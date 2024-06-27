import paho.mqtt.client as mqtt

# Konfiguracija MQTT
mqtt_host = "localhost"  # Adresa MQTT brokera na Raspberry Pi-u
mqtt_port = 1883
topic = "sensor/indoor"

def on_message(client, userdata, message):
    print(f"Received `{message.payload.decode()}` from `{message.topic}` topic")

if __name__ == "__main__":
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(mqtt_host, mqtt_port, 60)
    client.subscribe(topic)
    client.loop_forever()