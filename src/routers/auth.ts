import { create, verifyEmail, sendReverificationToken } from "#/controllers/user";
import { validate } from "#/middleware/validator";
import { CreateuserSchema, EmailVerificationBody } from "#/utils/validationSchema";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/create', validate(CreateuserSchema), create);
authRouter.post('/verify-email', validate(EmailVerificationBody), verifyEmail);
authRouter.post('/re-verify-email', sendReverificationToken);

export default authRouter;