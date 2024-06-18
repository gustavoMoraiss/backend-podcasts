import {
  create,
  verifyEmail,
  sendReverificationToken,
  generateForgetPasswordLink,
  grantValid,
  updatePassword,
  signIn,
} from "#/controllers/user";
import { isValidPassResetToken, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import {
  CreateuserSchema,
  TokenAndIdValidationSchema,
  UpdatePasswordSchema,
  EmailValidationSchema,
} from "#/utils/validationSchema";
import { error } from "console";
import { Router } from "express";
import formidable from "formidable";

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
authRouter.post("/is-auth", mustAuth, signIn);
authRouter.post("/update-profile", (req, res) => {
  if (!req.headers["content-type"]?.startsWith("multipart/form-data"))
    return res.status(422).json({ error: "Only accepts form-data!" });

  //handle de file update
  const form = formidable();
  form.parse(req, (err, fields, files) => {
    console.log(fields);
    console.log(files);
    res.json({ uploaded: true });
  });
});

export default authRouter;
