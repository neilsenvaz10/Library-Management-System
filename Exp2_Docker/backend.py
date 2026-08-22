import http.server
import socketserver
import os
import time

PORT = 5000
SERVER_NAME = os.getenv("SERVER_NAME", "Backend-Unknown")
DELAY = float(os.getenv("DELAY", 0.1))

class BackendHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        # Simulate CPU / Database processing delay
        time.sleep(DELAY)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response = f'{{"server": "{SERVER_NAME}", "delay": {DELAY}}}'
        self.wfile.write(response.encode())

    def log_message(self, format, *args):
        return  # Suppress default HTTP logs for clean output

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), BackendHandler) as httpd:
        print(f"[{SERVER_NAME}] Active on port {PORT} with processing delay {DELAY}s...")
        httpd.serve_forever()
