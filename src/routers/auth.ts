import { create, verifyEmail, sendReverificationToken, generateForgetPasswordLink, isValidPassResetToken } from "#/controllers/user";
import { validate } from "#/middleware/validator";
import { CreateuserSchema, TokenAndIdValidation } from "#/utils/validationSchema";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/create', validate(CreateuserSchema), create);
authRouter.post('/verify-email', validate(TokenAndIdValidation), verifyEmail);
authRouter.post('/re-verify-email', sendReverificationToken);
authRouter.post('/forget-password', generateForgetPasswordLink);
authRouter.post('/verify-pass-reset-token', validate(TokenAndIdValidation), isValidPassResetToken);

export default authRouter;