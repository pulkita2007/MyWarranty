
// require("dotenv").config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require("cors");
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const User = require('./models/User');
// const transporter = require('./config/email');
// const twilio = require('twilio');
// const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// // const dotenv = require('dotenv'); // Removed duplicate

// // dotenv.config(); // Removed duplicate

// const app = express();

// const testRoutes = require("./routes/testRoutes"); // adjust path
// app.use("/api", testRoutes);
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// app.use(cors());
// //add after some time
// // Middleware
// app.use(express.json());
// // const warranties = require('./routes/api/warranties'); // Moved below to routes section

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error(err));

// // Basic Route
// app.get('/', (req, res) => {
//     res.send('API is running...');
// });

// // Define Routes
// app.use('/api/users', require('./routes/api/users'));
// app.use('/api/warranties', require('./routes/api/warranties'));
// app.use('/api/bills', require('./routes/api/bills'));
// app.use('/api/upload', require('./routes/api/upload'));
// app.use('/api/payment', require('./routes/api/payment'));
// app.use('/uploads', express.static('uploads'));
// app.use('/api/admin', require('./routes/api/admin'));

// // Stripe Webhook (should be placed before express.json() if express.json() is used globally)
// app.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//     } catch (err) {
//         console.error(`Webhook Error: ${err.message}`);
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // Handle the event
//     switch (event.type) {
//         case 'checkout.session.completed':
//             const session = event.data.object;
//             const userId = session.client_reference_id;
//             const customerId = session.customer;

//             try {
//                 const user = await User.findById(userId);
//                 if (user) {
//                     user.isPremium = true;
//                     user.stripeCustomerId = customerId;
//                     await user.save();
//                     console.log(`User ${user.id} is now premium.`);

//                     // Send subscription email notification
//                     const mailOptions = {
//                         from: process.env.EMAIL_USER,
//                         to: user.email,
//                         subject: 'Premium Subscription Activated!',
//                         html: `
//                             <h1>Congratulations!</h1>
//                             <p>Your premium subscription has been successfully activated.</p>
//                             <p>Enjoy all the premium features of myWarranty!</p>
//                         `,
//                     };
//                     await transporter.sendMail(mailOptions);

//                     // Send subscription SMS notification (if phoneNumber exists)
//                     if (user.phoneNumber) {
//                         const message = 'Your myWarranty premium subscription has been activated! Enjoy exclusive features.';
//                         await client.messages.create({
//                             body: message,
//                             to: user.phoneNumber,
//                             from: process.env.TWILIO_PHONE_NUMBER,
//                         });
//                     }
//                 }
//             } catch (err) {
//                 console.error(`Error updating user to premium: ${err.message}`);
//             }
//             break;
//         // ... handle other event types
//         default:
//             console.log(`Unhandled event type ${event.type}`);
//     }

//     res.json({ received: true });
// });

// // Start cron jobs
// require('./utils/cronJobs');

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//     console.error(err.message);
//     res.status(500).send('Server Error');
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("./models/User");
const transporter = require("./config/email");
const twilio = require("twilio");
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const app = express();

// ✅ Middleware (put before routes)
app.use(cors());
app.use(express.json());

// ✅ Routes
// const testRoutes = require("./routes/testRoutes");
// app.use("/api", testRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", require("./routes/api/users"));
app.use("/api/warranties", require("./routes/api/warranties"));
app.use("/api/bills", require("./routes/api/bills"));
app.use("/api/upload", require("./routes/api/upload"));
app.use("/api/payment", require("./routes/api/payment"));
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", require("./routes/api/admin"));

// ✅ Stripe webhook (⚠️ must come BEFORE express.json for raw body)
app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle events
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const userId = session.client_reference_id;
        const customerId = session.customer;

        try {
          const user = await User.findById(userId);
          if (user) {
            user.isPremium = true;
            user.stripeCustomerId = customerId;
            await user.save();
            console.log(`User ${user.id} is now premium.`);

            // Send subscription email
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: user.email,
              subject: "Premium Subscription Activated!",
              html: `
                <h1>Congratulations!</h1>
                <p>Your premium subscription has been successfully activated.</p>
                <p>Enjoy all the premium features of myWarranty!</p>
              `,
            });

            // Send SMS (if phone exists)
            if (user.phoneNumber) {
              await client.messages.create({
                body:
                  "Your myWarranty premium subscription has been activated! Enjoy exclusive features.",
                to: user.phoneNumber,
                from: process.env.TWILIO_PHONE_NUMBER,
              });
            }
          }
        } catch (err) {
          console.error(`Error updating user to premium: ${err.message}`);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// ✅ Start cron jobs
require("./utils/cronJobs");

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send("Server Error");
});

// ✅ Start server (only once)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
