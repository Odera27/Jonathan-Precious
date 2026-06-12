from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # allow requests from your Next.js frontend

# ── Load the trained model at startup ──────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "xgboost_model.pkl")

model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("✅ XGBoost model loaded successfully")
else:
    print("⚠️ Model file not found at", MODEL_PATH)


# ── Health check endpoint ──────────────────────────────────────
@app.route("/", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "Campus Inventory ML Service",
        "model_loaded": model is not None
    })


# ── Prediction endpoint ────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded. Run train.py first."}), 500

    data = request.get_json()

    # Validate input
    if not data or "product_id" not in data:
        return jsonify({"error": "Missing required field: product_id"}), 400

    product_id = data["product_id"]
    current_stock = data.get("current_stock", 0)
    semester_period = data.get("semester_period", 1)  # 0=start, 1=mid, 2=exam
    is_holiday = data.get("is_holiday", 0)

    # ── Build features for the next 7 days ─────────────────────
    today = datetime.now()
    forecast = []
    total_predicted = 0

    for i in range(1, 8):
        future_date = today + timedelta(days=i)
        features = pd.DataFrame([{
            "day_of_week": future_date.weekday(),
            "week_of_month": (future_date.day - 1) // 7 + 1,
            "month": future_date.month,
            "semester_period": semester_period,
            "is_holiday": is_holiday,
            "product_id": product_id
        }])

        predicted_demand = float(model.predict(features)[0])
        predicted_demand = max(0, round(predicted_demand, 1))  # no negative demand
        total_predicted += predicted_demand

        forecast.append({
            "date": future_date.strftime("%Y-%m-%d"),
            "day": future_date.strftime("%A"),
            "predicted_demand": predicted_demand
        })

    # ── Reorder recommendation ──────────────────────────────────
    safety_buffer = 1.2  # 20% buffer above predicted demand
    recommended_reorder = max(0, round((total_predicted * safety_buffer) - current_stock))
    stockout_risk = "HIGH" if current_stock < total_predicted else "LOW"

    return jsonify({
        "product_id": product_id,
        "current_stock": current_stock,
        "forecast_7_days": forecast,
        "total_predicted_demand": round(total_predicted, 1),
        "recommended_reorder_quantity": recommended_reorder,
        "stockout_risk": stockout_risk
    })


# ── Run server (Render-compatible) ─────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)