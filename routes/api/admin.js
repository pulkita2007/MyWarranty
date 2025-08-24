
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const adminAuth = require('../../middleware/adminAuth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Warranty = require('../../models/Warranty');
const Bill = require('../../models/Bill');

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/users/:id/activate
// @desc    Activate/Deactivate user account
// @access  Private (Admin only)
router.put('/users/:id/activate', adminAuth, async (req, res) => {
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.isActive = req.body.isActive; // Assuming isActive is passed in body
        await user.save();

        res.json({ msg: `User ${user.email} account status updated to ${user.isActive}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/users/:id/role
// @desc    Assign role to user
// @access  Private (Admin only)
router.put('/users/:id/role', adminAuth, async (req, res) => {
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (req.body.role && ['user', 'admin'].includes(req.body.role)) {
            user.role = req.body.role;
            await user.save();
            res.json({ msg: `User ${user.email} role updated to ${user.role}` });
        } else {
            return res.status(400).json({ msg: 'Invalid role provided' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/users/:id/premium
// @desc    Manage user premium status
// @access  Private (Admin only)
router.put('/users/:id/premium', adminAuth, async (req, res) => {
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.isPremium = req.body.isPremium; // Assuming isPremium (boolean) is passed in body
        await user.save();

        res.json({ msg: `User ${user.email} premium status updated to ${user.isPremium}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/payments/subscriptions
// @desc    Monitor subscriptions
// @access  Private (Admin only)
router.get('/payments/subscriptions', adminAuth, async (req, res) => {
    try {
        const subscriptions = await stripe.subscriptions.list();
        res.json(subscriptions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/payments/transactions
// @desc    View transactions (charges)
// @access  Private (Admin only)
router.get('/payments/transactions', adminAuth, async (req, res) => {
    try {
        const charges = await stripe.charges.list();
        res.json(charges);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/dashboard-stats
// @desc    Get dashboard statistics (total users, premium users, warranties, bills, revenue)
// @access  Private (Admin only)
router.get('/dashboard-stats', adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const premiumUsers = await User.countDocuments({ isPremium: true });
        const totalWarranties = await Warranty.countDocuments();
        const totalBills = await Bill.countDocuments();

        // Calculate subscription revenue (example: fetch from Stripe or aggregate from local DB if applicable)
        // For simplicity, this example just returns 0.
        const totalSubscriptionRevenue = 0;

        res.json({
            totalUsers,
            premiumUsers,
            totalWarranties,
            totalBills,
            totalSubscriptionRevenue,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
