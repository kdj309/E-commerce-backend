const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const { dbconnect } = require("./db");
const cors = require("cors");
const { rateLimiterUsingThirdParty } = require("./middleware/ApiRateLimiter");
const app = express();
dbconnect();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(rateLimiterUsingThirdParty);
//!1 Authentication related routes
app.use("/api", require("./routes/auth"));
//!2 User related routes
app.use("/api", require("./routes/user"));
//!3 category related routes
app.use("/api", require("./routes/category"));
app.use("/api", require("./routes/size"));

//!4 product related routes
app.use("/api", require("./routes/product"));
//!5 order related routes
app.use("/api", require("./routes/order"));
//!6 payment using braintree
app.use("/api", require("./routes/paymentB"));
//!7 payment using stripe
app.use("/api", require("./routes/paywithStripe"));
//!8 size related routes
app.listen(3001, () => {
  console.log("server running");
});
