from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from typing import Any, Dict
import smtplib
import ssl
from email.message import EmailMessage
try:
    import requests
except Exception:
    requests = None

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
    name = (data.get("name") or "").strip()
    sender_email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()
    topics = data.get("topics") or []

    if not name or not sender_email or not message:
        return jsonify({"error": "Missing required fields"}), 400

    # SMTP configuration via environment variables
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER") or os.environ.get("GMAIL_USER")
    smtp_pass = os.environ.get("SMTP_PASS") or os.environ.get("GMAIL_APP_PASSWORD")
    to_email = os.environ.get("CONTACT_TO") or smtp_user

    if not smtp_user or not smtp_pass or not to_email:
        # Fall back to logging only if SMTP is not configured
        print("Contact form (SMTP not configured):", data)
        return jsonify({"ok": True, "note": "SMTP not configured; logged only"})

    # Compose email
    subject = f"New portfolio contact from {name}"
    lines = [
        f"Name: {name}",
        f"Email: {sender_email}",
        f"Topics: {', '.join(topics) if topics else '—'}",
        "",
        message,
    ]
    body = "\n".join(lines)

    email_msg = EmailMessage()
    email_msg["Subject"] = subject
    email_msg["From"] = smtp_user
    email_msg["To"] = to_email
    # So replies go to the visitor's address
    email_msg["Reply-To"] = sender_email
    email_msg.set_content(body)

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            server.ehlo()
            # Upgrade to TLS
            server.starttls(context=ssl.create_default_context())
            server.ehlo()
            server.login(smtp_user, smtp_pass)
            server.send_message(email_msg)
        return jsonify({"ok": True})
    except Exception as e:
        # Do not leak credentials; return minimal error
        print("Contact send failed:", repr(e))
        return jsonify({"error": "Failed to send message"}), 502

@app.route("/api/leetcode", methods=["GET"])
def leetcode_profile():
    username = request.args.get("user", type=str)
    if not username:
        return jsonify({"error": "Missing 'user' query param"}), 400

    template = os.environ.get("LEETCODE_API_URL", "https://leetcode-stats-api.herokuapp.com/{username}")
    url = template.replace("{username}", username)

    data: Dict[str, Any] = {}
    if requests is not None:
        try:
            r = requests.get(url, timeout=8)
            r.raise_for_status()
            data = r.json() if r.headers.get("content-type", "").startswith("application/json") else json.loads(r.text)
        except Exception as e:
            return jsonify({"error": "Upstream request failed", "detail": str(e)}), 502
    else:
        return jsonify({"error": "'requests' not installed on server"}), 500

    def num(val):
        try:
            return int(val)
        except Exception:
            try:
                f = float(val)
                return int(f) if float(f).is_integer() else f
            except Exception:
                return 0

    easy = data.get("easySolved") or data.get("easy_solved") or data.get("easy") or 0
    med = data.get("mediumSolved") or data.get("medium_solved") or data.get("medium") or 0
    hard = data.get("hardSolved") or data.get("hard_solved") or data.get("hard") or 0
    total_solved = data.get("totalSolved") or data.get("total_solved") or (num(easy) + num(med) + num(hard))
    total_questions = data.get("totalQuestions") or data.get("questions") or data.get("total_questions")
    acceptance = data.get("acceptanceRate") or data.get("acceptance_rate")
    ranking = data.get("ranking") or data.get("rank") or data.get("level")
    contest_rating = data.get("contestRating") or data.get("contest_rating")

    normalized = {
        "username": username,
        "profileUrl": f"https://leetcode.com/{username}/",
        "rank": ranking if ranking is not None else "",
        "contestRating": contest_rating,
        "totalSolved": num(total_solved),
        "totalQuestions": num(total_questions) if total_questions is not None else None,
        "acceptanceRate": float(acceptance) if acceptance not in (None, "", []) else None,
        "solved": {
            "easy": num(easy),
            "medium": num(med),
            "hard": num(hard),
        },
        "badges": data.get("badges") if isinstance(data.get("badges"), list) else [],
    }

    return jsonify(normalized)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
