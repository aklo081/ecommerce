const mongoose = require('mongoose');


const categorySchemma = new mongoose.Schema({
    name: {type: String, required: true, minlenght: 5, maxlenght: 250},
    description: { type: String, required: true},
})

module.exports = mongoose.model("Category", categorySchemma)
