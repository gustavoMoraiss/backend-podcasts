"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../controllers/user");
const auth_1 = require("../middleware/auth");
const validator_1 = require("../middleware/validator");
const validationSchema_1 = require("../utils/validationSchema");
const express_1 = require("express");
const fileParser_1 = __importDefault(require("../middleware/fileParser"));
const authRouter = (0, express_1.Router)();
authRouter.post("/create", (0, validator_1.validate)(validationSchema_1.CreateuserSchema), user_1.create);
authRouter.post("/verify-email", (0, validator_1.validate)(validationSchema_1.TokenAndIdValidationSchema), user_1.verifyEmail);
authRouter.post("/re-verify-email", user_1.sendReverificationToken);
authRouter.post("/forget-password", user_1.generateForgetPasswordLink);
authRouter.post("/verify-pass-reset-token", (0, validator_1.validate)(validationSchema_1.TokenAndIdValidationSchema), auth_1.isValidPassResetToken, user_1.grantValid);
authRouter.post("/update-password", (0, validator_1.validate)(validationSchema_1.UpdatePasswordSchema), auth_1.isValidPassResetToken, user_1.updatePassword);
authRouter.post("/sign-in", (0, validator_1.validate)(validationSchema_1.EmailValidationSchema), user_1.signIn);
authRouter.post("/is-auth", auth_1.mustAuth, user_1.signIn);
authRouter.post("/update-profile", fileParser_1.default, (req, res) => {
    console.log(req.files);
    res.json({ ok: true });
});
exports.default = authRouter;
