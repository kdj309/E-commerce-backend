const Stripe = require("stripe");
require("dotenv").config();

const sip = Stripe(process.env.STRIPEKEY);

let MY_DOMAIN = process.env.MYAPPURL;

exports.paymentprocess = async (req, res) => {
  const { products, token } = req.body;

  const session = await sip.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: { name: "T-shirt" },
          unit_amount: token.amount * 100,
        },
        price: products[0].id,
        quantity: products.length,
      },
    ],
    mode: "payment",
    success_url: `${MY_DOMAIN}PaymentSuccess`,
    cancel_url: `${MY_DOMAIN}PaymentFailure`,
    client_reference_id: token.id,
    customer_email: token.email,
    billing_address_collection: "required",
    customer_creation: "always",
    phone_number_collection: {
      enabled: true,
    },
  });
  return res.status(200).json({
    url: session.url,
    transactionId: session.id,
    payementintentid: session.payment_intent,
  });
};
exports.getPaymentInfo = async (req, res) => {
  const paymentInfo = await sip.paymentIntents.retrieve(
    req.params.paymentIntent
  );
  let epoch = paymentInfo.created;
  let TimeStamp = new Date(0);
  TimeStamp.setUTCSeconds(epoch);
  response = {
    id: paymentInfo?.id,
    amount: paymentInfo?.amount_received,
    addressInfo: paymentInfo?.charges.data[0]?.billing_details?.address,
    email: paymentInfo?.charges.data[0]?.billing_details?.email,
    name: paymentInfo?.charges.data[0]?.billing_details?.name,
    timestamp: TimeStamp,
  };
  return res.status(200).json({
    paymentData: response,
  });
};
exports.cancelPayment = async (req, res) => {
  const session = await sip.checkout.sessions.expire(req.body.transactionId);
  console.log(session);
};
