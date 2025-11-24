const mongoose = require('mongoose');

let DogModel = {};

const DogSchema = new mongoose.Schema({

});

DogModel = mongoose.model('Dog', DogSchema);

module.exports = DogModel;
