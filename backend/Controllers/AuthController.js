const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");
const nodemailer = require('nodemailer');
const OtpModel = require('../Models/OTP');

const signup = async (req, res) => {
    try {
        const { name, email, password, termsAccepted } = req.body;

        if (!termsAccepted) {
            return res.status(400).json({
                message: "You must accept terms and conditions",
                success: false
            });
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User already exists, you can login", success: false });
        }

        const userModel = new UserModel({ 
            name, 
            email, 
            password,
            termsAccepted: true,
            termsAcceptedAt: new Date()
        });

        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();

        res.status(201).json({ message: "Signup successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: "Auth failed, email doesn't exist", success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: "Auth failed, email doesn't exist", success: false });
        }

        // Soft-deleted - return special flag instead of blocking
        if (user.isDeleted) {
            return res.status(200).json({ success: false, isDeleted: true, message: "Account is scheduled for deletion" });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({
            message: "Login success",
            success: true,
            jwtToken,
            email,
            name: user.name,
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "No account found with this email" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await OtpModel.deleteMany({ email });
        await OtpModel.create({ email, otp, expiresAt });

        await transporter.sendMail({
            from: `"SkincareSync" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Your OTP for password reset',
            text: `Your OTP is ${otp}. It expires in 10 minutes.`
        });

        res.json({ success: true, message: "OTP sent to your email" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const record = await OtpModel.findOne({ email });
        if (!record) return res.status(400).json({ success: false, message: "OTP not found. Please request again" });
        if (record.otp !== otp) return res.status(400).json({ success: false, message: "Incorrect OTP" });
        if (record.expiresAt < new Date()) return res.status(400).json({ success: false, message: "OTP has expired" });

        res.json({ success: true, message: "OTP verified" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Verification failed" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const record = await OtpModel.findOne({ email });
        if (!record || record.otp !== otp || record.expiresAt < new Date()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await UserModel.findOneAndUpdate({ email }, { password: hashed });
        await OtpModel.deleteMany({ email });

        res.json({ success: true, message: "Password reset successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Reset failed" });
    }
};

const restoreAccount = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) return res.status(403).json({ success: false, message: "Incorrect password" });

        user.isDeleted = false;
        user.deletedAt = null;
        await user.save();

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: "Account restored",
            jwtToken,
            email: user.email,
            name: user.name,
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

module.exports = { signup, login, sendOtp, verifyOtp, resetPassword, restoreAccount };
