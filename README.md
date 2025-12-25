# Portfolio Website

A personal portfolio website for Mayank Joshi showcasing ML development projects, blog posts, and professional experience.

## 🚀 Publishing to GitHub Pages

This repository is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Build and deployment", set:
     - Source: **GitHub Actions**

2. **Deployment:**
   - The site will automatically deploy when you push to the `main` branch
   - You can also manually trigger deployment from the "Actions" tab

3. **Access Your Site:**
   - Once deployed, your site will be available at: `https://lothnic.github.io/portfolio/`
   - If you want this to be your main user page (`https://lothnic.github.io`), rename this repository to `lothnic.github.io`

### Manual Deployment

You can manually trigger a deployment by:
1. Going to the "Actions" tab in your repository
2. Selecting "Deploy to GitHub Pages" workflow
3. Clicking "Run workflow"

## 📁 Project Structure

```
.
├── index.html          # Main portfolio page
├── styles.css          # Styles
├── script.js           # JavaScript functionality
├── blog/               # Blog section
├── images/             # Image assets
├── resume/             # Resume files
└── resume.pdf          # PDF resume
```

## 🛠️ Local Development

Since this is a static HTML site, you can simply open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## 📝 License

This is a personal portfolio project.
