// create subscription model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    calculatorType: { type: String, required: true },
    boardId: { type: Number, required: true },
    inputFields: { type: Object, required: true },

    webhookUrl: { type: String, required: true },
    subscriptionId: { type: Number, required: true },
    recipeId: { type: Number, required: true },
    integrationId: { type: Number, required: true }
}, {timestamps: true});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
