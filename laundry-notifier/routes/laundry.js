const express = require('express');
const router = express.Router();
//const coap = require("node-coap-client").CoapClient;
const got = require('got');
const twilio = require('twilio');

const ObjectId = require('mongoose').Types.ObjectId;

const Laundry = require('../models/Laundry');

const accountSid = 'ACf8c9f3eab98b29746cbcb694909f0efc'; // Your Account SID from www.twilio.com/console
const authToken = 'b753cbac428a6d7792860cb5f5b57cbb';   // Your Auth Token from www.twilio.com/console
const client = new twilio(accountSid, authToken);

router.post('/new', (req, res, next) => {
    try {
    Laundry.create({
        phonenumber: req.body.phonenumber,
        laundryIp: req.body.laundryIp,
        name: req.body.name,
        _id: new ObjectId()
    }, (err, laundry) => {
        if (err) {
            console.log("Nope it failed")
            res.status(500).json({
                message: "Something went wrong with DB",
                err: err
            });
        } else {
            // coap.request("coap://" + laundry.laundryIp + ":5683/laundry", "post", new Buffer.from(payload)).then((response) => {
            //     res.json({
            //         message: "You successfully registered a laundry machine",
            //         laundry: laundry,
            //         coapResponse: response
            //     });
            // }).catch((err) => {
            //     res.status(500).json({
            //         message: "Something went wrong with coap",
            //         err: err,
            //         laundry: laundry
            //     });
            // });

            got.post('http://' + laundry.laundryIp + ':5000/laundry', {
                json: true,
                body: {
                    ipaddress: "192.168.11.130",
                    name: laundry.name,
                    laundryId: laundry._id
                }
            }).then((response) => {
                res.json({
                    message: "You successfully registered a laundry machine",
                    laundry: laundry,
                    coapResponse: response
                });
            }).catch((err) => {
                res.status(500).json({
                    message: "Something went wrong with coap",
                    err: err,
                    laundry: laundry
                });
            });
        }
    });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "It broke",
            error: e
        });
    }
});

router.get('/finished/:laundryId', (req, res, next) => {
    Laundry.findById(req.params.laundryId, {}, (err, laundry) => {
        if(err) {
            res.status(500).json({
                message: "Failed to connect to DB",
                error: err
            });
        } else if (laundry == null) {
            res.status(404).json({
                message: "Failed find anything in DB with that ID"
            });
        } else {
            client.messages.create({
                body: 'Your laundry is Done!',
                to: laundry.phonenumber,  // Text this number
                from: '+13176997292' // From a valid Twilio number
            }, (err, result) => {
                if (err) {
                    res.status(500).json({
                        message: "Message Failed",
                        error: err
                    });
                } else {
                    res.json({
                        details: "Sent Message! " + laundry.phonenumber
                    });
                }
            });
        }
    });
});

router.get('/test', (req, res, next) => {
    client.messages.create({
        body: 'I am the ghost of christmas past ooooooh',
        to: '+18124472314',  // Text this number
        from: '+13176997292' // From a valid Twilio number
    }, (err, result) => {
        if (err) {
            res.status(500).json({
                message: "Message Failed",
                error: err
            });
        } else {
            res.json({
                details: "Sent Message!"
            });
        }
    });
});

module.exports = router;