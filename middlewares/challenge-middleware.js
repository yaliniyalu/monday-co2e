
function challenge (req, res, next) {
    if (req.body.challenge) {
        return res.status(200).send(req.body)
    }

    next()
}

module.exports = challenge;
