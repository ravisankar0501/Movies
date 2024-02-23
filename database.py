from flask import Flask, render_template, request
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('hub.html', movies=[])

@app.route('/search', methods=['POST'])
def search_movies():
    query = request.form.get('query')
    if query:
        api_key = 'f16be0a860c732a007c43688a0ce0e28'
        search_url = f'https://api.themoviedb.org/3/search/movie'
        params = {
            'api_key': api_key,
            'query': query
        }
        response = requests.get(search_url, params=params)
        movies = response.json().get('results', [])
        return render_template('hub.html', movies=movies)
    return render_template('hub.html', movies=[])

if __name__ == '__main__':
    app.run(debug=True)
