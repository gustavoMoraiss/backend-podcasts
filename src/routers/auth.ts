import {
  create,
  verifyEmail,
  sendReverificationToken,
  generateForgetPasswordLink,
  grantValid,
  updatePassword,
  signIn,
  updateProfile,
  sendProfile,
  logout,
} from "#/controllers/user";
import { isValidPassResetToken, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import {
  CreateuserSchema,
  TokenAndIdValidationSchema,
  UpdatePasswordSchema,
  EmailValidationSchema,
} from "#/utils/validationSchema";
import { Router } from "express";
import fileParser, { RequestWithFiles } from "#/middleware/fileParser";

const authRouter = Router();

authRouter.post("/create", validate(CreateuserSchema), create);
authRouter.post(
  "/verify-email",
  validate(TokenAndIdValidationSchema),
  verifyEmail
);
authRouter.post("/re-verify-email", sendReverificationToken);
authRouter.post("/forget-password", generateForgetPasswordLink);
authRouter.post(
  "/verify-pass-reset-token",
  validate(TokenAndIdValidationSchema),
  isValidPassResetToken,
  grantValid
);
authRouter.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPassResetToken,
  updatePassword
);
authRouter.post("/sign-in", validate(EmailValidationSchema), signIn);
authRouter.get("/is-auth", mustAuth, sendProfile);
authRouter.post("/update-profile", mustAuth, fileParser, updateProfile);
authRouter.post("/log-out", mustAuth, logout);

export default authRouter;
