"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAudio = void 0;
const cloud_1 = __importDefault(require("../cloud"));
const audio_1 = __importDefault(require("../models/audio"));
const createAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { title, about, category } = req.body;
    const poster = (_a = req.files) === null || _a === void 0 ? void 0 : _a.poster;
    const audioFile = (_b = req.files) === null || _b === void 0 ? void 0 : _b.audio;
    const ownerId = req.user.id;
    if (!audioFile)
        return res.status(422).json({ error: "Audio file is required" });
    try {
        const audioRes = yield cloud_1.default.uploader.upload(audioFile.filepath, {
            resource_type: "video",
        });
        const newAudio = new audio_1.default({
            title,
            about,
            ownerId,
            category,
            file: {
                url: audioRes.url,
                publicId: audioRes.public_id,
            },
        });
        if (poster) {
            const posterRes = yield cloud_1.default.uploader.upload(poster.filepath, {
                width: 300,
                height: 300,
                crop: "thumb",
                gravity: "face",
            });
            newAudio.poster = { url: posterRes.url, publicId: posterRes.public_id };
        }
        res.status(201).send({
            audio: {
                title,
                about,
                file: newAudio.file.url,
                poster: (_c = newAudio.poster) === null || _c === void 0 ? void 0 : _c.url,
            },
        });
        yield newAudio.save();
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.createAudio = createAudio;
