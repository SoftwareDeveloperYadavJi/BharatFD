import FAQ from "../models/faqModel.js";
import Redis from "ioredis";

// Initialize Redis
const redis = new Redis();

// Add FAQ (No caching needed for writes)
export const addFAQ = async (req, res) => {
    const { question, answer, question_hi, question_bn, question_fr, question_es, answer_hi, answer_bn, answer_fr, answer_es } = req.body;

    try {
        const faq = new FAQ({ question, answer, question_hi, question_bn, question_fr, question_es, answer_hi, answer_bn, answer_fr, answer_es });
        await faq.save();

        // Clear cached FAQs to prevent stale data
        await redis.del("faqs:*");

        res.send({ message: "FAQ added successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error adding FAQ", error: error.message });
    }
};

// Get FAQs with Redis Caching
export const getFAQs = async (req, res) => {
    try {
        const lang = req.query.lang || "en"; // Default to English

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


// Update FAQ (Clears Cache)
export const updateFAQ = async (req, res) => {
    const { id } = req.params;
    const { question, answer, question_hi, question_bn, question_fr, question_es, answer_hi, answer_bn, answer_fr, answer_es } = req.body;

    try {
        const updatedFAQ = await FAQ.findByIdAndUpdate(
            id,
            { question, answer, question_hi, question_bn, question_fr, question_es, answer_hi, answer_bn, answer_fr, answer_es },
            { new: true }
        );

        if (!updatedFAQ) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        // Clear cached FAQs to update with new data
        await redis.del("faqs:*");

        res.json({ message: "FAQ updated successfully", updatedFAQ });
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
