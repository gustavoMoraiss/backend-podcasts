import { CreateUserRequest, VerifyEmailRequest } from "#/@types/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import User from "#/models/user";
import { formatProfile, generateToken } from "#/utils/helper";
import {
  sendVerificationMail,
  sendVerificationPasswordLink,
  sendPassResetSuccessEmail,
} from "#/utils/mail";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "#/utils/variables";
import jwt from "jsonwebtoken";
import { RequestWithFiles } from "#/middleware/fileParser";
import { error } from "console";
import cloudinary from "#/cloud";
import formidable from "formidable";

export const create: RequestHandler = async (req: CreateUserRequest, res) => {
  const { email, password, name } = req.body;

  const user = User.create({ name, email, password });

  const token = generateToken();

  await EmailVerificationToken.create({
    owner: (await user)._id,
    token,
  });

  sendVerificationMail(token, {
    name,
    email,
    userId: (await user)._id.toString(),
  });

  res.status(201).json({ user: { id: (await user)._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token." });

  const matched = await verificationToken?.compareToken(token);

  if (!matched) return res.status(403).json({ error: "Invalid token." });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your email is verified." });
};

export const sendReverificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    res.status(403).json({ error: "Invalid request." });

  const user = await User.findById(userId);

  if (!user) res.status(403).json({ error: "Invalid request." });

  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  const token = generateToken();

  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  sendVerificationMail(token, {
    name: user?.name ?? "",
    email: user?.email ?? "",
    userId: user?._id.toString() ?? "",
  });

  res.json({ message: "Please, check your mail." });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Account not found!" });

  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });

  const token = crypto.randomBytes(36).toString("hex");

  await PasswordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendVerificationPasswordLink({ email: user.email, link: resetLink });

  res.json({ message: "Check you registered mail." });
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user)
    return res.status(403).json({
      error: "Unauthorized access.",
    });

  const matched = await user.comparePassword(password);
  if (matched)
    return res.status(422).json({
      error: "The new password must be different.",
    });

  user.password = password;
  await user.save();

  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });

  sendPassResetSuccessEmail(user.name, user.email);
  res.json({ message: "Password resets successfully." });
};

export const signIn: RequestHandler = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user)
    return res.status(403).json({ error: "Email/ Password mismatch." });

  const matched = await user.comparePassword(password);

  if (!matched)
    return res.status(403).json({ error: "Email/ Password mismatch." });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  user.tokens.push(token);
  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    },
    token,
  });
};

export const sendProfile: RequestHandler = async (req, res) => {
  res.json({
    profile: req.user,
  });
};

export const logout: RequestHandler = async (req, res) => {
  const { fromAll } = req.query;
  const token = req.token;

  const user = await User.findById(req.user.id);

  if (!user) throw new Error("something went worng, user not found.");

  if (fromAll === "yes") user.tokens = [];
  else user.tokens = user.tokens.filter((t) => t !== token);

  await user.save();
  res.json({ success: true });
};

export const updateProfile: RequestHandler = async (
  req: RequestWithFiles,
  res
) => {
  const { name } = req.body;
  const avatar = req.files?.avatar as formidable.File;

  const user = await User.findById(req.user.id);
  if (!user) throw new Error("something went worng, user not found!");

  if (typeof name !== "string" || name.trim().length < 3)
    return res.status(422).json({ error: "Invalid name!" });

  user.name = name;

  if (avatar) {
    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar?.publicId);
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      avatar.filepath,
      {
        width: 300,
        height: 300,
        crop: "thomb",
        gravity: "face",
      }
    );

    user.avatar = { url: secure_url, publicId: public_id };
  }
  await user.save();
  res.json({ profile: formatProfile(user) });
};
