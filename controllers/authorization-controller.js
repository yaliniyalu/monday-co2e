const jwt = require("jsonwebtoken");
const qs = require('qs');
const { AuthorizationCode } = require('simple-oauth2');
const mondaySdk = require("monday-sdk-js");
const Token = require("../models/token");

/** @type MondayServerSdk */
const monday = mondaySdk();

async function OAuthRedirect(req, res) {
    if (!req.query.token) {
        return res.status(500).json({ error: 'not authenticated' });
    }

    const { token } = req.query;
    const { userId, accountId, backToUrl } = await jwt.verify(token, process.env.MONDAY_SIGNING_SECRET);

    const accessToken = await Token.findOne({userId});

    if (accessToken) {
        return res.redirect(backToUrl)
    } else {
        return res.redirect('https://auth.monday.com/oauth2/authorize?' +
            qs.stringify({
                client_id: process.env.MONDAY_CLIENT_ID,
                state: token
            })
        );
    }
}

async function OAuthCallback(req, res) {
    if (!req.query.code || !req.query.state) {
        return res.status(500).json({ error: 'not authenticated' });
    }

    const { code, state } = req.query;
    const { userId, accountId, backToUrl } = jwt.verify(state, process.env.MONDAY_SIGNING_SECRET);

    const token = await monday.oauthToken(code, process.env.MONDAY_CLIENT_ID, process.env.MONDAY_CLIENT_SECRET)

    await new Token({token: token.access_token, userId, accountId}).save()

    return res.redirect(backToUrl);
}

module.exports = {
    OAuthRedirect,
    OAuthCallback
}
