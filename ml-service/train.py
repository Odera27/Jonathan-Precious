import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib

df = pd.read_csv("data/training_data.csv")

df["date"] = pd.to_datetime(df["date"])
df["day_of_week"] = df["date"].dt.dayofweek
df["week_of_month"] = (df["date"].dt.day - 1) // 7 + 1
df["month"] = df["date"].dt.month

X = df[["day_of_week", "week_of_month", "month", "semester_period", "is_holiday", "product_id"]]
y = df["quantity_sold"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = xgb.XGBRegressor(
    learning_rate=0.05,
    max_depth=6,
    n_estimators=300,
    subsample=0.8
)
model.fit(X_train, y_train)

preds = model.predict(X_test)
print("MAE:", mean_absolute_error(y_test, preds))

joblib.dump(model, "model/xgboost_model.pkl")
print("Model saved!")
