const express = require('express');
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const cors = require('cors');
const mqttClient = mqtt.connect('tcp://broker.hivemq.com:1883');
const Device = require('./app/models/device');
const User = require('./app/models/user');
const subscribeTopic = "nhom24Sub"
const publishTopic = "nhom24Pub"


const server = express().use(express.json()).use(express.urlencoded({ extended: true })).use(cors());

const authRouter = require('./app/routes/authRouter');
const userRouter = require('./app/routes/userRouter');
const deviceRouter = require('./app/routes/deviceRouter');
const user = require('./app/models/user');

server.use('/auth', authRouter);
server.use('/user', userRouter);
server.use('/device', deviceRouter);
server.use(express.static('public'));

const http = require('http').createServer(server);

mqttClient.on('connect', () => {
    mqttClient.subscribe(subscribeTopic, (err) => {
        if (err) console.log(err);
    })
})

mqttClient.on('message', async (subscribeTopic, payload) => {
    try {
        var jsonMessage = JSON.parse(payload.toString());
        console.log("Update from device: " + jsonMessage.deviceId);
        const device = await Device.findById(jsonMessage.deviceId);
        if (device) {
            if (device.connectState == 'pending') {
                device.connectState = 'active';
                await User.findOneAndUpdate({ _id: device.creatorId, "devices.connectState": "pending" }, {
                    $set: {
                        "devices.$.connectState": "active"
                    }
                })
            }

            if (device.stateHistory.length >= 50) {
                device.stateHistory.shift();
            }

            // User time limit outdate
            if (device.actionHistory[device.actionHistory.length - 1].keepTo < Date.now()) {
                device.stateHistory.push({
                    temperature: jsonMessage.temperature,
                    humidity: jsonMessage.humidity,
                    actorState: jsonMessage.actorStateRequest
                })
                if (device.actionHistory.length > 50) device.actionHistory.shift();
                device.actionHistory.push({
                    from: "device",
                    action: device.stateHistory[device.stateHistory.length - 1].actorState,
                    keepTo: Date.now()
                })
            } else {
                device.stateHistory.push({
                    temperature: jsonMessage.temperature,
                    humidity: jsonMessage.humidity,
                    actorState: device.actionHistory[device.actionHistory.length - 1].action
                })
            }

            mqttClient.publish(publishTopic, JSON.stringify({
                actorState: device.actionHistory[device.actionHistory.length - 1].action,
                keepTo: device.actionHistory[device.actionHistory.length - 1].keepTo,
                from: device.actionHistory[device.actionHistory.length - 1].from
            }))

            await Device.findByIdAndUpdate(jsonMessage.deviceId, {
                $set: device
            })
        }
    } catch (error) {
        console.log(error);
    }
})

http.mqttClient = mqttClient;
http.listen(3000);

console.log("Listen at port 3000");