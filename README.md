# Meliotech Product Image Carousel

A modern, feature-rich React application for managing and showcasing product images with a beautiful UI and smooth user experience.

## 🌟 Features

- **Image Upload & Management**
  - Drag and drop interface
  - Multiple file upload support
  - File type validation (JPG, PNG, GIF)
  - File size limit (10MB per image)
  - Real-time upload progress indicator

- **Image Gallery**
  - Grid view with responsive layout
  - Image filtering by type
  - Sorting options (by date, name, size)
  - Image metadata display
  - Quick actions (view, download, share, delete)

- **Carousel Mode**
  - Smooth transitions between images
  - Thumbnail navigation
  - Auto-play functionality
  - Touch-friendly controls
  - Keyboard navigation support

- **Fullscreen View**
  - High-resolution image display
  - Image information overlay
  - Quick action buttons
  - Smooth animations

- **UI/UX Features**
  - Dark/Light mode support
  - Responsive design
  - Beautiful animations
  - Loading states
  - Toast notifications
  - Accessibility features

## 🛠️ Tech Stack

- **Frontend Framework**
  - React 19
  - Framer Motion (animations)
  - Tailwind CSS (styling)
  - React Slick (carousel)

- **UI Components & Icons**
  - Lucide React (icons)
  - React Toastify (notifications)

- **Development Tools**
  - Create React App
  - PostCSS
  - Autoprefixer

## 🚀 Deployment

The application is deployed on Vercel:
[View Live Demo](https://interview-project-virid-two.vercel.app/)

## 📁 Project Structure

```
src/
├── components/
│   ├── App.js                 # Main application component
│   └── ProductImageCarousel.js # Core carousel component
├── styles/
│   ├── index.css             # Global styles
│   └── App.css               # App-specific styles
├── utils/                    # Utility functions
└── assets/                   # Static assets
```

## 🔧 Key Components

### ProductImageCarousel
- Handles image upload and management
- Implements drag and drop functionality
- Manages image state and metadata
- Provides filtering and sorting capabilities
- Implements carousel and fullscreen views

### App
- Manages application-wide state
- Implements dark/light mode
- Handles responsive navigation
- Provides layout structure

## 🎨 Styling

- Uses Tailwind CSS for utility-first styling
- Custom animations with Framer Motion
- Responsive design with mobile-first approach
- Dark mode support with CSS variables
- Custom color scheme and typography

## 🔍 Known Issues & Limitations

1. **Image Size**
   - Maximum file size limited to 10MB per image
   - Large images may affect performance

2. **Browser Support**
   - Web Share API not supported in all browsers
   - Falls back to clipboard copy when sharing is not available

3. **Memory Management**
   - Large number of images may impact performance
   - Object URLs are properly cleaned up on component unmount

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/BakangMonei/interview-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Slick](https://react-slick.neostack.com/)
- [Lucide Icons](https://lucide.dev/)
