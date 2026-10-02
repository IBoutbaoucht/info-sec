// ==============================================================================
// Web Privacy TP — Browser Fingerprinting
// Author: Imad BOUTBAOUCHT
// Part 2 & Part 4: Active Feature Collection and SHA-256 Fingerprint Generator
// ==============================================================================

// Helper function to compute SHA-256 using Web Crypto API (crypto.subtle.digest)
async function computeSHA256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Function to collect active browser features from various browser objects
function collectActiveFeatures() {
    // 1. From 'navigator' object
    const browserLanguage = navigator.language || "unknown";
    const languagesList = navigator.languages ? Array.from(navigator.languages) : [browserLanguage];
    const cpuCores = navigator.hardwareConcurrency || "unknown";
    const deviceMemory = navigator.deviceMemory || "unknown"; // in GB (Chromium)
    const platform = navigator.platform || "unknown";
    const userAgent = navigator.userAgent || "unknown";

    // 2. From 'screen' object
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const availWidth = screen.availWidth;
    const availHeight = screen.availHeight;
    const colorDepth = screen.colorDepth;

    // 3. From 'window' object
    const devicePixelRatio = window.devicePixelRatio || 1;
    const windowInnerWidth = window.innerWidth;
    const windowInnerHeight = window.innerHeight;

    // 4. From 'Intl' object (Internationalization API)
    let timeZone = "unknown";
    try {
        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
    } catch (e) {
        timeZone = "error";
    }

    // 5. From 'document' object
    const docReferrer = document.referrer || "direct";

    return {
        language: browserLanguage,
        languages: languagesList,
        screenWidth: screenWidth,
        screenHeight: screenHeight,
        availWidth: availWidth,
        availHeight: availHeight,
        colorDepth: colorDepth,
        timeZone: timeZone,
        hardwareConcurrency: cpuCores,
        deviceMemory: deviceMemory,
        devicePixelRatio: devicePixelRatio,
        windowInnerWidth: windowInnerWidth,
        windowInnerHeight: windowInnerHeight,
        platform: platform,
        userAgent: userAgent,
        referrer: docReferrer
    };
}

// Main execution when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
    console.log("=== Active Feature Collector Initialized ===");

    // Step 2.3: Read first active feature
    const browserLanguage = navigator.language;
    console.log("Browser language:", browserLanguage);

    const outputElement = document.getElementById("feature-output");
    if (outputElement) {
        outputElement.textContent = "Browser language: " + browserLanguage;
    }

    // Task 2: Collect all active features
    const features = collectActiveFeatures();
    console.log("Collected Active Features:", features);

    // Display active features on the webpage
    const activeList = document.getElementById("active-features-list");
    if (activeList) {
        activeList.innerHTML = `
            <li><strong>Preferred Language (navigator):</strong> ${features.language}</li>
            <li><strong>Languages List (navigator):</strong> ${features.languages.join(", ")}</li>
            <li><strong>CPU Cores (navigator.hardwareConcurrency):</strong> ${features.hardwareConcurrency}</li>
            <li><strong>Device Memory (navigator.deviceMemory):</strong> ${features.deviceMemory} GB</li>
            <li><strong>Screen Resolution (screen):</strong> ${features.screenWidth} x ${features.screenHeight}</li>
            <li><strong>Available Screen (screen):</strong> ${features.availWidth} x ${features.availHeight}</li>
            <li><strong>Color Depth (screen):</strong> ${features.colorDepth} bits</li>
            <li><strong>Time Zone (Intl):</strong> ${features.timeZone}</li>
            <li><strong>Device Pixel Ratio (window):</strong> ${features.devicePixelRatio}</li>
            <li><strong>Window Viewport (window):</strong> ${features.windowInnerWidth} x ${features.windowInnerHeight}</li>
            <li><strong>Platform (navigator):</strong> ${features.platform}</li>
        `;
    }

    // Part 4: Combine features in fixed canonical order to produce SHA-256 fingerprint
    // Fixed order: Language | Resolution | TimeZone | CPU | ColorDepth | PixelRatio
    const canonicalString = [
        features.language,
        `${features.screenWidth}x${features.screenHeight}`,
        features.timeZone,
        features.hardwareConcurrency,
        features.colorDepth,
        features.devicePixelRatio
    ].join(" | ");

    console.log("Canonical Feature String:", canonicalString);

    let sha256Hash = "";
    try {
        sha256Hash = await computeSHA256(canonicalString);
        console.log("Computed SHA-256 Browser Fingerprint:", sha256Hash);

        const hashDisplay = document.getElementById("fingerprint-hash");
        if (hashDisplay) {
            hashDisplay.textContent = sha256Hash;
        }

        const canonicalDisplay = document.getElementById("canonical-string");
        if (canonicalDisplay) {
            canonicalDisplay.textContent = canonicalString;
        }
    } catch (err) {
        console.error("Error computing SHA-256:", err);
    }

    // Task 2, step 3: Send collected active features to Flask server
    const activePayload = {
        type: "active_fingerprint",
        ...features,
        canonicalString: canonicalString,
        sha256Fingerprint: sha256Hash
    };

    fetch("/collect", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(activePayload)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Flask server response for active features:", data);
        const statusElem = document.getElementById("active-send-status");
        if (statusElem) {
            statusElem.textContent = "Active features successfully transmitted to Flask server!";
            statusElem.className = "status-badge success";
        }
    })
    .catch(err => {
        console.error("Failed to send active features to Flask server:", err);
    });

    // Part 4: Button to send ONLY the SHA-256 hash via GET /collect?fp=...
    const sendHashBtn = document.getElementById("send-hash-btn");
    const hashStatus = document.getElementById("hash-status");
    if (sendHashBtn) {
        sendHashBtn.addEventListener("click", () => {
            if (!sha256Hash) return;
            fetch(`/collect?fp=${encodeURIComponent(sha256Hash)}`)
                .then(res => res.json())
                .then(data => {
                    console.log("Server response for hash query:", data);
                    if (hashStatus) {
                        hashStatus.textContent = `Hash sent to server via GET /collect?fp=${sha256Hash.substring(0, 12)}... (Success)`;
                        hashStatus.className = "status-badge success";
                    }
                })
                .catch(err => {
                    console.error("Error sending hash:", err);
                    if (hashStatus) {
                        hashStatus.textContent = "Error sending hash to server.";
                        hashStatus.className = "status-badge error";
                    }
                });
        });
    }

    // Part 4: Test Stability Button
    const verifyStabilityBtn = document.getElementById("verify-stability-btn");
    const stabilityLog = document.getElementById("stability-log");
    if (verifyStabilityBtn && stabilityLog) {
        let testCount = 0;
        verifyStabilityBtn.addEventListener("click", async () => {
            testCount++;
            const recomputedHash = await computeSHA256(canonicalString);
            const isMatch = (recomputedHash === sha256Hash);
            const logEntry = document.createElement("div");
            logEntry.className = isMatch ? "log-item match" : "log-item mismatch";
            logEntry.innerHTML = `Test #${testCount}: <code>${recomputedHash}</code> &mdash; <strong>${isMatch ? "STABLE MATCH" : "CHANGED"}</strong>`;
            stabilityLog.appendChild(logEntry);
        });
    }
});
