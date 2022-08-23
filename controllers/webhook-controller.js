const Webhook = require("../models/webhook");
const {calculateAndTrigger} = require("../services/calculation-service");

async function handleColumnChange(req, res) {
    const {userId, boardId, columnId, pulseId} = req.body.event

    const webhooks = await Webhook
        .findOne({boardId, columnId})
        .populate('subscriptions')
        .exec()

    if (!webhooks) {
        return res.status(200).send()
    }

    for (const subscription of webhooks.subscriptions) {
        await calculateAndTrigger(subscription, pulseId, userId)
    }

    res.status(200).send()
}

module.exports = {
    handleColumnChange
}
