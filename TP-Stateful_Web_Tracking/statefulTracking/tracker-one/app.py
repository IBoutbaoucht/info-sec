from flask import Flask, request, make_response, redirect
import secrets

app = Flask(__name__)

@app.route("/sync")
def sync():
    # 1. Tracker 1 reads its own cookie
    aid = request.cookies.get("tracker1_id")
    is_new = aid is None

    if is_new:
        aid = secrets.token_hex(8)

    # 2. Tracker 1 redirects the browser to Tracker 2, putting its ID inside the URL!
    redirect_url = f"http://tracker-two.test:9002/sync_receive?partner_id={aid}"
    response = make_response(redirect(redirect_url))
    
    if is_new:
        response.set_cookie("tracker1_id", aid, samesite='None', secure=False)

    return response

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=9001, debug=True)
