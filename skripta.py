from flask import Flask, jsonify, render_template, request, redirect, url_for, session
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'supersecretkey'
CORS(app)

# Zakucani podaci za dashboard
dashboard_data = {
    "temperature": 25,
    "humidity": 60,
    "pm25": 15,
    "pm10": 20,
    "co2": 400
}

# Zakucani podaci za indoor quality
indoor_data = {
    "mq2": 200,
    "mq7": 150,
    "mq135": 180,
    "dht11": 75
}

# Zakucani podaci za korisnike
users = {
    "maja": "maja",
    "ana": "ana"
}

@app.route("/")
def home():
    username = session.get('username')
    return render_template("index.html", dashboard_data=dashboard_data, username=username)

@app.route("/indoor_quality")
def indoor_quality():
    if 'username' in session:
        username = session['username']
        is_admin = username in ['maja', 'ana']
        return render_template("indoor_quality.html", indoor_data=indoor_data, is_admin=is_admin, username=username)
    return redirect(url_for('login'))

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and users[username] == password:
            session['username'] = username
            return redirect(url_for('home'))
        return render_template("login.html", error="Invalid credentials")
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))

@app.route("/setup")
def setup():
    return jsonify({"Poruka SETUP"})

@app.route('/distance')
def distance():
    try:
        return jsonify({"Poruka DISTANCE"})
    except RuntimeError as error:
        print(error.args[0])
        return jsonify({"poruka": "Podaci nisu poslati", "error": error.args[0]})


@app.route('/api/outdoor_quality')
def outdoor_quality():
    return jsonify(dashboard_data)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
