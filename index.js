import { Slide } from './scripts/types.js';
import { loadFile } from './scripts/utils.js';
import MarkdownPresentation from './scripts/classes/MarkdownPresentation.js';

const DEFAULT_MARKDOWN_PATH = './default.md';

/** @type {MarkdownPresentation?} */
let presentation = null;

const mainContent = document.getElementById('content');

/** @type {HTMLButtonElement?} */
const prevSlideBtn = document.querySelector('button#prev-slide-btn');
/** @type {HTMLButtonElement?} */
const nextSlideBtn = document.querySelector('button#next-slide-btn');

const currentSlideIndex = document.getElementById('current-slide-index');
const totalSlides = document.getElementById('total-slides');

/** @type {HTMLInputElement?} */
const mdFileUploader = document.querySelector('input#md-uploader');

const progressBar = document.getElementById('slide-progress-bar');

/**
 * Loads markdown content from the given URL or path and displays
 * its first slide. Also updates the total number of slides.
 * @param {string} markdownPath - URL or relative path to the markdown content
 * @throws {Error} If the markdown content cannot be loaded
 */
const loadMarkdown = async (markdownPath) => {
    try {
        const markdown = await loadFile(markdownPath);
        presentation = new MarkdownPresentation(markdown);
        const currentSlide = presentation.getCurrentSlide();

        handleSlideChange(currentSlide);
        if (totalSlides) {
            totalSlides.textContent = currentSlide.totalSlides.toString();
        }

        if (progressBar) {
            progressBar.style.width = `${currentSlide.percentageCompleted}%`;
        }
    } catch (e) {
        console.error(e);
        alert(`Failed to load the markdown file.`);
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

    if (currentSlideIndex) {
        currentSlideIndex.textContent = slide.currentIndex.toString();
    }

    if (progressBar && slide.totalSlides > 1) {
        progressBar.style.width = `${slide.percentageCompleted}%`;
    }
}

/**
 * Handles the next slide button click event.
 * If there is a next slide, updates the main content and navigation buttons.
 * @param {Event} event - The click event triggered by the next slide button.
 */
nextSlideBtn?.addEventListener('click', () => {
    if (!presentation) {
        return;
    }
    const nextSlide = presentation.nextSlide();
    handleSlideChange(nextSlide);
});

/**
 * Handles the previous slide button click event.
 * If there is a previous slide, updates the main content and navigation buttons.
 * @param {Event} event - The click event triggered by the previous slide button.
 */
prevSlideBtn?.addEventListener('click', () => {
    if (!presentation) {
        return;
    }
    const prevSlide = presentation.prevSlide();
    handleSlideChange(prevSlide);
});

/**
 * Handles the file upload event and loads the selected .md file.
 * @param {Event} event - The change event triggered by the file upload input.
 */
mdFileUploader?.addEventListener('change', async () => {
    const file = mdFileUploader?.files?.[0];
    if (!file) {
        alert('No valid .md file selected.');
        return;
    }
    const fileUrl = URL.createObjectURL(file);
    loadMarkdown(fileUrl);
});

/**
 * Handles the keyup event and navigates to the next or previous slide
 * based on the pressed arrow key.
 * @param {KeyboardEvent} event - The keyup event triggered by the user pressing an arrow key.
 */
window.addEventListener('keyup', (event) => {
    if (!presentation) {
        return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
    }
    
    console.log('running');

    if (event.key === 'ArrowLeft') {
        const prevSlide = presentation.prevSlide();
        handleSlideChange(prevSlide);
    } else if (event.key === 'ArrowRight') {
        const nextSlide = presentation.nextSlide();
        handleSlideChange(nextSlide);
    }
});

// Load the default.md on page load
loadMarkdown(DEFAULT_MARKDOWN_PATH);