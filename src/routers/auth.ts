import { create, verifyEmail } from "#/controllers/user";
import { validate } from "#/middleware/validator";
import { CreateuserSchema, EmailVerificationBody } from "#/utils/validationSchema";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/create', validate(CreateuserSchema), create);
authRouter.post('/verify-email', validate(EmailVerificationBody),verifyEmail);

export default authRouter;