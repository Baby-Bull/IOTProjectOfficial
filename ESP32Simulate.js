const mqtt = require('mqtt');
const mqttClient = mqtt.connect('tcp://broker.hivemq.com');
const publishTopic = "nhom24Sub";
const subscribeTopic = "nhom24Pub";
const deviceId = '60c77855fd044a3a38ce88e9';
var temperature = 0;
var humidity = 0;
var actorState = 'ON';
var isActorStateChange = false;
var keepActorStateTo = 0;
var location = '';

mqttClient.on('connect', () => {
    mqttClient.subscribe(subscribeTopic, (error) => {
        if (error) console.log(error);
    })
})

const interval = setInterval(every5SecondsFunction, 5000);
function every5SecondsFunction() {
    // get temperature and humidity
    temperature =( 25 + 13 * Math.random()).toFixed(1);
    humidity = (100 * Math.random()).toFixed(1);
    // clear state change
    isActorStateChange = false;
    if (temperature > 28 || humidity > 60) {
        if (Date.now() > keepActorStateTo) {
            actorState = 'ON';
            isActorStateChange = true;
            console.log("Auto start actor");
        }
    } else {
        if (Date.now() > keepActorStateTo) {
            actorState = 'OFF';
            isActorStateChange = true;
            console.log("Auto stop actor");
        }
    }
    mqttClient.publish(publishTopic, JSON.stringify({
        deviceId: deviceId,
        temperature: temperature,
        humidity: humidity,
        actorState: actorState,
        isActorStateChange: isActorStateChange,
        location: location
    }))
}

mqttClient.on('message', (subscribeTopic, payload) => {
    var jsonMessage = JSON.parse(payload.toString());
    actorState = jsonMessage.actorState;
    keepActorStateTo = new Date(parseInt(jsonMessage.keepActorStateTo)).getTime();
    console.log("Actor " + actoreState + " till " + (new Date(keepActorStateTo) + " by user " + jsonMessage.userId));
})
