import requests

# Replace with your API endpoint URL
api_url = 'https://api.themoviedb.org/3/search/movie'

# Replace with your TMDB API key
api_key = 'f16be0a860c732a007c43688a0ce0e28'

# Construct the query parameters
query_params = {
    'api_key': api_key,
    'query': 'Inception'  # Replace with your desired query
}

# Make a GET request to the API
response = requests.get(api_url, params=query_params)

# Parse the JSON response
data = response.json()

# Extract movie information from the response
movies = data.get('results', [])

# Print movie details
for movie in movies:
    print(f"Title: {movie['title']}")
    print(f"Overview: {movie['overview']}")
    print("-----------")
 