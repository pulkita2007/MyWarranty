const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const Warranty = require('../../models/Warranty');
const Bill = require('../../models/Bill');
const crypto = require('crypto');
const transporter = require('../../config/email');

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
// router.post('/register', async (req, res) => {
//     const { firstName, lastName, email, password, phoneNumber } = req.body;

//     try {
//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ msg: 'User already exists' });
//         }

//         user = new User({
//             firstName,
//             lastName,
//             email,
//             password,
//             phoneNumber,
//         });

//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(password, salt);

//         await user.save();

//         const payload = {
//             user: {
//                 id: user.id,
//                 role: user.role,
//             },
//         };

//         const token = jwt.sign(
//     {
//         id: user._id,
//         role: user.role,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         isPremium: user.isPremium,
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: '1h' }
// );

// res.json({
//     success: true,
//     token,
//     user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//         role: user.role,
//         isPremium: user.isPremium,
//         isActive: user.isActive,
//     }
// });

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // @route   POST api/users/login
// // @desc    Authenticate user & get token
// // @access  Public
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         let user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ msg: 'Invalid Credentials' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ msg: 'Invalid Credentials' });
//         }

//         const payload = {
//             user: {
//                 id: user.id,
//                 role: user.role,
//             },
//         };

//         // Generate Access Token
//         const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//         // Generate Refresh Token
//         const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
//         user.refreshToken = refreshToken;
//         await user.save();

//         // res.json({ accessToken, refreshToken });

//         res.json({
//     success: true,
//     accessToken,
//     refreshToken,
//     user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//         role: user.role,
//         isPremium: user.isPremium,
//         isActive: user.isActive,
//     }
// });


//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        // Generate Access Token
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Generate Refresh Token
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                isPremium: user.isPremium,
                isActive: user.isActive,
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        // Generate Access Token
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Generate Refresh Token
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Save refreshToken in DB
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                isPremium: user.isPremium,
                isActive: user.isActive,
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/users/forgot-password
// @desc    Request password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h1>You have requested a password reset</h1>
                <p>Please go to this link to reset your password:</p>
                <a href="${resetUrl}">${resetUrl}</a>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ msg: 'Email sent' });
    } catch (err) {
        console.error(err.message);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/users/reset-password/:token
// @desc    Reset password
// @access  Public
router.put('/reset-password/:token', async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid token or token has expired' });
        }

        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ msg: 'Password reset successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/users/refresh-token
// @desc    Refresh access token using refresh token
// @access  Public
router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ msg: 'No refresh token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.user.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ msg: 'Invalid refresh token' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/users
// @desc    Get user profile
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/users
// @desc    Update user profile
// @access  Private
router.put('/', auth, async (req, res) => {
    const { firstName, lastName, email, phoneNumber } = req.body;

    // Build user object
    const userFields = {};
    if (firstName) userFields.firstName = firstName;
    if (lastName) userFields.lastName = lastName;
    if (email) userFields.email = email;
    if (phoneNumber) userFields.phoneNumber = phoneNumber;

    try {
        let user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: userFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/users/export
// @desc    Export user data (warranties and bills)
// @access  Private
router.get('/export', auth, async (req, res) => {
    try {
        const warranties = await Warranty.find({ user: req.user.id });
        const bills = await Bill.find({ user: req.user.id });

        const userData = {
            user: req.user.id,
            warranties,
            bills,
        };

        res.json(userData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
