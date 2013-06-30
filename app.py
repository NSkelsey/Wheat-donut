from flask import Flask, request, render_template
import json
from random import randint, sample
import os

app = Flask(__name__)

methods = ['http','http', 'ssh', 'spotify']

@app.route('/')
def home():
    return render_template('ind.html')

#@app.route('/d3')
#def home():
#    p = "We are up."
#    return render_template('ind.html',p=p)

@app.route('/xhr',methods=['GET'])
def serve_json():
    li = ['192.168.1.%s' % randint(0,255) for i in range(0, randint(0,40))]
    li = [(i,'223.193.3.%s'%randint(0,255),sample(methods, 1)[0]) for i in li]
    obj = {'data' : li}
    return json.dumps(obj)



if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port,debug=True)
