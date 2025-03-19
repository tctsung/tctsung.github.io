// DOM Elements (keep your existing elements)
const header = document.querySelector('.header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');
const sections = document.querySelectorAll('.section');

// Add this new code for rotating titles
function setupRotatingTitles() {
    const titles = document.querySelectorAll('.rotating-titles .title');
    if (!titles.length) return;
    
    let currentIndex = 0;
    
    // Set first title as visible initially
    titles[0].classList.add('visible');
    
    // Function to rotate titles
    function rotateTitles() {
        // Remove visible class from current title
        titles[currentIndex].classList.remove('visible');
        
        // Move to next title or back to first
        currentIndex = (currentIndex + 1) % titles.length;
        
        // Add visible class to new current title
        titles[currentIndex].classList.add('visible');
    }
    
    // Set interval for rotation (every 3 seconds)
    setInterval(rotateTitles, 3000);
}

// Mobile Menu Toggle (keep your existing code)
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    nav.classList.toggle('active');
});

// Close mobile menu when a link is clicked (keep your existing code)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        nav.classList.remove('active');
    });
});

// Active link highlighting based on scroll position (keep your existing code)
function highlightActiveLink() {
    let scrollPosition = window.scrollY;
    
    // Loop through sections to find current position
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current section link
            const activeLink = document.querySelector(`.nav a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Add scroll event to highlight active links (keep your existing code)
window.addEventListener('scroll', highlightActiveLink);

// Initialize on page load (add setupRotatingTitles to your existing code)
document.addEventListener('DOMContentLoaded', () => {
    highlightActiveLink();
    setupRotatingTitles(); // Add this line
    
    // Smooth scroll for anchor links (complete your truncated code)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Vlog filtering functionality
    const searchInput = document.getElementById('vlog-search');
    const searchBtn = document.getElementById('search-btn');
    const filterTags = document.querySelectorAll('.filter-tag');
    const vlogCards = document.querySelectorAll('.vlog-card');

    // Function to filter vlogs based on search and active tag
    function filterVlogs() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeTag = document.querySelector('.filter-tag.active').getAttribute('data-tag');

        vlogCards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            const tags = card.getAttribute('data-tags').split(',').map(tag => tag.toLowerCase());
            
            // Filter by search term
            const matchesSearch = searchTerm === '' || title.includes(searchTerm);
            
            // Filter by tag
            const matchesTag = activeTag === 'all' || tags.includes(activeTag.toLowerCase());
            
            // Show or hide based on both conditions
            if (matchesSearch && matchesTag) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // Add event listeners
    if (searchInput && searchBtn) {
        // Search functionality
        searchInput.addEventListener('input', filterVlogs);
        searchBtn.addEventListener('click', filterVlogs);

        // Tag filtering
        filterTags.forEach(tag => {
            tag.addEventListener('click', function() {
                // Update active tag
                document.querySelector('.filter-tag.active').classList.remove('active');
                this.classList.add('active');
                
                // Apply filters
                filterVlogs();
            });
        });
    }
});
