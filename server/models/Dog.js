const mongoose = require('mongoose');

let DogModel = {};

const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

DogModel = mongoose.model('Dog', DogSchema);

module.exports = DogModel;
