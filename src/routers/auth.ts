import { create, verifyEmail, sendReverificationToken, generateForgetPasswordLink, grantValid, updatePassword } from "#/controllers/user";
import { isValidPassResetToken } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { CreateuserSchema, TokenAndIdValidationSchema, UpdatePasswordSchema } from "#/utils/validationSchema";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/create', validate(CreateuserSchema), create);
authRouter.post('/verify-email', validate(TokenAndIdValidationSchema), verifyEmail);
authRouter.post('/re-verify-email', sendReverificationToken);
authRouter.post('/forget-password', generateForgetPasswordLink);
authRouter.post('/verify-pass-reset-token', validate(TokenAndIdValidationSchema), isValidPassResetToken, grantValid);
authRouter.post('/update-password', validate(UpdatePasswordSchema), isValidPassResetToken, updatePassword);

export default authRouter;