// create token model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    token: { type: String, required: true },
    userId: { type: Number, required: true },
    accountId: { type: Number, required: true },
})

const Token = mongoose.model('Token', tokenSchema)
module.exports = Token
