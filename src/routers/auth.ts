import { create, verifyEmail, sendReverificationToken, generateForgetPasswordLink, grantValid, updatePassword, signIn } from "#/controllers/user";
import { isValidPassResetToken } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { CreateuserSchema, TokenAndIdValidationSchema, UpdatePasswordSchema, EmailValidationSchema } from "#/utils/validationSchema";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/create', validate(CreateuserSchema), create);
authRouter.post('/verify-email', validate(TokenAndIdValidationSchema), verifyEmail);
authRouter.post('/re-verify-email', sendReverificationToken);
authRouter.post('/forget-password', generateForgetPasswordLink);
authRouter.post('/verify-pass-reset-token', validate(TokenAndIdValidationSchema), isValidPassResetToken, grantValid);
authRouter.post('/update-password', validate(UpdatePasswordSchema), isValidPassResetToken, updatePassword);
authRouter.post('/sign-in', validate(EmailValidationSchema), signIn);

export default authRouter;