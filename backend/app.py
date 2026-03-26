from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    logs = data.get("logs", [])

    if len(logs) < 2:
        return jsonify({
            "prediction": 0,
            "confidence": "not-enough-data"
        })

    # Extract acquisitions
    y = np.array([log.get("acquisition", 0) for log in logs])

    # Time index
    X = np.arange(len(y))

    # Linear regression
    slope, intercept = np.polyfit(X, y, 1)

    # Predict next value
    next_x = len(y)
    prediction = slope * next_x + intercept

    return jsonify({
        "prediction": max(0, round(prediction)),
        "confidence": "linear-regression-model"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)