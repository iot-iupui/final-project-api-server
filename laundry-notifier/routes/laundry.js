var express = require('express');
var router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const coap = require("node-coap-client").CoapClient;

const Laundry = require('../models/Laundry');


router.post('/new', (req, res, next) => {
    Laundry.save({
        phonenumber: req.body.phonenumber,
        laundryIp: req.body.laundryIp,
        name: req.body.name,
        _id: new ObjectId()
    }, (err, laundry) => {
        if (err) {
            res.status(500).json({
                message: "Something went wrong with DB",
                err: err
            });
        } else {
            coap.request("coap://" + laundry.laundryIp + ":5683/server", "post", {
                apiServer: "159.203.108.254:3000",
                name: laundry.name
            }).then((response) => {
                res.json({
                    message: "You successfully registered a laundry machine",
                    laundry: laundry,
                    coapResponse: response
                });
            }).catch((err) => {
                res.status(500).json({
                    message: "Something went wrong with coap",
                    err: err
                });
            });
        }
    });
});

router.post('/finished', (req, res, next) => {

});