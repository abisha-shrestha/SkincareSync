const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        termsAccepted: Joi.boolean().valid(true).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const field = error.details[0].context.key;

        const messages = {
            name: "Please enter your full name",
            email: "Please enter a valid email address",
            password: "Password must be at least 4 characters",
            termsAccepted: "Please accept the terms and conditions to continue"
        };

        return res.status(400).json({
            message: messages[field] || "Please check your input",
            success: false
        });
    }

    next();
};
const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            success: false
        });
    }

    next();
};

module.exports = {
    signupValidation,
    loginValidation
};