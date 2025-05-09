# Presently: A Markdown Presentation Tool

### How to Use
- Navigate slides using arrow keys or the buttons
- Upload your own markdown by clicking "Load Slides (.md)"
- Edit any slide by clicking the Edit button, then Save when done
- Slides are separated by --- in your markdown files

## Architecture

### Core Technologies
- **Vanilla JavaScript** with JSDoc for type checking
- **No frameworks** - pure HTML, CSS, and JS
- **Module pattern** for code organization
- **Mobile-first responsive design**

---

### Component Structure
- **MarkdownPresentation class**: Core engine for parsing and navigation
- **UI Components**: Modular elements like slides, controllers, editor
- **Utils**: Helper functions for file loading and HTML escaping


### Data Flow
1. Load markdown content
2. Parse into slides
3. Render current slide
4. Navigate via UI controls or keyboard
5. Edit mode for content modification

---

## Design Considerations

### Framework Decision
- Considered Vue.js with TypeScript to align with job requirements
- Opted for vanilla JS as framework would be overkill
- JSDoc provides type safety without TypeScript complexity
- Easier to demonstrate core JavaScript skills

### Responsive Design
- Mobile-first approach ensures compatibility across devices
- Flexible layouts with Flexbox
- Media queries for device-specific optimizations

### Performance Optimizations
- Minimal DOM manipulation
- Debounced navigation events
- Lazy loading for images

---

### Separation of Concerns
- Markdown parsing logic isolated from presentation logic
- Content separate from styling
- Navigation functionality independent of content rendering

### Extensibility
- Modular code structure for easy feature additions
- Clear interfaces between components

---

## Challenges Faced

### Markdown Parsing Edge Cases
- Complex regex patterns for different markdown elements
- Preventing paragraph tags inside other elements

---

## Implementation Highlights

### Markdown Parser
- Custom regex-based parser for markdown elements
- Support for common markdown syntax
- Special handling for presentation-specific elements

### Navigation System
- Keyboard shortcuts with debouncing
- Touch controls for mobile
- UI buttons with proper state handling

### Editor Functionality
- In-place editing with markdown preview
- Save changes workflow

---

## Future Features

### Immediate Next Steps
- More comprehensive markdown support
- Slide transitions and animations

### Long-term Roadmap
- Extensive browser Compatility

---

## Takeaways

### Technical Learnings
- Regex optimization for markdown parsing
- Event handling best practices
- Efficient state management in vanilla JS

### Project Approach
- Value of progressive enhancement

### Skills Demonstrated
- Clean architecture without frameworks
- Modern JavaScript techniques
- Responsive design implementation

---

## Final Thoughts

Building Presently reminded me that simplicity is often better than complexity. Modern browsers now support features that previously required heavy libraries - why add dependencies when you don't need them?

Sometimes the best solution is the simplest one.

*Note: This presentation was created using Presently itself!*
