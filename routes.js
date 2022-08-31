const express = require('express');
const router = express.Router();
const SubscriptionController = require('./controllers/subscription-controller');
const AuthorizationController = require('./controllers/authorization-controller');
const WebhookController = require('./controllers/webhook-controller');
const ActionController = require('./controllers/action-controller');
const FetchController = require('./controllers/fetch-controller');
const WebPageController = require("./controllers/web-page-controller");

const auth = require("./middlewares/auth-middleware");
const challenge = require("./middlewares/challenge-middleware");

// status route
router.get('/status', (req, res) => {
    res.status(200).send('OK');
})

router.post('/trigger/:id/subscribe', auth, SubscriptionController.subscribeTrigger)
router.post('/trigger/:id/unsubscribe', auth, SubscriptionController.unsubscribeTrigger)

router.post('/action/emission', auth, ActionController.setEmission)
router.post('/action/trees', auth, ActionController.setTrees)
router.post('/action/donate', auth, ActionController.setDonation)
router.post('/action/sum', auth, ActionController.setSum)

router.get("/oauth/authorize", AuthorizationController.OAuthRedirect)
router.get("/oauth/callback", AuthorizationController.OAuthCallback)

router.post("/webhooks/column-change", challenge, WebhookController.handleColumnChange)

// fetch route
router.post('/fetch/grid-type', auth, FetchController.getGridTypes)
router.post('/fetch/iwt', auth, FetchController.getIWT)
router.post('/fetch/cabin-class', auth, FetchController.getCabinClass)
router.post('/fetch/vehicle-type', auth, FetchController.getVehicles)
router.post('/fetch/fuel', auth, FetchController.getFuels)

// pages
router.get('/', WebPageController.index)
router.get('/factors/:factor', WebPageController.factors)
router.get('/contact', WebPageController.render('contact.njk'))
router.get('/privacy', WebPageController.render('privacy.njk'))
router.get('/terms', WebPageController.render('terms.njk'))

module.exports = router;
