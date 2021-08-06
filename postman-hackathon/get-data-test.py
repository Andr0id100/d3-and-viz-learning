import requests
import json

API_KEY = "4b4f474a"
SERIES_NAME = "Attack on Titan"
FILE_NAME = "aot" 
res = requests.get(f"http://www.omdbapi.com/?apikey={API_KEY}&t={SERIES_NAME}&type=series")
if res.status_code == 200:
    season_count = res.json()["totalSeasons"]

    data = []
    for season in range(1, eval(season_count)+1):
        print("Collecting Season", season)
        res = requests.get(f"http://www.omdbapi.com/?apikey={API_KEY}&t={SERIES_NAME}&Season={season}")
        data.append(res.json())

    with open(f"{FILE_NAME}.json", "w") as f:
        json.dump(data, f, indent=2)
else:
    print("Show not found")