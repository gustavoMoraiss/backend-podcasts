import { Model, ObjectId, Schema, model } from "mongoose";

interface EmailVerificationToken {
    owner: ObjectId;
    token: string;
    createdAt: Date,

}

const emailVerificationTokenSchema = new Schema<EmailVerificationToken>({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now()
    }
}, { timestamps: true })

export default model("EmailVerificationToken", emailVerificationTokenSchema) as Model<EmailVerificationToken>