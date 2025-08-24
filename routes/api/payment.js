
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../../models/User');

// @route   POST api/payment/create-checkout-session
// @desc    Create a Stripe checkout session for premium plan
// @access  Private
router.post('/create-checkout-session', auth, async (req, res) => {
    const { priceId } = req.body; // Example: priceId from Stripe Pricing Table

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            customer: user.stripeCustomerId || undefined, // Use existing customer ID if available
            client_reference_id: user.id,
            success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
        });

        // If user doesn't have a Stripe customer ID, save it
        //removed this block
        if (!user.stripeCustomerId) {
            user.stripeCustomerId = session.customer;
            await user.save();
        }

        res.json({ id: session.id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /webhook
// @desc    Stripe webhook endpoint for handling payment events
// @access  Public (Stripe calls this)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
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
                }
            } catch (err) {
                console.error(`Error updating user to premium: ${err.message}`);
            }
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

module.exports = router;
