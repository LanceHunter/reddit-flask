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

@app.route('api/posts/<int:id>', methods=['DELETE'])
    def deletePost(id):
    deleteString = 'DELETE from posts where id={}'.format(str(id))
   firstResults = db.query(deleteString)
    results = firstResults.dictresult()

@app.route('api/posts/<int:id>/comments')
    commentResults = db.query('select * from "comments" where "post_id" in (posts.map(p => p.id))')
    return jsonify(results)

@app.route('api/posts/<int:id>', methods=['GET', 'POST'])
def updatePost(id):
    form = UpdateForm(request.form)

if request.method == 'POST'
    print request.form


    updatePost = 'update posts where id={}'.format(str(id))
   firstResults = db.update(updatePost)
   results = firstResults.dictresult()




if __name__ == '__main__':
    app.run()
