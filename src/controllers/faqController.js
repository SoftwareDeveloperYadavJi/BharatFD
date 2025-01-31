import FAQ from "../models/faqModel.js";


export const addFAQ = async (req, res) => {
    const { question, answer } = req.body;

    try {
        const faq = new FAQ({ question, answer });
        await faq.save();
        res.send({ message: "FAQ added successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error adding FAQ", error: error.message });
    }
};



export const getFAQs = async (req, res) => {
    try {
        const lang = req.query.lang || "en"; // Default to English if no language provided
        const faqs = await FAQ.find();

        // Map over each FAQ and return only the requested language
        const translatedFaqs = faqs.map((faq) => ({
            _id: faq._id,
            question: faq[`question_${lang}`] || faq.question, // Fallback to English
            answer: faq[`answer_${lang}`] || faq.answer, // Fallback to English
            createdAt: faq.createdAt,
            updatedAt: faq.updatedAt,
        }));

        res.json(translatedFaqs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching FAQs", error: error.message });
    }
};



