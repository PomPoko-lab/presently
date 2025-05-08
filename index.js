import { Slide } from './scripts/types.js';
import MarkdownPresentation from './scripts/classes/MarkdownPresentation.js';
import { loadFile } from './scripts/utils.js';

const DEFAULT_MARKDOWN_PATH = './default.md';

/** @type {MarkdownPresentation?} */
let presentation = null;

const mainContent = document.getElementById('content');
const prevSlideBtn = document.getElementById('prev-slide-btn');
const nextSlideBtn = document.getElementById('next-slide-btn');

const loadInitialMarkdown = async () => {
    try {
        const markdown = await loadFile(DEFAULT_MARKDOWN_PATH);
        presentation = new MarkdownPresentation(markdown);
        const currentSlide = presentation.getCurrentSlide();
        
        if (mainContent) {
            mainContent.innerHTML = currentSlide.html;
        }
    } catch (e) {
        console.error(e);
        alert(`Failed to load initial markdown.`);
    }
}

// Load the default.md on page load
loadInitialMarkdown();