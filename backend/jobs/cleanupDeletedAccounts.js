const cron = require('node-cron');
const UserModel = require('../Models/User');
const Profile = require('../Models/Profile');
const Address = require('../Models/Address');
const Cart = require('../Models/Cart');
const Wishlist = require('../Models/Wishlist');
const Order = require('../Models/Order');

const cleanupDeletedAccounts = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const expiredUsers = await UserModel.find({
                isDeleted: true,
                deletedAt: { $lte: thirtyDaysAgo }
            });

            for (const user of expiredUsers) {
                const email = user.email;
                await Profile.deleteOne({ userEmail: email });
                await Address.deleteMany({ userEmail: email });
                await Cart.deleteOne({ userId: email });
                await Wishlist.deleteOne({ userId: email });
                await UserModel.deleteOne({ _id: user._id });
                console.log(`Permanently deleted account: ${email}`);
            }
        } catch (err) {
            console.error('Cleanup job error:', err);
        }
    });
};

module.exports = cleanupDeletedAccounts;