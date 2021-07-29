const { json } = require('express');
const mqtt = require('mqtt');
const mqttClient = mqtt.connect('tcp://broker.hivemq.com');
const publishTopic = "nhom24Sub";
const subscribeTopic = "nhom24Pub";
const deviceId = '61026f45259f4a0f48869e4b';
var temperature = 0;
var humidity = 0;
var actorState = 'ON';
var actorStateRequest = 'ON';
var location = '';

mqttClient.on('connect', () => {
    mqttClient.subscribe(subscribeTopic, (error) => {
        if (error) console.log(error);
    })
})

const interval = setInterval(every5SecondsFunction, 5000);
function every5SecondsFunction() {
    // get temperature and humidity
    temperature = (30 + 10 * Math.random()).toFixed(1);
    humidity = (100 * Math.random()).toFixed(1);
    // clear state change
    if (temperature > 35) {
        actorStateRequest = 'ON';
        console.log("Request turn on!");
    } else {
        actorStateRequest = 'OFF';
        console.log("Request turn off!");
    }
    mqttClient.publish(publishTopic, JSON.stringify({
        deviceId: deviceId,
        temperature: temperature,
        humidity: humidity,
        actorState: actorState,
        actorStateRequest: actorStateRequest,
        location: location
    }))
}

mqttClient.on('message', (subscribeTopic, payload) => {
    var jsonMessage = JSON.parse(payload.toString());
    if (jsonMessage.actorState && jsonMessage.keepTo && jsonMessage.from) {
        actorState = jsonMessage.actorState;
        keepTo = jsonMessage.keepTo;
        console.log("Actor " + actorState + " till " + (new Date(keepTo) + " by " + jsonMessage.from));
    }
})