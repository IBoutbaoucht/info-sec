from flask import Flask, render_template, request, make_response
import secrets
app = Flask(__name__)

@app.route("/")

def home():
    # Check whether the browser already has an identifier
    aid = request.cookies.get("aid")
    is_new = aid is None
    # Generate an identifier only for a new browser
    if is_new:
        aid = secrets.token_hex(8)
    # Create the normal HTTP response containing index.html
    response = make_response(render_template("index.html"))
    # Ask the browser to store the identifier
    if is_new:
        response.set_cookie(
        key="aid",
        value=aid,
        secure=True
        )
    return response

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
