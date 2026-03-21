import json
import random
import secrets
from datetime import datetime

# Configuration
POLL_ID = "69bd5d4b31dd84242c0b8b85"
INPUT_FILE = 'quickpik.users.json'
OUTPUT_FILE = 'submissions_summer_course_poll.json'

def generate_mongo_id():
    """Generates a random 24-character hex string to simulate a MongoDB ObjectId."""
    return secrets.token_hex(12)

def generate_skewed_grid():
    """
    Generates a 4x5 grid with skewed logic:
    Row 1: Mostly 5th column (index 4).
    Rows 2-4: Only 1st, 2nd, or 3rd columns (indices 0, 1, 2).
    """
    grid = []
    
    row1 = [False] * 5
    if random.random() > 0.2:
        row1[4] = True
    grid.append(row1)
    
    for _ in range(3):
        row = [False] * 5
        if random.random() > 0.3:
            target_col = random.randint(0, 2)
            row[target_col] = True
        grid.append(row)
        
    return grid

def transform_data():
    try:
        with open(INPUT_FILE, 'r') as f:
            users = json.load(f)
        
        submissions = []
        now_iso = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

        for user in users:
            user_id_str = user['_id']['$oid']
            
            submission = {
                "_id": {
                    "$oid": generate_mongo_id()
                },
                "poll_id": POLL_ID,
                "user_id": user_id_str,
                "selected_cells": generate_skewed_grid(),
                "submitted_at": {"$date": now_iso},
                "updated_at": {"$date": now_iso}
            }
            submissions.append(submission)

        with open(OUTPUT_FILE, 'w') as f:
            json.dump(submissions, f, indent=2)
            
        print(f"Success! Generated {len(submissions)} skewed records in {OUTPUT_FILE}")

    except Exception as e:
        print(f"Error processing data: {e}")

if __name__ == "__main__":
    transform_data()