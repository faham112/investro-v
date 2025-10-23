# Design Guidelines: Minimal "Hi" Website

## User Requirements
**Critical Constraint:** No CSS styling whatsoever - pure HTML only

## Design Approach
**Selected Approach:** Absolute Minimal HTML
The user has explicitly requested no styling, so this project uses raw browser defaults exclusively.

## Implementation Specifications

### HTML Structure
- Single `index.html` file
- Basic HTML5 doctype and structure
- Text content: "hi"
- No `<style>` tags
- No inline styles
- No CSS classes or IDs
- No external stylesheets

### Browser Defaults
All visual presentation relies on browser's native rendering:
- Default serif font (typically Times New Roman)
- Default black text on white background
- Default font size (typically 16px)
- Default margins and padding
- No custom colors, spacing, or typography

### Content Presentation
- Plain text "hi" displayed in the body
- No containers, divs, or semantic HTML beyond basic structure
- Simplest possible valid HTML5 document

## Rationale
This design honors the user's explicit request for zero styling, creating the absolute minimum viable HTML page that displays the requested text.