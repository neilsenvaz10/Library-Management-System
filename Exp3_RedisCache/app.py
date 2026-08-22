import http.server
import socketserver
import os
import json
import time
import redis

PORT = 8000
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
CACHE_TTL = 60  # Cache key expiration time in seconds

# Initialize Redis Connection
cache = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

def simulated_database_query(category="all"):
    """Simulates an expensive database query (JOINs across books, authors, availability)."""
    time.sleep(0.200)  # 200ms DB processing delay
    return [
        {
            "book_id": "B101",
            "title": "Design Patterns: Elements of Reusable Object-Oriented Software",
            "author": "Erich Gamma et al.",
            "category": "Computer Science",
            "available_copies": 5,
            "shelf_location": "CS-A1-12"
        },
        {
            "book_id": "B102",
            "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
            "author": "Robert C. Martin",
            "category": "Software Engineering",
            "available_copies": 3,
            "shelf_location": "SE-B3-04"
        },
        {
            "book_id": "B103",
            "title": "Database System Concepts",
            "author": "Abraham Silberschatz",
            "category": "Database Systems",
            "available_copies": 8,
            "shelf_location": "DB-C2-09"
        },
        {
            "book_id": "B104",
            "title": "Introduction to Algorithms",
            "author": "Thomas H. Cormen",
            "category": "Algorithms",
            "available_copies": 2,
            "shelf_location": "AL-D4-15"
        }
    ]

class LibraryCatalogHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        start_time = time.time()
        path = self.path

        # ---------------------------------------------------------------
        # ENDPOINT 1: Direct Uncached Database Access for Book Catalog
        # ---------------------------------------------------------------
        if path == "/books/uncached" or path == "/feed/uncached":
            catalog_data = simulated_database_query()
            elapsed_ms = (time.time() - start_time) * 1000
            response = {
                "source": "PRIMARY_DATABASE",
                "latency_ms": round(elapsed_ms, 2),
                "books": catalog_data
            }
            self._send_json(200, response)

        # ---------------------------------------------------------------
        # ENDPOINT 2: Cache-Aside Pattern for Book Catalog
        # ---------------------------------------------------------------
        elif path == "/books/cached" or path == "/feed/cached":
            cache_key = "library:book_catalog"
            cached_catalog = cache.get(cache_key)

            if cached_catalog:
                # --- CACHE HIT ---
                elapsed_ms = (time.time() - start_time) * 1000
                response = {
                    "source": "REDIS_CACHE_HIT",
                    "latency_ms": round(elapsed_ms, 2),
                    "books": json.loads(cached_catalog)
                }
                self._send_json(200, response)
            else:
                # --- CACHE MISS ---
                catalog_data = simulated_database_query()
                # Write to Redis with expiration (TTL)
                cache.setex(cache_key, CACHE_TTL, json.dumps(catalog_data))
                elapsed_ms = (time.time() - start_time) * 1000
                response = {
                    "source": "DATABASE_MISS_STORED_TO_CACHE",
                    "latency_ms": round(elapsed_ms, 2),
                    "books": catalog_data
                }
                self._send_json(200, response)

        # ---------------------------------------------------------------
        # ENDPOINT 3: Cache Invalidation (Flush)
        # ---------------------------------------------------------------
        elif path == "/cache/flush":
            cache.flushall()
            self._send_json(200, {"status": "Cache Flushed Successfully"})
        else:
            self._send_json(404, {"error": "Endpoint not found"})

    def _send_json(self, status_code, payload):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode('utf-8'))

    def log_message(self, format, *args):
        return  # Suppress default HTTP logs

if __name__ == "__main__":
    print(f"Library Management API (Exp 3) active on port {PORT}...")
    print(f"Connecting to Redis at {REDIS_HOST}:{REDIS_PORT}...")
    with socketserver.TCPServer(("", PORT), LibraryCatalogHandler) as httpd:
        httpd.serve_forever()

