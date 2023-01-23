const Stripe = require("stripe");
require("dotenv").config();

const sip = Stripe(process.env.STRIPEKEY);

let MY_DOMAIN = process.env.MYAPPURL;

exports.paymentprocess = async (req, res) => {
  const { products, token } = req.body;
  const session = await sip.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
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
    success_url: `${MY_DOMAIN}?success=true`,
    cancel_url: `${MY_DOMAIN}?canceled=true`,
    client_reference_id: token.id,
    customer_email: token.email,
    billing_address_collection: "required",
    customer_creation: "always",
    phone_number_collection: {
      enabled: true,
    },
  });
  return res.json({ url: session.url, transactionId: session.id });
};
