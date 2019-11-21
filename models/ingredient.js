var mongoose = require('mongoose');

var Ingredient = new mongoose.Schema({
    quantity : {
        type : Number
    },
    ingredient : {
        type : String
    },
    thing      : {
        type   : String
    }
});

module.exports = Ingredient;