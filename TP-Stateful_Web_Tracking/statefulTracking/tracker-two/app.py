from flask import Flask, request, make_response
import secrets

app = Flask(__name__)

# This database will store the linked identities
sync_db = {}

@app.route("/sync_receive")
def sync_receive():
    # 1. Tracker 2 extracts Tracker 1's ID from the URL
    partner_id = request.args.get("partner_id")
    
    # 2. Tracker 2 reads its own cookie
    my_id = request.cookies.get("tracker2_id")
    is_new = my_id is None
    
    if is_new:
        my_id = secrets.token_hex(8)
        
    # 3. Link the two identities in the database!
    if partner_id:
        sync_db[my_id] = partner_id
        
    print("\n--- TRACKER 2 SYNC DATABASE ---")
    print(f"My Cookie ID for this user : {my_id}")
    print(f"Tracker 1's ID for this user : {partner_id}")
    print("SUCCESS: Identities officially linked!")
    print("-------------------------------\n")
    
    # Return an invisible 1x1 pixel so the browser doesn't show a broken image icon
    pixel = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
    response = make_response(pixel)
    response.headers['Content-Type'] = 'image/gif'
    
    if is_new:
        response.set_cookie("tracker2_id", my_id, samesite='None', secure=False)
        
    return response

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=9002, debug=True)
