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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const groq_sdk_1 = require("groq-sdk");
const express_1 = __importDefault(require("express"));
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const prompts_1 = require("./prompts");
const groq = new groq_sdk_1.Groq({ apiKey: process.env.GROQ_API_KEY });
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/template', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d, _e;
    const prompt = req.body.prompt;
    const response = yield groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt
            }, {
                role: 'system',
                content: 'Return either node or react based on what do you think this project should be. Only return a single word either node or react.Do not return anything extra'
            }
        ],
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0,
        max_completion_tokens: 100,
        top_p: 1,
        stream: true,
    });
    console.log("\uD83D\uDCE5 Streaming response...");
    let answer = '';
    try {
        for (var _f = true, response_1 = __asyncValues(response), response_1_1; response_1_1 = yield response_1.next(), _a = response_1_1.done, !_a; _f = true) {
            _c = response_1_1.value;
            _f = false;
            const chunk = _c;
            const contentPiece = ((_e = (_d = chunk.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) || '';
            process.stdout.write(contentPiece);
            answer += contentPiece;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_f && !_a && (_b = response_1.return)) yield _b.call(response_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (answer != 'react' && answer != 'node') {
        return res.status(403).json({ message: "You cant access this" });
    }
    if (answer === 'react') {
        return res.json({
            prompts: [prompts_1.BASE_PROMPT, react_1.basePromptR]
        });
    }
    if (answer === 'node') {
        return res.json({
            prompts: [node_1.basePromptN]
        });
    }
}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_2, _b, _c;
        var _d, _e;
        console.log("🔁 main() started");
        const chatCompletion = yield groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: "what is 2+2?"
                }
            ],
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            temperature: 0,
            max_completion_tokens: 100,
            top_p: 1,
            stream: true,
        });
        console.log("📥 Streaming response...");
        try {
            for (var _f = true, chatCompletion_1 = __asyncValues(chatCompletion), chatCompletion_1_1; chatCompletion_1_1 = yield chatCompletion_1.next(), _a = chatCompletion_1_1.done, !_a; _f = true) {
                _c = chatCompletion_1_1.value;
                _f = false;
                const chunk = _c;
                process.stdout.write(((_e = (_d = chunk.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) || '');
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_f && !_a && (_b = chatCompletion_1.return)) yield _b.call(chatCompletion_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        console.log("\n✅ Done streaming.");
    });
}
main().catch((err) => console.error("❌ Error in main():", err));
app.listen(3002);
