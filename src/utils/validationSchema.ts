import * as yup from 'yup'
import { isValidObjectId } from 'mongoose';

export const CreateuserSchema = yup.object().shape({
    name: yup.string().trim().required("Name is missing or blank.").min(3, "Name is too short or invalid.").max(25, "Name is too long."),
    email: yup.string().required("Email is missing or blank.").email("invalid email ID."),
    password: yup.string().required("Password is missing or blank").min(8, "Password is too short.").matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/, "Password is too simple")
});

export const TokenAndIdValidationSchema = yup.object().shape({
    token: yup.string().trim().required("Invalid token."),
    userId: yup.string().transform(function (value) {
        if (this.isType(value) && isValidObjectId(value)) {
            return value;
        }
        return "";
    }).required("Invalid userId.")
});

export const UpdatePasswordSchema = yup.object().shape({
    token: yup.string().trim().required("Invalid token."),
    password: yup.string().required("Password is missing or blank").min(8, "Password is too short.").matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/, "Password is too simple"),
    userId: yup.string().transform(function (value) {
        if (this.isType(value) && isValidObjectId(value)) {
            return value;
        }
        return "";
    },

    ).required("Invalid userId.")
});



