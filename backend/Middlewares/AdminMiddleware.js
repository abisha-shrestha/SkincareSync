const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');

const adminOnly = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided', success: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded._id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access only', success: false });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token', success: false });
    }
};

module.exports = adminOnly;     