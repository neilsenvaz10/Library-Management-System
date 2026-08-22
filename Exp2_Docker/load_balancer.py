import http.server
import socketserver
import os
import threading
import urllib.request

MODE = os.getenv("MODE", "rr")

# Hostnames map to Docker's internal DNS bridge names
BACKENDS = [
    {"name": "Server 1 (Fast)", "url": "http://backend1:5000"},
    {"name": "Server 2 (Slow)", "url": "http://backend2:5000"},
    {"name": "Server 3 (Medium)", "url": "http://backend3:5000"},
]

rr_index = 0
active_connections = {b["url"]: 0 for b in BACKENDS}
lock = threading.Lock()

def select_backend():
    global rr_index
    with lock:
        if MODE == "least_conn":
            target = min(BACKENDS, key=lambda b: active_connections[b["url"]])
        else:  # Default: Round Robin
            target = BACKENDS[rr_index]
            rr_index = (rr_index + 1) % len(BACKENDS)
        
        active_connections[target["url"]] += 1
        return target["url"]

def release_backend(url):
    with lock:
        active_connections[url] -= 1

class LBHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        target_url = select_backend()
        try:
            with urllib.request.urlopen(target_url) as resp:
                data = resp.read()
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(data)
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode())
        finally:
            release_backend(target_url)

    def log_message(self, format, *args):
        return

class ThreadedHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True

if __name__ == "__main__":
    print("==================================================")
    print(f"   LOAD BALANCER ONLINE | ALGORITHM: {MODE.upper()}")
    print("==================================================")
    server = ThreadedHTTPServer(("", 8000), LBHandler)
    server.serve_forever()
