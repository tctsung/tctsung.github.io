// Mobile menu functionality
function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
}

// Contact form validation
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Basic validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                // If validation passes, you would typically send the form data to a server
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
}

// Rotating titles animation
function setupRotatingTitles() {
    const titles = document.querySelectorAll('.rotating-titles .title');
    if (titles.length > 0) {
        let currentIndex = 0;
        
        // Show the first title
        titles[0].classList.add('visible');
        
        // Setup the rotation interval
        setInterval(() => {
            // Hide current title
            titles[currentIndex].classList.remove('visible');
            
            // Update index to next title (loop back to 0 if at the end)
            currentIndex = (currentIndex + 1) % titles.length;
            
            // Show next title
            titles[currentIndex].classList.add('visible');
        }, 3000); // Change every 3 seconds
    }
}

// Vlog filtering functionality
function setupVlogFilters() {
    const vlogCards = document.querySelectorAll('.vlog-card');
    const filterTags = document.querySelectorAll('.filter-tag');
    const searchInput = document.getElementById('vlog-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (vlogCards.length > 0 && filterTags.length > 0) {
        // Tag filtering
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                // Update active class
                filterTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                
                const selectedTag = tag.getAttribute('data-tag');
                
                // Filter vlog cards
                vlogCards.forEach(card => {
                    if (selectedTag === 'all') {
                        card.style.display = 'block';
                    } else {
                        const cardTags = card.getAttribute('data-tags').split(',');
                        if (cardTags.includes(selectedTag)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
        
        // Search functionality
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                const searchTerm = searchInput.value.toLowerCase();
                
                vlogCards.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const tags = card.getAttribute('data-tags').toLowerCase();
                    
                    if (title.includes(searchTerm) || tags.includes(searchTerm)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Reset active tag
                filterTags.forEach(t => t.classList.remove('active'));
                document.querySelector('[data-tag="all"]').classList.add('active');
            });
        }
    }
}

// Add scroll event to highlight active links
function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a');
    
    if (sections.length > 0 && navLinks.length > 0) {
        const scrollPosition = window.scrollY + 200; // Adjust for better highlight timing
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Language settings management
function setupLanguagePopup() {
    const selectedLanguage = localStorage.getItem('preferredLanguage');
    
    // Only show the pop-up if no language preference is stored
    if (!selectedLanguage) {
        showLanguagePopup();
    } else {
        // Ensure the user is on the correct language version of the page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (selectedLanguage === 'zh-TW' && !currentPage.includes('-tw')) {
            redirectToLanguagePage(currentPage, 'zh-TW');
        } else if (selectedLanguage === 'en' && currentPage.includes('-tw')) {
            redirectToLanguagePage(currentPage, 'en');
        }
    }

    // Add event listeners for language switch links
    document.querySelectorAll('.lang-switch a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('href');
            const lang = targetPage.includes('-tw') ? 'zh-TW' : 'en';
            // Store the language preference before redirecting
            localStorage.setItem('preferredLanguage', lang);
            window.location.href = targetPage;
        });
    });
}

// Show language selection popup
function showLanguagePopup() {
    // Remove any existing pop-up to prevent duplicates
    const existingPopup = document.querySelector('.language-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.className = 'language-popup';
    popup.innerHTML = `
        <div class="language-popup-content">
            <h2>Language / 語言</h2>
            <p>Please select your preferred language to continue.</p>
            <ul>
                <li><a href="#" data-lang="en">English</a></li>
                <li><a href="#" data-lang="zh-TW">繁體中文</a></li>
            </ul>
        </div>
    `;
    
    // Add event listeners for language selection
    popup.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            // Store the selected language in localStorage
            localStorage.setItem('preferredLanguage', lang);
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            // Remove the pop-up before redirecting
            popup.remove();
            redirectToLanguagePage(currentPage, lang);
        });
    });
    
    // Append popup and trigger fade-in
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.classList.add('visible');
    }, 10); // Small delay ensures transition works
}

// Redirect to appropriate language page
function redirectToLanguagePage(currentPage, lang) {
    let newPage;
    
    // Default to index if no page is specified
    if (!currentPage || currentPage === '') {
        currentPage = 'index.html';
    }
    
    // Handle special case for root URL
    if (currentPage === '/' || currentPage === 'index.html') {
        newPage = lang === 'zh-TW' ? 'index-tw.html' : 'index.html';
    } else if (lang === 'zh-TW') {
        // If current page doesn't have -tw, add it (for English to Chinese)
        newPage = currentPage.includes('-tw') ? currentPage : currentPage.replace('.html', '-tw.html');
    } else {
        // If current page has -tw, remove it (for Chinese to English)
        newPage = currentPage.includes('-tw') ? currentPage.replace('-tw.html', '.html') : currentPage;
    }
    
    window.location.href = newPage;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupRotatingTitles();
    setupVlogFilters();
    setupContactForm();
    highlightActiveLink();
    setupLanguagePopup();
});

// Add scroll event to highlight active links
window.addEventListener('scroll', highlightActiveLink);