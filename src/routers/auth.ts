import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { error } from "console";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/create', (req: CreateUser, res, next) => {

    const { email, password, name } = req.body;

    if (!name.trim()) return res.json({ error: "Name is missing or blank." });
    if (name.length < 3) return res.json({ error: "This name is invalid." });
    if (!name.trim()) return res.json({ error: "This name is invalid." });

    next()

}, async (req: CreateUser, res) => {
    const { email, password, name } = req.body;
    const newUser = new User({ email, password, name })
    newUser.save()
    res.json(newUser);
});

export default authRouter;