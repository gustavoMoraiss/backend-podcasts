import { create, verifyEmail } from "#/controllers/user";
import { validate } from "#/middleware/validator";
import { CreateuserSchema } from "#/utils/validationSchema";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/create', validate(CreateuserSchema), create);
authRouter.post('/verify-email', verifyEmail);

export default authRouter;