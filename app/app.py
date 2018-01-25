from flask import flask
app = Flask(__app__)

@app.route('/')
def hello():
    return 'Hello'
