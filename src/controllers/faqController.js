import FAQ from "../models/faqModel.js";
import Redis from "ioredis";
import { translateText } from "../services/translation.js";


// Initialize Redis
const redis = new Redis();

// Add FAQ (No caching needed for writes)
export const addFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const faq = new FAQ({ question, answer });
        // claen radis cache
        await redis.del("faqs:*");
        await faq.save();
        res.status(200).json({ message: "FAQ Created Successfully", faq });
    } catch (error) {
        res.status(500).json({ message: "Error adding FAQ", error: error.message });
    }
};



// Get FAQs with Redis Caching
export const getFAQs = async (req, res) => {
    try {
        const lang = req.query.lang || "en"; // Default to English
        console.log(lang);
        // Check Redis Cache
        const cacheKey = `faqs:${lang}`;
        const cachedFAQs = await redis.get(cacheKey);
        if (cachedFAQs) {
            console.log("✅ Serving from Redis Cache");
            return res.json(JSON.parse(cachedFAQs));
        }

        // Fetch from MongoDB
        const faqs = await FAQ.find().lean();

        // Format FAQs based on the requested language
        const translatedFaqs = faqs.map((faq) => ({
            _id: faq._id,
            question: faq[`question_${lang}`] || faq.question, // Fallback to English
            answer: faq[`answer_${lang}`] || faq.answer, // Fallback to English
            createdAt: faq.createdAt,
            updatedAt: faq.updatedAt,
        }));

        // Store in Redis (Cache for 10 minutes)
        await redis.setex(cacheKey, 600, JSON.stringify(translatedFaqs));

        res.json(translatedFaqs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching FAQs", error: error.message });
    }
};

export const updateFAQ = async (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;

    try {
        const faq = await FAQ.findById(id);

        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        // Update only if the fields are provided
        if (question) faq.question = question;
        if (answer) faq.answer = answer;

        // Update translations if question or answer is modified
        if (question || answer) {
            const languages = ["hi", "bn", "fr", "es"]; // Supported languages
            for (const lang of languages) {
                if (question) faq[`question_${lang}`] = await translateText(question, lang);
                if (answer) faq[`answer_${lang}`] = await translateText(answer, lang);
            }
        }

        await faq.save();

        // Clear cached FAQs to prevent stale data
        await redis.del("faqs:*");

        res.json({ message: "FAQ updated successfully", updatedFAQ: faq });
    } catch (error) {
        res.status(500).json({ message: "Error updating FAQ", error: error.message });
    }
};



// Delete FAQ (Clears Cache)
export const deleteFAQ = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedFAQ = await FAQ.findByIdAndDelete(id);

        if (!deletedFAQ) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        // Clear cache to remove stale data
        await redis.del("faqs:*");

        res.json({ message: "FAQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting FAQ", error: error.message });
    }
};
