const Subscription = require('../models/subscription');
const Webhook = require("../models/webhook");
const MondayService = require("../services/monday-service");
const {ElectricityGrid, CabinClass, Fuels, Waterways, Vehicles} = require('../calculators/data/index.js');

const UpdateRequired = [
    ['gridTypeColumnId', ElectricityGrid],
    ['iwtColumnId', Waterways],
    ['vehicleTypeColumnId', Vehicles],
    ['fuelColumnId', Fuels],
    ['cabinClassColumnId', CabinClass]
]

async function subscribeTrigger(req, res) {
    if (!req.body.payload.inputFields) {
        return res.status(400).send()
    }

    const payload = req.body.payload
    payload.calculatorType = req.params.id
    payload.boardId = payload.inputFields.boardId
    delete payload.inputFields.boardId

    const unique = []
    payload.inputFields = Object.entries(payload.inputFields).filter(([, value]) => {
        if (!unique.includes(value)) {
            unique.push(value)
            return true
        }
        return false
    }).reduce((acc, [key, value]) => { acc[key] = value; return acc }, {})

    payload.userId = req.session.userId

    const subscription = new Subscription(payload)
    await subscription.save()

    const update = []
    for (const key in payload.inputFields) {
        const found = UpdateRequired.find(e => e[0] === key)
        if (found) {
            update.push(found)
        }
    }

    let mutation = [];
    if (update.length > 0) {
        const columns = await MondayService.getColumns(subscription.boardId, req.session.shortLivedToken)
        for (const arr of update) {
            const column = columns.find(e => e.id === payload.inputFields[arr[0]])
            if (!column || column.type !== 'color') {
                continue
            }

            const values = Object.values(JSON.parse(column.settings_str).labels ?? {})
            for (const {name} of arr[1]) {
                if (!values.includes(name)) {
                    mutation.push({
                        columnId: column.id,
                        value: name
                    })
                }
            }
        }
    }

    if (mutation.length > 0) {
        const {id} = await MondayService.createItem(subscription.boardId, req.session.shortLivedToken)
        mutation = mutation.map((e, i) => {
            return `
                a${i}: change_column_value(
                    board_id: ${subscription.boardId}, 
                    item_id: ${id}, 
                    column_id: "${e.columnId}", 
                    create_labels_if_missing: true, 
                    value:"{\\"label\\":\\"${e.value}\\"}"
                ) { id }
            `
        })
        mutation.push(`delete_item (item_id: ${id}) { id }`)
        await MondayService.runQuery(`mutation { ${mutation.join('\n')} }`, req.session.shortLivedToken)
    }

    await Webhook.subscribe(subscription, req.session.shortLivedToken)

    res.json({webhookId: subscription._id})
}

async function unsubscribeTrigger(req, res) {
    const subscriptionId = req.body.payload.webhookId

    const subscription = await Subscription.findById(subscriptionId).exec()
    if (subscription) {
        await Webhook.unsubscribe(subscription, req.session.shortLivedToken)
        await subscription.remove()
    }

    res.json({})
}

module.exports = {
    subscribeTrigger,
    unsubscribeTrigger
}
