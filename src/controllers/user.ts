import { CreateUser } from "#/@types/user";
import { generateTemplate } from "#/mail/template";
import emailVerificationToken from "#/models/emailVerificationToken";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { MAILTRAP_PASSWORD, MAILTRAP_USER } from "#/utils/variables";
import { RequestHandler } from "express";
import nodemailer from 'nodemailer';
import path from 'path'

export const createUser: RequestHandler = async (req: CreateUser, res) => {
    const { email, password, name } = req.body;
    const user = User.create({ name, email, password });


    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: MAILTRAP_USER,
            pass: MAILTRAP_PASSWORD
        }
    });

    const token = generateToken()
    const newToken = await emailVerificationToken.create({
        owner: (await user)._id,
        token
    });

    const welcomeMessage = `Hi ${name}, welcome to Podify! There are so much thing that we do for verified users. Use the given OTP to verify your email.`;

    transport.sendMail({
        to: (await user)?.email,
        from: "auth@podify.com",
        subject: "Welcome message",
        html: generateTemplate({
            title: "Welcome to Podify",
            message: welcomeMessage,
            logo: "cid:logo",
            banner: "cid:welcome",
            link: "#",
            btnTitle: token
        }),
        attachments: [
            {
                filename: "logo.png",
                path: path.join(__dirname, "../mail/logo.png"),
                cid: "logo"
            },
            {
                filename: "welcome.png",
                path: path.join(__dirname, "../mail/welcome.png"),
                cid: "welcome"
            }
        ]
    });

    res.status(201).json(user);
}