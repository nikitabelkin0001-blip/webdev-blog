"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.posts = exports.tags = void 0;
exports.saveData = saveData;
exports.initializeStore = initializeStore;
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dataPath = path_1.default.join(__dirname, '..', '..', 'data.json');
//Для хранения данных в памяти
exports.tags = [];
exports.posts = [];
//Загрузка данных из файла
function loadData() {
    try {
        if (fs_1.default.existsSync(dataPath)) {
            const data = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
            exports.tags = data.tags || [];
            exports.posts = data.posts || [];
            console.log('📂 Данные загружены из data.json');
        }
    }
    catch (err) {
        console.error('Ошибка загрузки данных:', err);
    }
}
// Сохранение данных в файл
function saveData() {
    try {
        fs_1.default.writeFileSync(dataPath, JSON.stringify({ tags: exports.tags, posts: exports.posts }, null, 2));
        console.log('💾 Данные сохранены в data.json');
    }
    catch (err) {
        console.error('Ошибка сохранения данных:', err);
    }
}
// Заполнение тестовыми данными
function initializeStore() {
    loadData();
    if (exports.tags.length === 0 && exports.posts.length === 0) {
        console.log('🔄 Заполняем тестовыми данными...');
        //Теги
        const tag1 = {
            id: (0, uuid_1.v4)(),
            name: 'JavaScript',
            slug: 'javascript',
            description: 'Язык программирования для веба',
            createdAt: new Date().toISOString(),
        };
        const tag2 = {
            id: (0, uuid_1.v4)(),
            name: 'TypeScript',
            slug: 'typescript',
            description: 'Типизированный JavaScript',
            createdAt: new Date().toISOString(),
        };
        const tag3 = {
            id: (0, uuid_1.v4)(),
            name: 'Next.js',
            slug: 'nextjs',
            description: 'React-фреймворк',
            createdAt: new Date().toISOString(),
        };
        const tag4 = {
            id: (0, uuid_1.v4)(),
            name: 'Tailwind CSS',
            slug: 'tailwind',
            description: 'Утилитарный CSS',
            createdAt: new Date().toISOString(),
        };
        const tag5 = {
            id: (0, uuid_1.v4)(),
            name: 'Node.js',
            slug: 'nodejs',
            description: 'Серверный JavaScript',
            createdAt: new Date().toISOString(),
        };
        exports.tags = [tag1, tag2, tag3, tag4, tag5];
        /// Постя
        const now = new Date().toISOString();
        exports.posts = [
            {
                id: (0, uuid_1.v4)(),
                title: 'Введение в JavaScript',
                content: 'JavaScript — это язык программирования, который работает в браузере и на сервере. Он позволяет создавать интерактивные веб-страницы.',
                isPublished: true,
                publishedAt: now,
                tagId: tag1.id,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: (0, uuid_1.v4)(),
                title: 'Почему TypeScript лучше JavaScript',
                content: 'TypeScript добавляет статическую типизацию, что помогает ловить ошибки на этапе разработки, а не в рантайме.',
                isPublished: true,
                publishedAt: now,
                tagId: tag2.id,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: (0, uuid_1.v4)(),
                title: 'Next.js 14: Что нового',
                content: 'App Router, Server Components, улучшенная производительность и новый рендеринг.',
                isPublished: false,
                tagId: tag3.id,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: (0, uuid_1.v4)(),
                title: 'Tailwind CSS за 10 минут',
                content: 'Утилитарные классы позволяют верстать без отрыва от HTML и без написания CSS-файлов.',
                isPublished: true,
                publishedAt: now,
                tagId: tag4.id,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: (0, uuid_1.v4)(),
                title: 'Создаём API на Express',
                content: 'Express — минималистичный веб-фреймворк для Node.js. Позволяет быстро создать REST API.',
                isPublished: true,
                publishedAt: now,
                tagId: tag5.id,
                createdAt: now,
                updatedAt: now,
            },
        ];
        saveData();
    }
}
