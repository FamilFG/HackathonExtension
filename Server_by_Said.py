from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

new_server = Flask(__name__)
CORS(new_server)

genai.configure(api_key="AIzaSyBmPrCO2_J4K6a6XWVy56xhr72JLr6JLy4")
model = genai.GenerativeModel("gemini-2.5-flash")

@new_server.route("/analyze", methods=["POST"])
def analyze():
    if request.method=="POST":
        
            msg = request.json["text"]
            mode=request.json["mod"]
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
                    f"Don't use text format (ex. *[text]*)."
                    f"Just provide concise information.\n\nText: {msg}"
                   
                )
            elif mode == "academic":
                prompt = (
                    f"Explain the following text in detail using Google Scholar sources."
                    f"Provide historical or contextual background if relevant."
                    f"Don't use text format (ex. *[text]*)."
                    f"Keep it under 150 words. Include more technical details and examples if applicable.\n\nText: {msg}"
                    
                )
            else:
                return jsonify({"error": "Invalid mode specified"}), 400

            response = model.generate_content(prompt)
            return jsonify({
                "answer": response.text,
            }), 200



if __name__ == "__main__":
    new_server.run(debug=True)
