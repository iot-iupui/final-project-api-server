const mongoose = require('mongoose');

module.exports = mongoose.Schema('Laundry', {
    phonenumber: String,
    laundryIp: String,
    name: String,
    _id: String
});
