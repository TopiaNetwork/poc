from flask import Flask, send_file

app = Flask(__name__)


@app.route('/soljson.js')
def get_file():
    return send_file('soljson-latest.js', mimetype='application/javascript')


if __name__ == '__main__':
    app.run()