import http.server
import socketserver
import os
import sys
import webbrowser
import threading

DEFAULT_PORT = int(os.environ.get("PORT", 8080))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Disable caching for instant updates
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Clean terminal logging
        sys.stdout.write(f"[{self.log_date_time_string()}] {format % args}\n")
        sys.stdout.flush()

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

def open_browser(port):
    url = f"http://localhost:{port}"
    print(f"\n🚀 Opening browser at: {url}\n")
    webbrowser.open(url)

def run_server():
    os.chdir(DIRECTORY)
    port = DEFAULT_PORT
    httpd = None

    # Find available port
    while port < DEFAULT_PORT + 20:
        try:
            httpd = ReusableTCPServer(("", port), CustomHandler)
            break
        except OSError:
            print(f"Port {port} is currently in use, trying port {port + 1}...")
            port += 1

    if not httpd:
        print("❌ Error: Could not find an open port between 8080 and 8100.")
        sys.exit(1)

    print("=" * 60)
    print("  AEGIS COUNCIL: Multi-Agent Candidate Assessment Platform")
    print(f"  Live Server URL: http://localhost:{port}")
    print(f"  Serving Directory: {DIRECTORY}")
    print("  Press Ctrl+C to stop the server")
    print("=" * 60)

    # Automatically launch browser in 1 second
    threading.Timer(1.0, open_browser, args=[port]).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped gracefully. Goodbye!")
    finally:
        httpd.server_close()

if __name__ == "__main__":
    run_server()
