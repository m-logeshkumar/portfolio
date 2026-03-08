# Portfolio

Professional React portfolio for a software developer with editable content management system.

## Features

- 🎨 Modern design with Navy/Gray theme and Cyan accents
- 🔐 Static login system (username: `admin` / password: `portfolio123`)
- ✏️ Edit mode - Update projects, skills, and experience in real-time
- 💾 LocalStorage persistence - All changes are saved automatically
- 📱 Fully responsive design
- ⚡ Built with React 18 + Vite for blazing fast performance
- 🎭 Smooth animations using Framer Motion
- 🎨 Beautiful UI with Ant Design 5 + Tailwind CSS

## Tech Stack

- **Frontend**: React 18, Vite
- **UI Libraries**: Ant Design 5, Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React, Ant Design Icons
- **Forms**: React Hook Form

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to view your portfolio.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
portfolio/
├── src/
│   ├── components/         # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── LoginModal.jsx
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Experience.jsx
│   │   └── Dashboard.jsx
│   ├── store/            # Zustand state management
│   │   ├── portfolioStore.js
│   │   └── authStore.js
│   ├── data/             # Portfolio data
│   │   └── portfolio.json
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Customization

### Styling

- **Colors**: Edit `tailwind.config.js` to change the color scheme
- **Theme**: Modify `App.jsx` ConfigProvider to customize Ant Design theme
- **Custom CSS**: Add styles to `src/App.css`

## Pages

1. **Home** (`/`) - Hero section with stats and tech stack showcase
2. **About** (`/about`) - Developer journey timeline
3. **Skills** (`/skills`) - Categorized skills with proficiency levels
4. **Projects** (`/projects`) - Filterable project showcase with detailed case studies
5. **Experience** (`/experience`) - Professional experience timeline
6. **Dashboard** (`/dashboard`) - Edit mode dashboard with quick actions

## Features by Page

### Home
- Hero section with name and title
- Stats cards (Projects, Tech Stack, Years Experience)
- Tech stack carousel with hover effects
- Call-to-action buttons

### About
- Developer introduction
- Vertical timeline of career milestones
- Contact information
- Location details

### Skills
- 3-column categorized grid
  - Web Development
  - Languages
  - Specialized (MERN Stack, Machine Learning)
- Progress bars showing proficiency
- Edit mode: Add/remove skills, adjust levels with sliders

### Projects
- Filter by: All, Featured, Full Stack, MERN, ML, Recent
- Project cards with:
  - Thumbnail images
  - Impact metrics
  - Technology tags
  - GitHub and Live Demo links
  - Case study modal
- Edit mode: Full CRUD operations

### Experience
- Timeline format with company logos
- Role, company, dates
- Achievement bullets
- Edit mode: Add/edit/delete experience entries

### Dashboard
- Statistics overview
- Quick action buttons
- Data structure preview
- Reset to defaults option

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

### Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Or connect your GitHub repo for auto-deployment

### GitHub Pages

```bash
npm run build
# Push the dist folder to gh-pages branch
```

## LocalStorage Data

All edits are stored in localStorage under the key `portfolio_data`. To reset:
- Use the "Reset to Defaults" button in Dashboard
- Or clear browser localStorage manually

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Feel free to use this template for your own portfolio!

## Author

Built with ❤️ using React, Vite, Ant Design, and Tailwind CSS

---

