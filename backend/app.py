from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/projects", methods=["GET"])
def projects():
    return jsonify([
        {
            "title": "LifeAura AI / SANKALP",
            "desc": "Health-tech platform: MERN + OCR + Disease Prediction + FHIR",
            "tags": ["React", "Node", "MongoDB", "PyTorch", "FHIR"],
            "repo": "https://github.com/Siddharth-Jaswal/LifeAura",
            "demo": "https://lifeaura.vercel.app"
        },
        {
            "title": "Portfolio Engine",
            "desc": "Dynamic React + Flask widgets, Apple-like design",
            "tags": ["React", "Flask", "Tailwind", "Framer Motion"],
            "repo": "https://github.com/Siddharth-Jaswal/portfolio",
            "demo": "#"
        }
    ])

@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.json or {}
    print("Contact form:", data)
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
