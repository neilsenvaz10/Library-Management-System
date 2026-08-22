from concurrent.futures import ThreadPoolExecutor
import json
import time
import urllib.request

LB_URL = "http://localhost:8000"
TOTAL_REQUESTS = 30
CONCURRENT_WORKERS = 10

def send_request(req_id):
    try:
        with urllib.request.urlopen(LB_URL) as response:
            payload = json.loads(response.read().decode())
            return payload["server"]
    except Exception as e:
        return None

if __name__ == "__main__":
    print("==================================================")
    print("   LAYER 1: CLIENT TRAFFIC GENERATOR")
    print("==================================================")
    print(f"Sending {TOTAL_REQUESTS} requests with concurrency level = {CONCURRENT_WORKERS}...\n")
    
    start_time = time.time()
    with ThreadPoolExecutor(max_workers=CONCURRENT_WORKERS) as executor:
        results = list(executor.map(send_request, range(TOTAL_REQUESTS)))
    
    total_time = time.time() - start_time

    # Aggregate distribution counts
    counts = {}
    for r in results:
        if r:
            counts[r] = counts.get(r, 0) + 1

    print("--------------------------------------------------")
    print("               EXECUTION RESULTS                  ")
    print("--------------------------------------------------")
    print(f"Total Processing Time: {total_time:.2f} seconds\n")
    print(f"{'Backend Target':<25} | {'Requests':<10} | {'Distribution':<10}")
    print("-" * 55)
    
    for server, count in sorted(counts.items()):
        pct = (count / TOTAL_REQUESTS) * 100
        print(f"{server:<25} | {count:<10} | {pct:.1f}%")
    print("--------------------------------------------------\n")
