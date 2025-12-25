/**
 * Mayank Joshi Portfolio - JavaScript
 * Handles theme toggle, mobile menu, and smooth interactions
 */

// ============================================================================
// Theme Management
// ============================================================================

const THEME_KEY = 'portfolio-theme';

/**
 * Initialize theme from localStorage or default to dark
 */
function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const theme = savedTheme || 'dark';
    setTheme(theme);
}

/**
 * Set the theme and update UI
 * @param {string} theme - 'dark' or 'light'
 */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcon(theme);
}

/**
 * Toggle between dark and light themes
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

/**
 * Update the theme toggle icon
 * @param {string} theme - Current theme
 */
function updateThemeIcon(theme) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    if (sunIcon && moonIcon) {
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
}

// ============================================================================
// Mobile Navigation
// ============================================================================

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.getElementById('mobileMenuToggle');

    if (navLinks && menuToggle) {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    }
}

/**
 * Close mobile menu when a link is clicked
 */
function closeMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.getElementById('mobileMenuToggle');

    if (navLinks && menuToggle) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    }
}

// ============================================================================
// Smooth Scroll
// ============================================================================

/**
 * Handle smooth scrolling for anchor links
 * @param {Event} e - Click event
 */
function handleAnchorClick(e) {
    const href = e.currentTarget.getAttribute('href');

    if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            closeMobileMenu();
        }
    }
}

// ============================================================================
// Scroll Effects
// ============================================================================

/**
 * Add/remove navbar background on scroll
 */
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar-inner');

    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }
}

// ============================================================================
// Intersection Observer for Animations
// ============================================================================

/**
 * Set up intersection observer for fade-in animations
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections and cards
    const animatedElements = document.querySelectorAll('.project-card, .blog-card, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================================================
// Draggable Photo
// ============================================================================

/**
 * Make the hero photo draggable
 */
function setupDraggablePhoto() {
    const photo = document.querySelector('.hero-center');
    const heroContainer = document.querySelector('.hero-container');

    if (!photo || !heroContainer) return;

    let isDragging = false;
    let startX, startY;
    let initialX, initialY;
    let currentX = 0;
    let currentY = 0;

    // Position photo absolutely for free movement
    photo.style.position = 'absolute';
    photo.style.cursor = 'grab';
    photo.style.userSelect = 'none';
    photo.style.zIndex = '10';

    // Get initial center position
    const resetToCenter = () => {
        const containerRect = heroContainer.getBoundingClientRect();
        const photoRect = photo.getBoundingClientRect();
        currentX = (containerRect.width - photoRect.width) / 2;
        currentY = (containerRect.height - photoRect.height) / 2;
        updatePosition();
    };

    const updatePosition = () => {
        photo.style.left = `${currentX}px`;
        photo.style.top = `${currentY}px`;
        photo.style.transform = 'none'; // Remove the center transform
    };

    const onDragStart = (e) => {
        isDragging = true;
        photo.style.cursor = 'grabbing';
        photo.style.transition = 'none';

        // Get starting position
        if (e.type === 'mousedown') {
            startX = e.clientX;
            startY = e.clientY;
        } else if (e.type === 'touchstart') {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }

        initialX = currentX;
        initialY = currentY;

        // Add slight rotation while dragging
        photo.querySelector('.hero-image-container').style.transform = 'rotate(-2deg) scale(1.02)';
    };

    const onDragMove = (e) => {
        if (!isDragging) return;

        e.preventDefault();

        let clientX, clientY;
        if (e.type === 'mousemove') {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        currentX = initialX + deltaX;
        currentY = initialY + deltaY;

        // Constrain to hero container
        const containerRect = heroContainer.getBoundingClientRect();
        const photoRect = photo.getBoundingClientRect();
        const navHeight = 70; // Navbar height

        // Horizontal bounds
        currentX = Math.max(0, Math.min(currentX, containerRect.width - photoRect.width));
        // Vertical bounds (account for navbar)
        currentY = Math.max(navHeight, Math.min(currentY, containerRect.height - photoRect.height));

        updatePosition();
    };

    const onDragEnd = () => {
        if (!isDragging) return;
        isDragging = false;

        photo.style.cursor = 'grab';
        photo.style.transition = 'transform 0.3s ease';

        // Reset rotation
        photo.querySelector('.hero-image-container').style.transform = 'rotate(3deg)';
    };

    // Mouse events
    photo.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);

    // Touch events for mobile
    photo.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);

    // Prevent default drag behavior
    photo.addEventListener('dragstart', (e) => e.preventDefault());

    // Initialize position
    // Small delay to ensure layout is complete
    setTimeout(resetToCenter, 100);

    // Recalculate on resize
    window.addEventListener('resize', resetToCenter);
}

// ============================================================================
// Event Listeners
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Smooth scroll for all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', handleAnchorClick);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const navLinks = document.getElementById('navLinks');
        const mobileToggle = document.getElementById('mobileMenuToggle');

        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);

    // Setup scroll animations
    setupScrollAnimations();

    // Setup draggable photo
    setupDraggablePhoto();
});

// ============================================================================
// Keyboard Navigation
// ============================================================================

document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// ============================================================================
// Console Easter Egg
// ============================================================================

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   👋 Hey there, fellow developer!                         ║
║                                                           ║
║   Thanks for checking out my portfolio.                   ║
║   Feel free to reach out if you want to collaborate!      ║
║                                                           ║
║   - Mayank J0shi                                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);
