from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

new_server = Flask(__name__)
CORS(new_server)

genai.configure(api_key="AIzaSyA4GOTW7dfyZr5x09kTpAKEiN3y56Wi13Y")
model = genai.GenerativeModel("gemini-2.5-flash")

@new_server.route("/analyze", methods=["POST"])
def analyze():
    if request.method=="POST":
        
            msg = request.json["text"]
            mode=request.json["mode"]
            if not msg:
                return jsonify({"error": "No data provided"}), 400
            
            #msg = data.get("text", "")
            #mode = data.get("mode", "normal")

            if not msg:
                return jsonify({"error": "Please Highlight Text"}), 400

            if mode == "normal":
                prompt = (
                    f"Explain the following text clearly and factually in the style of Wikipedia. "
                    f"Keep the explanation under 50 words. Do not ask questions or provide extra commentary. "
                    f"Just provide concise information.\n\nText: {msg}"
                )
            elif mode == "more":
                prompt = (
                    f"Explain the following text in detail as if writing a Wikipedia article section. "
                    f"Provide historical or contextual background if relevant. "
                    f"Keep it under 150 words. Include more technical details and examples if applicable.\n\nText: {msg}"
                )
            else:
                return jsonify({"error": "Invalid mode specified"}), 400

            response = model.generate_content(prompt)
            return jsonify({
                "status": "success",
                "answer": response.text,
                "mode": mode
            }), 200



if __name__ == "__main__":
    new_server.run(debug=True)
