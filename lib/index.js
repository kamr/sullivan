"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * embed webpack-dev-server
 */
let webpack, webpackDevMiddleware, webpackHotMiddleware, webpackConfig;
if (process.env.NODE_ENV !== "production") {
    webpack = require("webpack");
    webpackDevMiddleware = require("webpack-dev-middleware");
    webpackConfig = require("../../webpack.config");
    webpackHotMiddleware = require("webpack-hot-middleware");
}
const colyseus_1 = require("colyseus");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const express_2 = __importDefault(require("@colyseus/social/express"));
const monitor_1 = require("@colyseus/monitor");
const mongoose_1 = __importDefault(require("mongoose"));
const DrawingRoom_1 = require("./rooms/DrawingRoom");
const Drawing_1 = __importDefault(require("./db/Drawing"));
exports.port = Number(process.env.PORT || 8080);
exports.endpoint = "localhost";
/**
 * Connect to MongoDB
 */
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/colyseus', {
    autoIndex: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
});
const app = express_1.default();
const gameServer = new colyseus_1.Server({ server: http_1.default.createServer(app) });
gameServer.define("2minutes", DrawingRoom_1.DrawingRoom, { expiration: 60 * 2 });
gameServer.define("5minutes", DrawingRoom_1.DrawingRoom, { expiration: 60 * 5 });
gameServer.define("1hour", DrawingRoom_1.DrawingRoom, { expiration: 60 * 60 });
gameServer.define("1day", DrawingRoom_1.DrawingRoom, { expiration: 60 * 60 * 24 });
gameServer.define("1week", DrawingRoom_1.DrawingRoom, { expiration: 60 * 60 * 24 * 7 });
if (process.env.NODE_ENV !== "production") {
    const webpackCompiler = webpack(webpackConfig({}));
    app.use(webpackDevMiddleware(webpackCompiler, {}));
    app.use(webpackHotMiddleware(webpackCompiler));
    // on development, use "../../" as static root
    exports.STATIC_DIR = path_1.default.resolve(__dirname, "..", "..");
}
else {
    // on production, use ./public as static root
    exports.STATIC_DIR = path_1.default.resolve(__dirname, "public");
}
app.use("/", express_1.default.static(exports.STATIC_DIR));
// @colyseus/social routes
app.use("/", express_2.default);
app.get('/drawings', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.json(yield Drawing_1.default.find({}, {
        _id: 1,
        mode: 1,
        createdAt: 1,
    }).sort({
        createdAt: -1
    }));
}));
app.get('/drawings/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.json(yield Drawing_1.default.findOne({ _id: req.params.id }));
}));
// add colyseus monitor
const auth = express_basic_auth_1.default({ users: { 'admin': 'admin' }, challenge: true });
app.use("/colyseus", auth, monitor_1.monitor(gameServer));
gameServer.listen(exports.port);
console.log(`Listening on http://${exports.endpoint}:${exports.port}`);
