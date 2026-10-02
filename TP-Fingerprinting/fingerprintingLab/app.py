import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    print("\n" + "=" * 55)
    print("========== NEW VISIT (PASSIVE FINGERPRINTING) ==========")
    print("=" * 55)
    
    # 1. Connection and network level info
    print(f"IP address                 : {request.remote_addr}")
    print(f"HTTP method                : {request.method}")
    print(f"Host                       : {request.host}")

    # 2. Base HTTP request headers (from lab handout)
    user_agent = request.headers.get("User-Agent", "N/A")
    accept_language = request.headers.get("Accept-Language", "N/A")
    print(f"User-Agent                 : {user_agent}")
    print(f"Accept-Language            : {accept_language}")

    # 3. Task 1: Additional passive HTTP headers
    accept = request.headers.get("Accept", "N/A")
    accept_encoding = request.headers.get("Accept-Encoding", "N/A")
    sec_ch_ua = request.headers.get("Sec-CH-UA", "N/A")
    sec_ch_ua_platform = request.headers.get("Sec-CH-UA-Platform", "N/A")
    sec_ch_ua_mobile = request.headers.get("Sec-CH-UA-Mobile", "N/A")
    sec_fetch_dest = request.headers.get("Sec-Fetch-Dest", "N/A")
    sec_fetch_mode = request.headers.get("Sec-Fetch-Mode", "N/A")
    sec_fetch_site = request.headers.get("Sec-Fetch-Site", "N/A")
    upgrade_insecure = request.headers.get("Upgrade-Insecure-Requests", "N/A")
    dnt = request.headers.get("DNT", "Not set")
    sec_gpc = request.headers.get("Sec-GPC", "Not set")
    referer = request.headers.get("Referer", "None")

    print(f"Accept (MIME types)        : {accept}")
    print(f"Accept-Encoding            : {accept_encoding}")
    print(f"Sec-CH-UA (Client Hints)   : {sec_ch_ua}")
    print(f"Sec-CH-UA-Platform         : {sec_ch_ua_platform}")
    print(f"Sec-CH-UA-Mobile           : {sec_ch_ua_mobile}")
    print(f"Sec-Fetch-Dest             : {sec_fetch_dest}")
    print(f"Sec-Fetch-Mode             : {sec_fetch_mode}")
    print(f"Sec-Fetch-Site             : {sec_fetch_site}")
    print(f"Upgrade-Insecure-Requests  : {upgrade_insecure}")
    print(f"DNT (Do Not Track)         : {dnt}")
    print(f"Sec-GPC (Global Privacy)   : {sec_gpc}")
    print(f"Referer                    : {referer}")
    print("=" * 55 + "\n")

    passive_data = {
        "ip": request.remote_addr,
        "method": request.method,
        "userAgent": user_agent,
        "acceptLanguage": accept_language,
        "accept": accept,
        "acceptEncoding": accept_encoding,
        "secChUa": sec_ch_ua,
        "secChUaPlatform": sec_ch_ua_platform,
        "secChUaMobile": sec_ch_ua_mobile,
        "upgradeInsecureRequests": upgrade_insecure,
        "dnt": dnt,
        "secGpc": sec_gpc
    }

    return render_template("index.html", passive_data=passive_data)


@app.route("/collect", methods=["GET", "POST"])
def collect():
    # Handle GET request (Part 4: sending hash via query parameter)
    if request.method == "GET":
        fp_hash = request.args.get("fp")
        if fp_hash:
            print("\n" + "#" * 55)
            print(">>> [PART 4] RECEIVED HASH IDENTIFIER VIA GET QUERY")
            print(f"Fingerprint SHA-256 Hash : {fp_hash}")
            print(f"Origin IP               : {request.remote_addr}")
            print("#" * 55 + "\n")
            return jsonify({"status": "success", "mode": "hash_only", "fp": fp_hash}), 200
        return jsonify({"status": "error", "message": "Missing 'fp' parameter"}), 400

    # Handle POST request (Part 2 Active Features & Part 3 Behavioral Features)
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"status": "error", "message": "No JSON payload provided"}), 400

    payload_type = data.get("type", "unknown")

    if payload_type == "active_fingerprint":
        print("\n" + "*" * 55)
        print(">>> [PART 2 & 4] RECEIVED ACTIVE BROWSER FEATURES")
        print("*" * 55)
        print(f"Browser Language (navigator)      : {data.get('language')}")
        print(f"Languages Array (navigator)       : {data.get('languages')}")
        print(f"Screen Resolution (screen)        : {data.get('screenWidth')}x{data.get('screenHeight')}")
        print(f"Available Screen Size (screen)    : {data.get('availWidth')}x{data.get('availHeight')}")
        print(f"Color Depth (screen)              : {data.get('colorDepth')} bits")
        print(f"Time Zone (Intl)                  : {data.get('timeZone')}")
        print(f"CPU Cores (navigator)             : {data.get('hardwareConcurrency')}")
        print(f"Device Memory (navigator)         : {data.get('deviceMemory', 'N/A')} GB")
        print(f"Device Pixel Ratio (window)       : {data.get('devicePixelRatio')}")
        print(f"Window Viewport (window)          : {data.get('windowInnerWidth')}x{data.get('windowInnerHeight')}")
        print(f"Platform (navigator)              : {data.get('platform')}")
        if "sha256Fingerprint" in data:
            print(f"Computed SHA-256 Fingerprint      : {data.get('sha256Fingerprint')}")
        print("*" * 55 + "\n")

    elif payload_type == "behavioral_fingerprint":
        print("\n" + "~" * 55)
        print(">>> [PART 3] RECEIVED BEHAVIOURAL TYPING FEATURES")
        print("~" * 55)
        print(f"Target Sentence                   : {data.get('sentence')}")
        print(f"Total Typing Time                 : {data.get('typingTime')} s")
        print(f"Typing Speed (Characters/s)       : {data.get('speedCPS')} char/s")
        print(f"Typing Speed (Words/min)          : {data.get('speedWPM')} WPM")
        print(f"Backspace Corrections             : {data.get('corrections')}")
        print("~" * 55 + "\n")

    else:
        print("\n>>> RECEIVED GENERIC DATA:", json.dumps(data, indent=2))

    return jsonify({"status": "success", "received_type": payload_type}), 200


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
