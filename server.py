# import socket
# from _thread import *
# import sys

# server = "192.168.50.195"
# port = 5555

# s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# try:
#     s.bind((server, port))
# except socket.error as e:
#     str(e)

# s.listen(2)
# print("Waiting fo a connection, Server Started")


# def threaded_client(conn):
#     conn.send(str.encode("Connected"))
#     reply = ""
#     while True:
#         try:
#             data = conn.recv(2048)
#             reply = data.decode("utf-8")

#             if not data:
#                 print("Disconnected")
#                 break
#             else:
#                 print("Recieved: ", reply)
#                 print("Sending: ", reply)

#             conn.sendall(str.encode(reply))
#         except:
#             break

#     print("Lost connection")
#     conn.close()


# while True:
#     conn, addr = s.accept()
#     print("Connected to", addr)

#     start_new_thread(threaded_client, (conn,))


# import snake

# HOST = "192.168.50.195"
# PORT = 9999

# class NeuralHTTP(BaseHTTPRequestHandler):
# def do_GET(self):
# self.send_response(200)
# self.send_header("Content-type", "text/html")
# self.end_headers()

# self.wfile.write(bytes("<html><body><h1>hello</h1></body></html>", "utf-8"))

# def do_POST(self):
# self.send_response(200)
# self.send_header("Content-type", "text/html")
# self.end_headers()

# if self.path == "/start_game":
# snake.start_game()

# server = HTTPServer((HOST, PORT), NeuralHTTP)
# print("Server now running...")

# server.serve_forever()
# server.server_close()
# print("Server stopped")
