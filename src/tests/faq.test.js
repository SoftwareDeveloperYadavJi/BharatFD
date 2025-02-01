import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from 'express';
import FAQ from "../models/faqModel.js";
import faqRouter from '../routes/faqRoutes.js';

// Create Express app instance specifically for testing
const app = express();
app.use(express.json());
app.use('/faq', faqRouter);

let mongoServer;

// Increase the timeout for all tests
jest.setTimeout(30000);

beforeAll(async () => {
    try {
        // Create the MongoDB Memory Server
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        // Close any existing connections
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }

        // Connect to the in-memory database
        await mongoose.connect(mongoUri);

        // Wait for the connection to be fully established
        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
        console.error('Error in test setup:', error);
        throw error;
    }
});

beforeEach(async () => {
    // Clear all collections before each test
    try {
        await Promise.all(
            Object.values(mongoose.connection.collections).map(collection =>
                collection.deleteMany({})
            )
        );
    } catch (error) {
        console.error('Error in test cleanup:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
        // Cleanup
        await mongoose.disconnect();
        await mongoServer.stop();
    } catch (error) {
        console.error('Error in test cleanup:', error);
        throw error;
    }
});

describe("POST /faq/add", () => {
    it("should add a new FAQ and return the created object", async () => {
        const faqData = {
            question: "What is Node.js?",
            answer: "Node.js is a JavaScript runtime built on Chrome's V8 engine."
        };

        const response = await request(app)
            .post("/faq/add")
            .send(faqData)
            .expect(201);

        expect(response.body).toHaveProperty("faq");
        expect(response.body).toHaveProperty("message", "FAQ Created Successfully");
        expect(response.body.faq).toHaveProperty("_id");
        expect(response.body.faq.question).toBe(faqData.question);
        expect(response.body.faq.answer).toBe(faqData.answer);
    });

    it("should return 500 if required fields are missing", async () => {
        const invalidData = {
            question: "What is Node.js?"
        };

        const response = await request(app)
            .post("/faq/add")
            .send(invalidData)
            .expect(500);

        expect(response.body).toHaveProperty("error");
    });
});

describe("GET /faq/all", () => {
    const languages = [
        "hi", "bn", "ta", "te", "mr", // Top 5 Indian Languages
        "fr", "es",                   // Top 2 European Languages
        "ar", "ja"                    // Arabic and Japanese
    ];

    // Unicode ranges for different scripts
    const scriptRanges = {
        hi: /[\u0900-\u097F]/,  // Devanagari
        bn: /[\u0980-\u09FF]/,  // Bengali
        ta: /[\u0B80-\u0BFF]/,  // Tamil
        te: /[\u0C00-\u0C7F]/,  // Telugu
        mr: /[\u0900-\u097F]/,  // Devanagari (Marathi uses same script as Hindi)
        fr: /[À-ÿ]/,           // French accented characters
        es: /[À-ÿ]/,           // Spanish accented characters
        ar: /[\u0600-\u06FF]/,  // Arabic
        ja: /[\u3040-\u30FF\u4E00-\u9FAF]/  // Japanese (Hiragana, Katakana, Kanji)
    };

    beforeEach(async () => {
        // Add test data
        await FAQ.create({
            question: "What is Node.js?",
            answer: "Node.js is a JavaScript runtime."
        });
    });

    // Test each supported language
    languages.forEach(lang => {
        it(`should return FAQs translated in ${lang.toUpperCase()}`, async () => {
            const response = await request(app)
                .get("/faq/all")
                .query({ lang })
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            if (response.body.length > 0) {
                const faq = response.body[0];

                // Basic property checks
                expect(faq).toHaveProperty("question");
                expect(faq).toHaveProperty("answer");

                // Verify content is different from English
                expect(faq.question).not.toBe("What is Node.js?");
                expect(faq.answer).not.toBe("Node.js is a JavaScript runtime.");

                // Verify correct script is used based on language
                const scriptRegex = scriptRanges[lang];
                expect(faq.question.match(scriptRegex) || faq.answer.match(scriptRegex)).toBeTruthy();
            }
        });
    });

    it("should still return FAQs in English for invalid language code", async () => {
        const response = await request(app)
            .get("/faq/all")
            .query({ lang: 'invalid' })
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
            const faq = response.body[0];
            expect(faq).toHaveProperty("question");
            expect(faq).toHaveProperty("answer");
            // Should return English content for invalid language
            expect(faq.question).toBe("What is Node.js?");
            expect(faq.answer).toBe("Node.js is a JavaScript runtime.");
        }
    });

    it("should return FAQs in English when no language is specified", async () => {
        const response = await request(app)
            .get("/faq/all")
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
            const faq = response.body[0];
            expect(faq).toHaveProperty("question");
            expect(faq).toHaveProperty("answer");
            // Should return English content when no language specified
            expect(faq.question).toBe("What is Node.js?");
            expect(faq.answer).toBe("Node.js is a JavaScript runtime.");
        }
    });

    it("should handle multiple FAQs in translation", async () => {
        // Add another FAQ
        await FAQ.create({
            question: "What is Express.js?",
            answer: "Express.js is a web framework for Node.js"
        });

        const response = await request(app)
            .get("/faq/all")
            .query({ lang: 'hi' }) // Test with Hindi as an example
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);

        // Verify both FAQs are translated
        response.body.forEach(faq => {
            expect(faq).toHaveProperty("question");
            expect(faq).toHaveProperty("answer");
            expect(faq.question.match(scriptRanges.hi) || faq.answer.match(scriptRanges.hi)).toBeTruthy();
        });
    });
});