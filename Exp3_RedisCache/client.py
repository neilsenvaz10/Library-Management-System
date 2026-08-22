import urllib.request
import json
import time

BASE_URL = "http://localhost:8000"

def make_request(endpoint):
    start = time.time()
    try:
        with urllib.request.urlopen(f"{BASE_URL}{endpoint}") as response:
            data = json.loads(response.read().decode())
            data['client_total_time_ms'] = round((time.time() - start) * 1000, 2)
            return data
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    print("==========================================================")
    print("  EXPERIMENT 03: LIBRARY CATALOG REDIS CACHING BENCHMARK")
    print("==========================================================\n")

    # Step 1: Flush Cache
    make_request("/cache/flush")
    print(">>> Cache state successfully cleared.\n")

    # Step 2: Test Uncached Endpoint
    print("--- [TEST 1] Querying UNCACHED Book Catalog (/books/uncached) ---")
    uncached_latencies = []
    for i in range(1, 6):
        res = make_request("/books/uncached")
        lat = res['client_total_time_ms']
        uncached_latencies.append(lat)
        print(f" Request {i}: Source={res['source']} | Total Latency={lat} ms")

    avg_uncached = sum(uncached_latencies) / len(uncached_latencies)
    print(f"==> Average Uncached Response Time: {avg_uncached:.2f} ms\n")

    # Step 3: Test Cache-Aside Endpoint
    print("--- [TEST 2] Querying CACHE-ASIDE Book Catalog (/books/cached) ---")
    cached_latencies = []

    # Cold Cache Request (Miss)
    res_miss = make_request("/books/cached")
    print(f" Request 1 (Cold Cache): Source={res_miss['source']} | Latency={res_miss['client_total_time_ms']} ms")

    # Hot Cache Requests (Hits)
    for i in range(2, 6):
        res = make_request("/books/cached")
        lat = res['client_total_time_ms']
        cached_latencies.append(lat)
        print(f" Request {i} (Hot Cache) : Source={res['source']} | Latency={lat} ms")

    avg_cached = sum(cached_latencies) / len(cached_latencies)
    print(f"==> Average Hot Cache Response Time: {avg_cached:.2f} ms\n")

    # Metrics Summary
    speedup = avg_uncached / avg_cached if avg_cached > 0 else 0
    print("--------------------------------------------------------------")
    print("             LIBRARY SYSTEM CACHING RESULTS")
    print("--------------------------------------------------------------")
    print(f" Direct DB Catalog Latency (Avg)   : {avg_uncached:.2f} ms")
    print(f" Redis Cache Catalog Latency (Avg) : {avg_cached:.2f} ms")
    print(f" Performance Speedup               : ~{speedup:.1f}x Faster")
    print("--------------------------------------------------------------\n")

