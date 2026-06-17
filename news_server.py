"""
世界杯资讯 API 服务
========================
运行方式：python news_server.py
依赖安装：pip install flask flask-cors requests

接口列表：
  GET  /api/news          -> 获取当前 CSV 中所有资讯
  POST /api/news/refresh  -> 触发爬虫重新抓取
  GET  /api/news/status   -> 查询爬虫运行状态
"""

from flask import Flask, jsonify
from flask_cors import CORS
import requests
import json
import csv
import os
import time
import threading

app = Flask(__name__)
CORS(app)  # 允许跨域，兼容非代理情况

# CSV 保存到 public 目录（Vue 可直接 fetch 访问）
CSV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public', 'worldcup_news.csv')

# 爬虫运行状态
refresh_status = {
    'running': False,
    'last_update': None,
    'count': 0,
    'message': '尚未抓取'
}


# ===================== 爬虫核心逻辑 =====================

def fetch_news_data(page: int = 1, page_size: int = 100) -> dict:
    url = "https://api.cntv.cn/newList/getMixListByPageId"
    params = {
        "serviceId": "pcsports",
        "id": "PAGE9KvERaZA7JHsJxgLozps260518",
        "catg": "0,1,2",
        "p": page,
        "n": page_size
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://worldcup.cctv.com/",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    }
    try:
        response = requests.get(url, params=params, headers=headers, timeout=30)
        response.encoding = 'utf-8'
        text = response.text
        if text.startswith('cb') and '(' in text:
            json_str = text[text.find('(') + 1:text.rfind(')')]
            return json.loads(json_str)
        return response.json()
    except Exception as e:
        print(f"请求失败: {e}")
        return {}


def parse_news_data(data: dict) -> list:
    news_list = []
    if not data or 'data' not in data:
        return news_list
    items = data['data'].get('list', [])
    for item in items:
        content_type = ""
        url_parts = item.get('url', '').split('/')
        if url_parts:
            spid = url_parts[-1][:4] if len(url_parts) > 1 else ""
            if spid == "VIDE":
                content_type = "视频"
            elif spid == "ARTI":
                content_type = "文章"
            elif spid == "PHOA":
                content_type = "图集"
        news_list.append({
            '标题':    item.get('title', '').strip(),
            '链接':    item.get('url', ''),
            '封面图':  item.get('image', ''),
            '发布时间': item.get('time', ''),
            '内容类型': content_type,
            '简介':    item.get('brief', ''),
            '来源':    item.get('source', '央视网'),
            '内容ID':  item.get('id', ''),
            '视频时长': item.get('videoLength', ''),
        })
    return news_list


def get_all_news(max_pages: int = 5) -> list:
    all_news = []
    page = 1
    while page <= max_pages:
        print(f"  正在获取第 {page} 页...")
        data = fetch_news_data(page, 100)
        if not data or 'data' not in data:
            break
        news_list = parse_news_data(data)
        if not news_list:
            break
        all_news.extend(news_list)
        total = data['data'].get('total', 0)
        if page * 100 >= total:
            break
        page += 1
        time.sleep(0.5)
    return all_news


def save_to_csv(news_list: list, filename: str):
    if not news_list:
        return
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w', newline='', encoding='utf-8-sig') as csvfile:
        fieldnames = ['标题', '链接', '封面图', '发布时间', '内容类型', '简介', '来源', '内容ID', '视频时长']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for news in news_list:
            writer.writerow(news)
    print(f"✅ 已保存 {len(news_list)} 条资讯到 {filename}")


# ===================== 后台爬取线程 =====================

def do_refresh():
    global refresh_status
    refresh_status['running'] = True
    refresh_status['message'] = '正在抓取中...'
    print("🚀 开始抓取世界杯资讯...")
    try:
        news_data = get_all_news(max_pages=5)
        save_to_csv(news_data, CSV_PATH)
        refresh_status['last_update'] = time.strftime('%Y-%m-%d %H:%M:%S')
        refresh_status['count'] = len(news_data)
        refresh_status['message'] = f'抓取完成，共 {len(news_data)} 条'
        print(f"✅ 资讯更新完成，共 {len(news_data)} 条")
    except Exception as e:
        refresh_status['message'] = f'抓取失败: {str(e)}'
        print(f"❌ 抓取失败: {e}")
    finally:
        refresh_status['running'] = False


# ===================== API 接口 =====================

@app.route('/api/news', methods=['GET'])
def get_news():
    """返回当前 CSV 中的所有资讯"""
    news = []
    if os.path.exists(CSV_PATH):
        with open(CSV_PATH, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                news.append(dict(row))
    return jsonify({
        'success': True,
        'data': news,
        'total': len(news),
        'lastUpdate': refresh_status['last_update']
    })


@app.route('/api/news/refresh', methods=['POST'])
def refresh_news():
    """触发爬虫重新抓取（异步后台执行）"""
    if refresh_status['running']:
        return jsonify({'success': False, 'message': '爬虫正在运行中，请稍候...'})
    thread = threading.Thread(target=do_refresh, daemon=True)
    thread.start()
    return jsonify({'success': True, 'message': '已开始抓取最新资讯，预计 30 秒完成'})


@app.route('/api/news/status', methods=['GET'])
def get_status():
    """查询爬虫运行状态"""
    return jsonify(refresh_status)


# ===================== 启动服务 =====================

if __name__ == '__main__':
    print("=" * 50)
    print("🌍 世界杯资讯 API 服务")
    print(f"📡 监听地址：http://localhost:5001")
    print(f"📁 CSV 路径：{CSV_PATH}")
    print("=" * 50)
    print("接口说明：")
    print("  GET  http://localhost:5001/api/news          获取资讯列表")
    print("  POST http://localhost:5001/api/news/refresh  触发爬虫更新")
    print("  GET  http://localhost:5001/api/news/status   查询爬虫状态")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5001, debug=False)
