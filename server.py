from http.server import HTTPServer, BaseHTTPRequestHandler
import snake

HOST = "192.168.50.195"
PORT = 9999

class NeuralHTTP(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        self.wfile.write(bytes("<html><body><h1>hello</h1></body></html>", "utf-8"))

    def do_POST(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        if self.path == "/start_game":
            snake.start_game()

server = HTTPServer((HOST, PORT), NeuralHTTP)
print("Server now running...")

server.serve_forever()
server.server_close()
print("Server stopped")
