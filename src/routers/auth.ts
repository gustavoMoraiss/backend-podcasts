import { create, verifyEmail, sendReverificationToken, generateForgetPasswordLink, grantValid } from "#/controllers/user";
import { isValidPassResetToken } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { CreateuserSchema, TokenAndIdValidation } from "#/utils/validationSchema";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/create', validate(CreateuserSchema), create);
authRouter.post('/verify-email', validate(TokenAndIdValidation), verifyEmail);
authRouter.post('/re-verify-email', sendReverificationToken);
authRouter.post('/forget-password', generateForgetPasswordLink);
authRouter.post('/verify-pass-reset-token', validate(TokenAndIdValidation), isValidPassResetToken, grantValid);

export default authRouter;