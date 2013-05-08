from flask import Flask, request
import json
from random import randint, sample

app = Flask(__name__)

methods = ['http','http', 'ssh', 'spotify']

@app.route('/xhr')
def serve_json():
    li = ['192.168.1.%s' % randint(0,255) for i in range(0, randint(0,40))]
    li = [(i, sample(methods, 1)[0]) for i in li]
    obj = {'data' : li}
    return json.dumps(obj)


if __name__ == '__main__':
    app.run(debug=True)
