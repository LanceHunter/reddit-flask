from pg import DB
from flask import Flask, request, send_from_directory, jsonify
app = Flask(__name__)
db = DB(dbname = 'reddit-clone', host='localhost')

@app.route('/')
def hello_world():
    return send_from_directory('app/public', 'index.html')

@app.route('/api/posts')
def get_posts():
    firstResults = db.query('select * from posts')
    results = firstResults.dictresult()

    commentResults = db.query('select * from "comments" where "post_id" in (posts.map(p => p.id))')
    return jsonify(results)


if __name__ == '__main__':
    app.run()
