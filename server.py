from http.server import BaseHTTPRequestHandler, HTTPServer


HOST = "192.168.50.195"
PORT = 9999

class NeuralHTTP(BaseHTTPRequestHandler):
  def do_GET(self):
    self.send_response(200)
    self.send_header("Content-type", "text/html")
    self.end_headers()

    self.wfile.write(bytes("<html><body><h1>hello</h1></body></html>", "utf-8"))


server = HTTPServer((HOST, PORT), NeuralHTTP)
print("Server now running...")

server.serve_forever()
server.server_close()
print("Server stopped")
