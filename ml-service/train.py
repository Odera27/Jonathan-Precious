import pandas as pd
import xgboost as xgb
import pickle

# Load your data
df = pd.read_csv("data/training_data.csv")

X = df.drop("target_column", axis=1)
y = df["target_column"]

# Train
model = xgb.XGBRegressor(n_estimators=100)
model.fit(X, y)

# Save model
with open("model/xgboost_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model trained and saved!")