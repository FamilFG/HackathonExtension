(function () {
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
    let currentMode = "normal";

    function highlightSelected(text, selected) {
        const escaped = selected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return text.replace(new RegExp(escaped, 'gi'), match => `<b>${match}</b>`);
    }

    function fetchAnswer(mode) {
        currentMode = mode;
        const answerDiv = document.getElementById("gptAnswer");
        answerDiv.textContent = "Loading...";
        fetch("http://127.0.0.1:5000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: selectedText, mod: mode })
        })
            .then(res => res.json())
            .then(data => {
                if (mode === currentMode) {
                    answerDiv.innerHTML = highlightSelected(data.answer, selectedText);
                    answerDiv.style.fontSize = "13px";
                }
            })
            .catch(err => {
                if (mode === currentMode) {
                    answerDiv.textContent = "Error: " + err.message;
                }
            });
    }

    document.addEventListener("mouseup", () => {
        selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0) {
            const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.display = "block";
            
            document.getElementById("toggleBtn").textContent = "Academic";
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
        document.getElementById("gptAnswer").textContent = "Loading...";
        if (!isLarge) {
            fetchAnswer("academic");
            isLarge = true;
            tooltip.querySelector("#toggleBtn").textContent = "Normal";
        } else {
            fetchAnswer("normal");
            isLarge = false;
            tooltip.querySelector("#toggleBtn").textContent = "Academic";
        }
    });

    tooltip.querySelector("#refreshBtn").addEventListener("click", () => {
        document.getElementById("gptAnswer").textContent = "Loading...";
        fetchAnswer(isLarge ? "academic" : "normal");
    });
})();

