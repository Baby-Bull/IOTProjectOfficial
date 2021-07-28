const express = require('express');
const deviceRouter = express.Router();

const deviceController = require('../controllers/deviceController');
const Device = require('../models/device');

deviceRouter.post('/getDeviceInfo', deviceController.onGetDeviceInfo);
deviceRouter.post('/createDevice', deviceController.onCreateDevice);


//edit sate automatic - ON OFF
deviceRouter.put("/editDevice/:id", async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);
        if (device.stateHistory.length >= 50) {
            device.stateHistory.shift();
        }
        device.stateHistory.push({
            temperature: req.query.temperature,
            humidity: req.query.humidity,
            actorState: (req.query.temperature > 35 ? "ON" : "OFF")
        });

        await Device.findByIdAndUpdate(req.params.id, {
            $set: device
        })
        res.status(200).json("," + device.stateHistory[device.stateHistory.length - 1].actorState + "," + device.actionHistory[device.actionHistory.length - 1].action + ",");
    } catch (error) {
        res.status(500).json(error);
    }
});

//state is edited by user - manual
deviceRouter.put("/editByUser/:id", async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);
        if (device.creatorId === req.body.userId) {
            try {
                for (var i = 0; i < device.actionHistory.length; i++) {
                    device.actionHistory[i].action = req.body.action;
                }
                await Device.findByIdAndUpdate(req.params.id, {
                    $set: device
                });
                res.status(200).json(device);
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(404).json("you cant modify here !!!");
        }

    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = deviceRouter;