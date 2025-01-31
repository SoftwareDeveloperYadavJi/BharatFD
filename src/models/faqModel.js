import mongoose from "mongoose";
import { translateText } from "../services/translation.js";

// Define the schema with support for selected languages
const faqSchema = new mongoose.Schema(
    {
        question: { type: String, required: true },
        answer: { type: String, required: true }, // WYSIWYG support

        // Translations for multiple languages
        question_hi: { type: String },
        question_bn: { type: String },
        question_ta: { type: String },
        question_te: { type: String },
        question_mr: { type: String },
        question_fr: { type: String },
        question_es: { type: String },
        question_ar: { type: String },
        question_ja: { type: String }, // Japanese (Replaced Chinese)

        answer_hi: { type: String },
        answer_bn: { type: String },
        answer_ta: { type: String },
        answer_te: { type: String },
        answer_mr: { type: String },
        answer_fr: { type: String },
        answer_es: { type: String },
        answer_ar: { type: String },
        answer_ja: { type: String }, // Japanese (Replaced Chinese)
    },
    { timestamps: true }
);

// Pre-save middleware to handle translations
faqSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("question") && !this.isModified("answer")) return next();

        const languages = [
            "hi", "bn", "ta", "te", "mr", // Top 5 Indian Languages
            "fr", "es",                 // Top 2 European Languages
            "ar", "ja"                  // Top 2 Middle Eastern & Asian Languages (Arabic, Japanese)
        ];

        for (const lang of languages) {
            if (!this[`question_${lang}`]) {
                this[`question_${lang}`] = await translateText(this.question, lang);
            }

            if (!this[`answer_${lang}`]) {
                this[`answer_${lang}`] = await translateText(this.answer, lang);
            }
        }
        next();
    } catch (error) {
        console.error("Translation Error:", error);
        next(error);
    }
});

// Method to retrieve translation dynamically
faqSchema.methods.getTranslatedText = function (lang = "en") {
    return {
        question: this[`question_${lang}`] || this.question, // Fallback to English
        answer: this[`answer_${lang}`] || this.answer, // Fallback to English
    };
};

const FAQ = mongoose.model("FAQ", faqSchema);
export default FAQ;
