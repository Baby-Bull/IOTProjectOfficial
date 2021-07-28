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
const io = require('socket.io')(http, {
    cors: {
        origin: true
    }
});

mqttClient.on('connect', () => {
    mqttClient.subscribe(subscribeTopic, (err) => {
        if (err) console.log(err);
    })
})

mqttClient.on('message', async (subscribeTopic, payload) => {
    try {
        var jsonMessage = JSON.parse(payload.toString());
        console.log("Update from device: " + jsonMessage.deviceId);
        let device = await Device.findById(jsonMessage.deviceId);
        if (device.connectState == 'pending') {
            device.connectState = 'active';
            await User.findOneAndUpdate({ _id: device.creatorId, "devices.connectState": "pending" }, {
                $set: {
                    "devices.$.connectState": "active"
                }
            })
        }
        if (device.stateHistory.length >= 50) device.stateHistory.shift();
        device.stateHistory.push({
            temperature: jsonMessage.temperature,
            humidity: jsonMessage.humidity,
            actorState: jsonMessage.actorState
        });
        if (jsonMessage.isActorStateChange) {
            if (device.actionHistory.length >= 50) device.actionHistory.shift();
            device.actionHistory.push({
                userId: jsonMessage.deviceId,
                username: device.deviceName,
                action: jsonMessage.actorState
            })
        }
        device.save();
        io.to('' + device._id).emit('deviceUpdate', jsonMessage);
    } catch (error) {
        console.log(error);
    }
})

io.on('connection', (socket) => {
    console.log('New connection from ' + socket.id);
    socket.on('init', async (userId) => {
        let user = await User.findById(userId);
        user.devices.forEach((device) => {
            socket.join('' + device.deviceId);
        })
    })
    socket.on('switch', async (data) => {
        mqtt.publish(publishTopic, JSON.stringify({
            actorState: data.actorState,
            keepActorStateTo: data.keepActorStateTo,
            userId: data.userId
        }))
        let device = await Device.findById(data.deviceId);
        if (device.actionHistory.length >= 50) device.actionHistory.shift();
        device.actionHistory.push({
            userId: data.userId,
            username: data.username,
            action: data.actorState
        })
        await device.save();
    })
})

http.mqttClient = mqttClient;
http.listen(3000);

console.log("Listen at port 3000");