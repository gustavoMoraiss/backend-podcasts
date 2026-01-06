"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioValidationSchema = exports.SignInValidationSchema = exports.UpdatePasswordSchema = exports.TokenAndIdValidationSchema = exports.CreateuserSchema = void 0;
const yup = __importStar(require("yup"));
const mongoose_1 = require("mongoose");
const audio_category_1 = require("./audio_category");
exports.CreateuserSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required("Name is missing or blank.")
        .min(3, "Name is too short or invalid.")
        .max(25, "Name is too long."),
    email: yup
        .string()
        .required("Email is missing or blank.")
        .email("invalid email ID."),
    password: yup
        .string()
        .required("Password is missing or blank")
        .min(8, "Password is too short.")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/, "Password is too simple"),
});
exports.TokenAndIdValidationSchema = yup.object().shape({
    token: yup.string().trim().required("Invalid token."),
    userId: yup
        .string()
        .transform(function (value) {
        if (this.isType(value) && (0, mongoose_1.isValidObjectId)(value)) {
            return value;
        }
        return "";
    })
        .required("Invalid userId."),
});
exports.UpdatePasswordSchema = yup.object().shape({
    token: yup.string().trim().required("Invalid token."),
    password: yup
        .string()
        .required("Password is missing or blank")
        .min(8, "Password is too short.")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/, "Password is too simple"),
    userId: yup
        .string()
        .transform(function (value) {
        if (this.isType(value) && (0, mongoose_1.isValidObjectId)(value)) {
            return value;
        }
        return "";
    })
        .required("Invalid userId."),
});
exports.SignInValidationSchema = yup.object().shape({
    email: yup
        .string()
        .required("Email is missing or blank.")
        .email("invalid email ID."),
    password: yup.string().trim().required("Password is missing or blank"),
});
exports.AudioValidationSchema = yup.object().shape({
    title: yup
        .string()
        .required("Title is missing or blank.")
        .email("invalid email ID."),
    about: yup.string().trim().required("About is missing or blank"),
    category: yup
        .string()
        .trim()
        .oneOf(audio_category_1.categories, "Invalid category")
        .required("Category is missing or blank"),
});
