from flask import Flask, jsonify, render_template, request, redirect, url_for, session
from flask_cors import CORS
import paho.mqtt.client as mqtt

app = Flask(__name__)
app.secret_key = 'supersecretkey'
CORS(app)

# MQTT Configuration
mqtt_host = "localhost"  # Replace with your MQTT broker address
mqtt_port = 1883
topic_prefix = "sensor/"

# Zakucani podaci za dashboard
dashboard_data = {
    "temperature": 25,
    "humidity": 60,
    "pressure": 1013,
    "wind_speed": 5,
    "wind_deg": 180,
}

# Zakucani podaci za indoor quality
indoor_data = {
    "mq2": 0,
    "mq7": 0,
    "mq135": 0,
    "dht11": 0,
    "ml8511":0
}

# Zakucani podaci za korisnike
users = {
    "maja": "maja",
    "ana": "ana",
    "sara":"sara"
}

def on_message(client, userdata, message):
    global indoor_data
    topic = message.topic
    payload = message.payload.decode("utf-8")
    print(f"Received message '{payload}' on topic '{topic}'")
    # Update indoor_data based on the received topic
    if topic == topic_prefix + "dht/first":
        indoor_data["dht11"] = payload
    elif topic == topic_prefix + "multi/first":
        indoor_data["mq2"] = payload
    elif topic == topic_prefix + "multi/second":
        indoor_data["mq7"] = payload
    elif topic == topic_prefix + "multi/third":
        indoor_data["mq135"] = payload

client = mqtt.Client()
client.on_message = on_message
client.connect(mqtt_host, mqtt_port, 60)
client.subscribe(topic_prefix + "dht/first", 1)
client.subscribe(topic_prefix + "multi/#", 1)


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
    return render_template("indoor_quality.html", indoor_data=indoor_data)

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
