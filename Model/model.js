const mongoose = require('mongoose');


const profilePost = new mongoose.Schema({
    username: { type: String},
    email: { type: String },
    password: { type: String },
    image: { type: String },
    desc: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("profile", profilePost);