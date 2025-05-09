import { Slide } from "../types.js";
import { escapeHtml } from "../utils.js";
export default class {
    /** @private */
    DELIMITER = /^\s*---\s*$/m; // Regex for the slide delimiter, only triggers for --- on a new line

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
     * @returns {{html: string, rawContent: string}[]} Array of HTML slides
     * @private
     */
    parseMarkdownToSlides(markdown) {
        const slidesMarkdown = markdown.split(this.DELIMITER);

        return slidesMarkdown.map(md => {
            return {
                'html': this.markdownToHtml(md.trim()),
                'rawContent': md.trim()
            };
        });
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
        // Regex Matches: ```code```
        // Store code blocks in an array and replace with tokens
        /** @type {string[]} */
        const codeBlocks = [];
        
        // Tokenize the code blocks to hide them from <p>
        html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
            const id = codeBlocks.length;
            codeBlocks.push(code.trim());
            return `__CODE_BLOCK_${id}__`;
        });
        
        // Inline code (single backticks)
        // Regex Matches: `code`
        html = html.replace(/`([^`]+)`/g, (match, code) =>  
            `<code class="inline-code">${escapeHtml(code)}</code>`);
        
        // Headers
        // Regex Matches: #, ##, ###
        html = html.replace(/^# (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^## (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^### (.*$)/gm, '<h4>$1</h4>');
        
        // Bold, italic and strikethrough
        // Regex Matches: **bold**, *italic*, ~~strikethrough~~
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

        // Checkboxes
        // Regex Matches: - [x] text
        html = html.replace(/^\s*-\s+\[([ xX])\]\s+(.*$)/gm, (match, checked, text) => {
            const isChecked = checked.toLowerCase() === 'x' ? 'checked' : '';
            return `<div class="checkbox-item"><input type="checkbox" ${isChecked} disabled><span>${text}</span></div>`;
        });
        
        // Unordered lists - mark with ul-item class temporarily
        // Regex Matches: *, -
        html = html.replace(/^\* (.*$)/gm, '<li class="ul-item">$1</li>');
        html = html.replace(/^- (.*$)/gm, '<li class="ul-item">$1</li>');

        // Ordered lists - mark with ol-item class temporarily
        html = html.replace(/^\d+\. (.*$)/gm, '<li class="ol-item">$1</li>');

        // Group unordered list items
        html = html.replace(/(<li class="ul-item">.*?<\/li>(\s*<li class="ul-item">.*?<\/li>)*)/g, '<ul>$1</ul>');

        // Group ordered list items
        html = html.replace(/(<li class="ol-item">.*?<\/li>(\s*<li class="ol-item">.*?<\/li>)*)/g, '<ol>$1</ol>');

        // Now we'll clean up the teomorary classes
        html = html.replace(/<li class="ul-item">(.*?)<\/li>/g, '<li>$1</li>');
        html = html.replace(/<li class="ol-item">(.*?)<\/li>/g, '<li>$1</li>');
        
        // Links and images
        // Regex Matches: [text](url)
        html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" loading="lazy" height="auto" style="max-width: 200px; max-height: 200px">');
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
        
        // Paragraphs (avoiding nested tags)
        // Regex Matches: text
        html = html.replace(/^(?!<.*>$|$)(.+)$/gm, '<p>$1</p>');

        // Restore the code blocks
        codeBlocks.forEach((code, id) => {
            html = html.replace(
                `__CODE_BLOCK_${id}__`, 
                `<pre><code>${escapeHtml(code)}</code></pre>`
            );
        });
        
        return html;
    }

    /**
     * Gets the current slides raw markdown and re-parses the HTML
     * @return {void}
     */

    reparseCurrentSlideMarkdown() {
        const currentSlide = this.getCurrentSlide();
        const newHtml = this.markdownToHtml(currentSlide.rawContent);
        this.slides[this.currentIndex].html = newHtml;
    }

    /**
     * Sets the current slide's markdown content and re-parses the HTML
     * @param {string} markdown - New markdown content for the current slide
     * @param {boolean} skipReparse - Skip re-parsing the HTML
     * @returns {void}
     */
    setCurrentSlideMarkdown(markdown, skipReparse = false) {
        this.slides[this.currentIndex].rawContent = markdown;
        this.reparseCurrentSlideMarkdown();
    }

    /**
     * Deletes the current slide and moves to the previous slide, if it exists
     * @returns {void}
     */
    deleteCurrentSlide() {
        this.slides.splice(this.currentIndex, 1);
        this.currentIndex = Math.min(this.currentIndex, this.slides.length - 1);
    }

    /**
     * Get the current slide
     * @returns {Slide} Current slide info with HTML and navigation state
     */
    getCurrentSlide() {
        return {
            html: this.slides[this.currentIndex].html,
            rawContent: this.slides[this.currentIndex].rawContent,
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