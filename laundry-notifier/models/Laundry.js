const mongoose = require('mongoose');

module.exports = mongoose.model("Laundry", mongoose.Schema({
    phonenumber: String,
    laundryIp: String,
    name: String,
    _id: String
}));
