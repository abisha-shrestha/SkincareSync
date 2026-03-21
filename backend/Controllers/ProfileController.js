const Profile = require('../Models/Profile');
const UserModel = require('../Models/User');
const bcrypt = require('bcrypt');

const getProfile = async (req, res) => {
    try {
        const { userEmail } = req.query;
        let profile = await Profile.findOne({ userEmail });
        if (!profile) {
            profile = await Profile.create({ userEmail });
        }
        res.json({ success: true, profile });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { userEmail, fullName, phone, city, birthdate, gender } = req.body;

        if (fullName !== undefined && fullName.trim().length < 3) {
            return res.status(400).json({ success: false, message: 'Full name must be at least 3 characters' });
        }
        if (phone && phone.trim() !== '') {
            const phoneRegex = /^(97|98)\d{8}$/;
            if (!phoneRegex.test(phone.trim())) {
                return res.status(400).json({ success: false, message: 'Phone must start with 97 or 98 and be exactly 10 digits' });
            }
        }

        const profile = await Profile.findOneAndUpdate(
            { userEmail },
            { fullName, phone, city, birthdate, gender },
            { new: true, upsert: true }
        );
        res.json({ success: true, profile });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const saveSkinType = async (req, res) => {
    try {
        const { userEmail, skinType } = req.body;
        const user = await UserModel.findOneAndUpdate(
            { email: userEmail },
            { skinType },
            { new: true }
        );
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, skinType: user.skinType });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getSkinType = async (req, res) => {
    try {
        const { userEmail } = req.query;
        const user = await UserModel.findOne({ email: userEmail }).select('skinType');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, skinType: user.skinType || '' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { userEmail, currentPassword, newPassword } = req.body;

        if (!newPassword || newPassword.length < 4) {
            return res.status(400).json({ success: false, message: 'New password must be at least 4 characters' });
        }

        const user = await UserModel.findOne({ email: userEmail });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(403).json({ success: false, message: 'Current password is incorrect' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { userEmail, password } = req.body;

        const user = await UserModel.findOne({ email: userEmail });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(403).json({ success: false, message: 'Incorrect password' });

        user.isDeleted = true;
        user.deletedAt = new Date();
        await user.save();

        res.json({ success: true, message: 'Account scheduled for deletion' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getProfile, updateProfile, saveSkinType, getSkinType, changePassword, deleteAccount };