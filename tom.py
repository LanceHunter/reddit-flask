from pg import DB
from flask import Flask, request, send_from_directory, jsonify
app = Flask(__name__)
db = DB(dbname = 'reddit-clone', host='localhost')
def getId(x): return x['id']

@app.route('/')
def hello_world():
    return send_from_directory('app/public', 'index.html')

@app.route('/api/posts')
def get_posts():
    firstResults = db.query('select * from posts')
    results = firstResults.dictresult()
    idArray = map(getId ,results)
    idString = ','.join(str(e) for e in idArray)
    print idString
    queryString = 'select * from "comments" where "post_id" in ({})'.format(idString)
    commentResults = db.query(queryString)
    print queryString
    comments = commentResults.dictresult()
    print comments
    return jsonify(results)


if __name__ == '__main__':
    app.run()
