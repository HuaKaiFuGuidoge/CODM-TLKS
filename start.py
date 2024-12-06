import os
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

# 设置当前工作目录为项目根目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# 启动一个HTTP服务器
PORT = 8000

# 创建一个TCPServer实例，指定端口和请求处理程序
with TCPServer(("", PORT), SimpleHTTPRequestHandler) as httpd:
    print(f"服务器已启动，访问地址: http://localhost:{PORT}")
    httpd.serve_forever()
