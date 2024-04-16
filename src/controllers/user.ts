import { CreateUserRequest, VerifyEmailRequest } from "#/@types/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationMail } from "#/utils/mail";
import { error } from "console";
import { RequestHandler } from "express";

export const create: RequestHandler = async (req: CreateUserRequest, res) => {
    const { email, password, name } = req.body;

    const user = User.create({ name, email, password });

    const token = generateToken()

    sendVerificationMail(token, { name, email, userId: (await user)._id.toString() })

    res.status(201).json({ user: { id: (await user)._id, name, email } });
}

export const verifyEmail: RequestHandler = async (req: VerifyEmailRequest, res) => {
    const { token, userId } = req.body;

    const verificationToken = await EmailVerificationToken.findOne({
        owner: userId
    })

    if (!verificationToken) return res.status(403).json({ error: "Invalid token." })

    const matched = await verificationToken?.compareToken(token)

    if (!matched) return res.status(403).json({ error: "Invalid token." })

    await User.findByIdAndUpdate(userId, {
        verified: true
    })

    await EmailVerificationToken.findByIdAndDelete(verificationToken._id)

    res.json({ message: "Your email is verified." })
}