# Web Privacy & Stateful Tracking — Lab Repository

**Author:** Imad BOUTBAOUCHT  
**Course / Module:** Information Security — Web Privacy (TP1)  
**Report Document:** 📄 [`final_report.pdf`](final_report.pdf) | 📝 [`final_report.md`](final_report.md)

---

## 📌 Project Overview
This repository contains the complete practical implementation, experiments, security analysis, and documentation for the **Stateful Web Tracking & Web Privacy** lab.

The lab investigates how web tracking works under the hood, comparing:
1. **Third-Party Cookie Tracking (Challenge 1):** Tracking users across independent publisher websites using embedded `<iframe>` elements.
2. **First-Party Analytics (Challenge 2):** Utilizing client-side JavaScript (`analytics.js`) in first-party context and analyzing Same-Origin Policy (SOP) isolation.
3. **Cookie Syncing (Challenge 7):** How ad networks synchronize isolated user identifiers across different domains using HTTP `302 FOUND` redirects.

---

## 📁 Repository Directory Structure

```text
TP-Stateful_Web_Tracking/
├── README.md                      # Main GitHub documentation & project overview
├── final_report.pdf               # Complete standalone PDF Lab Report (17 pages)
├── final_report.md                # Markdown source of the lab report
├── TP_Privacy.pdf                 # Lab assignment specification PDF
├── .gitignore                     # Git ignore file for venv & temporary files
├── docs/
│   └── screenshots/               # High-resolution lab screenshots
│       ├── warmup_http_headers.png
│       ├── warmup_set_cookie_header.png
│       ├── warmup_httponly_cookie.png
│       ├── chall1_publisher1_iframe.png
│       ├── chall1_publisher2_iframe.png
│       ├── chall1_tracker_log.png
│       ├── chall2_publisher1_cookie.png
│       ├── chall2_publisher2_cookie.png
│       ├── chall2_analytics_server_log.png
│       ├── chall7_302_redirect_sync.png
│       └── chall7_tracker2_db_linked.png
└── statefulTracking/              # Application Source Code
    ├── app.py                     # Warm-Up Flask server
    ├── templates/                 # Warm-Up HTML templates
    ├── analytics-server/          # First-Party Analytics Server & analytics.js
    ├── publisher-one/             # Publisher 1 website app (Port 8001)
    ├── publisher-two/             # Publisher 2 website app (Port 8002)
    ├── tracker-one/               # Tracker 1 app (Port 9001 - Redirector)
    └── tracker-two/               # Tracker 2 app (Port 9002 - Receiver & DB)
```

---

## 🛠️ Setup & Execution Instructions

### 1. Local Host Name Mapping
Add the following domain entries to your hosts file (`/etc/hosts` on Linux/macOS or `C:\Windows\System32\drivers\etc\hosts` on Windows):

```text
127.0.0.1   lab.test
127.0.0.1   publisher-one.test
127.0.0.1   publisher-two.test
127.0.0.1   tracker-one.test
127.0.0.1   tracker-two.test
127.0.0.1   analytics.test
```

### 2. Python Virtual Environment Setup
```bash
cd statefulTracking
python3 -m venv venv
source venv/bin/activate
pip install flask
```

### 3. Running the Applications

#### Warm-Up Application (Port 8000)
```bash
python3 app.py
# Access at: http://lab.test:8000
```

#### Challenge 1 & 2: Publishers & Trackers
```bash
# Terminal 1: Publisher One (Port 8001)
python3 publisher-one/app.py

# Terminal 2: Publisher Two (Port 8002)
python3 publisher-two/app.py

# Terminal 3: Analytics Server (Port 9100)
python3 analytics-server/app.py

# Terminal 4: Tracker One (Port 9001)
python3 tracker-one/app.py

# Terminal 5: Tracker Two (Port 9002)
python3 tracker-two/app.py
```

---

## 📸 Screenshots & Visual Evidence
All cropped and labeled screenshots documenting server terminal outputs, browser Developer Tools, Network redirects, and cookies are stored in [`docs/screenshots/`](docs/screenshots/).

| Figure | Description | File Link |
| :--- | :--- | :--- |
| **Figure 1** | Request & Response Headers Inspection | [`warmup_http_headers.png`](docs/screenshots/warmup_http_headers.png) |
| **Figure 2** | `Set-Cookie` Response Header | [`warmup_set_cookie_header.png`](docs/screenshots/warmup_set_cookie_header.png) |
| **Figure 3** | `HttpOnly` Cookie Protection in DevTools | [`warmup_httponly_cookie.png`](docs/screenshots/warmup_httponly_cookie.png) |
| **Figure 4** | Publisher 1 Embedding Tracker-1 IFrame | [`chall1_publisher1_iframe.png`](docs/screenshots/chall1_publisher1_iframe.png) |
| **Figure 5** | Publisher 2 Sending Third-Party Cookie | [`chall1_publisher2_iframe.png`](docs/screenshots/chall1_publisher2_iframe.png) |
| **Figure 6** | Tracker 1 Chronological Profile Log | [`chall1_tracker_log.png`](docs/screenshots/chall1_tracker_log.png) |
| **Figure 7** | Publisher 1 First-Party Analytics Cookie | [`chall2_publisher1_cookie.png`](docs/screenshots/chall2_publisher1_cookie.png) |
| **Figure 8** | Publisher 2 First-Party Analytics Cookie | [`chall2_publisher2_cookie.png`](docs/screenshots/chall2_publisher2_cookie.png) |
| **Figure 9** | Analytics Server Receiving Separate Identifiers | [`chall2_analytics_server_log.png`](docs/screenshots/chall2_analytics_server_log.png) |
| **Figure 10** | `302 FOUND` Redirect Passing Partner ID | [`chall7_302_redirect_sync.png`](docs/screenshots/chall7_302_redirect_sync.png) |
| **Figure 11** | Tracker 2 Database Cross-Identity Link Log | [`chall7_tracker2_db_linked.png`](docs/screenshots/chall7_tracker2_db_linked.png) |

---

## 📄 Complete Report
The full standalone lab report with technical explanations, security analysis, answered questions, figures, and source code is available in PDF format:
👉 **[`final_report.pdf`](final_report.pdf)**
