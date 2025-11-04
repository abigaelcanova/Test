# Visitor Registration System

A modern, mobile-first visitor registration web application built with React, Tailwind CSS, and shadcn/ui. Features a clean, responsive interface with a multi-step registration workflow.

## 🎨 Features

- **Mobile-First Responsive Design**: Seamlessly adapts from 360px to large desktop screens
- **Multi-Step Registration Process**: Guided 3-step workflow for visitor registration
- **Dual View Modes**: 
  - Mobile: Card-based list with floating action button
  - Desktop: Table view with vertical navigation
- **Status Management**: Visual badges for visitor status (confirmed, checked-in, cancelled, etc.)
- **Dark Mode Support**: Full dark mode implementation with class-based toggle
- **Accessibility**: WCAG compliant with keyboard navigation and ARIA labels
- **Modern UI Components**: Built with shadcn/ui (Radix UI primitives)

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful icon library

## 📱 Responsive Breakpoints

```js
{
  sm: '360px',   // Small phones
  md: '768px',   // Tablets / desktop transition
  lg: '1024px',  // Large desktop
  xl: '1280px',  // Extra large screens
}
```

## 📦 Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Usage

### Adding a Visitor

1. **Mobile**: Tap the floating "+" button (bottom-right)
   **Desktop**: Click "Add new visitor" button (top-right)

2. **Step 1 - Visitor Information**
   - Enter visitor email (optional)
   - First name (required)
   - Last name (required)
   - Phone number (optional)
   - Select check-in preference
   - Add notes for visitor
   - Option to add multiple visitors

3. **Step 2 - Who is Hosting**
   - Choose "I am" for self-hosting (auto-proceeds)
   - Choose "Someone else" to specify host details:
     - Host name
     - Floor
     - Suite

4. **Step 3 - Visit Date and Time**
   - Select visit date (required)
   - Toggle recurring visit (optional)
   - Set start and end times (optional)
   - Select number of entries (required)

5. **Confirmation**: View confirmation with visit details

### Navigation

- **Upcoming Tab**: View scheduled future visits
- **Past Tab**: View completed or cancelled visits
- Tabs appear horizontally on mobile, vertically on desktop

## 🎨 Design System

### Color Tokens

The app uses HSL-based CSS variables for theming:
- `--primary` - Primary brand color
- `--secondary` - Secondary accents
- `--destructive` - Error/delete actions
- `--muted` - Subtle backgrounds
- `--accent` - Highlights

### Component Variants

**Buttons**
- `default` - Primary actions
- `outline` - Secondary actions
- `ghost` - Tertiary actions
- `destructive` - Delete/cancel actions

**Badges**
- `default` - Confirmed status
- `secondary` - Invited status
- `success` - Checked-in status
- `destructive` - Cancelled status
- `warning` - Late status

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/                      # shadcn/ui base components
│   │   ├── button.jsx
│   │   ├── badge.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── select.jsx
│   │   ├── tabs.jsx
│   │   └── ...
│   ├── modal-steps/             # Multi-step form components
│   │   ├── Step1VisitorInfo.jsx
│   │   ├── Step2WhoHosting.jsx
│   │   └── Step3DateTime.jsx
│   ├── VisitorCard.jsx          # Mobile visitor card
│   ├── VisitorTable.jsx         # Desktop visitor table
│   ├── VisitorModal.jsx         # Main registration modal
│   ├── ConfirmationModal.jsx    # Success confirmation
│   ├── EmptyState.jsx           # No visitors state
│   └── LoadingSkeleton.jsx      # Loading state
├── lib/
│   └── utils.js                 # Utility functions
├── App.jsx                      # Main app component
├── main.jsx                     # React entry point
└── index.css                    # Global styles
```

## 🧪 Testing

All components include `data-testid` attributes for testing:

```jsx
// Navigation
cy.get('[data-testid="tab-upcoming"]').click()
cy.get('[data-testid="tab-past"]').click()

// Add visitor flow
cy.get('[data-testid="add-visitor-fab"]').click()
cy.get('[data-testid="visitor-firstname"]').type('John')
cy.get('[data-testid="visitor-lastname"]').type('Doe')

// Visitor display
cy.get('[data-testid="visitor-card"]').should('be.visible')
cy.get('[data-testid="visitor-name"]').contains('John Doe')
cy.get('[data-testid="visitor-status"]').contains('confirmed')
```

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Esc, Arrow keys)
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators and focus trapping in modals
- **Reduced Motion**: Respects `prefers-reduced-motion` user preference
- **Color Contrast**: WCAG AA compliant contrast ratios

## 🌙 Dark Mode

To enable dark mode, add the `dark` class to the `<html>` element:

```js
// Toggle dark mode
document.documentElement.classList.toggle('dark')
```

All components automatically adapt to dark mode using CSS variables.

## 📝 Migration Notes

This is a refactored version of the original vanilla JS application. See [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) for detailed migration information.

### Key Improvements

✅ Mobile-first responsive design (360px+)
✅ Modern React component architecture
✅ Tailwind CSS utility classes
✅ Accessible shadcn/ui components
✅ Dark mode support
✅ Enhanced keyboard navigation
✅ Better form validation
✅ Loading states and skeletons
✅ All original functionality preserved

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] Email notifications
- [ ] Real-time visitor tracking
- [ ] Search and filter functionality
- [ ] Bulk visitor upload (CSV)
- [ ] Calendar integration
- [ ] Multi-language support
- [ ] Visitor badge generation
- [ ] QR code check-in

## 📄 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📚 Documentation

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Radix UI Documentation](https://www.radix-ui.com)

---

**Built with ❤️ using modern web technologies**
