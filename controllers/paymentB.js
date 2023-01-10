const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "rp6zqphbvsxqyz89",
    publicKey: "n7s7xyqpxfwznds9",
    privateKey: "edebd333b31e58951604f7a7e878bd81"
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, (err, response) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(response)
        }

    });
}
exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromtheClient = req.body.amount
    gateway.transaction.sale({
        amount: amountFromtheClient,
        paymentMethodNonce: nonceFromTheClient,
    }, (err, result) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.send(result)
        }
    });
}