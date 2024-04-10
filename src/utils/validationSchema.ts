import * as yup from 'yup'

export const CreateuserSchema = yup.object().shape({
    name: yup.string().trim().required("Name is missing or blank.").min(3, "Name is too short or invalid.").max(25, "Name is too long."),
    email: yup.string().required("Email is missing or blank.").email("invalid email ID."),
    password: yup.string().required("Password is missing or blank").min(8, "Password is too short.").matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/, "Password is too simple")
});

