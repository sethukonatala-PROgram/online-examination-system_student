#!/usr/bin/env python3
"""
ExamPulse - Professional Online Examination & Assessment Portal
Lightweight zero-dependency Python 3 HTTP Server.
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import argparse

DEFAULT_PORT = 8080

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        sys.stderr.write(f"[{self.log_date_time_string()}] {args[0]} - {args[1]}\n")

def run(port=DEFAULT_PORT, open_browser=True):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base_dir)

    handler = CustomHTTPRequestHandler
    socketserver.TCPServer.allow_reuse_address = True

    try:
        if sys.platform == 'win32':
            sys.stdout.reconfigure(encoding='utf-8')
            sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            url = f"http://localhost:{port}"
            print("=" * 65)
            print("  ExamPulse - Smart Online Examination & Assessment System")
            print("=" * 65)
            print(f"  Server URL:      {url}")
            print(f"  Root Directory:  {base_dir}")
            print("  Press Ctrl+C to stop.")
            print("=" * 65)

            if open_browser:
                try:
                    webbrowser.open(url)
                except Exception:
                    pass

            httpd.serve_forever()
    except OSError as e:
        if e.errno in (98, 10048):
            print(f"\n[Info] Port {port} is busy. Trying port {port + 1}...")
            run(port + 1, open_browser)
        else:
            raise e
    except KeyboardInterrupt:
        print("\n\nExamPulse server stopped.")
        sys.exit(0)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="ExamPulse Assessment Server")
    parser.add_argument('--port', type=int, default=DEFAULT_PORT, help="Port to bind (default: 8080)")
    parser.add_argument('--no-browser', action='store_true', help="Do not open browser automatically")
    args = parser.parse_args()

    run(port=args.port, open_browser=not args.no_browser)
