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
