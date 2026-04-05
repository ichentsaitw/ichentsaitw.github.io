import http.server, os, sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))
port = int(sys.argv[1]) if len(sys.argv) > 1 else 5510

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args): pass

print(f"Serving ichentsaitw.github.io at http://127.0.0.1:{port}")
http.server.HTTPServer(('127.0.0.1', port), Handler).serve_forever()
