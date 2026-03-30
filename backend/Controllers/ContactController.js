const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

const sendMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (message.trim().length < 10) {
            return res.status(400).json({ success: false, message: 'Message must be at least 10 characters' });
        }

        await transporter.sendMail({
            from: `"SkincareSync Contact" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            replyTo: email,
            subject: `New message from ${name} — SkincareSync`,
            html: `
                <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px; background: #faf8f5; border-radius: 16px; border: 1px solid #e6e0d9;">
                    <h2 style="color: #6b5d52; margin-bottom: 8px;">New Contact Message</h2>
                    <p style="color: #9a8880; font-size: 14px; margin-bottom: 28px;">Sent via SkincareSync contact form</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e6e0d9; color: #9a8880; font-size: 13px; width: 100px;">Name</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e6e0d9; color: #2d2520; font-size: 14px;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e6e0d9; color: #9a8880; font-size: 13px;">Email</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e6e0d9; color: #2d2520; font-size: 14px;"><a href="mailto:${email}" style="color: #8B5E3C;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; color: #9a8880; font-size: 13px; vertical-align: top;">Message</td>
                            <td style="padding: 12px 0; color: #2d2520; font-size: 14px; line-height: 1.7;">${message.replace(/\n/g, '<br/>')}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 28px; font-size: 12px; color: #9a8880;">
                        Reply directly to this email to respond to ${name}.
                    </p>
                </div>
            `
        });

        res.json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
        console.error('Email error:', err);
        res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
    }
};

module.exports = { sendMessage };