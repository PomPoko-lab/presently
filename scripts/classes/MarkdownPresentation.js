import { Slide } from "../types.js";
import { escapeHtml } from "../utils.js";
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
        
        // Code blocks with language support
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang ? ` class="language-${lang}"` : ''; // No syntax highlighting for now
            return `<pre><code${language}>${escapeHtml(code.trim())}</code></pre>`;
        });
        
        // Inline code (single backticks)
        html = html.replace(/`([^`]+)`/g, (match, code) => 
            `<code class="inline-code">${escapeHtml(code)}</code>`);
        
        // Headers
        html = html.replace(/^# (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^## (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^### (.*$)/gm, '<h4>$1</h4>');
        
        // Bold, italic and strikethrough
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
        
        // Unordered lists
        html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
        html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>');
        
        // Ordered lists
        html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
        
        // Blockquotes
        html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
        
        // Horizontal rule
        html = html.replace(/^---$/gm, '<hr>');
        
        // Links and images
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
        html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
        
        // Paragraphs (avoiding nested tags)
        html = html.replace(/^(?!<[a-z]).+$/gm, match => {
            if (match.trim() === '') return match;
            return `<p>${match}</p>`;
        });
        
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
            totalSlides: this.slides.length,
            percentageCompleted: ((this.currentIndex + 1) / this.slides.length) * 100
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