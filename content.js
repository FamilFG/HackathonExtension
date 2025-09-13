(function () {
    // --- Create tooltip ---
    const tooltip = document.createElement("div");
    tooltip.className = "gpt-tooltip";
    tooltip.innerHTML = `
        <div class="gpt-tooltip-content">
            <div id="gptAnswer" class="gpt-tooltip-text">Loading...</div>
            <div class="gpt-tooltip-controls">
                <button id="toggleBtn" class="gpt-tooltip-btn">More</button>
                <button id="refreshBtn" class="gpt-tooltip-btn" title="Refresh">&#x21bb;</button>
            </div>
        </div>
    `;
    document.body.appendChild(tooltip);

    let selectedText = "";
    let isLarge = false;

    function highlightSelected(text, selected) {
        // Escape special regex characters in selected text
        const escaped = selected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Replace all occurrences (case-insensitive) with bold
        return text.replace(new RegExp(escaped, 'gi'), match => `<b>${match}</b>`);
    }

    function fetchAnswer(mode) {
        const answerDiv = document.getElementById("gptAnswer");
        answerDiv.textContent = "Loading...";
        fetch("http://127.0.0.1:5000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: selectedText, mode })
        })
            .then(res => res.json())
            .then(data => {
                // Bold the selected word/phrase in the answer
                answerDiv.innerHTML = highlightSelected(data.answer, selectedText);
                answerDiv.style.fontSize = "13px"; // Always same font size
            })
            .catch(err => {
                answerDiv.textContent = "Error: " + err.message;
            });
    }

    document.addEventListener("mouseup", () => {
        selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0) {
            const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.display = "block";
            isLarge = false;
            document.getElementById("toggleBtn").textContent = "More";
            document.getElementById("gptAnswer").style.fontSize = "13px";
            fetchAnswer("normal");
        } else {
            tooltip.style.display = "none";
        }
    });

    document.addEventListener("mousedown", (e) => {
        if (!tooltip.contains(e.target)) {
            tooltip.style.display = "none";
        }
    });

    tooltip.querySelector("#toggleBtn").addEventListener("click", () => {
        // Show loading immediately, then fetch the correct mode
        document.getElementById("gptAnswer").textContent = "Loading...";
        if (!isLarge) {
            fetchAnswer("more");
            isLarge = true;
            tooltip.querySelector("#toggleBtn").textContent = "Less";
        } else {
            fetchAnswer("normal");
            isLarge = false;
            tooltip.querySelector("#toggleBtn").textContent = "More";
        }
    });

    tooltip.querySelector("#refreshBtn").addEventListener("click", () => {
        // Always refresh with the current mode
        document.getElementById("gptAnswer").textContent = "Loading...";
        fetchAnswer(isLarge ? "more" : "normal");
    });
})();
