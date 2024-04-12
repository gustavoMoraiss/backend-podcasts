import { createUser } from "#/controllers/user";
import { validate } from "#/middleware/validator";
import { CreateuserSchema } from "#/utils/validationSchema";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/create', validate(CreateuserSchema), createUser);

export default authRouter;