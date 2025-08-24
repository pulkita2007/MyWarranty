
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Bill = require('../../models/Bill');

// @route   POST api/bills
// @desc    Add a new bill
// @access  Private
router.post('/', auth, async (req, res) => {
    const { billNumber, storeName, billDate, amount, category, paymentMethod, description, notes } = req.body;

    try {
        const newBill = new Bill({
            user: req.user.id,
            billNumber,
            storeName,
            billDate,
            amount,
            category,
            paymentMethod,
            description,
            notes,
        });

        const bill = await newBill.save();
        res.json(bill);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/bills
// @desc    Get all user bills
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const bills = await Bill.find({ user: req.user.id }).sort({ billDate: -1 });
        res.json(bills);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/bills/:id
// @desc    Get bill by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);

        if (!bill) {
            return res.status(404).json({ msg: 'Bill not found' });
        }

        // Make sure user owns the bill
        if (bill.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        res.json(bill);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/bills/:id
// @desc    Update a bill
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { billNumber, storeName, billDate, amount, category, paymentMethod, description, notes } = req.body;

    // Build bill object
    const billFields = {};
    if (billNumber) billFields.billNumber = billNumber;
    if (storeName) billFields.storeName = storeName;
    if (billDate) billFields.billDate = billDate;
    if (amount) billFields.amount = amount;
    if (category) billFields.category = category;
    if (paymentMethod) billFields.paymentMethod = paymentMethod;
    if (description) billFields.description = description;
    if (notes) billFields.notes = notes;

    try {
        let bill = await Bill.findById(req.params.id);

        if (!bill) return res.status(404).json({ msg: 'Bill not found' });

        // Make sure user owns the bill
        if (bill.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        bill = await Bill.findByIdAndUpdate(
            req.params.id,
            { $set: billFields },
            { new: true }
        );
        res.json(bill);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/bills/:id
// @desc    Delete a bill
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);

        if (!bill) {
            return res.status(404).json({ msg: 'Bill not found' });
        }

        // Make sure user owns the bill
        if (bill.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Bill.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Bill removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
