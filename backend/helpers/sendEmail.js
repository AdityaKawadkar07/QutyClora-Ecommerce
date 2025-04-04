import nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';
import { fileURLToPath } from 'url';
import path from 'path';

const sendEmail = async (email, content, type = "reset") => {
    // Dynamically import 'nodemailer-express-handlebars'
    const hbs = (await import('nodemailer-express-handlebars')).default;

    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Configure Handlebars template
    const handlebarOptions = {
        viewEngine: {
            extName: '.hbs',
            partialsDir: path.resolve('./views'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views'),
        extName: '.hbs',
    };

    transporter.use('compile', hbs(handlebarOptions));

    // Define email details based on type
    let mailOptions;
    if (type === "reset") {
        mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            template: 'resetPassword', // Existing reset password email template
            context: {
                resetLink: content, // Reset link
            },
        };
    } else if (type === "otp") {
        mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            template: 'otpEmail', // New OTP email template
            context: {
                otp: content, // OTP code
            },
        };
    } else {
        return { success: false, message: "Invalid email type" };
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false };
    }
};

export default sendEmail;
