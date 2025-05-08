import { Slide } from "../types.js";
export default class {
    /** @private */
    DELIMITER = '---';

    /**
     * @param {string} markdown - Markdown content to parse into slides
     */
    constructor(markdown) {
        this.slides = this.parseMarkdownToSlides(markdown || '');
        this.currentIndex = 0;
    }

    /**
     * Parse markdown into slides
     * @param {string} markdown - Markdown content
     * @returns {string[]} Array of HTML slides
     * @private
     */
    parseMarkdownToSlides(markdown) {
        const slidesMarkdown = markdown.split(this.DELIMITER);

        return slidesMarkdown.map(md => this.markdownToHtml(md.trim()));
    }

    /**
     * Convert markdown to HTML
     * @param {string} md - Markdown content
     * @returns {string} HTML content
     * @private
     */
    markdownToHtml(md) {
        if (!md) return '';

        let html = md;
        return html;
    }

    /**
     * Get the current slide
     * @returns {Slide} Current slide info with HTML and navigation state
     */
    getCurrentSlide() {
        return {
            html: this.slides[this.currentIndex],
            hasNext: this.currentIndex < this.slides.length - 1,
            hasPrevious: this.currentIndex > 0,
            currentIndex: this.currentIndex + 1,
            totalSlides: this.slides.length
        };
    }

    /**
     * Move to the next slide
     * @returns {Slide} Next slide info, or current if at the end
     */
    nextSlide() {
        if (this.currentIndex < this.slides.length - 1) {
            this.currentIndex++;
        }
        return this.getCurrentSlide();
    }

    /**
     * Move to the previous slide
     * @returns {Slide} Previous slide info, or current if at the beginning
     */
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
        return this.getCurrentSlide();
    }
}