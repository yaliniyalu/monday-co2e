const mondayService = require("./../services/monday-service");

async function setEmission(req, res) {
    const {itemId, emission, emissionColumnId, boardId} = req.body.payload.inputFields

    await mondayService.updateColumn(boardId, itemId, emissionColumnId, emission, req.session.shortLivedToken)

    return res.status(200).send()
}

async function setTrees(req, res) {
    const {itemId, trees, treesColumnId, boardId} = req.body.payload.inputFields

    await mondayService.updateColumn(boardId, itemId, treesColumnId, trees, req.session.shortLivedToken)

    return res.status(200).send()
}

async function setDonation(req, res) {
    const {itemId, amount, amountColumnId, boardId} = req.body.payload.inputFields

    await mondayService.updateColumn(boardId, itemId, amountColumnId, amount, req.session.shortLivedToken)

    return res.status(200).send()
}

async function setSum(req, res) {
    const {itemId, sum, sumColumnId, boardId} = req.body.payload.inputFields

    await mondayService.updateColumn(boardId, itemId, sumColumnId, sum, req.session.shortLivedToken)

    return res.status(200).send()
}

module.exports = {
    setEmission,
    setTrees,
    setDonation,
    setSum
}
