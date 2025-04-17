import nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const sendEmail = async (email, content, type = "reset",attachmentPath = null) => {
    // Dynamically import 'nodemailer-express-handlebars'
    const hbs = (await import('nodemailer-express-handlebars')).default;

    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // // Configure Handlebars template
    // const handlebarOptions = {
    //     viewEngine: {
    //         extName: '.hbs',
    //         partialsDir: path.resolve('./views'),
    //         defaultLayout: false,
    //     },
    //     viewPath: path.resolve('./views'),
    //     extName: '.hbs',
    // };

    const handlebarOptions = {
        viewEngine: {
            extName: '.hbs',
            partialsDir: path.join(__dirname, '../views'),
            defaultLayout: false,
        },
        viewPath: path.join(__dirname, '../views'),
        extName: '.hbs',
    };
    
    handlebarOptions.viewEngine.helpers = {
        multiply: (a, b) => a * b
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
    } else if (type === "order-receipt") {
        mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Order Confirmation Receipt',
            template: 'orderReceipt',
            context: content,
            ...(attachmentPath && fs.existsSync(attachmentPath) && {
                attachments: [
                    {
                        filename: `Receipt-${content.orderId}.pdf`,
                        path: attachmentPath,
                    },
                ],
            }),
        };
    }else if (type === "order-status-update") {
        mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Your Order ${content.orderId} is Now ${content.status}`,
            template: 'order-status-update',
            context: content,
        };
    }
     else {
        return { success: false, message: "Invalid email type" };
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        // Clean up file after sending (only if there's an attachment)
        if (attachmentPath && fs.existsSync(attachmentPath)) {
            fs.unlinkSync(attachmentPath);
        }
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false };
    }
};

export default sendEmail;
