import { Slide } from './scripts/types.js';
import MarkdownPresentation from './scripts/classes/MarkdownPresentation.js';
import { loadFile } from './scripts/utils.js';

const DEFAULT_MARKDOWN_PATH = './default.md';

/** @type {MarkdownPresentation?} */
let presentation = null;

const mainContent = document.getElementById('content');

/** @type {HTMLButtonElement?} */
const prevSlideBtn = document.querySelector('button#prev-slide-btn');
/** @type {HTMLButtonElement?} */
const nextSlideBtn = document.querySelector('button#next-slide-btn');

const loadInitialMarkdown = async () => {
    try {
        const markdown = await loadFile(DEFAULT_MARKDOWN_PATH);
        presentation = new MarkdownPresentation(markdown);
        const currentSlide = presentation.getCurrentSlide();

        handleSlideChange(currentSlide);
    } catch (e) {
        console.error(e);
        alert(`Failed to load initial markdown.`);
    }
}

/**
 * Updates the main content and navigation buttons based on the provided slide.
 * @param {Slide} slide - The slide object containing HTML content and navigation state.
 */
const handleSlideChange = (slide) => {
    if (mainContent) {
        mainContent.innerHTML = slide.html;
    }
    if (prevSlideBtn) {
        prevSlideBtn.disabled = !slide.hasPrevious;
    }
    if (nextSlideBtn) {
        nextSlideBtn.disabled = !slide.hasNext;
    }
}

nextSlideBtn?.addEventListener('click', () => {
    if (!presentation) {
        return;
    }
    const nextSlide = presentation.nextSlide();
    handleSlideChange(nextSlide);
});

prevSlideBtn?.addEventListener('click', () => {
    if (!presentation) {
        return;
    }
    const prevSlide = presentation.prevSlide();
    handleSlideChange(prevSlide);
});

// Load the default.md on page load
loadInitialMarkdown();