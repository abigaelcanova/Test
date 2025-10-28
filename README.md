# Visitor Registration System

A modern, user-friendly visitor registration web application with a clean interface and multi-step form process.

## Features

- **Multi-step Registration Process**: Guide visitors through a 3-step registration workflow
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Form Validation**: Built-in validation for required fields
- **Interactive UI**: Smooth transitions and visual feedback
- **Date/Time Selection**: Easy-to-use date and time pickers
- **Hosting Options**: Choose between self-hosting or someone else hosting

## Project Structure

```
Test/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles and layout
├── js/
│   └── main.js         # Application logic and functionality
└── README.md           # Project documentation
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox, transitions, and custom properties
- **Vanilla JavaScript**: No frameworks or libraries required

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (optional, but recommended)

### Installation

1. Clone or download this repository
2. Navigate to the project directory

### Running the Application

#### Option 1: Using Python's built-in server (Recommended)

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser and navigate to `http://localhost:8000`

#### Option 2: Using Node.js http-server

```bash
npx http-server -p 8000
```

Then open your browser and navigate to `http://localhost:8000`

#### Option 3: Direct File Opening

Simply open `index.html` in your web browser. Note: Some features may not work correctly without a local server.

## Usage

1. Click the "Add new visitor" button to open the registration modal
2. **Step 1**: Fill in visitor information including:
   - Email (optional)
   - First name (required)
   - Last name (required)
   - Phone number (optional)
   - Check-in preference
   - Notes for the visitor
3. **Step 2**: Select who is hosting the visitor:
   - "I am" - Automatically proceeds to step 3
   - "Someone else" - Additional fields for host details, building, floor, and suite
4. **Step 3**: Set visit date and time:
   - Visit date (required)
   - Start time (optional)
   - End time (optional)
   - Number of entries (required)
5. Click "Submit Visitor Request" to complete the registration

## Features in Detail

### Navigation
- Toggle between "Upcoming" and "Past" visitor views
- Visual indicators for active navigation items

### Modal System
- Step-by-step progress indicator
- Back button for easy navigation
- Close button or click outside to dismiss
- Form data persists when navigating between steps

### Form Elements
- Clear buttons for quick input field clearing
- Country selector for phone numbers
- Custom date picker with formatted display
- Dropdown selectors for floors, suites, and times
- Toggle buttons for check-in options

### User Experience
- Smooth transitions and hover effects
- Visual feedback for selected options
- Progress bar showing current step
- Disabled inputs for read-only fields
- Responsive layout adapting to screen sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Backend integration for data persistence
- Email notifications
- Visitor badge generation
- Visitor history tracking
- Search and filter functionality
- Export visitor data to CSV
- Calendar integration
- Multi-language support

## Development

### File Structure

- **index.html**: Contains the semantic HTML structure and all UI elements
- **css/styles.css**: Organized CSS with clear sections for each component
- **js/main.js**: Modular JavaScript with separated concerns:
  - Navigation handling
  - Modal management
  - Form validation
  - Step navigation
  - Date/time formatting

### Best Practices Implemented

- Separation of concerns (HTML, CSS, JS)
- Semantic HTML elements
- Accessible form labels
- Progressive enhancement
- Mobile-first responsive design
- Clean, maintainable code structure
- Commented code sections
- Consistent naming conventions

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available for educational and commercial use.

