import translate from "google-translate-api-x";

/**
 * Translate the given text to the specified target language
 * @param {string} text - The text to be translated
 * @param {string} targetLang - The target language to translate to
 * @returns {Promise<string>} The translated text or the original text in case of error
 */
export const translateText = async (text, targetLang) => {
    try {
        if (!text) return "";
        const { text: translated } = await translate(text, { to: targetLang });
        return translated;
    } catch (error) {
        console.error(`Translation Error for ${targetLang}:`, error);
        return text; // Fallback to original text
    }
};
