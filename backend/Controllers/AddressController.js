const Address = require('../Models/Address');

const getAddresses = async (req, res) => {
    try {
        const { userEmail } = req.query;
        const addresses = await Address.find({ userEmail }).sort({ isDefault: -1, createdAt: -1 });
        res.json({ success: true, addresses });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const addAddress = async (req, res) => {
    try {
        const { userEmail, label, fullName, phone, address, city, isDefault } = req.body;

        if (isDefault) {
            await Address.updateMany({ userEmail }, { isDefault: false });
        }

        const newAddress = await Address.create({ userEmail, label, fullName, phone, address, city, isDefault: isDefault || false });
        res.status(201).json({ success: true, address: newAddress });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateAddress = async (req, res) => {
    try {
        const { userEmail, label, fullName, phone, address, city, isDefault } = req.body;

        if (isDefault) {
            await Address.updateMany({ userEmail }, { isDefault: false });
        }

        const updated = await Address.findByIdAndUpdate(
            req.params.id,
            { label, fullName, phone, address, city, isDefault },
            { new: true }
        );
        res.json({ success: true, address: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteAddress = async (req, res) => {
    try {
        await Address.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Address deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };