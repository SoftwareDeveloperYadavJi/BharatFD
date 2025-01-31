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



export const getFAQBylng = async (req, res) => {
    const lng = req.query.lng || "en";
    try {
        // get FAQ by language

    } catch (error) {
        res.status(500).send({ message: "Error getting FAQ", error: error.message });
    }
};


