chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "sendToGPT") {
        // Здесь вызываешь свой API к ChatGPT / OpenAI
        // Я пока сделаю фейковый ответ для примера
        const fakeAnswer = `**GPT ответ:**\n\nВы выделили: "${message.text}"`;

        // Отправляем в popup
        chrome.runtime.sendMessage({ action: "showAnswer", answer: fakeAnswer });
    }
});
