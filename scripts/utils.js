/**
 * Loads a file and returns its content
 * @param {string} filePath - URL or relative path to the file
 * @returns {Promise<string>} The content of the file
 * @throws {Error} If the file cannot be loaded
 */
export const loadFile = async (filePath) => {
    try {
        const response = await fetch(filePath);
        const fileContent = await response.text();
        return fileContent;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * Escapes special HTML characters in a string.
 * Converts characters like &, <, >, ", and ' to their corresponding HTML entities.
 * 
 * @param {string} text - The input string to escape.
 * @returns {string} The escaped string with HTML entities.
 */

export const escapeHtml = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/`/g, "&#96;")
      .replace(/'/g, "&#039;");
};