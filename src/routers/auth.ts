import { CreateUser } from "#/@types/user";
import { validate } from "#/middleware/validator";
import User from "#/models/user";
import { CreateuserSchema } from "#/utils/validationSchema";
import { error } from "console";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/create',
    validate(CreateuserSchema)
    , async (req: CreateUser, res) => {

        const { email, password, name } = req.body;
        CreateuserSchema.validate({ email, password, name }).catch(error => {

        })
        const newUser = new User({ email, password, name })
        newUser.save()
        res.json(newUser);
    });

export default authRouter;