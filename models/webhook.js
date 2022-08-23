// create webhook model
const mondayService = require("../services/monday-service");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const webhookSchema = new Schema({
    boardId: { type: Number, required: true },
    columnId: { type: String, required: true },
    webhookId: { type: Number, required: true },
    subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscription' }]
}, {timestamps: true});

webhookSchema.statics.subscribe = async function(subscription, token) {
    for (const key in subscription.inputFields) {
        let columnId = subscription.inputFields[key]

        if (typeof columnId === 'object') {
            continue
        }

        const hook = await Webhook.findOne({boardId: subscription.boardId, columnId}).exec()
        if (hook) {
            if (!hook.subscriptions.includes(subscription._id)) {
                hook.subscriptions.push(subscription._id)
                await hook.save()
            }
            continue
        }

        const result = await mondayService.setWebHookForColumn(subscription.boardId, columnId, token)

        const webhook = new Webhook({
            boardId: subscription.boardId,
            columnId,
            subscriptions: [subscription._id],
            webhookId: result.id
        })

        await webhook.save()
    }
}

webhookSchema.statics.unsubscribe = async function(subscription, token) {
    for (const key in subscription.inputFields) {
        const columnId = subscription.inputFields[key]

        if (typeof columnId !== 'string') {
            continue
        }

        const hook = await Webhook.findOne({boardId: subscription.boardId, columnId}).exec()
        if (!hook) {
            continue;
        }

        if (hook.subscriptions.includes(subscription._id)) {
            hook.subscriptions.splice(hook.subscriptions.indexOf(subscription._id), 1)
            await hook.save()
        }

        if (hook.subscriptions.length === 0) {
            await mondayService.deleteWebHook(hook.webhookId, token)
            await hook.remove()
        }
    }
}

const Webhook = mongoose.model('Webhook', webhookSchema)
module.exports = Webhook
