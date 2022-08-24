const Token = require("../models/token");
const mondayService = require("./monday-service");
const calculate = require("../calculators/calculator");

async function calculateAndTrigger(subscription, itemId, userId) {
    const token = await Token.findOne({ userId }).exec()
    if (!token) {
        return
    }

    const item = await mondayService.getItem(itemId, token.token)
    if (!item) {
        return
    }

    const fields = {};
    for (const key in subscription.inputFields) {
        if (typeof subscription.inputFields[key] === 'object') {
            fields[key] = subscription.inputFields[key].value
            continue
        }

        const column = item.column_values.find(v => v.id === subscription.inputFields[key])
        if (column.type === 'color') {
            fields[key] = column.text
        } else {
            fields[key] = JSON.parse(column.value)
        }

        if (column.type === 'numeric') {
            fields[key] = fields[key] * 1
        }
    }

    let emission = null
    const isEmpty = Object.values(fields).some(v => v === null)
    if (!isEmpty) {
        emission = await calculate(subscription.calculatorType, fields)
    }

/*    console.log(fields)
    console.log(emission)*/

    await mondayService.triggerAction(subscription.webhookUrl, {
        ...emission,
        itemId
    })
}

module.exports = {
    calculateAndTrigger
}
