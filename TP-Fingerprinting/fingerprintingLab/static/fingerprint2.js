// ==============================================================================
// Web Privacy TP — Browser Fingerprinting
// Author: Imad BOUTBAOUCHT
// Part 3: The Typing Imposter (Behavioural Biometrics Collector)
// ==============================================================================

/**
 * Task 4 - Algorithm & Formulas:
 * 1. Typing Speed Formulas:
 *    - Characters Per Second (CPS):
 *      CPS = (Sentence Length in characters) / (Total Time in seconds)
 *    - Words Per Minute (WPM):
 *      WPM = (Sentence Length / 5) / (Total Time in minutes)
 *          = (Sentence Length / 5) / (Total Time in seconds / 60)
 *
 * 2. State Variables:
 *    - startTime (timestamp ms via performance.now())
 *    - endTime (timestamp ms via performance.now())
 *    - backspaceCount (integer)
 *    - isCompleted (boolean)
 *
 * 3. Event Listeners:
 *    - "keydown" on input field:
 *        * If Backspace is pressed, increment backspaceCount.
 *        * If startTime is null and not completed, record startTime = performance.now().
 *    - "input" on input field:
 *        * Check if current value equals target sentence.
 *        * If equal and not completed:
 *            - record endTime = performance.now()
 *            - isCompleted = true
 *            - calculate time, CPS, WPM
 *            - display results
 *            - send payload to Flask via fetch("/collect")
 *    - "click" on restart button:
 *        * Reset state variables, clear input, clear result displays, re-enable input.
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("=== Behavioural Biometrics Collector (fingerprint2.js) Initialized ===");

    // DOM Elements corresponding to Task 3
    const targetSentenceElem = document.getElementById("target-sentence");
    const typingInput = document.getElementById("typing-input");
    const restartBtn = document.getElementById("restart-btn");
    
    // Result display elements
    const resultsArea = document.getElementById("typing-results");
    const totalTimeElem = document.getElementById("total-time");
    const typingSpeedElem = document.getElementById("typing-speed");
    const correctionsCountElem = document.getElementById("corrections-count");
    const typingStatusElem = document.getElementById("typing-status");

    if (!targetSentenceElem || !typingInput || !restartBtn) {
        console.warn("Behavioural elements missing from the page.");
        return;
    }

    const targetSentence = targetSentenceElem.textContent.trim();

    // Experiment State
    let startTime = null;
    let endTime = null;
    let backspaceCount = 0;
    let isCompleted = false;

    // Helper: normalize apostrophes and spacing for robust comparison
    function normalizeText(str) {
        return str.replace(/[\u2018\u2019]/g, "'").trim();
    }

    const normalizedTarget = normalizeText(targetSentence);

    // Event 1: keydown (detect start and count Backspaces)
    typingInput.addEventListener("keydown", (event) => {
        if (isCompleted) return;

        // Count Backspace corrections
        if (event.key === "Backspace") {
            backspaceCount++;
            console.log(`Backspace correction detected. Total: ${backspaceCount}`);
        }

        // Start the timer on the first key stroke (excluding standalone modifier keys)
        if (startTime === null && event.key.length === 1) {
            startTime = performance.now();
            console.log("Typing timer started at:", startTime);
            if (typingStatusElem) {
                typingStatusElem.textContent = "Typing in progress...";
                typingStatusElem.className = "status-badge active";
            }
        }
    });

    // Event 2: input (detect when sentence is completed)
    typingInput.addEventListener("input", () => {
        if (isCompleted) return;

        const currentInput = normalizeText(typingInput.value);

        if (currentInput === normalizedTarget) {
            endTime = performance.now();
            isCompleted = true;

            const totalTimeMs = endTime - startTime;
            const totalTimeSeconds = (totalTimeMs / 1000);
            
            // Formula calculations:
            // Characters Per Second (CPS)
            const speedCPS = (normalizedTarget.length / totalTimeSeconds);
            // Words Per Minute (WPM) standard definition (5 characters = 1 word)
            const speedWPM = ((normalizedTarget.length / 5) / (totalTimeSeconds / 60));

            console.log("=== Target Sentence Successfully Completed! ===");
            console.log(`Total Time: ${totalTimeSeconds.toFixed(2)} s`);
            console.log(`Typing Speed: ${speedCPS.toFixed(2)} chars/s (${speedWPM.toFixed(2)} WPM)`);
            console.log(`Backspace Corrections: ${backspaceCount}`);

            // Display results in the webpage
            if (totalTimeElem) {
                totalTimeElem.textContent = `${totalTimeSeconds.toFixed(2)} seconds`;
            }
            if (typingSpeedElem) {
                typingSpeedElem.textContent = `${speedCPS.toFixed(2)} chars/s (${speedWPM.toFixed(2)} WPM)`;
            }
            if (correctionsCountElem) {
                correctionsCountElem.textContent = `${backspaceCount} correction(s)`;
            }
            if (resultsArea) {
                resultsArea.style.display = "block";
            }
            if (typingStatusElem) {
                typingStatusElem.textContent = "Completed! Behavioural profile extracted.";
                typingStatusElem.className = "status-badge success";
            }

            // Lock input slightly to highlight completion
            typingInput.classList.add("input-complete");

            // Send behavioural features to Flask server
            const payload = {
                type: "behavioral_fingerprint",
                sentence: normalizedTarget,
                typingTime: parseFloat(totalTimeSeconds.toFixed(2)),
                speedCPS: parseFloat(speedCPS.toFixed(2)),
                speedWPM: parseFloat(speedWPM.toFixed(2)),
                corrections: backspaceCount
            };

            fetch("/collect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                console.log("Flask server response for behavioural data:", data);
            })
            .catch(err => {
                console.error("Error sending behavioural data to Flask:", err);
            });
        }
    });

    // Event 3: click (restart the experiment)
    restartBtn.addEventListener("click", () => {
        // Reset state
        startTime = null;
        endTime = null;
        backspaceCount = 0;
        isCompleted = false;

        // Reset input field
        typingInput.value = "";
        typingInput.disabled = false;
        typingInput.classList.remove("input-complete");
        typingInput.focus();

        // Clear display results
        if (totalTimeElem) totalTimeElem.textContent = "--";
        if (typingSpeedElem) typingSpeedElem.textContent = "--";
        if (correctionsCountElem) correctionsCountElem.textContent = "--";
        if (resultsArea) resultsArea.style.display = "none";
        if (typingStatusElem) {
            typingStatusElem.textContent = "Ready. Start typing below.";
            typingStatusElem.className = "status-badge ready";
        }

        console.log("Typing experiment reset.");
    });
});
