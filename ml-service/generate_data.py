import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)

# ── Configuration ────────────────────────────────────────────
start_date = datetime(2025, 6, 1)
days = 365  # 12 months
product_ids = list(range(1, 19))  # 18 product categories

# Base daily demand per product (units/day)
base_demand = {pid: np.random.randint(5, 25) for pid in product_ids}

rows = []

for d in range(days):
    current = start_date + timedelta(days=d)
    month = current.month
    day_of_week = current.weekday()

    # ── Semester period logic (adjust to your academic calendar) ──
    # 0 = semester start, 1 = mid-semester, 2 = exam period
    if month in [1, 6, 9]:        # resumption months
        semester_period = 0
    elif month in [4, 7, 11, 12]: # exam months
        semester_period = 2
    else:
        semester_period = 1

    # Holidays (public + breaks)
    is_holiday = 1 if (month == 12 and current.day > 20) or \
                      (month == 1 and current.day < 8) or \
                      (month == 8) else 0

    for pid in product_ids:
        demand = base_demand[pid]

        # Academic calendar effects
        if semester_period == 2:      # exam period spike
            demand *= np.random.uniform(1.3, 1.6)
        elif semester_period == 0:    # resumption spike
            demand *= np.random.uniform(1.2, 1.4)

        # Weekend dip (less campus traffic)
        if day_of_week >= 5:
            demand *= np.random.uniform(0.5, 0.8)

        # Holiday collapse (students away)
        if is_holiday:
            demand *= np.random.uniform(0.1, 0.3)

        # Random daily noise
        demand *= np.random.uniform(0.85, 1.15)

        rows.append({
            "date": current.strftime("%Y-%m-%d"),
            "product_id": pid,
            "quantity_sold": max(0, round(demand)),
            "semester_period": semester_period,
            "is_holiday": is_holiday
        })

df = pd.DataFrame(rows)
df.to_csv("data/training_data.csv", index=False)
print(f"✅ Generated {len(df)} records across {len(product_ids)} products")
print(df.head(10));
