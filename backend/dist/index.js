"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const tags_1 = __importDefault(require("./routes/tags"));
const posts_1 = __importDefault(require("./routes/posts"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const allowedOrigins = [
    'http://localhost:3000',
    'https://webdev-blog.vercel.app',
    'https://webdev-blog-2z6k.vercel.app'
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express_1.default.json());
app.use('/api/tags', tags_1.default);
app.use('/api/posts', posts_1.default);
app.use('/api/auth', auth_1.default);
app.get('/', (req, res) => {
    res.json({
        message: 'Backend is running!',
        status: 'ok',
        endpoints: ['/api/tags', '/api/posts', '/api/auth']
    });
});
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
    console.log(`📌 Tags: http://localhost:${PORT}/api/tags`);
    console.log(`📌 Posts: http://localhost:${PORT}/api/posts`);
    console.log(`📌 Auth: http://localhost:${PORT}/api/auth`);
});
