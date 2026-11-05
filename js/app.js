// Team Coco App - Main Application Logic
import { videoService, formatVideoDate, getEmbedUrl, getDeepLink } from './video-service.js';
import { showsService } from './shows-service.js';
import { merchService } from './merch-service.js';

let currentPage = 'home';
let currentTab = 'discussions';
let currentTourFilter = 'upcoming';

async function initApp() {
    initSplashScreen();
    setupNavigation();
    setupEventListeners();
    renderVideosPage();
    await renderShowsPage();
    renderMerchPage();
    renderCommunityPage();
    renderTeamPage();
    // renderSponsorBanner();  // Hidden
    await renderLatestVideo();
    showToast('Welcome to Team Coco!');
}

function initSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    if (!splashScreen) return;
    
    // Show splash for 3 seconds, then fade out
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        
        // Remove from DOM after transition
        setTimeout(() => {
            splashScreen.remove();
        }, 800);
    }, 3000);
}

function setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const logoLink = document.querySelector('.logo');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.getAttribute('data-page');
            switchPage(page);
            
            navBtns.forEach(b => {
                b.classList.remove('active');
                b.removeAttribute('aria-current');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'page');
        });
    });
    
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage('home');
            
            navBtns.forEach(b => {
                b.classList.remove('active');
                b.removeAttribute('aria-current');
            });
            document.querySelector('.nav-btn[data-page="home"]').classList.add('active');
            document.querySelector('.nav-btn[data-page="home"]').setAttribute('aria-current', 'page');
        });
    }
}

function switchPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Render page content when navigating
        if (pageName === 'videos') {
            renderVideosPage();
        } else if (pageName === 'shows') {
            renderShowsPage();
        } else if (pageName === 'merch') {
            renderMerchPage();
        } else if (pageName === 'community') {
            renderCommunityPage();
        } else if (pageName === 'team') {
            renderTeamPage();
        }
    }
}

function setupEventListeners() {
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input[type="email"]');
            if (input.value) {
                showToast('Thanks for subscribing to Team Coco updates!');
                input.value = '';
            }
        });
    }
    
    // Video modal
    document.addEventListener('click', (e) => {
        // Play video buttons
        if (e.target.closest('[data-action="play-video"]')) {
            const btn = e.target.closest('[data-action="play-video"]');
            const videoId = btn.getAttribute('data-video-id');
            openVideoModal(videoId);
        }
        
        // Close modal
        if (e.target.closest('[data-action="close-modal"]')) {
            closeVideoModal();
        }
        
        // Section header buttons
        if (e.target.closest('.section-header .btn-link')) {
            const btn = e.target.closest('.section-header .btn-link');
            const page = btn.getAttribute('data-page');
            if (page) {
                switchPage(page);
                document.querySelectorAll('.nav-btn').forEach(nb => {
                    nb.classList.remove('active');
                    nb.removeAttribute('aria-current');
                });
                const targetBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);
                if (targetBtn) {
                    targetBtn.classList.add('active');
                    targetBtn.setAttribute('aria-current', 'page');
                }
            }
        }
    });
    
    // Show filters
    const showFilterBtns = document.querySelectorAll('.show-filters .filter-chip');
    showFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTourFilter = btn.getAttribute('data-filter');
            renderShowsPage();
        });
    });
    
    // Community tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.getAttribute('data-tab');
            
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById(`tab-${currentTab}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    
    // New post
    const postBtn = document.getElementById('post-btn');
    const postTextarea = document.querySelector('#new-post-form textarea');
    const charCount = document.getElementById('char-count');
    
    if (postTextarea) {
        postTextarea.addEventListener('input', () => {
            if (charCount) {
                charCount.textContent = postTextarea.value.length;
            }
            if (postBtn) {
                postBtn.disabled = postTextarea.value.trim().length === 0 || postTextarea.value.length > 500;
            }
        });
    }
    
    if (postBtn) {
        postBtn.addEventListener('click', () => {
            if (postTextarea && postTextarea.value.trim()) {
                const newPost = {
                    id: Date.now().toString(),
                    author: 'You',
                    avatar: 'YOU',
                    content: postTextarea.value.trim(),
                    time: 'Just now',
                    likes: 0
                };
                mockPosts.unshift(newPost);
                renderCommunityPage();
                postTextarea.value = '';
                if (charCount) charCount.textContent = '0';
                postBtn.disabled = true;
                showToast('Post created!');
            }
        });
    }
    
    // Video filters
    const videoCategory = document.getElementById('video-category');
    const videoSort = document.getElementById('video-sort');
    if (videoCategory) {
        videoCategory.addEventListener('change', renderVideosPage);
    }
    if (videoSort) {
        videoSort.addEventListener('change', renderVideosPage);
    }
    
    // Merch filters
    // const merchCategory = document.getElementById('merch-category');
    // if (merchCategory) {
    //     merchCategory.addEventListener('change', renderMerchPage);
    // }
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });
}

// Render latest video on homepage from YouTube RSS
async function renderLatestVideo() {
    const container = document.querySelector('.home-clip-thumbnail');
    const labelEl = document.querySelector('.home-clip-label');
    
    console.log('[App] renderLatestVideo called, container:', container);
    
    if (!container) {
        console.error('[App] No .home-clip-thumbnail container found');
        return;
    }
    
    // Show loading state
    container.innerHTML = `
        <div class="video-loading" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--gray-500);gap:0.75rem;">
            <svg class="spinner" viewBox="0 0 24 24" style="width:32px;height:32px;animation:spin 1s linear infinite;" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="var(--primary-color)" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round"/>
            </svg>
            <span>Loading latest video...</span>
        </div>
    `;

    // Add spinner animation if not exists
    if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
    }
    
    try {
        const video = await videoService.getLatestVideo();
        console.log('[App] renderLatestVideo got video:', video);
        
        if (video.error) {
            console.warn('[App] Video service returned error:', video);
            container.innerHTML = `
                <svg class="play-button" viewBox="0 0 64 64" aria-hidden="true">
                    <circle cx="32" cy="32" r="30" fill="rgba(255,107,0,0.9)"/>
                    <polygon points="24,18 24,46 46,32" fill="white"/>
                </svg>
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 16 9'%3E%3Crect fill='%23000' width='16' height='9'/%3E%3Ctext x='8' y='24.5' font-family='Arial Black' font-size='1.8' fill='%23FF6B00' text-anchor='middle'%3ECONAN%3C/text%3E%3Ctext x='8' y='26.5' font-family='Arial' font-size='0.9' fill='white' text-anchor='middle'%3ENEEDS A FRIEND%3C/text%3E%3C/svg%3E" alt="Latest clip">
            `;
            if (labelEl) labelEl.textContent = 'Latest Upload';
            return;
        }
        
        // Update label with published date
        if (labelEl && video.publishedAt) {
            labelEl.textContent = `Latest Upload • ${formatVideoDate(video.publishedAt)}`;
        }
        
        // Render: iframe for inline playback + visible "Watch on YouTube" button
        container.setAttribute('data-video-id', video.videoId);
        container.style.position = 'relative';
        container.innerHTML = `
            <iframe 
                src="${getEmbedUrl(video.videoId)}" 
                title="${escapeHtml(video.title)}"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen
                loading="lazy"
                style="width:100%;height:100%;border:none;border-radius:var(--border-radius-lg);">
            </iframe>
            <div class="video-watch-btn" style="position:absolute;bottom:1rem;right:1rem;z-index:10;">
                <a href="${getDeepLink(video.videoId)}" target="_blank" rel="noopener" 
                   class="btn btn-primary" style="padding:0.625rem 1.25rem;font-size:0.875rem;box-shadow:var(--shadow-lg);">
                    ▶ Watch on YouTube
                </a>
            </div>
        `;
        console.log('[App] Video rendered successfully');
    } catch (err) {
        console.error('[App] renderLatestVideo error:', err);
        container.innerHTML = `
            <svg class="play-button" viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="30" fill="rgba(255,107,0,0.9)"/>
                <polygon points="24,18 24,46 46,32" fill="white"/>
            </svg>
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 16 9'%3E%3Crect fill='%23000' width='16' height='9'/%3E%3Ctext x='8' y='24.5' font-family='Arial Black' font-size='1.8' fill='%23FF6B00' text-anchor='middle'%3ECONAN%3C/text%3E%3Ctext x='8' y='26.5' font-family='Arial' font-size='0.9' fill='white' text-anchor='middle'%3ENEEDS A FRIEND%3C/text%3E%3C/svg%3E" alt="Latest clip">
        `;
        if (labelEl) labelEl.textContent = 'Latest Upload';
    }
}

function renderVideosPage() {
    const videosGrid = document.getElementById('videos-grid');
    if (!videosGrid) return;
    
    videosGrid.innerHTML = '';
    
    const categoryFilter = document.getElementById('video-category')?.value || 'all';
    const sortBy = document.getElementById('video-sort')?.value || 'newest';
    
    let filteredVideos = [...mockVideos];
    
    if (categoryFilter !== 'all') {
        filteredVideos = filteredVideos.filter(v => v.category === categoryFilter);
    }
    
    if (sortBy === 'newest') {
        filteredVideos.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
        filteredVideos.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'popular') {
        filteredVideos.sort((a, b) => parseInt(b.views) - parseInt(a.views));
    }
    
    if (filteredVideos.length === 0) {
        videosGrid.innerHTML = '<p style="color: var(--gray-600); text-align: center; grid-column: 1/-1;">No videos found.</p>';
        return;
    }
    
    filteredVideos.forEach(video => {
        const videoCard = createVideoCard(video);
        videosGrid.appendChild(videoCard);
    });
}

async function renderShowsPage() {
    const showList = document.getElementById('show-list');
    if (!showList) return;
    
    showList.innerHTML = `
        <div class="video-loading" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;color:var(--gray-500);gap:0.75rem;">
            <svg class="spinner" viewBox="0 0 24 24" style="width:32px;height:32px;animation:spin 1s linear infinite;" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="var(--primary-color)" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round"/>
            </svg>
            <span>Loading upcoming shows...</span>
        </div>
    `;
    
    if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
    }
    
    try {
        const shows = await showsService.getShows();
        console.log('[App] renderShowsPage got shows:', shows);
        
        if (shows.error) {
            showList.innerHTML = '<p style="color: var(--gray-600); text-align: center; padding: 2rem;">Failed to load shows. Using cached data.</p>';
            const stale = showsService.getCachedShows(true);
            if (stale && stale.length) {
                renderShowsList(stale);
            }
            return;
        }
        
        renderShowsList(shows);
    } catch (err) {
        console.error('[App] renderShowsPage error:', err);
        showList.innerHTML = `<p style="color: var(--red-500); text-align: center; padding: 2rem;">Error loading shows: ${err.message}</p>`;
    }
}

function renderShowsList(allShows) {
    const showList = document.getElementById('show-list');
    if (!showList) return;
    
    // Filter based on current filter (upcoming/past)
    const today = new Date().toISOString().split('T')[0];
    let shows = allShows;
    
    if (currentTourFilter === 'upcoming') {
        shows = shows.filter(s => s.date >= today);
    } else if (currentTourFilter === 'past') {
        shows = shows.filter(s => s.date < today);
    }
    
    showList.innerHTML = '';
    
    if (!shows || shows.length === 0) {
        const msg = currentTourFilter === 'upcoming' 
            ? 'No upcoming shows announced yet.' 
            : 'No past shows in database.';
        showList.innerHTML = `<p style="color: var(--gray-600); text-align: center; padding: 2rem;">${msg}</p>`;
        return;
    }
    
    // Sort by date
    shows.sort((a, b) => a.date.localeCompare(b.date));
    
    shows.forEach(show => {
        const isUpcoming = show.date >= today;
        const showCard = createShowCard(show, isUpcoming);
        showList.appendChild(showCard);
    });
}

async function renderMerchPage() {
    const merchGrid = document.getElementById('merch-grid');
    if (!merchGrid) return;
    
    merchGrid.innerHTML = `
        <div class="video-loading" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;color:var(--gray-500);gap:0.75rem;">
            <svg class="spinner" viewBox="0 0 24 24" style="width:32px;height:32px;animation:spin 1s linear infinite;" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="var(--primary-color)" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round"/>
            </svg>
            <span>Loading merch...</span>
        </div>
    `;
    
    if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
    }
    
    try {
        const products = await merchService.getMerch();
        console.log('[App] renderMerchPage got products:', products);
        
        if (products.error) {
            merchGrid.innerHTML = '<p style="color: var(--gray-600); text-align: center; padding: 2rem;">Failed to load merch.</p>';
            return;
        }
        
        renderMerchList(products);
    } catch (err) {
        console.error('[App] renderMerchPage error:', err);
        merchGrid.innerHTML = `<p style="color: var(--red-500); text-align: center; padding: 2rem;">Error loading merch: ${err.message}</p>`;
    }
}

function renderMerchList(products) {
    const merchGrid = document.getElementById('merch-grid');
    if (!merchGrid) return;
    
    merchGrid.innerHTML = '';
    
    if (!products || products.length === 0) {
        merchGrid.innerHTML = '<p style="color: var(--gray-600); text-align: center; grid-column: 1/-1;">No merch available.</p>';
        return;
    }
    
    products.forEach(product => {
        const merchCard = createMerchCard(product);
        merchGrid.appendChild(merchCard);
    });
}

function renderCommunityPage() {
    // Render posts
    const postsFeed = document.getElementById('posts-feed');
    if (postsFeed) {
        postsFeed.innerHTML = '';
        mockPosts.forEach(post => {
            const postCard = createPostCard(post);
            postsFeed.appendChild(postCard);
        });
    }
    
    // Render fan art
    const fanArtGrid = document.getElementById('fan-art-grid');
    if (fanArtGrid) {
        fanArtGrid.innerHTML = '';
        mockFanArt.forEach(art => {
            const artCard = createFanArtCard(art);
            fanArtGrid.appendChild(artCard);
        });
    }
}

function renderTeamPage() {
    const teamGrid = document.getElementById('team-grid');
    if (!teamGrid) return;
    
    teamGrid.innerHTML = '';
    
    mockTeam.forEach(member => {
        const memberCard = createTeamCard(member);
        teamGrid.appendChild(memberCard);
    });
}

function renderSponsorBanner() {
    const sponsorContainer = document.getElementById('home-sponsor');
    if (!sponsorContainer) return;
    
    // For now, show the first sponsor (in a real app, this could be rotated or selected by date)
    const sponsor = mockSponsors[0];
    if (!sponsor) return;
    
    sponsorContainer.innerHTML = `
        <div class="sponsor-banner">
            <div class="sponsor-tag">${escapeHtml(sponsor.tagline)}</div>
            <a href="${sponsor.url}" target="_blank" rel="noopener" class="sponsor-link">
                <div class="sponsor-image">
                    <img src="${sponsor.image}" alt="${escapeHtml(sponsor.name)}">
                </div>
                <div class="sponsor-content">
                    <h3 class="sponsor-name">${escapeHtml(sponsor.name)}</h3>
                    <p class="sponsor-description">${escapeHtml(sponsor.description)}</p>
                </div>
                <span class="sponsor-cta">Learn More →</span>
            </a>
        </div>
    `;
    sponsorContainer.style.display = 'block';
}

function createVideoCard(video) {
    const card = document.createElement('article');
    card.className = 'video-card';
    card.setAttribute('data-video-id', video.id);
    card.innerHTML = `
        <div class="video-thumbnail">
            <svg class="play-button" viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="30" fill="rgba(255,107,0,0.9)"/>
                <polygon points="24,18 24,46 46,32" fill="white"/>
            </svg>
            <img src="${video.thumbnail}" alt="${escapeHtml(video.title)}">
            <span class="video-duration">${video.duration}</span>
        </div>
        <div class="video-info">
            <h3 class="video-title">${escapeHtml(video.title)}</h3>
            <div class="video-meta">${formatViews(video.views)} views • ${formatDate(video.date)}</div>
        </div>
    `;
    card.addEventListener('click', () => {
        openVideoModal(video.id);
    });
    return card;
}

function createShowCard(show, showButton) {
    const card = document.createElement('article');
    card.className = 'show-card';
    card.innerHTML = `
        <div class="show-date">
            <span class="show-day">${show.day}</span>
            <span class="show-month">${show.month}</span>
        </div>
        <div class="show-details">
            <div class="show-venue">${escapeHtml(show.venue)}</div>
            <div class="show-city">${escapeHtml(show.city)}</div>
        </div>
        ${showButton ? `<a href="${show.ticketUrl}" class="btn btn-primary show-link" target="_blank" rel="noopener">Get Tickets</a>` : ''}
    `;
    return card;
}

function createMerchCard(item) {
    const card = document.createElement('article');
    card.className = 'merch-card';
    card.innerHTML = `
        <div class="merch-thumbnail">
            <img src="${item.image}" alt="${escapeHtml(item.name)}">
        </div>
        <div class="merch-info">
            <h3 class="merch-name">${escapeHtml(item.name)}</h3>
            <div class="merch-price">$${item.price.toFixed(2)}</div>
            <a href="${item.url || 'https://www.podswag.com/collections/team-coco'}" target="_blank" rel="noopener" class="btn btn-primary merch-btn">Buy on PodSwag</a>
        </div>
    `;
    return card;
}

function createPostCard(post) {
    const card = document.createElement('article');
    card.className = 'post-card';
    card.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">${post.avatar}</div>
            <div class="post-author-info">
                <div class="post-author">${escapeHtml(post.author)}</div>
                <div class="post-time">${post.time}</div>
            </div>
        </div>
        <div class="post-content">${escapeHtml(post.content)}</div>
        <div class="post-actions">
            <button class="post-action" data-action="like-post">👍 Like (${post.likes})</button>
            <button class="post-action" data-action="reply-post">💬 Reply</button>
            <button class="post-action" data-action="share-post">🔗 Share</button>
        </div>
    `;
    card.querySelector('[data-action="like-post"]').addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('Liked post!');
    });
    card.querySelector('[data-action="reply-post"]').addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('Reply coming soon!');
    });
    card.querySelector('[data-action="share-post"]').addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('Link copied!');
    });
    return card;
}

function createFanArtCard(art) {
    const card = document.createElement('article');
    card.className = 'fan-art-card';
    card.innerHTML = `
        <div class="fan-art-thumbnail">
            <img src="${art.image}" alt="${escapeHtml(art.title)}">
        </div>
        <div class="fan-art-info">
            <div class="fan-art-title">${escapeHtml(art.title)}</div>
            <div class="fan-art-author">by ${escapeHtml(art.author)}</div>
        </div>
    `;
    card.addEventListener('click', () => {
        showToast(`Viewing "${art.title}" by ${art.author}`);
    });
    return card;
}

function createTeamCard(member) {
    const card = document.createElement('article');
    card.className = 'team-card';
    card.innerHTML = `
        <div class="team-photo">
            <img src="${member.image}" alt="${escapeHtml(member.name)}">
        </div>
        <div class="team-info">
            <h3 class="team-name">${escapeHtml(member.name)}</h3>
            <div class="team-role">${escapeHtml(member.role)}</div>
            <p class="team-bio">${escapeHtml(member.bio)}</p>
        </div>
    `;
    return card;
}

function openVideoModal(videoId) {
    const modal = document.getElementById('video-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const modalMeta = document.getElementById('modal-meta');
    
    const video = mockVideos.find(v => v.id === videoId) || mockVideos[0];
    
    if (modal && modalTitle) {
        modalTitle.textContent = video.title;
        if (modalDesc) modalDesc.textContent = video.description;
        if (modalMeta) {
            modalMeta.textContent = `${formatViews(video.views)} views • ${formatDate(video.date)} • ${video.duration}`;
        }
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        showToast('Playing video...');
    }
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    if (modal) {
        modal.hidden = true;
        document.body.style.overflow = 'auto';
    }
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 200);
    }, 3000);
}

function formatViews(views) {
    const num = parseInt(views);
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}