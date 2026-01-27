import pandas as pd
import requests
from datetime import datetime, timedelta
import time

# Read the Excel file
print("Reading McDonald's restaurant data...")
df = pd.read_excel('McDonald restaurants.xlsx')

# Display the structure
print("\nFile structure:")
print(df.head())
print("\nColumns:", df.columns.tolist())
print(f"\nTotal restaurants: {len(df)}")

# Check if we have coordinates or need to geocode
if 'latitude' in df.columns or 'lat' in df.columns:
    print("\n✓ Coordinates found in file")
else:
    print("\n✗ No coordinates found - will need to geocode addresses")
