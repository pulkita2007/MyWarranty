
const cron = require('node-cron');
const Warranty = require('../models/Warranty');
const Bill = require('../models/Bill');
const User = require('../models/User');
const transporter = require('../config/email');
const twilio = require('twilio');

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Function to send email reminder
const sendEmailReminder = async (user, item, type, daysLeft) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `${type} Expiry Reminder: ${item.productName || item.billNumber}`,
        html: `
            <h1>Your ${type} is expiring soon!</h1>
            <p>Your ${type}: ${item.productName || item.billNumber} will expire in ${daysLeft} days.</p>
            <p>Expiry Date: ${item.expiryDate ? item.expiryDate.toDateString() : item.billDate.toDateString()}</p>
            <p>Store: ${item.storeName}</p>
        `,
    };
    await transporter.sendMail(mailOptions);
};

// Function to send SMS reminder
const sendSmsReminder = async (user, item, type, daysLeft) => {
    if (!user.phoneNumber) return;

    const message = `Your ${type}: ${item.productName || item.billNumber} will expire in ${daysLeft} days. Expiry Date: ${item.expiryDate ? item.expiryDate.toDateString() : item.billDate.toDateString()}.`;

    await client.messages.create({
        body: message,
        to: user.phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
    });
};

// Schedule cron job to run daily at a specific time (e.g., 9:00 AM)


cron.schedule('0 9 * * *', async () => {
    console.log('Running daily expiry reminder check');
    const today = new Date();

    
    // Check Warranties
    const warranties = await Warranty.find({});
    for (const warranty of warranties) {
        const expiryDate = new Date(warranty.expiryDate);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 30 || diffDays === 7 || diffDays === 1) { // Remind 30, 7, and 1 day before
            const user = await User.findById(warranty.user);
            if (user) {
                await sendEmailReminder(user, warranty, 'Warranty', diffDays);
                // For premium users, send SMS
                // if (user.isPremium) {
                //     await sendSmsReminder(user, warranty, 'Warranty', diffDays);
                // }
            }
        }
    }

    // Check Bills (assuming bills also have an expiryDate or relevant date for reminders)
    const bills = await Bill.find({});
    for (const bill of bills) {
        const billDate = new Date(bill.billDate); // Using billDate as an example for reminder
        const diffTime = billDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 30 || diffDays === 7 || diffDays === 1) { // Example reminder logic for bills
            const user = await User.findById(bill.user);
            if (user) {
                await sendEmailReminder(user, bill, 'Bill', diffDays);
                // For premium users, send SMS
                // if (user.isPremium) {
                //     await sendSmsReminder(user, bill, 'Bill', diffDays);
                // }
            }
        }
    }
});
