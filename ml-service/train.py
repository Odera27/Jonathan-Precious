import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

df = pd.read_csv('data/training_data.csv')
df['date'] = pd.to_datetime(df['date'])
df['day_of_week'] = df['date'].dt.dayofweek
df['week_of_month'] = (df['date'].dt.day - 1) // 7 + 1
df['month'] = df['date'].dt.month

X = df[['day_of_week','week_of_month','month','semester_period','is_holiday','product_id']]
y = df['quantity_sold']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = xgb.XGBRegressor(learning_rate=0.05, max_depth=6, n_estimators=300, subsample=0.8, eval_metric='rmse')
model.fit(X_train, y_train, eval_set=[(X_train,y_train),(X_test,y_test)], verbose=False)

preds = model.predict(X_test)
mae = mean_absolute_error(y_test, preds)
rmse = np.sqrt(mean_squared_error(y_test, preds))
print('MAE:', mae)
print('RMSE:', rmse)

joblib.dump(model, 'model/xgboost_model.pkl')
print('Model saved!')

results = model.evals_result()
plt.figure(figsize=(8.5,5))
plt.plot(results['validation_0']['rmse'], label='Training RMSE', linewidth=2)
plt.plot(results['validation_1']['rmse'], label='Validation RMSE', linewidth=2)
plt.xlabel('Boosting Round (Tree Number)')
plt.ylabel('RMSE (units/day)')
plt.title('XGBoost Training Convergence Curve')
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig('training_curve.png', dpi=140, bbox_inches='tight')
print('Training curve saved!')
