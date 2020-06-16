"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const PathSchema = new mongoose_1.default.Schema({
    brush: String,
    color: Number,
    points: [Number]
}, {
    _id: false
});
const Drawing = new mongoose_1.Schema({
    paths: [PathSchema],
    mode: String,
    votes: Number,
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.default.model('Drawing', Drawing);
