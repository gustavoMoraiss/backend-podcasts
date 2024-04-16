import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationMail } from "#/utils/mail";
import { RequestHandler } from "express";

export const createUser: RequestHandler = async (req: CreateUser, res) => {
    const { email, password, name } = req.body;

    const user = User.create({ name, email, password });

    const token = generateToken()

    sendVerificationMail(token, { name, email, userId: (await user)._id.toString() })

    res.status(201).json({ user: { id: (await user)._id, name, email } });
}