from pg import DB
db = DB()
from flask import Flask, request, send_from_directory
app = Flask(__name__)


if __name__ == '__main__':
    app.run()

@app.route('/')
def hello_world():
    return send_from_directory('app/public', 'index.html')
