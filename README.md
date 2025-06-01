# resume-builder
# Professional Resume Builder

A modern, responsive web application for creating and customizing professional resumes with real-time preview.

## Features

- **Real-time Preview**: See changes instantly as you fill out the form
- **Multiple Templates**: Choose from Classic, Modern, and Minimalist designs
- **Customization Options**:
  - Color picker for accent colors
  - Font selection (including Google Fonts)
  - Dark/Light theme toggle
- **Dynamic Fields**: Add/remove experience, education, projects, certifications, and languages
- **Progress Tracking**: Visual indicator of resume completion status
- **Local Storage**: Automatically saves your work in the browser
- **Print/Download**: Generate a printer-friendly version of your resume
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. Fill in your personal information (name, email, phone)
2. Add your professional summary and skills
3. Include work experience, education, projects, certifications, and languages
4. Customize the appearance:
   - Select a template (Classic, Modern, Minimalist)
   - Choose an accent color
   - Pick a font
   - Toggle between dark/light mode
5. Click "Download/Print" to generate your resume
6. Use "Clear All" to start over (if needed)

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **Storage**: Browser localStorage for persistent data
- **Printing**: Generates a print-optimized version with proper styling
- **Responsive**: Media queries for mobile-friendly layout
- **Accessibility**: Semantic HTML and ARIA labels

## Installation

No installation required! Simply open `index.html` in any modern web browser.

For development:
1. Clone this repository
2. Open the project folder
3. Launch `index.html` in your browser

## Customization

To add more templates:
1. Add new template options to the `<select id="templateSelect">` in index.html
2. Add corresponding CSS styles in style.css under `[data-template="your-template-name"]`
3. Add print styles in script.js in the `getTemplatePrintStyles()` function

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.

## License

This project is open source and available under the [MIT License](LICENSE).
