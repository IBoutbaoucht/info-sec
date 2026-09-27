from flask import Flask, request

app = Flask(__name__, static_folder='static')

@app.route("/track")
def track():
    publisher = request.args.get("publisher")
    aid = request.args.get("aid")
    
    print("\n--- ANALYTICS SERVER LOG ---")
    print(f"Event received: User {aid} visited {publisher}")
    print(f"Cookies automatically received by the analytics server: {request.cookies}")
    print("----------------------------\n")
    
    # Return a 1x1 transparent pixel GIF (standard for analytics)
    pixel = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
    return pixel, 200, {'Content-Type': 'image/gif'}

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=9100, debug=True)
