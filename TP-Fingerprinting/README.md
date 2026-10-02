# Browser Fingerprinting — Web Privacy TP

**Author:** Imad BOUTBAOUCHT

## Contents

- `TP_fp.pdf` — the lab handout.
- `Imad BOUTBAOUCHT.pdf` — the full lab report (screenshots, explanations, results).
- `fingerprintingLab/` — the solution project (Flask).

## Project structure

```
fingerprintingLab/
├── app.py
├── requirements.txt
├── templates/
│   └── index.html
└── static/
    ├── fingerprint.js
    ├── fingerprint2.js
    └── style.css
```

## How to run

```bash
cd fingerprintingLab
pip install -r requirements.txt
python app.py
```

Then open http://127.0.0.1:8000 in a browser.

## What the solution does

1. **Part 1 — Passive fingerprinting:** the server prints the HTTP headers it receives (User-Agent, Accept-Language, Accept, Sec-CH-UA, DNT, Sec-GPC, …).
2. **Part 2 — Active fingerprinting:** `fingerprint.js` reads `navigator`, `screen`, `window`, `Intl` and `document`, displays the values, and POSTs them to `/collect`.
3. **Part 3 — Typing behaviour:** `fingerprint2.js` measures total typing time, typing speed (chars/s and WPM) and Backspace corrections while reproducing the target sentence, then sends them to `/collect`.
4. **Part 4 — Combined fingerprint:** the features are concatenated in a fixed order and hashed with SHA-256 (`crypto.subtle.digest`); only the hash is sent via `GET /collect?fp=...`.
