// --- Firebase Config ---
const firebaseConfig = {
    apiKey: "AIzaSyBLhxlVr8mjel_rVI1xqeRJ2DSywjiI2ek",
    authDomain: "nxzwallet.firebaseapp.com",
    databaseURL: "https://nxzwallet-default-rtdb.firebaseio.com",
    projectId: "nxzwallet",
    storageBucket: "nxzwallet.appspot.com",
    messagingSenderId: "910859278641",
    appId: "1:910859278641:web:d896205c530816fb297810" 
};
firebase.initializeApp(firebaseConfig);

// --- Loader Functions ---
let loadingOverlay = null;
let loadingTextEl = null;

function showLoader(text = 'Processing...') {
    if (loadingOverlay) {
        loadingTextEl.textContent = text;
        loadingOverlay.classList.remove('hidden');
        gsap.fromTo(loadingOverlay, {opacity: 0}, {opacity: 1, duration: 0.3});
    }
}
function hideLoader() {
    if (loadingOverlay) {
        gsap.to(loadingOverlay, {
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => loadingOverlay.classList.add('hidden')
        });
    }
}

// --- [UPGRADED] Premium Modal Function ---
function showCustomModal(config) {
    const { type = 'error', title, message, primaryButton, secondaryButton, autoClose, onRender, iconHtml, showCloseButton = false } = config;
    const modalScreen = document.getElementById('modal-screen');
    if (!modalScreen) return;

    const lottieSources = {
        success: 'https://lottie.host/f8bab0a3-06b1-46c6-b6c1-3b0e285358b7/DvJ1GvxOPv.lottie',
        error: 'https://lottie.host/adeb3497-0612-44f8-bddc-c7c564f22c9b/ypALfoP56V.lottie'
    };

    let buttonsHTML = '';
    if (primaryButton) {
        buttonsHTML += primaryButton.link 
            ? `<a href="${primaryButton.link}" target="_blank" class="w-full py-3 rounded-xl action-button text-base inline-block">${primaryButton.text}</a>`
            : `<button id="custom-modal-primary-btn" class="w-full py-3 rounded-xl action-button text-base">${primaryButton.text}</button>`;
    }
    if (secondaryButton) {
        buttonsHTML += `<button id="custom-modal-secondary-btn" class="w-full py-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-base mt-2">${secondaryButton.text}</button>`;
    }
    
    const isCustomHtmlMessage = typeof message === 'string' && message.trim().startsWith('<');

    const iconElement = iconHtml 
        ? `<div class="mb-4 flex items-center justify-center">${iconHtml}</div>`
        : (lottieSources[type] 
            ? `<div class="w-24 h-24 mb-2"><dotlottie-wc src="${lottieSources[type]}" autoplay loop style="width: 100%; height: 100%;"></dotlottie-wc></div>`
            : '');
    
    const contentHTML = isCustomHtmlMessage 
        ? message 
        : `${iconElement}<h3 class="text-2xl font-bold mb-2 z-10">${title}</h3><div class="text-gray-300 text-sm mb-4 z-10">${message}</div>`;
    
    const closeButtonHTML = showCloseButton ? `<button id="custom-modal-close-btn" class="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl z-20">&times;</button>` : '';

    modalScreen.innerHTML = `
        <div class="modal-box text-white text-center flex flex-col items-center relative overflow-hidden p-6">
            ${closeButtonHTML}
            <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
               ${type === 'success' ? '<dotlottie-wc src="https://lottie.host/933f0761-a979-4009-ac22-692723146d2f/J43a2j75sU.lottie" autoplay loop style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; opacity: 0.3;"></dotlottie-wc>' : ''}
            </div>
            <div class="w-full z-10 flex flex-col items-center">
                ${contentHTML}
            </div>
            <div class="w-full z-10 mt-auto">
                ${buttonsHTML}
            </div>
        </div>`;
    
    modalScreen.classList.remove('hidden');
    
    gsap.fromTo(modalScreen.querySelector('.modal-box'), 
        { scale: 0.8, opacity: 0, y: 50 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
    );

    if (type === 'success') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, zIndex: 1001 });
    }

    if (onRender) onRender(modalScreen);

    const closeModal = () => {
        gsap.to(modalScreen.querySelector('.modal-box'), {
            scale: 0.8, opacity: 0, y: 50, duration: 0.3, ease: "power2.in",
            onComplete: () => modalScreen.classList.add('hidden')
        });
    };
    
    if (autoClose) setTimeout(closeModal, autoClose);

    const closeBtnEl = document.getElementById('custom-modal-close-btn');
    if (closeBtnEl) {
        closeBtnEl.addEventListener('click', closeModal, { once: true });
    }

    const primaryBtnEl = document.getElementById('custom-modal-primary-btn');
    const secondaryBtnEl = document.getElementById('custom-modal-secondary-btn');

    if (primaryBtnEl && primaryButton && primaryButton.onClick) {
        primaryBtnEl.addEventListener('click', () => {
            primaryButton.onClick();
            if (!autoClose && primaryButton.closeOnClick !== false) closeModal();
        }, { once: true });
    }
    if (secondaryBtnEl) {
        secondaryBtnEl.addEventListener('click', () => {
            if (secondaryButton.onClick) secondaryButton.onClick();
            if (!autoClose) closeModal();
        }, { once: true });
    } else if (!primaryButton || !primaryButton.link) {
         const singleButton = primaryBtnEl || document.querySelector('.action-button');
         if(singleButton && !autoClose) singleButton.addEventListener('click', closeModal, { once: true });
    }
}

function showBadgeModal(badgeData) {
    const modalScreen = document.getElementById('badge-modal-screen');
    if (!modalScreen) return;

    const mediaHTML = badgeData.type === 'video'
        ? `<video src="${badgeData.url}" class="badge-modal-media" autoplay loop muted playsinline></video>`
        : `<img src="${badgeData.url}" class="badge-modal-media" loading="lazy">`;

    modalScreen.innerHTML = `
        <div class="badge-modal-box">
            <button class="badge-modal-close-btn">&times;</button>
            <div class="badge-modal-media-container">${mediaHTML}</div>
            <h3 class="text-xl font-bold font-oswald text-white">${badgeData.title || "Verified Badge"}</h3>
            <p class="text-gray-300 text-sm mt-2">${badgeData.description || 'This user or team holds a special badge.'}</p>
        </div>
    `;

    modalScreen.classList.remove('hidden');

    const modalBox = modalScreen.querySelector('.badge-modal-box');
    gsap.fromTo(modalBox,
        { scale: 0.7, opacity: 0, y: 60 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
    );

    const closeModal = () => {
        gsap.to(modalBox, {
            scale: 0.7, opacity: 0, y: 60, duration: 0.3, ease: "power2.in",
            onComplete: () => modalScreen.classList.add('hidden')
        });
    };

    modalScreen.querySelector('.badge-modal-close-btn').addEventListener('click', closeModal);
    modalScreen.addEventListener('click', (e) => {
        if (e.target === modalScreen) {
            closeModal();
        }
    });
}

const showModal = (type, title, message, buttonText = 'Continue', onContinue = null) => {
    showCustomModal({
        type: type,
        title: title,
        message: message,
        primaryButton: { text: buttonText, onClick: onContinue }
    });
};
// --- Global Variables & Constants ---
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

window.dbData = { users: {}, posts: {}, newsPosts: {}, sliderImages: [], admin: {}, guildPosts: {}, playerSquadPosts: {}, redeemCodes: {} };
const DEFAULT_AVATAR = "https://firebasestorage.googleapis.com/v0/b/viptask-5c1fc.appspot.com/o/dfdc00fc6bb93771364bbf5000dad222.jpg?alt=media&token=ff33f08b-1b2e-424e-b636-f664d8044bed";
const DEFAULT_TEAM_LOGO = "https://firebasestorage.googleapis.com/v0/b/viptask-5c1fc.appspot.com/o/dfdc00fc6bb93771364bbf5000dad222.jpg?alt=media&token=ff33f08b-1b2e-424e-b636-f664d8044bed";
const APP_LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/viptask-5c1fc.appspot.com/o/dfdc00fc6bb93771364bbf5000dad222.jpg?alt=media&token=ff33f08b-1b2e-424e-b636-f664d8044bed";
const ADMIN_UID = 'PzD3xazXDBM6sVoYk25aOkufSCo1';
const MIN_DEPOSIT = 20; const MAX_DEPOSIT = 5000; const MIN_WITHDRAW = 50; const MAX_WITHDRAW = 500; const WITHDRAW_LIMIT_PER_DAY = 2;
const paymentMethods = {
    bkash: { name: 'bKash', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ_HdpMiHFyZ_YfUCB_-vNcDujA8hYsYys91VA0TCyzQ&s=10', number: '01647712206', type: 'Send Money' },
    nagad: { name: 'Nagad', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeLPfqiqpP3bbq8yh5BaQeIfvjvn3auAfy0xUP4GHoDw&s', number: '01647712206', type: 'Send Money' },
    rocket: { name: 'Rocket', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnNnydSE3RbmYHBeYiFeuxbin5CoY1G_uGC6n9gG3CPw&s=10', number: '016477122060', type: 'Send Money' }
};
const diamondPacks = [
    { diamonds: 25, price: 25 }, { diamonds: 50, price: 50 }, { diamonds: 100, price: 100 },
    { diamonds: 115, price: 115 }, { diamonds: 240, price: 240 }, { diamonds: 355, price: 355 },
    { diamonds: 505, price: 505 }
];
let currentPaymentData = {};
let countdownInterval = null;
let isProfileFormDirty = false;

// --- Utility Functions ---
function timeAgo(isoDateString) { const date = new Date(isoDateString); const seconds = Math.floor((new Date() - date) / 1000); if (seconds < 2) return `just now`; if (seconds < 60) return `${seconds}s ago`; const minutes = Math.floor(seconds / 60); if (minutes < 60) return `${minutes}m ago`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours}h ago`; const days = Math.floor(hours / 24); return `${days}d ago`; }
function truncateName(name, maxLength = 15) { if (!name || typeof name !== 'string') return ''; if (name.length <= maxLength) return name; return name.substring(0, maxLength) + '..'; }
function formatNumberCompact(num) { num = Number(num); if (isNaN(num)) return '0'; if (num < 1000) { return String(num % 1 === 0 ? num : num.toFixed(1)).replace(/\.0$/, ''); } const si = [{ v: 1E3, s: "k" }, { v: 1E6, s: "M" }, { v: 1E9, s: "B" }, { v: 1E12, s: "T" },]; let i; for (i = si.length - 1; i > 0; i--) { if (num >= si[i].v) { break; } } return (num / si[i].v).toFixed(1).replace(/\.0$/, "") + si[i].s; }
function preloadImages(urls) { urls.forEach(url => { const img = new Image(); img.src = url; img.loading = 'lazy'; }); }
function getBangladeshDateString() { const now = new Date(); const bstTime = new Date(now.getTime() + (6 * 60 * 60 * 1000)); const year = bstTime.getUTCFullYear(); const month = String(bstTime.getUTCMonth() + 1).padStart(2, '0'); const day = String(bstTime.getUTCDate()).padStart(2, '0'); return `${year}-${month}-${day}`; }
function maskEmail(email) {
    if (!email || email.indexOf('@') === -1) return 'N/A';
    const [user, domain] = email.split('@');
    if (user.length <= 4) return `${user.substring(0, 1)}••••@${domain}`;
    return `${user.substring(0, 3)}••••${user.slice(-1)}@${domain}`;
}

// --- Firebase Helper Functions ---
async function uploadImage(file, path) { if (!file) return null; showLoader('Uploading Image...'); try { const fileRef = storage.ref().child(`${path}/${Date.now()}_${file.name}`); const snapshot = await fileRef.put(file); const downloadURL = await snapshot.ref.getDownloadURL(); const fileSizeKB = file.size / 1024; return { url: downloadURL, size: fileSizeKB }; } catch (error) { console.error("Image upload via Firebase Storage failed:", error); handleFirebaseError({ message: "Image upload failed. Please try again." }); return null; } finally { hideLoader(); } }
function updateTotalStorage(sizeDifference) { if (typeof sizeDifference !== 'number') return; const storageRef = database.ref('/admin/storage/totalUsedKB'); storageRef.transaction(currentTotal => { return (currentTotal || 0) + sizeDifference; }); }

const preloadedCache = new Set();
function backgroundPreloader() {
    if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => processPreloadQueue());
    } else {
        setTimeout(processPreloadQueue, 2000);
    }
}

function processPreloadQueue() {
    const db = window.dbData;
    const imagesToLoad = new Set();

    if (Array.isArray(db.sliderImages)) {
        db.sliderImages.forEach(slide => { if(slide.url) imagesToLoad.add(slide.url); });
    }
    if (db.posts) {
        Object.values(db.posts).forEach(post => { if(post.imageUrl) imagesToLoad.add(post.imageUrl); });
    }
    if (db.newsPosts) {
        Object.values(db.newsPosts).forEach(post => { if(post.imageUrl) imagesToLoad.add(post.imageUrl); });
    }
    if (db.guildPosts) {
        Object.values(db.guildPosts).forEach(gp => { if(gp.guildImage) imagesToLoad.add(gp.guildImage); });
    }

    imagesToLoad.forEach(url => {
        if (!preloadedCache.has(url)) {
            const img = new Image();
            img.src = url;
            img.loading = 'lazy';
            preloadedCache.add(url);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
        loadingOverlay = document.getElementById('loading-overlay');
        loadingTextEl = document.getElementById('loading-text');
        const screens = { splash: document.getElementById('splash-screen'), auth: document.getElementById('auth-container'), dashboard: document.getElementById('dashboard-screen'), modal: document.getElementById('modal-screen'), forgot: document.getElementById('forgot-password-modal'), topupPurchase: document.getElementById('topup-purchase-modal'), couponPurchase: document.getElementById('coupon-purchase-modal'), adView: document.getElementById('ad-view-screen') };
        const navContainer = document.querySelector('.nav-container');
        let currentUserData = null;
        let previousPostsState = {};
        
        const NAV_PAGE_MAP = {
            'nav-home': new Set(['home-content', 'sponsor-profile-content', 'guild-post-form-content', 'guild-application-content', 'player-squad-post-form-content', 'redeem-task-content']),
            'nav-search': new Set(['search-content']),
            'nav-my-matches': new Set(['my-matches-content', 'booking-content', 'participant-list-content', 'results-submission-content']),
            'nav-social-chat': new Set(['social-chat-content']),
            'nav-profile': new Set([
                'profile-content', 'user-profile-content', 'team-form-content', 'wallet-content', 'lup-wallet-screen', 
                'topup-screen', 'topup-history-content', 'mailbox-content', 'history-content', 'redeem-content',
                'lucky-box-content', 'edit-profile-content', 'change-password-content', 
                'manage-posts-content', 'help-community-content', 'video-tutorials-content', 'buy-sell-content',
                'partner-content', 'payment-content', 'complete-profile-content', 'leaderboard-content', 'season-details-content'
            ])
        };
        const ALL_NAV_PAGES = new Set(Object.values(NAV_PAGE_MAP).flatMap(s => [...s]));
        let navigationHistory = [];
        const allHeaders = document.querySelectorAll('header');
        const needFab = document.getElementById('need-fab');
        const transitionCover = document.getElementById('page-transition-cover');

        function showUnsavedChangesPopup(onConfirmLeaveCallback) {
            showCustomModal({
                type: 'error',
                title: 'পরিবর্তন সেভ করা হয়নি',
                message: 'আপনি কি সেভ না করেই বের হতে চান?',
                primaryButton: { 
                    text: 'না, কোনো কিছু পরিবর্তন করবো না',
                    onClick: onConfirmLeaveCallback 
                },
                secondaryButton: { 
                    text: 'হ্যাঁ, পরিবর্তন করবো' 
                }
            });
        }

        function handleNavigation(pageId, addToHistory = true) {
            const currentPageId = navigationHistory[navigationHistory.length - 1];
            if (currentPageId === 'edit-profile-content' && isProfileFormDirty && pageId !== 'edit-profile-content') {
                showUnsavedChangesPopup(() => {
                    isProfileFormDirty = false;
                    handleNavigation(pageId, addToHistory);
                });
                return;
            }

            if (addToHistory) {
                if (navigationHistory[navigationHistory.length - 1] !== pageId) {
                    history.pushState({ page: pageId }, '', `#${pageId}`);
                    navigationHistory.push(pageId);
                }
            }

            const transitionAndShow = () => {
                ALL_NAV_PAGES.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.classList.add('hidden');
                });
                
                const newPage = document.getElementById(pageId);
                if (newPage) {
                    newPage.classList.remove('hidden');
                    const mainContentArea = document.querySelector('#dashboard-screen main');
                    if(mainContentArea) mainContentArea.scrollTop = 0;
                    
                    gsap.fromTo(newPage, 
                        { opacity: 0, y: 10 }, 
                        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
                    );
                }

                allHeaders.forEach(h => h.classList.add('hidden'));
                
                const headerMap = {
                    'home-content': 'main-header', 'search-content': 'search-header', 'my-matches-content': 'my-matches-header',
                    'leaderboard-content': 'leaderboard-header',
                    'team-form-content': 'team-header', 'wallet-content': 'wallet-header', 'lup-wallet-screen': 'lup-wallet-header',
                    'topup-screen': 'topup-header', 'topup-history-content': 'topup-history-header', 'mailbox-content': 'mailbox-header', 'history-content': 'history-header',
                    'redeem-content': 'redeem-header', 'lucky-box-content': 'lucky-box-header', 'edit-profile-content': 'edit-profile-header',
                    'change-password-content': 'change-password-header', 'manage-posts-content': 'manage-posts-header',
                    'profile-content': null, // No header for new profile
                    'help-community-content': 'help-community-header', 'video-tutorials-content': 'video-tutorials-header',
                    'buy-sell-content': 'buy-sell-header',
                    'payment-content': 'payment-header', 'booking-content': 'booking-header', 'participant-list-content': 'participant-list-header',
                    'results-submission-content': 'results-submission-header', 'sponsor-profile-content': 'sponsor-profile-header',
                    'user-profile-content': 'user-profile-header', 'guild-post-form-content': 'guild-post-form-header',
                    'guild-application-content': 'guild-application-header', 'player-squad-post-form-content': 'player-squad-post-form-header',
                    'redeem-task-content': 'redeem-task-header', 'partner-content': 'partner-header',
                    'season-details-content': 'season-details-header',
                    'complete-profile-content': 'complete-profile-header',
                    'social-chat-content': 'social-chat-header'
                };
                
                let headerId = headerMap[pageId];

                if (pageId !== 'profile-content' && pageId !== 'user-profile-content') {
                     if (!headerId) {
                        headerId = 'main-header';
                    }
                    const headerElement = document.getElementById(headerId);
                    if (headerId !== 'main-header') {
                        if (headerElement) headerElement.classList.remove('hidden');
                    } else {
                        const homeSearchHeader = document.getElementById('home-search-header');
                        if (homeSearchHeader && !homeSearchHeader.classList.contains('hidden')) {
                            // do nothing
                        } else if (headerElement) {
                            headerElement.classList.remove('hidden');
                        }
                    }
                }

                pageId === 'manage-posts-content' ? needFab.classList.add('visible') : needFab.classList.remove('visible');
                
                updateActiveNavItem(pageId);

                const renderFunctionMap = {
                    'home-content': () => { renderAllPosts(); renderNewsFeed(); renderTournamentsFeed(); renderHomeGuildPosts(); renderHomePlayerSquadPosts(); renderMissionsPage(); renderStorePage(); },
                    'my-matches-content': renderMyMatchesPage,
                    'manage-posts-content': renderManageNeedPage,
                    'lucky-box-content': renderLuckyBoxPage,
                    'leaderboard-content': renderLeaderboardPage,
                    'history-content': renderHistoryPage,
                    'redeem-content': renderRedeemPage,
                    'wallet-content': renderWalletPage,
                    'lup-wallet-screen': renderLupWalletPage,
                    'topup-screen': renderTopUpPage, 
                    'topup-history-content': renderTopUpHistorySection,
                    'mailbox-content': renderMailbox,
                    'search-content': () => { document.getElementById('search-results-container').innerHTML = '<p class="text-center text-gray-500 mt-8">Type at least 3 characters to search.</p>'; },
                    'partner-content': renderPartnerScreen,
                    'season-details-content': renderSeasonDetailsPage,
                    'help-community-content': renderHelpPage,
                    'video-tutorials-content': renderVideoTutorialsPage,
                    'buy-sell-content': renderBuySellPage,
                    'complete-profile-content': renderCompleteProfilePage,
                };
                renderFunctionMap[pageId]?.();
            };

            if (addToHistory && navigationHistory.length > 1) {
                const oldPage = document.getElementById(navigationHistory[navigationHistory.length-2]);
                gsap.to(oldPage, {
                    opacity: 0, 
                    duration: 0.2, 
                    ease: 'power2.in',
                    onComplete: () => {
                        transitionAndShow();
                    }
                });
            } else {
                transitionAndShow();
            }
        }

        function updateActiveNavItem(pageId) {
            const navItems = document.querySelectorAll('.nav-item');
            const navIndicator = document.getElementById('nav-indicator');
            let activeItem = null;
            
            navItems.forEach(item => {
                const navId = item.id;
                if (NAV_PAGE_MAP[navId] && NAV_PAGE_MAP[navId].has(pageId)) {
                    item.classList.add('active');
                    activeItem = item;
                } else {
                    item.classList.remove('active');
                }
            });

            if (!activeItem) {
                const homeItem = document.getElementById('nav-home');
                if (homeItem) {
                    homeItem.classList.add('active');
                    activeItem = homeItem;
                }
            }

            if (activeItem) {
                setTimeout(() => {
                    if (navIndicator) {
                        navIndicator.style.width = `${activeItem.offsetWidth}px`;
                        navIndicator.style.left = `${activeItem.offsetLeft}px`;
                    }
                }, 350); 
            }
        }

        function setupNavbarSwipe() {
            const nav = document.getElementById('main-nav-container');
            const leftBtn = document.getElementById('nav-restore-left');
            const rightBtn = document.getElementById('nav-restore-right');
            let touchStartX = 0;
            let touchEndX = 0;

            nav.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            nav.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                const swipeThreshold = 50;
                if (touchEndX < touchStartX - swipeThreshold) {
                    nav.classList.add('nav-hidden-left');
                    leftBtn.classList.add('visible');
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    nav.classList.add('nav-hidden-right');
                    rightBtn.classList.add('visible');
                }
            }

            leftBtn.addEventListener('click', () => {
                nav.classList.remove('nav-hidden-left');
                leftBtn.classList.remove('visible');
            });

            rightBtn.addEventListener('click', () => {
                nav.classList.remove('nav-hidden-right');
                rightBtn.classList.remove('visible');
            });
        }

        function setupNewNavigationListeners() {
            let homeClickCount = 0;
            let homeClickTimer = null;
            document.getElementById('nav-home').addEventListener('click', (e) => {
                e.preventDefault();
                homeClickCount++;
                
                if (homeClickTimer) clearTimeout(homeClickTimer);

                homeClickTimer = setTimeout(() => {
                    if (homeClickCount === 1) {
                        handleNavigation('home-content');
                    } else if (homeClickCount === 2) {
                        const allTab = document.querySelector('.home-tab-link[data-target="post-feed"]');
                        if (allTab) {
                            allTab.click();
                            document.querySelector('#dashboard-screen main').scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    } else if (homeClickCount >= 3) {
                        location.reload();
                    }
                    homeClickCount = 0;
                }, 300);
            });
            
            document.getElementById('nav-search').addEventListener('click', (e) => { e.preventDefault(); handleNavigation('search-content'); });
            document.getElementById('nav-my-matches').addEventListener('click', (e) => { e.preventDefault(); handleNavigation('my-matches-content'); });
            
            document.getElementById('nav-social-chat').addEventListener('click', (e) => { 
                e.preventDefault(); 
                window.location.href = 'chat.html';
            });

            document.getElementById('nav-profile').addEventListener('click', (e) => { e.preventDefault(); handleNavigation('profile-content'); });

            window.onpopstate = (event) => {
                 const currentPageId = navigationHistory[navigationHistory.length - 1];
                if (currentPageId === 'edit-profile-content' && isProfileFormDirty) {
                    history.pushState({ page: 'edit-profile-content' }, '', '#edit-profile-content');
                    showUnsavedChangesPopup(() => {
                        isProfileFormDirty = false;
                        navigationHistory.pop();
                        const page = event.state ? event.state.page : 'home-content';
                        handleNavigation(page, false);
                    });
                    return;
                }
                navigationHistory.pop();
                const page = event.state ? event.state.page : 'home-content';
                handleNavigation(page, false);
            };
            
            document.body.addEventListener('click', function(event) {
                if (event.target.closest('.back-button')) {
                    event.preventDefault();
                    const currentPageId = navigationHistory[navigationHistory.length - 1];
                    if (currentPageId === 'edit-profile-content' && isProfileFormDirty) {
                        showUnsavedChangesPopup(() => {
                            isProfileFormDirty = false;
                            window.history.back();
                        });
                    } else {
                        window.history.back();
                    }
                }
                
                if (event.target.closest('.show-match-details-btn')) {
                    const postId = event.target.closest('.show-match-details-btn').dataset.postId;
                    showMatchDetailsModal(postId);
                }
            });
        }
        document.addEventListener('contextmenu', e => { if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') { e.preventDefault(); } });

        const handleFirebaseError = (err) => { showModal('error', 'An Error Occurred', err.message, 'Try Again'); };

        function calculateUserStats(userData, allPosts) {
            const posts = Object.values(allPosts || {});
            const bookings = Object.values(userData.bookings || {});
            let played = 0, wins = 0, kills = 0;
            
            bookings.forEach(booking => {
                const post = posts.find(p => p.id === booking.postId && p.status === 'completed');
                if (!post) return;

                played++;
                if (post.details.matchType !== 'Clash Squad') { 
                    const finalRankings = Object.values(post.participants || {}).map(p => { 
                        let totalPoints = 0; 
                        if (post.approvedResults && post.approvedResults[p.userId]) { 
                            Object.values(post.approvedResults[p.userId]).forEach(mapResult => { 
                                totalPoints += calculatePoints(mapResult.kills, mapResult.position); 
                            }); 
                        } 
                        return { userId: p.userId, totalPoints }; 
                    }).sort((a, b) => b.totalPoints - a.totalPoints);

                    if (finalRankings.length > 0 && finalRankings[0].userId === userData.firebaseUid) { 
                        wins++; 
                    }

                    if (post.approvedResults && post.approvedResults[userData.firebaseUid]) {
                        Object.values(post.approvedResults[userData.firebaseUid]).forEach(mapResult => {
                            kills += parseInt(mapResult.kills) || 0;
                        });
                    }
                } else {
                    if (post.csResults?.winner === userData.team?.id) {
                        wins++;
                    }
                }
            });
            return { played, wins, kills };
        }

        function updateProfileStats(userData) {
            const stats = userData.stats || { totalKills: 0, totalMatches: 0, totalWins: 0 };
        }
        
        
        function renderPremiumProfile(user, userData) {
            const name = user.displayName || userData.name;
            const avatar = userData.avatar || DEFAULT_AVATAR;
            const customizations = userData.profileCustomization || {};
        
            const bannerMedia = document.getElementById('profile-banner-media');
            const defaultBanner = "https://firebasestorage.googleapis.com/v0/b/viptask-5c1fc.appspot.com/o/Levelup%2F2e8e97546eae310a4edfaa46874232ef.jpg?alt=media&token=3f5dd29a-24d8-4aec-80e6-11504b80bdf7";
            
            if (userData.equippedEffect && window.dbData.admin?.config?.profileEffects?.[userData.equippedEffect]) {
                const effectData = window.dbData.admin.config.profileEffects[userData.equippedEffect];
                const mediaTag = effectData.url.includes('.mp4') ? 'video' : 'img';
                bannerMedia.innerHTML = `<${mediaTag} src="${effectData.url}" ${mediaTag === 'video' ? 'autoplay loop muted playsinline' : ''}></${mediaTag}>`;
            } else {
                bannerMedia.innerHTML = `<img src="${defaultBanner}" alt="Default Banner">`;
            }
        
            const bannerOverlay = document.getElementById('profile-banner-overlay');
            bannerOverlay.style.backdropFilter = `blur(${customizations.bgBlur || 0}px)`;
        
            const uidPill = document.getElementById('profile-uid-pill');
            const uidTextEl = document.getElementById('profile-page-uid');
            uidTextEl.textContent = userData.userId;
        
            const newUidPill = uidPill.cloneNode(true);
            uidPill.parentNode.replaceChild(newUidPill, uidPill);
        
            newUidPill.onclick = () => {
                if (newUidPill.classList.contains('animating')) return; 
                newUidPill.classList.add('animating');
                
                const uidText = userData.userId.toString();
                const uidSpan = newUidPill.querySelector('#profile-page-uid');
                uidSpan.innerHTML = uidText.split('').map(char => `<span>${char}</span>`).join('');
                const chars = uidSpan.querySelectorAll('span');
        
                gsap.to(chars, {
                    y: "100%",
                    opacity: 0,
                    stagger: 0.05,
                    ease: "power2.in",
                    onComplete: () => {
                        navigator.clipboard.writeText(uidText).then(() => {
                            showCustomModal({ type: 'success', title: 'UID Copied!', autoClose: 1500 });
                        }).catch(() => {
                            showCustomModal({ type: 'error', title: 'Copy Failed', message: 'Could not copy to clipboard.', autoClose: 2000 });
                        });
        
                        gsap.fromTo(chars, 
                            { y: "100%", opacity: 0 },
                            {
                                delay: 3,
                                y: "0%",
                                opacity: 1,
                                stagger: 0.05,
                                ease: "back.out(1.7)",
                                onComplete: () => {
                                    uidSpan.innerHTML = uidText;
                                    newUidPill.classList.remove('animating');
                                }
                            }
                        );
                    }
                });
            };
        
            document.getElementById('premium-profile-avatar').src = avatar;
            const avatarFrame = document.getElementById('premium-profile-avatar-frame');
            avatarFrame.classList.add('hidden'); 
            if (userData.equippedFrame) {
                const frameData = window.dbData.admin?.config?.profileFrames?.[userData.equippedFrame];
                if(frameData) {
                    avatarFrame.src = frameData.url;
                    avatarFrame.classList.remove('hidden');
                }
            }
        
            const usernameEl = document.getElementById('premium-user-name');
            usernameEl.textContent = name;
            usernameEl.style.color = customizations.textColor || '#FFFFFF';
        
            const followStatsContainer = document.getElementById('follow-stats-container');
            followStatsContainer.innerHTML = `
                <div class="text-center">
                    <p class="text-3xl font-bold font-oswald">${formatNumberCompact(userData.followersCount || 0)}</p>
                    <p class="text-xs text-gray-400 uppercase tracking-wider">Followers</p>
                </div>
                <div class="w-px h-8 bg-gray-700"></div>
                <div class="text-center">
                    <p class="text-3xl font-bold font-oswald">${formatNumberCompact(userData.followingCount || 0)}</p>
                    <p class="text-xs text-gray-400 uppercase tracking-wider">Following</p>
                </div>
            `;
        
            renderPremiumProfileBadges(userData);
            renderPremiumProfileTitles(userData);
            
            const teamCardContainer = document.getElementById('my-team-card-content');
            if (userData.team) {
                const leaderboardData = getFullLeaderboardData();
                const myTeamRankData = leaderboardData.find(t => t.team.id === userData.team.id);
                const rankScore = myTeamRankData ? myTeamRankData.points : (userData.team.rankScore || 0);
                const teamUID = userData.team.teamUid ? `@${userData.team.teamUid}` : `Joined: ${new Date(userData.team.id).toLocaleDateString()}`;

                teamCardContainer.innerHTML = `
                    <div class="team-card flex items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <img src="${userData.team.logo || DEFAULT_TEAM_LOGO}" class="team-logo" loading="lazy">
                            <div>
                                <p class="font-bold text-lg">${userData.team.name}</p>
                                <p class="text-xs text-gray-500">${teamUID}</p>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="flex items-center">
                                <p class="rank-score">${rankScore}</p>
                                <div class="rank-change-arrows">
                                    <i class="fa-solid fa-caret-up text-green-500"></i>
                                    <i class="fa-solid fa-caret-down text-red-500"></i>
                                </div>
                            </div>
                            <p class="text-xs text-gray-400 uppercase tracking-wider">Rank Score</p>
                        </div>
                    </div>
                `;
            } else {
                teamCardContainer.innerHTML = `
                    <div class="no-team-card text-center p-6">
                        <p class="text-gray-500">You are not part of a team.</p>
                        <button id="create-team-from-profile-btn" class="mt-4 py-2 px-6 action-button rounded-lg text-sm font-bold">Create a Team</button>
                    </div>
                `;
                document.getElementById('create-team-from-profile-btn').addEventListener('click', () => {
                    renderMyTeamPage(); 
                    handleNavigation('team-form-content'); 
                });
            }
        }
        
        function renderPremiumProfileBadges(userData) {
            const container = document.getElementById('profile-badges-container');
            if(!container) return;

            const allDbBadges = window.dbData.admin?.config?.verifiedBadges || {};
            const equippedBadges = (userData.equippedBadges || []).filter(id => id && allDbBadges[id]);
            
            if (equippedBadges.length === 0) {
                container.innerHTML = '<p class="empty-text-bn">আপনার কোনো ব্যাজ নেই</p>';
                return;
            }

            let html = '';
            equippedBadges.forEach(badgeId => {
                const badgeData = allDbBadges[badgeId];
                const mediaTag = badgeData.type === 'video' ? 'video' : 'img';
                const mediaSrc = `src="${badgeData.url}"`;
                const mediaAttrs = badgeData.type === 'video' ? 'autoplay loop muted playsinline' : 'loading="lazy"';
                html += `<div class="badge-slot"><${mediaTag} ${mediaSrc} ${mediaAttrs}></${mediaTag}></div>`;
            });
            container.innerHTML = html;
        }
        
        function renderPremiumProfileTitles(userData) {
            const container = document.getElementById('my-titles-grid');
            if(!container) return;

            const allDbTitles = window.dbData.admin?.config?.titles || {};
            const equippedTitles = (userData.equippedTitles || []).filter(id => id && allDbTitles[id]);

            if (equippedTitles.length === 0) {
                container.innerHTML = '<p class="empty-text-bn">আপনার কোনো টাইটেল নেই</p>';
                return;
            }
            
            let html = '';
            equippedTitles.forEach(titleId => {
                const titleData = allDbTitles[titleId];
                const mediaTag = titleData.url.endsWith('.mp4') ? 'video' : 'img';
                html += `<div class="title-slot"><${mediaTag} src="${titleData.url}" ${mediaTag === 'video' ? 'autoplay loop muted playsinline' : 'loading="lazy"'}></${mediaTag}></div>`;
            });
            container.innerHTML = html;
        }
        

        const populateDashboard = (user, userData) => {
            if (!user || !userData) return;
            currentUserData = userData;

            if (!userData.userId) {
                const newNumericId = Math.floor(100000000 + Math.random() * 900000000);
                database.ref('users/' + user.uid).update({ userId: newNumericId });
                userData.userId = newNumericId;
                currentUserData.userId = newNumericId;
            }
            
            renderPremiumProfile(user, userData);
            
            const name = user.displayName || userData.name; 
            const avatar = userData.avatar || DEFAULT_AVATAR;

            const promptContainer = document.getElementById('profile-completion-prompt-container');
            if (userData.isProfileComplete === false) {
                promptContainer.innerHTML = `
                    <div id="profile-completion-prompt" class="p-3 rounded-xl flex items-center justify-between font-bold">
                        <span>আপনার প্রোফাইল 30% সম্পন্ন। বাকি তথ্য পূরণ করুন।</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </div>
                `;
                promptContainer.querySelector('#profile-completion-prompt').addEventListener('click', () => {
                    handleNavigation('complete-profile-content');
                });
            } else {
                promptContainer.innerHTML = '';
            }
            
            document.getElementById('sidebar-username').textContent = name;
            document.getElementById('sidebar-avatar').src = avatar;
            
            const sidebarAvatarFrame = document.getElementById('sidebar-avatar-frame');
            sidebarAvatarFrame.classList.add('hidden');
            if (userData.equippedFrame) {
                const allFrames = window.dbData.admin?.config?.profileFrames || {};
                const frameData = allFrames[userData.equippedFrame];
                if(frameData) {
                    sidebarAvatarFrame.src = frameData.url;
                    sidebarAvatarFrame.classList.remove('hidden');
                }
            }

            document.getElementById('sidebar-teamname').textContent = userData.team?.name || 'No Team';
            
            const teamBadgeContainer = document.getElementById('sidebar-team-badge-container');
            teamBadgeContainer.innerHTML = '';
            if(userData.team?.equippedBadge) {
                const allBadges = window.dbData.admin?.config?.verifiedBadges || {};
                const badgeData = allBadges[userData.team.equippedBadge];
                if(badgeData && badgeData.type === 'team') {
                     const badgeEl = document.createElement('img');
                     badgeEl.src = badgeData.url;
                     badgeEl.className = 'h-4 cursor-pointer verification-badge';
                     badgeEl.dataset.badgeIndex = userData.team.equippedBadge;
                     badgeEl.onclick = () => showBadgeModal(badgeData);
                     teamBadgeContainer.appendChild(badgeEl);
                }
            }
            
            gsap.to('#sidebar-coin-balance', {
                innerText: userData.wallet?.coins || 0,
                duration: 1.5,
                snap: { innerText: 0.01 },
                onUpdate: function() {
                    this.targets()[0].innerHTML = formatNumberCompact(Math.ceil(this.targets()[0].innerText));
                }
            });
            gsap.to('#sidebar-diamond-balance', {
                innerText: userData.wallet?.diamonds || 0,
                duration: 1.5,
                snap: { innerText: 1 },
                onUpdate: function() {
                    this.targets()[0].innerHTML = formatNumberCompact(Math.ceil(this.targets()[0].innerText));
                }
            });
            
            document.getElementById('header-wallet-balance').textContent = (userData.wallet?.live || 0).toFixed(2); 
            updateMailboxBadge();
        };
        
        function setupRealtimeListener(user) {
            database.ref().on('value', snapshot => {
                const oldDbData = window.dbData;
                window.dbData = snapshot.val() || { users: {}, posts: {}, newsPosts: {}, sliderImages: [], admin: {}, guildPosts: {}, playerSquadPosts: {}, redeemCodes: {} };
                const currentUserDataFromDb = window.dbData.users?.[user.uid];
                if (!currentUserDataFromDb) { auth.signOut(); return; }
        
                currentUserData = currentUserDataFromDb;
        
                cleanupRedeemHistory();
                processMatchCompletions(oldDbData.posts, window.dbData.posts, user.uid);
                backgroundPreloader();
                populateDashboard(user, currentUserDataFromDb);
                
                const currentPageId = navigationHistory[navigationHistory.length - 1];
        
                const renderFunctionMap = {
                    'home-content': () => { renderAllPosts(); renderNewsFeed(); renderTournamentsFeed(); renderHomeGuildPosts(); renderHomePlayerSquadPosts(); renderMissionsPage(); renderStorePage(); },
                    'my-matches-content': renderMyMatchesPage,
                    'manage-posts-content': renderManageNeedPage,
                    'lucky-box-content': renderLuckyBoxPage,
                    'leaderboard-content': renderLeaderboardPage,
                    'history-content': renderHistoryPage,
                    'redeem-content': renderRedeemPage,
                    'profile-content': () => {},
                    'user-profile-content': () => {
                        const visibleProfile = document.getElementById('user-profile-follow-toggle-btn');
                        if (visibleProfile && visibleProfile.dataset.targetUid) {
                            renderUserProfile(visibleProfile.dataset.targetUid);
                        }
                    },
                    'wallet-content': renderWalletPage,
                    'lup-wallet-screen': renderLupWalletPage,
                    'topup-screen': renderTopUpPage, 
                    'topup-history-content': renderTopUpHistorySection,
                    'mailbox-content': renderMailbox,
                    'season-details-content': renderSeasonDetailsPage,
                    'team-form-content': renderMyTeamPage,
                    'results-submission-content': () => {
                        const postId = document.getElementById('results-submission-content').dataset.postId;
                        if (postId) {
                            const post = window.dbData.posts[postId];
                            if (post.status.startsWith('live')) renderLiveMatchPage(postId);
                            else if (post.status === 'completed') renderHistoryMatchDetailsPage(postId);
                        }
                    }
                };
                renderFunctionMap[currentPageId]?.();
            });
        }

        const runSplashAnimation = (onComplete) => {
            const tl = gsap.timeline({
                onComplete: () => {
                    document.getElementById('splash-screen').classList.add('hidden');
                    if(onComplete) onComplete();
                }
            });

            tl.to("#splash-screen-lottie", { duration: 2, opacity: 1 })
              .to("#splash-screen-lottie", { duration: 0.5, opacity: 0, scale: 0.5, ease: "power2.in" })
              .to("#splash-screen-logo", { duration: 0.8, opacity: 1, scale: 1, ease: "back.out(1.7)" }, "-=0.2")
              .to("#splash-screen", { duration: 0.5, opacity: 0, delay: 0.5 });
        };

        screens.splash.classList.remove('hidden');

        let isInitialLoad = true;

        auth.onAuthStateChanged(user => {
            const onUserDataFetched = (user, userData) => {
                if (userData && userData.role === 'sponsor') {
                    auth.signOut();
                    showModal('error', 'Access Denied', 'This is a sponsor account. Please log in via the Sponsor Panel.');
                    if (!isInitialLoad) hideLoader();
                    return;
                }
                if (!userData && isInitialLoad) {
                } else if (!userData && !isInitialLoad) {
                     auth.signOut();
                     return;
                }
        
                currentUserData = userData;

                setupRealtimeListener(user);
                if (isInitialLoad) {
                    runSplashAnimation(() => {
                        transitionToDashboard();
                        isInitialLoad = false;
                    });
                } else {
                    hideLoader();
                    transitionToDashboard();
                }
            };
        
            const onDataFetchError = (error) => {
                runSplashAnimation(() => {
                    showModal('error', 'Data Load Failed', 'Could not load your user data. Please try again.', 'OK', () => auth.signOut());
                    if (!isInitialLoad) hideLoader();
                });
            };
        
            if (user) {
                database.ref('/users/' + user.uid).once('value')
                    .then(snapshot => onUserDataFetched(user, snapshot.val()))
                    .catch(onDataFetchError);
            } else {
                if (isInitialLoad) {
                    runSplashAnimation(() => {
                        screens.auth.classList.remove('hidden');
                        gsap.fromTo("#auth-container .auth-view.active", {opacity: 0, scale: 0.9}, {opacity: 1, scale: 1, duration: 0.5, ease: "power2.out"});
                        isInitialLoad = false;
                    });
                } else {
                    screens.dashboard.classList.add('hidden');
                    screens.auth.classList.remove('hidden');
                    navContainer.classList.add('hidden');
                    const loginView = document.getElementById('login-view');
                    const signupView = document.getElementById('signup-view');
                    loginView.classList.add('active');
                    signupView.classList.remove('active');
                }
            }
        });
        
        function setupAuthPageListeners() {
            const togglePassword = (input, icon) => { const type = input.getAttribute('type') === 'password' ? 'text' : 'password'; input.setAttribute('type', type); icon.classList.toggle('fa-eye'); icon.classList.toggle('fa-eye-slash'); };
            document.getElementById('toggle-login-password').addEventListener('click', (e) => togglePassword(document.getElementById('login-password'), e.target));
            document.getElementById('toggle-signup-password').addEventListener('click', (e) => togglePassword(document.getElementById('signup-password'), e.target));
            document.getElementById('toggle-confirm-password').addEventListener('click', (e) => togglePassword(document.getElementById('signup-confirm-password'), e.target));
            const signupPassword = document.getElementById('signup-password'); const confirmPassword = document.getElementById('signup-confirm-password'); const matchMsg = document.getElementById('password-match-msg'); const strengthBar = document.getElementById('strength-bar');
            signupPassword.addEventListener('input', () => { const password = signupPassword.value; let strength = 0; if (password.length >= 8) strength++; if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++; if (password.match(/\d/)) strength++; if (password.match(/[^a-zA-Z\d]/)) strength++; strengthBar.className = 'strength-bar'; if (strength <= 1) strengthBar.classList.add('strength-weak'); else if (strength <= 3) strengthBar.classList.add('strength-medium'); else strengthBar.classList.add('strength-strong'); });
            confirmPassword.addEventListener('input', () => { if (confirmPassword.value === "") { matchMsg.textContent = ''; } else if (confirmPassword.value === signupPassword.value) { matchMsg.textContent = 'Passwords match!'; matchMsg.style.color = '#10b981'; } else { matchMsg.textContent = 'Passwords do not match.'; matchMsg.style.color = '#ef4444'; } });
            
            const authContainer = document.getElementById('auth-container');
            function switchAuthView(showSignup) {
                const loginView = document.getElementById('login-view');
                const signupView = document.getElementById('signup-view');
                const viewToHide = showSignup ? loginView : signupView;
                const viewToShow = showSignup ? signupView : loginView;
                const direction = showSignup ? 1 : -1;

                gsap.set(authContainer, { perspective: 1200 });
                gsap.set(viewToHide, { transformOrigin: "center center" });
                gsap.set(viewToShow, { transformOrigin: "center center", autoAlpha: 0, rotationY: -90 * direction, xPercent: 50 * direction });

                const tl = gsap.timeline({
                    onStart: () => {
                        loginView.classList.remove('active');
                        signupView.classList.remove('active');
                    },
                    onComplete: () => {
                        viewToShow.classList.add('active');
                    }
                });

                tl.to(viewToHide, { duration: 0.5, rotationY: 90 * direction, xPercent: -50 * direction, autoAlpha: 0, ease: "power2.in" })
                .to(viewToShow, { duration: 0.5, rotationY: 0, xPercent: 0, autoAlpha: 1, ease: "power2.out" }, "-=0.25");
            }

            document.getElementById('show-signup').addEventListener('click', (e) => { e.preventDefault(); switchAuthView(true); });
            document.getElementById('show-login').addEventListener('click', (e) => { e.preventDefault(); switchAuthView(false); });

            const forgotModal = document.getElementById('forgot-password-modal');
            const forgotModalBox = forgotModal.querySelector('.modal-box');

            document.getElementById('forgot-password-link').addEventListener('click', (e) => {
                e.preventDefault();
                forgotModal.classList.remove('hidden');
                gsap.fromTo(forgotModalBox, { scale: 0.8, opacity: 0, y: 50 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" });
            });

            const closeForgotModal = () => {
                gsap.to(forgotModalBox, {
                    scale: 0.8, opacity: 0, y: 50, duration: 0.3, ease: "power2.in",
                    onComplete: () => forgotModal.classList.add('hidden')
                });
            };

            document.getElementById('close-forgot-modal').addEventListener('click', closeForgotModal);
            forgotModal.addEventListener('click', (e) => {
                if (e.target === forgotModal) closeForgotModal();
            });

            document.getElementById('forgot-password-form').addEventListener('submit', (e) => { 
                e.preventDefault(); 
                const email = document.getElementById('forgot-email-input').value; 
                handleFormSubmit(e.target, 'Sending...', () => 
                    auth.sendPasswordResetEmail(email).then(() => { 
                        closeForgotModal(); 
                        showModal('success', 'Email Sent', `A password reset link has been sent to ${email}.`, 'OK'); 
                    })
                ); 
            });
        }
        setupAuthPageListeners();

        function animateHeaderTitle() {
            const titleSpans = document.querySelectorAll('#animated-header-title span');
            if (!titleSpans.length) return;

            const tl = gsap.timeline({
                repeat: -1, 
                repeatDelay: 3 
            });

            tl.to(titleSpans, { color: "#FFD700", duration: 0.1, stagger: 0.15, ease: "power1.inOut" })
            .to(titleSpans, { color: "#FFFFFF", duration: 0.1, stagger: { each: 0.15, from: "end" }, ease: "power1.inOut" }, "+=3"); 
        }

        function transitionToDashboard() {
            screens.auth.classList.add('hidden');
            screens.dashboard.classList.remove('hidden');
            navContainer.classList.remove('hidden');
            
            setTimeout(() => {
                handleNavigation('home-content', true); 
                setTimeout(() => {
                    updateActiveNavItem('home-content');
                }, 100);
                setupSlider(window.dbData.sliderImages); 
                initMyMatchesPage();
                setupHomePageScrolling();
                setupProfilePageListeners();
                setupHomeTabs();
                setupSidebar();
                setupNewNavigationListeners();
                animateHeaderTitle();
                initializeCountdowns();
                initializeItemExpiryChecker();
            }, 50);
        }

        const handleFormSubmit = (form, loadingText, promiseProvider) => {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) btn.disabled = true;
            showLoader(loadingText);
            return promiseProvider()
                .catch(err => {
                    hideLoader();
                    handleFirebaseError(err);
                    throw err; 
                })
                .finally(() => {
                    if (btn) btn.disabled = false;
                    if (!loadingOverlay.classList.contains('hidden')) {
                        hideLoader();
                    }
                });
        };

        const generateReferralCode = (length = 6) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        document.getElementById('signup-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            if (localStorage.getItem('accountCreated')) { showModal('error', 'Device Limit Reached', 'You can only create one account per device.'); return; }
            handleFormSubmit(form, 'Signing Up...', async () => {
                const email = form.querySelector('#signup-email').value.trim();
                if (!email.toLowerCase().endsWith('@gmail.com')) { throw { message: 'Registration is only allowed with a @gmail.com address.' }; }
                const password = form.querySelector('#signup-password').value;
                if (password !== form.querySelector('#signup-confirm-password').value) { throw { message: 'Passwords do not match.' }; }
                
                const emailExistsSnapshot = await database.ref('users').orderByChild('email').equalTo(email).once('value');
                if (emailExistsSnapshot.exists()) {
                    const usersData = emailExistsSnapshot.val();
                    const userKey = Object.keys(usersData)[0];
                    const existingUser = usersData[userKey];

                    if (existingUser.role === 'sponsor') {
                        throw { message: 'This email is already registered as a Sponsor. Please use the Sponsor Panel.' };
                    } else {
                        throw { message: 'This email is already registered. Please use a different email or try logging in.' };
                    }
                }
                
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                const fullName = form.querySelector('#signup-fullname').value;
                await user.updateProfile({ displayName: fullName });
                const newUserDbData = { 
                    userId: Math.floor(100000000 + Math.random() * 900000000), 
                    name: fullName, 
                    email: email, 
                    whatsapp: '+880' + form.querySelector('#signup-whatsapp').value, 
                    gender: form.querySelector('input[name="gender"]:checked').value, 
                    avatar: DEFAULT_AVATAR, 
                    role: 'user', 
                    wallet: { live: 0, event: 0, coins: 0, diamonds: 0 }, 
                    tickets: 5, 
                    team: null, 
                    bookings: {}, 
                    mailbox: {}, 
                    transactions: {}, 
                    storePurchaseCounters: {}, 
                    referralCode: generateReferralCode(), 
                    spinStats: { adSpins: 0, lastAdSpin: 0, boxSpins: 0 }, 
                    missionProgress: {}, 
                    votes: {},
                    stats: { totalKills: 0, totalMatches: 0, totalWins: 0 },
                    coupons: {},
                    earnedBadges: {},
                    earnedTitles: {},
                    inventory: { frames: {}, effects: {} },
                    isProfileComplete: true
                };
                await database.ref('users/' + user.uid).set(newUserDbData);
                localStorage.setItem('accountCreated', 'true');
                
                await auth.signOut();
                hideLoader();
                
                showCustomModal({
                    type: 'success',
                    title: 'Registration Successful!',
                    message: 'Welcome to LEVEL UP! Please log in to continue.',
                    primaryButton: {
                        text: 'Go to Login',
                        onClick: () => {
                            const signupView = document.getElementById('signup-view');
                            if (signupView.classList.contains('active')) {
                                 document.getElementById('show-login').click();
                            }
                        }
                    }
                });
            });
        });

        document.getElementById('login-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            handleFormSubmit(form, 'Signing In...', async () => {
                let email = document.getElementById('login-email').value.trim();
                const password = document.getElementById('login-password').value;
                if (email && !email.includes('@')) { email += '@gmail.com'; }
                await auth.signInWithEmailAndPassword(email, password);
            });
        });

        async function signInWithGoogle() {
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                showLoader('Connecting to Google...');
                const result = await auth.signInWithPopup(provider);
                const user = result.user;
                const isNewUser = result.additionalUserInfo.isNewUser;
                
                if (isNewUser) {
                    const newUserDbData = {
                        userId: Math.floor(100000000 + Math.random() * 900000000),
                        name: user.displayName,
                        email: user.email,
                        avatar: user.photoURL || DEFAULT_AVATAR,
                        role: 'user',
                        wallet: { live: 0, event: 0, coins: 0, diamonds: 0 },
                        tickets: 5,
                        isProfileComplete: false,
                        team: null, bookings: {}, mailbox: {}, transactions: {}, storePurchaseCounters: {},
                        referralCode: generateReferralCode(), spinStats: { adSpins: 0, lastAdSpin: 0, boxSpins: 0 },
                        missionProgress: {}, votes: {}, stats: { totalKills: 0, totalMatches: 0, totalWins: 0 },
                        coupons: {}, earnedBadges: {}, earnedTitles: {}, inventory: { frames: {}, effects: {} }
                    };
                    await database.ref('users/' + user.uid).set(newUserDbData);
                }
            } catch (error) {
                hideLoader();
                handleFirebaseError(error);
            }
        }

        document.getElementById('google-signin-btn').addEventListener('click', signInWithGoogle);
        document.getElementById('google-signup-btn').addEventListener('click', signInWithGoogle);
        
        document.getElementById('team-logo-upload').addEventListener('change', e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => { document.getElementById('team-logo-preview').src = event.target.result; };
                reader.readAsDataURL(file);
            }
        });
        
        function handleGlobalSearch(searchTerm) { 
            const resultsContainer = document.getElementById('search-results-container'); 
            const posts = Object.values(window.dbData.posts || {}).filter(p => p.authorId !== ADMIN_UID);
            const filteredPosts = posts.filter(p => p.details.eventName.toLowerCase().includes(searchTerm) || p.author.name.toLowerCase().includes(searchTerm) || (p.details.tags && p.details.tags.some(t => t.toLowerCase().includes(searchTerm)))); 
            
            const now = Date.now();
            const thirtyMinutes = 30 * 60 * 1000;
            const activeAndFilteredPosts = filteredPosts.filter(post => {
                const matchTime = new Date(post.matchDate).getTime();
                const isExpired = (matchTime + thirtyMinutes) < now;
                const isFinished = post.status === 'completed' || post.status === 'cancelled' || (post.status && post.status.startsWith('live'));
                return !isFinished && !isExpired;
            });

            resultsContainer.innerHTML = activeAndFilteredPosts.length > 0 ? activeAndFilteredPosts.map(createPostCardHTML).join('') : `<p class="text-center text-gray-500 mt-8">No results found.</p>`; 
            
            gsap.from(resultsContainer.children, { y: 50, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
        }
        document.getElementById('search-input-mobile').addEventListener('input', e => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const resultsContainer = document.getElementById('search-results-container');
            if (searchTerm.length < 3) {
                resultsContainer.innerHTML = '<p class="text-center text-gray-500 mt-8">Type at least 3 characters to search.</p>';
                return;
            }
            handleGlobalSearch(searchTerm);
        });

        function handleHomeSearch() {
            const searchTerm = document.getElementById('home-search-input').value.toLowerCase().trim();
            const activeTabEl = document.querySelector('.home-tab-link.active-home-tab');
            if (!activeTabEl) return;
            const activeTab = activeTabEl.dataset.target;

            if (searchTerm.length === 0) {
                renderAllPosts();
                renderTournamentsFeed();
                renderHomeGuildPosts();
                renderHomePlayerSquadPosts();
                return;
            }
        }

        function renderAllPosts() {
            const feed = document.getElementById('post-feed');
            const now = Date.now();
            
            const eventPosts = Object.values(window.dbData.posts || {}).filter(p => p.authorId !== ADMIN_UID);
            const thirtyMinutes = 30 * 60 * 1000;
            const activeEventPosts = eventPosts.filter(post => {
                const matchTime = new Date(post.matchDate).getTime();
                const isExpired = (matchTime + thirtyMinutes) < now;
                const isFinished = post.status === 'completed' || post.status === 'cancelled' || (post.status && post.status.startsWith('live'));
                return !isFinished && !isExpired;
            });
            
            const guildPosts = Object.values(window.dbData.guildPosts || {});
            const playerSquadPosts = Object.values(window.dbData.playerSquadPosts || {});
            
            const allPosts = [...activeEventPosts, ...guildPosts, ...playerSquadPosts];
            const boostedPosts = allPosts.filter(p => p.boostedUntil && p.boostedUntil > now);
            const regularPosts = allPosts.filter(p => !p.boostedUntil || p.boostedUntil <= now);
            
            const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);
            const finalPosts = [...shuffleArray(boostedPosts), ...shuffleArray(regularPosts)];

            const postsHTML = finalPosts.map(post => {
                if (post.details && post.details.eventName) return createPostCardHTML(post);
                if (post.guildName) return createGuildPostCardHTML(post);
                if (post.description) return createPlayerSquadPostCardHTML(post);
                return '';
            }).join('');

            if (!postsHTML.trim()) { 
                feed.innerHTML = `<div class="text-center text-gray-500 p-10 bg-gray-800/50 rounded-lg"><i class="fa-solid fa-ghost text-4xl mb-4"></i><p>No posts available at the moment.</p></div>`;
            } else {
                feed.innerHTML = postsHTML;
                gsap.from("#post-feed > div", { y: 100, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" });
            }
        }

        function renderTournamentsFeed() {
            const feed = document.getElementById('home-tournaments-feed');
            const posts = Object.values(window.dbData.posts || {}).filter(p => p.authorId !== ADMIN_UID).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            const now = Date.now();
            const thirtyMinutes = 30 * 60 * 1000;
            const activePosts = posts.filter(post => {
                const matchTime = new Date(post.matchDate).getTime();
                const isExpired = (matchTime + thirtyMinutes) < now;
                const isFinished = post.status === 'completed' || post.status === 'cancelled' || (post.status && post.status.startsWith('live'));
                return !isFinished && !isExpired;
            });
            
            if (activePosts.length === 0) {
                feed.innerHTML = `<div class="text-center text-gray-500 p-10 bg-gray-800/50 rounded-lg"><i class="fa-solid fa-trophy text-4xl mb-4"></i><p>No tournaments available right now.</p></div>`;
                return;
            }
            feed.innerHTML = activePosts.map(createPostCardHTML).join('');
            gsap.from("#home-tournaments-feed > div", { y: 50, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
        }
        
        const createPostCardHTML = (post) => {
            const isBooked = currentUserData?.bookings && !!currentUserData.bookings[post.id];
            const authorData = window.dbData.users?.[post.authorId];
            if (!authorData) return ''; 
            
            const allBadges = window.dbData.admin?.config?.verifiedBadges || {};
            let verifiedBadgeHTML = '';
            
            const badgeIndex = authorData?.verifiedBadge;

            if (badgeIndex !== undefined && badgeIndex !== null) {
                const badgeData = allBadges[badgeIndex];
                if (badgeData) {
                    if(badgeData.type === 'video') {
                        verifiedBadgeHTML = `<video src="${badgeData.url}" class="verification-badge" data-badge-index="${badgeIndex}" autoplay loop muted playsinline></video>`;
                    } else {
                        verifiedBadgeHTML = `<img src="${badgeData.url}" alt="Verified" class="verification-badge" data-badge-index="${badgeIndex}" loading="lazy">`;
                    }
                }
            }

            const authorProfileHTML = `
                <div class="flex items-center gap-3 cursor-pointer sponsor-profile-trigger" data-sponsor-id="${post.authorId}">
                    <img src="${authorData.avatar || DEFAULT_AVATAR}" class="w-10 h-10 rounded-full object-cover border-2 border-gray-600" loading="lazy">
                    <div class="overflow-hidden">
                        <div class="flex items-center">
                            <p class="font-semibold text-white truncate">${authorData.name}</p>
                            ${verifiedBadgeHTML}
                        </div>
                        <p class="text-xs text-gray-400">${timeAgo(post.timestamp)}</p>
                    </div>
                </div>`;

            const matchDate = new Date(post.matchDate), formattedDate = matchDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }); 
            
            let prizeOrPracticeHTML = '';
            if (post.details.eventType === 'practice') {
                prizeOrPracticeHTML = `<div class="border-t border-gray-700 pt-4 text-center"><p class="font-bold text-xl text-orange-400 font-oswald tracking-wider">PRACTICE MATCH</p></div>`;
            } else {
                const prizeListHTML = (post.details.winningPrizes && post.details.winningPrizes.length > 0) ? post.details.winningPrizes.map(p => `<li><span class="font-semibold text-green-400">${p.rank}:</span> ${p.prize} TK</li>`).join('') : '<li>No prize details provided.</li>';
                prizeOrPracticeHTML = `<details class="border-t border-gray-700 pt-3"><summary class="font-bold text-green-500 cursor-pointer">WINNING PRIZE <span class="text-xs font-normal text-gray-400">(See More...)</span></summary><ul class="list-disc list-inside text-gray-300 text-xs space-y-1 mt-2">${prizeListHTML}</ul></details>`;
            }

            const slotPercentage = (post.slots.total > 0 ? ((post.slots.booked || 0) / post.slots.total) * 100 : 0); 
            const formatTime = (timeStr) => { if (!timeStr) return 'N/A'; let [hours, minutes] = timeStr.split(':'); const ampm = hours >= 12 ? 'PM' : 'AM'; hours = hours % 12; hours = hours ? hours : 12; return `${hours}:${minutes} ${ampm}`; }; 
            const isFull = (post.slots.booked || 0) >= post.slots.total; 
            const isBanned = currentUserData.team && currentUserData.team.banLiftTimestamp && (currentUserData.team.banLiftTimestamp === -1 || Date.now() < currentUserData.team.banLiftTimestamp);
            
            let buttonHTML; 
            if (isBooked) {
                buttonHTML = `<button class="booking-btn text-white font-bold py-3 px-6 rounded-lg text-base" disabled style="background-image: none; background-color: #dc2626;">BOOKED</button>`;
            } else if(isBanned) {
                buttonHTML = `<button class="booking-btn text-white font-bold py-3 px-6 rounded-lg text-base" disabled style="background-image: none; background-color: #4a044e;">TEAM BANNED</button>`;
            } else if(isFull) { 
                buttonHTML = `<button class="booking-btn text-white font-bold py-3 px-6 rounded-lg text-base" disabled style="background: #880808;">SLOT FULL</button>`; 
            } else { 
                buttonHTML = `<button class="booking-btn text-white font-bold py-3 px-6 rounded-lg text-base" data-post-id="${post.id}">BOOK</button>`; 
            }
            
            const entryFeeHTML = post.entryFee > 0
                ? `<p class="font-oswald text-2xl font-bold text-white">${post.entryFee} <span class="text-sm">TK</span></p>`
                : `<p class="font-oswald text-2xl font-bold text-green-400">FREE</p>`;

            const mapsInfo = post.details.matchType === 'Clash Squad' ? '' : `<div class="col-span-3 mt-2"><strong class="text-gray-400 text-xs uppercase">Maps:</strong> <span class="text-white font-semibold">${post.details.numMatches} | ${post.details.maps.join(', ')}</span></div>`;
            
            const cardClasses = `post-card rounded-2xl overflow-hidden ${isBooked ? 'is-booked-card' : ''}`;

            return `<div class="${cardClasses}" data-post-id-wrapper="${post.id}">
                <div class="p-4">
                    <div class="flex justify-between items-start gap-4">
                        ${authorProfileHTML}
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <div class="countdown-container text-right" data-countdown="${post.matchDate}"></div>
                        </div>
                    </div>
                </div>
                <div class="px-4">
                    <img src="${post.imageUrl}" class="w-full h-auto max-h-96 object-contain rounded-lg" alt="Post Image" loading="lazy">
                </div>
                <div class="p-4 bg-[#28282B] space-y-3">
                    <h3 class="text-xl font-oswald font-bold text-green-400 tracking-wide">${truncateName(post.details.eventName, 25)}</h3>
                    
                    <div class="grid grid-cols-3 gap-x-4 gap-y-3 font-oswald tracking-wide text-sm text-center">
                        <div class="bg-black/20 p-2 rounded-lg"><strong class="text-gray-400 text-[10px] uppercase">Match Type:</strong> <span class="text-white font-semibold block">${post.details.matchType}</span></div>
                        <div class="bg-black/20 p-2 rounded-lg"><strong class="text-gray-400 text-[10px] uppercase">Team Type:</strong> <span class="text-white font-semibold block">${post.details.teamType}</span></div>
                        <div class="bg-black/20 p-2 rounded-lg"><strong class="text-gray-400 text-[10px] uppercase">Total Slots:</strong> <span class="text-white font-semibold block">${post.slots.total}</span></div>
                        
                        <div class="bg-black/20 p-2 rounded-lg"><strong class="text-gray-400 text-[10px] uppercase">Date:</strong> <span class="text-white font-semibold block">${formattedDate}</span></div>
                        <div class="bg-black/20 p-2 rounded-lg"><strong class="text-gray-400 text-[10px] uppercase">ID Pass:</strong> <span class="text-white font-semibold block">${formatTime(post.details.idPassTime)}</span></div>
                        <div class="bg-black/20 p-2 rounded-lg"><strong class="text-gray-400 text-[10px] uppercase">Match Starts:</strong> <span class="text-white font-semibold block">${formatTime(post.details.matchStartTime)}</span></div>

                        ${mapsInfo}
                    </div>

                    ${prizeOrPracticeHTML}
                </div>
                <div class="p-3 bg-black/30 flex justify-between items-center gap-4">
                    <div class="text-center">
                        <p class="text-gray-400 text-xs">ENTRY FEE</p>
                        ${entryFeeHTML}
                    </div>
                    <div class="flex-grow">
                        <div class="w-full slot-progress-bar rounded-full h-2.5">
                            <div class="slot-progress-fill h-2.5 rounded-full" style="width: ${slotPercentage}%"></div>
                        </div>
                        <p class="text-center text-xs text-gray-300 mt-1">${post.slots.booked || 0}/${post.slots.total} SLOTS BOOKED</p>
                    </div>
                    ${buttonHTML}
                </div>
            </div>`;
        }

        function updateAllCountdowns() {
            document.querySelectorAll('.countdown-container, .claim-countdown, #season-countdown-timer, #season-details-countdown-timer, .ad-cooldown-timer, .coupon-expiry-timer, .mail-delete-timer, .team-ban-timer, .item-timer, [data-countdown-to]').forEach(c => {
                const targetTime = new Date(c.dataset.countdown || c.dataset.countdownTo || c.dataset.cooldownEnd || c.dataset.deleteTime || c.dataset.banLift || c.dataset.expiry).getTime();
                if(isNaN(targetTime)) return;
                
                const now = new Date().getTime();
                let diff = targetTime - now;

                if (diff <= 0) {
                    if (c.closest('#prize-release-section')) {
                        const postId = c.closest('[data-post-id]').dataset.postId;
                        if (postId) {
                           renderPrizeReleaseAndVoting(postId);
                        }
                    }
                    if (c.classList.contains('mail-delete-timer')) c.textContent = 'deleted soon';
                    if (c.classList.contains('team-ban-timer')) { c.closest('.team-ban-timer-container')?.remove(); location.reload(); }
                    if (c.classList.contains('item-timer')) { c.closest('.inventory-item')?.remove(); }
                    return;
                }
                
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                if (c.classList.contains('item-timer') || c.classList.contains('team-ban-timer')) {
                    if (days > 0) c.textContent = `${days}d ${hours}h left`;
                    else if (hours > 0) c.textContent = `${hours}h ${minutes}m left`;
                    else c.textContent = `${minutes}m ${seconds}s left`;
                    return;
                }

                if (c.classList.contains('mail-delete-timer')) {
                    if (days > 0) c.textContent = `${days}d ${hours}h`;
                    else if (hours > 0) c.textContent = `${hours}h ${minutes}m`;
                    else c.textContent = `${minutes}m ${seconds}s`;
                    return;
                }
                
                if (c.classList.contains('ad-cooldown-timer')) {
                    c.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                    return;
                }
                
                if (c.classList.contains('coupon-expiry-timer')) {
                    if (days > 0) c.textContent = `${days}d ${hours}h left`;
                    else c.textContent = `${hours}h ${minutes}m left`;
                    return;
                }

                if (c.id === 'season-countdown-timer') {
                    c.textContent = `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
                    return;
                }

                if (c.id === 'season-details-countdown-timer') {
                    c.innerHTML = `
                        <div class="text-center"> <div class="countdown-value">${String(days).padStart(2, '0')}</div> <div class="countdown-label">Days</div> </div>
                        <div class="text-center"> <div class="countdown-value">${String(hours).padStart(2, '0')}</div> <div class="countdown-label">Hours</div> </div>
                        <div class="text-center"> <div class="countdown-value">${String(minutes).padStart(2, '0')}</div> <div class="countdown-label">Mins</div> </div>
                        <div class="text-center"> <div class="countdown-value">${String(seconds).padStart(2, '0')}</div> <div class="countdown-label">Secs</div> </div>
                    `;
                    return;
                }

                if (c.classList.contains('claim-countdown') && diff <= 0) {
                    const postId = c.dataset.postId;
                    const parentCard = document.querySelector(`.post-card[data-post-id="${postId}"]`);
                    if (parentCard) {
                         parentCard.querySelector('.claim-reward-section').innerHTML = `<button class="action-button py-2 px-6 rounded-lg claim-reward-btn" data-post-id="${postId}">Claim Reward</button>`;
                    }
                    c.remove();
                    return;
                }
                
                if (diff < 0 && c.classList.contains('countdown-container')) {
                    c.innerHTML = `<p class="text-red-500 font-bold text-sm">EVENT ENDED</p>`;
                    c.closest('.post-card')?.classList.add('opacity-50', 'grayscale');
                    return;
                }
                
                if (c.hasAttribute('data-countdown-to')) {
                     c.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                } else if (c.classList.contains('countdown-container')) {
                     c.innerHTML = `<div class="flex justify-end gap-1.5 text-white">
                                   <div class="countdown-item text-center"><span>${String(days).padStart(2, '0')}</span><p>Days</p></div>
                                   <div class="countdown-item text-center"><span>${String(hours).padStart(2, '0')}</span><p>Hrs</p></div>
                                   <div class="countdown-item text-center"><span>${String(minutes).padStart(2, '0')}</span><p>Min</p></div>
                               </div>`;
                }
            });
        }

        function initializeCountdowns() {
            if (countdownInterval) clearInterval(countdownInterval);
            countdownInterval = setInterval(updateAllCountdowns, 1000);
            updateAllCountdowns();
        }
        
        function setupHomePageScrolling() {
            const mainContentArea = document.querySelector('#dashboard-screen main');
            const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
            if (!mainContentArea || !scrollToTopBtn) return;
            mainContentArea.addEventListener('scroll', () => {
                if (mainContentArea.scrollTop > 1000) {
                    scrollToTopBtn.classList.add('visible');
                    gsap.to(scrollToTopBtn, { scale: 1, opacity: 1, duration: 0.3 });
                } else {
                    scrollToTopBtn.classList.remove('visible');
                    gsap.to(scrollToTopBtn, { scale: 0, opacity: 0, duration: 0.3 });
                }
            });
            scrollToTopBtn.addEventListener('click', () => {
                mainContentArea.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        function setupSlider(sliderData) {
            const sC = document.getElementById('slider-container'), dC = document.getElementById('slider-dots');
            if (!sC || !dC) return;

            const slidesArray = Array.isArray(sliderData) ? sliderData : [];

            if (slidesArray.length === 0) {
                dC.innerHTML = '';
                sC.innerHTML = '<div class="text-center w-full p-10 bg-gray-800/50 rounded-xl"><i class="fa-solid fa-images text-4xl text-gray-500 mb-4"></i><p class="text-gray-400">No promotional content available.</p></div>';
                return;
            }

            sC.innerHTML = slidesArray.map(slide => {
                let mediaElement = '';
                let clickableIndicator = '';
                const hasPostId = slide.postId || slide.guildPostId || slide.playerSquadPostId;
                let wrapperClass = hasPostId ? 'cursor-pointer' : '';

                switch(slide.type) {
                    case 'video': mediaElement = `<video class="slider-media" src="${slide.url}" loop playsinline ${slide.autoplay ? 'autoplay' : ''} ${!slide.isMuted ? '' : 'muted'}></video>`; break;
                    case 'gif': case 'image': default: mediaElement = `<img src="${slide.url}" class="slider-media" alt="Slider Content" loading="lazy">`; break;
                }
                if (hasPostId) { clickableIndicator = `<div class="clickable-post-indicator"><i class="fas fa-link"></i> VIEW POST</div>`; }
                
                return `<div class="w-full flex-shrink-0 relative aspect-video ${wrapperClass}" 
                            ${slide.postId ? `data-post-id="${slide.postId}"` : ''} 
                            ${slide.guildPostId ? `data-guild-post-id="${slide.guildPostId}"` : ''}
                            ${slide.playerSquadPostId ? `data-playersquad-post-id="${slide.playerSquadPostId}"` : ''}
                        >${mediaElement}${clickableIndicator}</div>`;
            }).join('');
            
            const slides = Array.from(sC.children);
            let cI = 0;
            dC.innerHTML = Array(slides.length).fill(0).map((_, i) => `<div class="w-2 h-2 rounded-full cursor-pointer transition-colors ${i === 0 ? 'bg-white' : 'bg-white/50'}" data-index="${i}"></div>`).join('');
            dC.querySelectorAll('div').forEach(dot => dot.addEventListener('click', (e) => {
                cI = parseInt(e.target.dataset.index);
                updateSlider();
                resetAutoScrollTimer();
            }));

            let isDragging = false, startPos = 0, currentTranslate = 0, prevTranslate = 0, animationID, autoScrollTimer = null, autoScrollInterval = null;

            const slideWidth = () => slides.length > 0 ? slides[0].getBoundingClientRect().width : 0;
            
            const updateSlider = (animate = true) => {
                if (slides.length === 0) return;
                const targetTranslate = -cI * slideWidth();
                if (animate) { gsap.to(sC, { x: targetTranslate, duration: 0.5, ease: "power2.inOut" }); } 
                else { gsap.set(sC, { x: targetTranslate }); }
                currentTranslate = targetTranslate; prevTranslate = targetTranslate;
                Array.from(dC.children).forEach((dot, index) => { dot.classList.toggle('bg-white', index === cI); dot.classList.toggle('bg-white/50', index !== cI); });
                sC.querySelectorAll('video').forEach((video, index) => { if (index === cI && slidesArray[index].autoplay) { video.play().catch(e => {}); } else { video.pause(); } });
            };

            if (slides.length <= 1) { updateSlider(false); return; }

            const stopAutoScroll = () => { clearInterval(autoScrollInterval); clearTimeout(autoScrollTimer); };
            const startAutoScroll = () => { stopAutoScroll(); autoScrollInterval = setInterval(() => { cI = (cI + 1) % slides.length; updateSlider(); }, 5000); };
            const resetAutoScrollTimer = () => { stopAutoScroll(); autoScrollTimer = setTimeout(startAutoScroll, 5000); };
            const getPositionX = (event) => event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
            const touchStart = (event) => { isDragging = true; startPos = getPositionX(event); animationID = requestAnimationFrame(animation); sC.style.cursor = 'grabbing'; stopAutoScroll(); };
            const touchMove = (event) => { if (isDragging) { const currentPosition = getPositionX(event); currentTranslate = prevTranslate + currentPosition - startPos; } };
            const touchEnd = () => {
                cancelAnimationFrame(animationID);
                isDragging = false;
                const movedBy = currentTranslate - prevTranslate;
                if (movedBy < -100 && cI < slides.length - 1) cI++;
                if (movedBy > 100 && cI > 0) cI--;
                updateSlider();
                sC.style.cursor = 'grab';
                resetAutoScrollTimer();
            };
            const animation = () => { gsap.set(sC, { x: currentTranslate }); if (isDragging) requestAnimationFrame(animation); };
            sC.style.cursor = 'grab';
            sC.addEventListener('mousedown', touchStart); sC.addEventListener('touchstart', touchStart, { passive: true });
            sC.addEventListener('mouseup', touchEnd); sC.addEventListener('mouseleave', () => { if (isDragging) touchEnd(); });
            sC.addEventListener('touchend', touchEnd); sC.addEventListener('mousemove', touchMove); sC.addEventListener('touchmove', touchMove, { passive: true });
            
            updateSlider(false); startAutoScroll();
        }

        function highlightPost(postId, postType = 'event') {
            handleNavigation('home-content');

            setTimeout(() => {
                let tabSelector, feedSelector, postSelector;

                switch(postType) {
                    case 'guild':
                        tabSelector = '#home-tabs .home-tab-link[data-target="home-guild-feed"]';
                        feedSelector = '#home-guild-feed';
                        postSelector = `.guild-post-card[data-guild-post-id-wrapper="${postId}"]`;
                        break;
                    case 'playerSquad':
                        tabSelector = '#home-tabs .home-tab-link[data-target="home-player-squad-feed"]';
                        feedSelector = '#home-player-squad-feed';
                        postSelector = `.player-squad-post-card[data-playersquad-post-id-wrapper="${postId}"]`;
                        break;
                    case 'event':
                    default:
                        tabSelector = '#home-tabs .home-tab-link[data-target="post-feed"]';
                        feedSelector = '#post-feed';
                        postSelector = `.post-card[data-post-id-wrapper="${postId}"]`;
                        break;
                }

                const tabToClick = document.querySelector(tabSelector);
                if (tabToClick) tabToClick.click();
                
                const postFeed = document.querySelector(feedSelector);
                const postElement = document.querySelector(postSelector);
                
                if (postElement && postFeed) {
                    document.querySelectorAll('.highlighted-post').forEach(el => el.classList.remove('highlighted-post'));
                    postFeed.prepend(postElement);
                    postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    postElement.classList.add('highlighted-post');
                    gsap.fromTo(postElement, { scale: 1 }, { scale: 1.05, duration: 0.5, yoyo: true, repeat: 3 });
                    setTimeout(() => {
                        postElement.classList.remove('highlighted-post');
                    }, 3000);
                } else {
                    showModal('error', 'Post Not Found', 'This promotional post may have expired or is no longer available.');
                }
            }, 250);
        }
        
        document.getElementById('slider-container').addEventListener('click', e => {
            const slide = e.target.closest('[data-post-id], [data-guild-post-id], [data-playersquad-post-id]');
            if (slide) {
                if (slide.dataset.postId) {
                    highlightPost(slide.dataset.postId, 'event');
                } else if (slide.dataset.guildPostId) {
                    highlightPost(slide.dataset.guildPostId, 'guild');
                } else if (slide.dataset.playersquadPostId) {
                    highlightPost(slide.dataset.playersquadPostId, 'playerSquad');
                }
            }
        });
        
        document.getElementById('back-home-btn').addEventListener('click', () => handleNavigation('home-content')); 
        needFab.addEventListener('click', () => { 
            showCustomModal({
                title: 'কি পোস্ট করতে চান?',
                iconHtml: `<img src="${APP_LOGO_URL}" alt="Logo" class="w-24 h-24 rounded-full object-cover" loading="lazy">`,
                message: `<div class="space-y-3"><button id="fab-need-guild" class="w-full py-3 rounded-lg action-button font-bold text-sm">Guild</button><button id="fab-need-player-squad" class="w-full py-3 rounded-lg action-button font-bold text-sm">Player/Squad</button></div>`,
                primaryButton: null,
                onRender: (modal) => {
                    modal.querySelector('#fab-need-guild').addEventListener('click', () => { document.getElementById('modal-screen').classList.add('hidden'); handleNavigation('guild-post-form-content'); renderGuildPostForm(); });
                    modal.querySelector('#fab-need-player-squad').addEventListener('click', () => { document.getElementById('modal-screen').classList.add('hidden'); handleNavigation('player-squad-post-form-content'); renderPlayerSquadPostForm(); });
                }
            });
        }); 
        
        function goBackToProfile() { 
            isProfileFormDirty = false;
            handleNavigation('profile-content'); 
        }
        function goHome() { handleNavigation('home-content'); }
        
        function calculateMyTeamStats(seasonStartDate, seasonEndDate) {
            const team = currentUserData.team;
            if (!team) return { played: 0, kills: 0, positionPoints: 0, totalPoints: 0, wins: 0 };

            const allPosts = Object.values(window.dbData.posts || {});
            const myTeamId = team.id;
            
            let played = 0, kills = 0, positionPoints = 0, totalPoints = 0, wins = 0;
            
            const seasonPosts = allPosts.filter(p => 
                p.status === 'completed' &&
                new Date(p.timestamp) >= seasonStartDate &&
                new Date(p.timestamp) <= seasonEndDate
            );

            seasonPosts.forEach(post => {
                const participantEntry = Object.values(post.participants || {}).find(p => p.teamId === myTeamId);
                if (participantEntry) {
                    played++;
                    if (post.details.matchType === 'Clash Squad') {
                        if (post.csResults && post.csResults.winner === myTeamId) {
                            if(post.details.eventType !== 'practice') { 
                                totalPoints += 6;
                            }
                            wins++;
                        }
                    } else { // BR Match
                        if (post.approvedResults && post.approvedResults[participantEntry.userId]) {
                            Object.values(post.approvedResults[participantEntry.userId]).forEach(mapResult => {
                                const mapKills = parseInt(mapResult.kills, 10) || 0;
                                const mapPosition = parseInt(mapResult.position, 10) || 0;
                                
                                kills += mapKills;
                                if(post.details.eventType !== 'practice') { 
                                    const ppMap = { 1: 12, 2: 9, 3: 8, 4: 7, 5: 6, 6: 5, 7: 4, 8: 3, 9: 2, 10: 1 };
                                    const mapPosPoints = ppMap[mapPosition] || 0;
                                    positionPoints += mapPosPoints;
                                    totalPoints += (mapKills + mapPosPoints);
                                }
                                if (mapPosition === 1) wins++;
                            });
                        }
                    }
                }
            });
            
            return { played, kills, positionPoints, totalPoints, wins };
        }

        function renderMyTeamPage() {
            const team = currentUserData.team;
            const viewContainer = document.getElementById('team-view-mode');
            const editContainer = document.getElementById('team-edit-mode');
            const form = document.getElementById('team-form');

            if (team) {
                const banLiftTime = team.banLiftTimestamp;
                const isBanned = banLiftTime && (banLiftTime === -1 || Date.now() < banLiftTime);
                
                viewContainer.classList.remove('hidden');
                editContainer.classList.add('hidden');
                
                let banOverlayHTML = '';
                if(isBanned) {
                    const banMessage = banLiftTime === -1 
                        ? 'আপনার টিমকে স্থায়ীভাবে ব্যান করা হয়েছে।' 
                        : 'আপনার টিমকে সাময়িকভাবে ব্যান করা হয়েছে।';

                    banOverlayHTML = `
                    <div id="team-ban-overlay">
                        <i class="fa-solid fa-ban text-6xl text-red-500 mb-4"></i>
                        <h2 class="text-2xl font-bold text-red-400">টিম ব্যানড</h2>
                        <p class="text-gray-300 mt-2">${banMessage}</p>
                        ${banLiftTime !== -1 ? `<p class="mt-4 text-lg font-bold" data-ban-lift="${new Date(banLiftTime).toISOString()}">${new Date(banLiftTime).toLocaleString()}</p>` : ''}
                        <button id="close-ban-overlay" class="mt-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">Close</button>
                    </div>`;
                }
                
                const allBadges = window.dbData.admin?.config?.verifiedBadges || {};
                let badgeHTML = '';
                if (team.equippedBadge) { 
                    const badgeData = allBadges[team.equippedBadge];
                    if(badgeData && badgeData.type === 'team') {
                        const expiry = team.earnedBadges[team.equippedBadge];
                        const timerHTML = (typeof expiry === 'number') ? `<div class="item-timer" data-expiry="${new Date(expiry).toISOString()}"></div>` : '';
                        badgeHTML = `<div class="relative">${timerHTML}<img src="${badgeData.url}" class="verification-badge" data-badge-index="${team.equippedBadge}"></div>`;
                    }
                }

                const membersHTML = team.members.map((member, index) => {
                    const isIgl = index === 0;
                    const iglBadge = isIgl ? '<span class="ml-2 text-xs font-bold bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">IGL</span>' : '';
                    return `<div class="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                                <div>
                                    <p class="font-semibold ${isIgl ? 'text-yellow-300' : 'text-white'} flex items-center">${member.name} ${iglBadge}</p>
                                    <p class="text-xs text-gray-400">Game UID: ${member.gameUid}</p>
                                </div>
                            </div>`;
                }).join('');
                
                const isLeader = team.members[0]?.gameUid == currentUserData.team?.members[0]?.gameUid && team.members[0]?.name == currentUserData.team?.members[0]?.name;
                let badgeSelectionHTML = '';
                if (isLeader && team.earnedBadges && Object.keys(team.earnedBadges).length > 0) {
                    const earnedBadgesHTML = Object.keys(team.earnedBadges).map(badgeId => {
                        const badgeData = allBadges[badgeId];
                        if (!badgeData || badgeData.type !== 'team') return '';
                        const isEquipped = team.equippedBadge == badgeId;
                        const expiry = team.earnedBadges[badgeId];
                        const timerHTML = (typeof expiry === 'number') ? `<div class="item-timer" data-expiry="${new Date(expiry).toISOString()}"></div>` : '';
                        const mediaHTML = badgeData.type === 'video' ? `<video src="${badgeData.url}" autoplay loop muted playsinline></video>` : `<img src="${badgeData.url}" alt="${badgeData.title}">`;
                        
                        return `<div class="earned-badge-item ${isEquipped ? 'equipped' : ''}" data-badge-id="${badgeId}">
                                    ${timerHTML}
                                    ${mediaHTML}
                                </div>`;
                    }).join('');

                    badgeSelectionHTML = `
                        <div id="team-badge-selection" class="mt-8">
                            <h3 class="font-bold text-lg mb-3">Equip Badge</h3>
                            <div id="earned-badges-container" class="grid grid-cols-4 gap-4">
                                ${earnedBadgesHTML}
                            </div>
                        </div>`;
                }
                
                const seasonStartDateString = window.dbData.admin?.leaderboard?.seasonStartDate;
                let statsHTML = '';
                
                let banTimerHTML = '';
                if (isBanned && banLiftTime !== -1) {
                     banTimerHTML = `<span class="team-ban-timer" data-ban-lift="${new Date(banLiftTime).toISOString()}"></span>`;
                }
                
                let teamUidHTML = '';
                if (team.teamUid) {
                    teamUidHTML = `
                    <div class="flex items-center justify-center gap-2 mt-2">
                        <p class="text-sm text-gray-400">Team UID: <span id="team-display-uid">${team.teamUid}</span></p>
                        <button id="copy-team-uid-btn" class="text-xs text-gray-500 hover:text-white bg-gray-700 p-1 rounded cursor-pointer"><i class="fa-solid fa-copy"></i></button>
                    </div>
                    `;
                }


                if (team.bannedFromLeaderboard) {
                    statsHTML = `<div class="mt-8 bg-red-900/50 border border-red-700 rounded-xl p-4 text-center"><h3 class="font-bold text-red-400">Banned from Leaderboard</h3><p class="text-sm text-gray-300">This team cannot participate in the current leaderboard season.</p></div>`;
                } else if (seasonStartDateString) {
                     const seasonStartDate = new Date(seasonStartDateString);
                     const seasonEndDate = new Date(seasonStartDate.getTime() + 60 * 24 * 60 * 60 * 1000);
                     const stats = calculateMyTeamStats(seasonStartDate, seasonEndDate);
                     const fullLeaderboard = getFullLeaderboardData();
                     const myTeamRankIndex = fullLeaderboard.findIndex(t => t.team.id === team.id);
                     const myRank = myTeamRankIndex !== -1 ? myTeamRankIndex + 1 : 'N/A';
                     
                     statsHTML = `
                        <div class="mt-8">
                            <h3 class="font-bold text-lg mb-3">Team Season Stats</h3>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                                <div class="bg-gray-900/50 p-3 rounded-lg"><p class="text-2xl font-bold font-oswald">${myRank}</p><p class="text-xs text-gray-400">Rank</p></div>
                                <div class="bg-gray-900/50 p-3 rounded-lg"><p class="text-2xl font-bold font-oswald text-green-400">${stats.totalPoints}</p><p class="text-xs text-gray-400">Total Points</p></div>
                                <div class="bg-gray-900/50 p-3 rounded-lg"><p class="text-2xl font-bold font-oswald">${stats.played}</p><p class="text-xs text-gray-400">Matches</p></div>
                                <div class="bg-gray-900/50 p-3 rounded-lg"><p class="text-2xl font-bold font-oswald">${stats.wins}</p><p class="text-xs text-gray-400">Wins</p></div>
                                <div class="bg-gray-900/50 p-3 rounded-lg"><p class="text-2xl font-bold font-oswald text-red-400">${stats.kills}</p><p class="text-xs text-gray-400">Total Kills</p></div>
                                <div class="bg-gray-900/50 p-3 rounded-lg"><p class="text-2xl font-bold font-oswald text-blue-400">${stats.positionPoints}</p><p class="text-xs text-gray-400">Position Pts</p></div>
                            </div>
                        </div>
                    `;
                }

                viewContainer.innerHTML = `
                    ${banOverlayHTML}
                    <div class="text-center mb-6">
                        <img src="${team.logo || DEFAULT_TEAM_LOGO}" class="w-28 h-28 rounded-full mx-auto border-4 ${isBanned ? 'border-red-500' : 'border-green-500'} object-cover">
                        <h2 class="text-3xl font-bold mt-4 flex items-center justify-center ${isBanned ? 'team-name-banned' : ''}">${team.name} ${badgeHTML} ${banTimerHTML}</h2>
                        ${teamUidHTML}
                    </div>
                    ${statsHTML}
                    <div class="mt-8"><h3 class="font-bold text-lg mb-3">Team Roster</h3><div class="space-y-3">${membersHTML}</div></div>
                    ${badgeSelectionHTML}
                    <div class="grid grid-cols-2 gap-4 mt-6">
                       ${!team.teamUid ? '<button id="create-team-uid-btn" class="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-lg">Create Team UID</button>' : ''}
                       <button id="show-edit-team-btn" class="w-full py-3 rounded-xl action-button text-lg ${!team.teamUid ? 'col-span-2' : ''}">Edit Team</button>
                    </div>
                `;

                document.getElementById('show-edit-team-btn')?.addEventListener('click', () => {
                    populateTeamFormForEdit();
                    viewContainer.classList.add('hidden');
                    editContainer.classList.remove('hidden');
                });

                document.getElementById('create-team-uid-btn')?.addEventListener('click', handleCreateTeamUID);
                document.getElementById('copy-team-uid-btn')?.addEventListener('click', () => {
                    navigator.clipboard.writeText(team.teamUid).then(() => showModal('success', 'Copied!', 'Team UID copied.'));
                });
                
                const closeBanOverlayBtn = document.getElementById('close-ban-overlay');
                if (closeBanOverlayBtn) {
                    closeBanOverlayBtn.addEventListener('click', () => {
                        document.getElementById('team-ban-overlay').remove();
                    });
                }

                viewContainer.querySelectorAll('.earned-badge-item').forEach(item => {
                    item.addEventListener('click', () => handleEquipBadge(item.dataset.badgeId, 'team'));
                });

            } else {
                viewContainer.classList.add('hidden');
                editContainer.classList.remove('hidden');
                form.reset();
                document.getElementById('team-logo-preview').src = DEFAULT_TEAM_LOGO;
                document.getElementById('save-team-btn').textContent = "Create Team";
                document.getElementById('team-name').readOnly = false;
                document.getElementById('team-name-change-notice').classList.add('hidden');
                for(let i=0; i < 7; i++) {
                    const nameInput = document.querySelector(`#member-${i}-name`);
                    const uidInput = document.querySelector(`#member-${i}-game-uid`);
                    if (nameInput) nameInput.value = '';
                    if (uidInput) uidInput.value = '';
                }
            }
        }
        
        async function handleEquipBadge(itemId, itemType) {
            const updates = {};
            let path, currentEquippedId, successMessage;

            const checkExpiry = (itemCollection, id) => {
                if(!itemCollection || !itemCollection[id]) return true;
                const expiry = itemCollection[id];
                return (typeof expiry === 'number' && Date.now() > expiry);
            }

            switch(itemType) {
                case 'team':
                    if (checkExpiry(currentUserData.team?.earnedBadges, itemId)) { showModal('error', 'Expired', 'This badge has expired.'); return; }
                    path = `users/${auth.currentUser.uid}/team/equippedBadge`;
                    currentEquippedId = currentUserData.team?.equippedBadge;
                    successMessage = "Team badge updated!";
                    break;
                case 'profile_badge':
                     if (checkExpiry(currentUserData.earnedBadges, itemId)) { showModal('error', 'Expired', 'This badge has expired.'); return; }
                    path = `users/${auth.currentUser.uid}/equippedProfileBadge`;
                    currentEquippedId = currentUserData.equippedProfileBadge;
                    successMessage = "Profile badge updated!";
                    break;
                case 'frame':
                     if (checkExpiry(currentUserData.inventory?.frames, itemId)) { showModal('error', 'Expired', 'This frame has expired.'); return; }
                    path = `users/${auth.currentUser.uid}/equippedFrame`;
                    currentEquippedId = currentUserData.equippedFrame;
                    successMessage = "Profile frame updated!";
                    break;
                case 'profile_effect':
                     if (checkExpiry(currentUserData.inventory?.effects, itemId)) { showModal('error', 'Expired', 'This background has expired.'); return; }
                    path = `users/${auth.currentUser.uid}/equippedEffect`;
                    currentEquippedId = currentUserData.equippedEffect;
                    successMessage = "Profile background updated!";
                    break;
                default:
                    return;
            }
            
            const newValue = (currentEquippedId === itemId) ? null : itemId;
            updates[path] = newValue;
            
            showLoader('Updating...');
            try {
                await database.ref().update(updates);
                hideLoader();
                showModal('success', 'Success!', successMessage);
            } catch(err) {
                hideLoader();
                handleFirebaseError(err);
            }
        }


        function populateTeamFormForEdit() {
            const team = currentUserData.team;
            if (!team) return;
            document.getElementById('team-name').value = team.name;
            document.getElementById('team-logo-preview').src = team.logo || DEFAULT_TEAM_LOGO;
            if(team.squadType === 'girls') { document.getElementById('squad-girls').checked = true; }
            else { document.getElementById('squad-boys').checked = true; }
            
            for(let i=0; i < 7; i++) {
                const member = team.members[i];
                const nameInput = document.querySelector(`#member-${i}-name`);
                const uidInput = document.querySelector(`#member-${i}-game-uid`); 
                if(member && nameInput && uidInput) {
                    nameInput.value = member.name;
                    uidInput.value = member.gameUid;
                } else if (nameInput && uidInput) {
                    nameInput.value = '';
                    uidInput.value = '';
                }
            }
            document.getElementById('save-team-btn').textContent = "Update Team";
            document.getElementById('team-name').readOnly = true;
            document.getElementById('team-name-change-notice').classList.remove('hidden');
        }
        
        function findUserByNumericId(numericId) {
            if (!numericId) return null;
            const allUsers = Object.values(window.dbData.users || {});
            const numericIdAsNumber = parseInt(numericId, 10);
            if (isNaN(numericIdAsNumber)) return null;
            return allUsers.find(user => user.userId === numericIdAsNumber);
        }

        document.getElementById('team-form').addEventListener('submit', async e => {
            e.preventDefault();
            const form = e.target;
        
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) submitButton.disabled = true;
            showLoader('Saving Team...');
        
            try {
                const teamName = document.getElementById('team-name').value.trim();
                if (!teamName) throw new Error('Please enter a name for your team.');
        
                const allUsers = Object.values(window.dbData.users || {});
                const isNameTaken = allUsers.some(user => user.team && user.team.name.toLowerCase() === teamName.toLowerCase() && (!currentUserData.team || user.team.id !== currentUserData.team.id));
                if (isNameTaken) throw new Error('This team name is already in use. Please choose another.');
                
                const teamLogoFile = document.getElementById('team-logo-upload').files[0];
                let logoInfo = { url: currentUserData.team?.logo || DEFAULT_TEAM_LOGO, size: currentUserData.team?.logoSizeKB || 0 };
                const oldSize = logoInfo.size;
                if (teamLogoFile) {
                    const uploadResult = await uploadImage(teamLogoFile, 'team-logos');
                    if (!uploadResult) throw new Error("Logo upload failed.");
                    logoInfo.url = uploadResult.url; logoInfo.size = uploadResult.size;
                }
                const members = [];
                for (let i = 0; i < 7; i++) {
                    const name = document.querySelector(`#member-${i}-name`).value.trim();
                    const gameUid = document.querySelector(`#member-${i}-game-uid`).value.trim();
                    if (name && gameUid) { members.push({ name, gameUid }); }
                }
                if (members.length < 4) throw new Error('Please provide details for at least 4 players.');
                
                const wasUpdating = !!currentUserData.team;
                const squadType = document.querySelector('input[name="squad-type"]:checked').value;
                const teamData = { id: wasUpdating ? currentUserData.team.id : Date.now(), name: teamName, logo: logoInfo.url, logoSizeKB: logoInfo.size, squadType: squadType, members };
                
                if (wasUpdating) {
                    if(currentUserData.team.teamUid) teamData.teamUid = currentUserData.team.teamUid;
                    if(currentUserData.team.verifiedBadge) teamData.verifiedBadge = currentUserData.team.verifiedBadge;
                    if(currentUserData.team.earnedBadges) teamData.earnedBadges = currentUserData.team.earnedBadges;
                    if(currentUserData.team.equippedBadge) teamData.equippedBadge = currentUserData.team.equippedBadge;
                }

                await database.ref('users/' + auth.currentUser.uid + '/team').set(teamData);
                
                updateTotalStorage(logoInfo.size - oldSize);
        
                hideLoader();
                showModal('success', `Team ${wasUpdating ? 'Updated' : 'Created'}!`, `Your team has been successfully ${wasUpdating ? 'updated' : 'created'}.`, 'Awesome!', () => handleNavigation('profile-content'));
            } catch (error) {
                hideLoader();
                handleFirebaseError(error);
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
        
        let bookingState = { postId: null, post: null, selectedTeam: null, selectedPlayers: [], selectedCouponId: null };
        document.body.addEventListener('click', e => { 
            const bookBtn = e.target.closest('.booking-btn'); 
            const sponsorTrigger = e.target.closest('.sponsor-profile-trigger');
            const verifiedBadge = e.target.closest('.verification-badge');
            const bookedCard = e.target.closest('.is-booked-card');
            const participantEntry = e.target.closest('.participant-list-entry');

            if (bookedCard && !bookBtn && !sponsorTrigger && !verifiedBadge) {
                handleNavigation('my-matches-content');
                return;
            }
            
            if (participantEntry) {
                const userId = participantEntry.dataset.userId;
                handleNavigation('user-profile-content');
                renderUserProfile(userId);
                return;
            }

            if (verifiedBadge) {
                e.preventDefault(); e.stopPropagation();
                const badgeIndex = verifiedBadge.dataset.badgeIndex;
                const allBadges = window.dbData.admin?.config?.verifiedBadges || {};
                const badgeData = allBadges[badgeIndex];
                if (badgeData) {
                    showBadgeModal(badgeData);
                } else {
                    showModal('success', 'Verified', 'This is a verified user, team, or sponsor.', 'OK');
                }
                return;
            }

            if (bookBtn && !bookBtn.disabled) { 
                const postId = bookBtn.dataset.postId;
                const post = window.dbData.posts[postId];
                const isSoloMatch = post.details.teamType.toLowerCase() === 'solo' || post.details.teamType.toLowerCase() === '1v1';

                if (currentUserData.wallet.live < post.entryFee) { showModal('error', 'Insufficient Balance', `You need ${post.entryFee} TK to book this match. Your balance is ${currentUserData.wallet.live.toFixed(2)} TK.`); return; } 
                if (!isSoloMatch && !currentUserData.team) { showModal('error', 'No Team Found', `You must create a team to join Squad, Duo or CS matches. Go to Profile -> My Team.`, 'Go to Profile', () => { handleNavigation('profile-content'); setTimeout(() => document.getElementById('create-team-button').click(), 250); }); return; } 

                bookingState = { postId, post, selectedTeam: currentUserData.team, selectedPlayers: [], selectedCouponId: null }; 
                handleNavigation('booking-content');
                renderBookingStep_Rules(); 
            }
            if(sponsorTrigger) { const sponsorId = sponsorTrigger.dataset.sponsorId; handleNavigation('sponsor-profile-content'); renderSponsorProfile(sponsorId); }
        });

        function playBookingSound() { const soundUrl = window.dbData.admin?.settings?.bookingSoundUrl; if (soundUrl) { const audio = document.getElementById('booking-success-sound'); if (audio) { audio.src = soundUrl; audio.play().catch(e => console.error("Audio play failed.", e)); } } }
        
        function handleBookingConfirmation() {
            const { post, selectedTeam, selectedPlayers, selectedCouponId } = bookingState;
            const userCoupons = currentUserData.coupons || {};
            const selectedCoupon = selectedCouponId ? userCoupons[selectedCouponId] : null;

            let finalFee = post.entryFee;
            let discountAmount = 0;
            if (selectedCoupon && selectedCoupon.minMatchValue <= post.entryFee) {
                discountAmount = selectedCoupon.discountValue;
                finalFee -= discountAmount;
            }

            if (currentUserData.wallet.live < finalFee) {
                showModal('error', 'Booking Failed', 'Your balance is insufficient for the final booking fee.');
                return;
            }

            const updates = {};
            const slotNumber = (post.slots.booked || 0) + 1;
            const newParticipantKey = database.ref(`posts/${post.id}/participants`).push().key;

            updates[`/posts/${post.id}/slots/booked`] = slotNumber;
            updates[`/posts/${post.id}/participants/${newParticipantKey}`] = { userId: auth.currentUser.uid, teamId: selectedTeam ? selectedTeam.id : null, players: selectedPlayers, slotNumber: slotNumber };
            updates[`/users/${auth.currentUser.uid}/wallet/live`] = currentUserData.wallet.live - finalFee;
            updates[`/users/${auth.currentUser.uid}/bookings/${post.id}`] = { postId: post.id, teamId: selectedTeam ? selectedTeam.id : null, players: selectedPlayers, bookingDate: new Date().toISOString(), finalFee: finalFee, couponUsed: selectedCouponId };
            
            const authorCurrentEventBalance = window.dbData.users[post.authorId]?.wallet.event || 0;
            updates[`/users/${post.authorId}/wallet/event`] = authorCurrentEventBalance + post.entryFee;
            
            if (selectedCouponId) {
                updates[`/users/${auth.currentUser.uid}/coupons/${selectedCouponId}/used`] = true;
                updates[`/users/${auth.currentUser.uid}/coupons/${selectedCouponId}/usedOnMatch`] = post.id;
            }

            database.ref().update(updates).then(() => { 
                playBookingSound();
                showModal('success', 'Booking Confirmed!', `You have successfully booked slot #${slotNumber}. Good luck!`, 'Awesome!', () => { 
                    handleNavigation('my-matches-content'); 
                }); 
            }).catch(err => { handleFirebaseError(err); });
        }

    function renderBookingStep_Rules() {
        const contentArea = document.getElementById('booking-content');
        const post = bookingState.post;
        const rules = post.details.rules;
        const rulesHTML = (rules && rules.length > 0) ? `<ul class="list-disc list-inside text-gray-300 space-y-2">${rules.map(rule => `<li>${rule}</li>`).join('')}</ul>` : '<p class="text-gray-300">No specific rules provided for this match.</p>';
        
        contentArea.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="flex-grow overflow-y-auto no-scrollbar">
                    <div class="p-4 bg-[#1e1e1e] border border-gray-700 rounded-lg mb-6">${rulesHTML}</div>
                    <label for="agree-rules" class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" id="agree-rules" class="hidden">
                        <div class="w-6 h-6 border-2 border-gray-500 rounded flex items-center justify-center check-icon-container">
                            <i class="fa-solid fa-check text-white hidden"></i>
                        </div>
                        <span class="text-gray-300">I have read and agree to the match rules.</span>
                    </label>
                </div>
                <div class="flex-shrink-0 p-4 bg-black flex gap-2">
                    <button id="booking-back-btn-2" class="w-1/3 py-3 rounded-lg bg-gray-600 font-bold">Back</button>
                    <button id="booking-next-btn-2" class="w-2/3 py-3 rounded-lg action-button" disabled>Next</button>
                </div>
            </div>`;

        const agreeCheckbox = contentArea.querySelector('#agree-rules'), nextBtn = contentArea.querySelector('#booking-next-btn-2');
        agreeCheckbox.addEventListener('change', () => { contentArea.querySelector('.check-icon-container .fa-check').classList.toggle('hidden', !agreeCheckbox.checked); nextBtn.disabled = !agreeCheckbox.checked; });
        nextBtn.addEventListener('click', renderBookingStep_TeamSelection);
        contentArea.querySelector('#booking-back-btn-2').addEventListener('click', () => { window.history.back(); });
    }

    function renderBookingStep_TeamSelection() {
        const post = bookingState.post;
        const teamType = post.details.teamType.toLowerCase();

        // Clash Squad Logic
        if (post.details.matchType === 'Clash Squad') {
            if (teamType === '4v4') { renderBookingStep_PlayerSelection(4); } 
            else if (teamType === '2v2') { renderBookingStep_PlayerSelection(2); }
            else if (teamType === '1v1') { renderBookingStep_PlayerSelection(1); }
            return;
        }

        // Battle Royal Logic
        if (teamType === 'solo') { renderBookingStep_SoloForm(); } 
        else if (teamType === 'duo') { renderBookingStep_PlayerSelection(2); } 
        else if (teamType === 'squad') { renderBookingStep_PlayerSelection(5); }
    }

    function renderBookingStep_SoloForm() {
        const contentArea = document.getElementById('booking-content');
        const myTeam = currentUserData.team;
        let selectionHTML = '';

        if (myTeam && myTeam.members && myTeam.members.length > 0) {
            const igl = myTeam.members[0];
            selectionHTML = `<div class="p-4 bg-green-500/30 border border-green-500 rounded-lg"><p class="font-semibold">${igl.name} (from your team)</p><p class="text-xs text-gray-400">Game UID: ${igl.gameUid}</p></div><p class="text-xs text-center text-gray-400 mt-2">You will be registered using your IGL info.</p>`;
        } else {
            selectionHTML = `<div class="form-section p-4 rounded-xl space-y-4"><p class="text-sm text-gray-300 mb-2">Provide your in-game details for this solo match.</p><div><label for="solo-ingame-name" class="form-label">In-Game Name</label><input type="text" id="solo-ingame-name" class="form-input" placeholder="Your In-Game Name" value="${currentUserData.name || ''}" required></div><div><label for="solo-ingame-uid" class="form-label">In-Game UID</label><input type="text" id="solo-ingame-uid" class="form-input" placeholder="Your In-Game UID" required></div></div>`;
        }

        contentArea.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="flex-grow overflow-y-auto no-scrollbar">
                    <h1 class="text-2xl font-bold mb-6">Confirm Your Entry</h1>
                    <div class="space-y-3">${selectionHTML}</div>
                </div>
                <div class="flex-shrink-0 p-4 bg-black flex gap-2">
                    <button id="booking-back-btn-3" class="w-1/3 py-3 rounded-lg bg-gray-600 font-bold">Back</button>
                    <button id="booking-next-btn-3" class="w-2/3 py-3 rounded-lg action-button">Next</button>
                </div>
            </div>`;

        contentArea.querySelector('#booking-back-btn-3').addEventListener('click', () => window.history.back());
        contentArea.querySelector('#booking-next-btn-3').addEventListener('click', () => {
            if (myTeam && myTeam.members && myTeam.members.length > 0) {
                bookingState.selectedPlayers = [myTeam.members[0]];
            } else {
                const soloName = document.getElementById('solo-ingame-name').value.trim();
                const soloUid = document.getElementById('solo-ingame-uid').value.trim();
                if (!soloName || !soloUid) {
                    showModal('error', 'Details Required', 'Please enter your In-Game Name and UID.');
                    return;
                }
                bookingState.selectedPlayers = [{ name: soloName, gameUid: soloUid }];
            }
            renderBookingStep_Confirm();
        });
    }
    
    function renderBookingStep_PlayerSelection(requiredPlayers) {
        const contentArea = document.getElementById('booking-content');
        const myTeam = currentUserData.team;
        const shouldAutoSelect = myTeam.members.length === requiredPlayers;

        const selectionHTML = myTeam.members.map((member, index) => `<label class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 bg-[#1e1e1e] border border-gray-700"><input type="checkbox" class="player-checkbox hidden" value="${index}" ${shouldAutoSelect ? 'checked' : ''}><div class="w-6 h-6 border-2 border-gray-500 rounded-md flex items-center justify-center check-icon-container"><i class="fa-solid fa-check text-white hidden"></i></div><div><p class="font-semibold">${member.name} ${index === 0 ? '(IGL)' : ''}</p><p class="text-xs text-gray-400">Game UID: ${member.gameUid}</p></div></label>`).join('');
        
        contentArea.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="flex-grow overflow-y-auto no-scrollbar">
                    <h1 class="text-2xl font-bold mb-6">Select Your Team (${requiredPlayers} Players)</h1>
                    <p class="text-sm text-yellow-400 -mt-4 mb-4">Select ${requiredPlayers} players from your roster for this match.</p>
                    <div class="space-y-3">${selectionHTML}</div>
                </div>
                <div class="flex-shrink-0 p-4 bg-black flex gap-2">
                    <button id="booking-back-btn-3" class="w-1/3 py-3 rounded-lg bg-gray-600 font-bold">Back</button>
                    <button id="booking-next-btn-3" class="w-2/3 py-3 rounded-lg action-button" ${shouldAutoSelect ? '' : 'disabled'}>Next</button>
                </div>
            </div>`;

        contentArea.querySelector('#booking-back-btn-3').addEventListener('click', () => window.history.back());
        contentArea.querySelector('#booking-next-btn-3').addEventListener('click', () => {
            const selectedIndexes = Array.from(contentArea.querySelectorAll('.player-checkbox:checked')).map(cb => parseInt(cb.value)); 
            bookingState.selectedPlayers = selectedIndexes.map(i => myTeam.members[i]);
            renderBookingStep_Confirm();
        });
        
        const checkboxes = contentArea.querySelectorAll('.player-checkbox');
        const nextBtn = contentArea.querySelector('#booking-next-btn-3');

        const updateSelectionState = () => {
            checkboxes.forEach(cb => {
                const label = cb.closest('label');
                label.classList.toggle('bg-green-500/30', cb.checked);
                label.classList.toggle('border-green-500', cb.checked);
                label.classList.toggle('bg-[#1e1e1e]', !cb.checked);
                label.classList.toggle('border-gray-700', !cb.checked);
                label.querySelector('.fa-check').classList.toggle('hidden', !cb.checked);
            });
            nextBtn.disabled = contentArea.querySelectorAll('.player-checkbox:checked').length !== requiredPlayers;
        };
        
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                const checkedCount = contentArea.querySelectorAll('.player-checkbox:checked').length;
                if (checkedCount > requiredPlayers) {
                    cb.checked = false;
                }
                updateSelectionState();
            });
        });

        updateSelectionState();
    }

    function renderBookingStep_Confirm() {
        const contentArea = document.getElementById('booking-content'); 
        const playersHTML = bookingState.selectedPlayers.map(p => `<li class="text-gray-300">${p.name} <span class="text-xs text-gray-500">(Game UID: ${p.gameUid})</span></li>`).join(''); 
        const teamName = bookingState.post.details.teamType === 'squad' ? `: ${bookingState.selectedTeam.name}` : ` (${bookingState.post.details.teamType.toUpperCase()})`;
        
        const userCoupons = currentUserData.coupons || {};
        const now = Date.now();
        const activeCoupons = Object.entries(userCoupons).filter(([,coupon]) => !coupon.used && new Date(coupon.expiryDate).getTime() > now);

        let couponsHTML = '';
        if (activeCoupons.length > 0) {
            const couponOptions = activeCoupons.map(([id, coupon]) => {
                const isApplicable = bookingState.post.entryFee >= coupon.minMatchValue;
                const disabledReason = !isApplicable ? `(Match must be at least ${coupon.minMatchValue} TK)` : '';
                return `
                    <div>
                        <input type="radio" name="coupon" id="coupon-${id}" value="${id}" class="hidden coupon-radio" ${!isApplicable ? 'disabled' : ''}>
                        <label for="coupon-${id}" class="coupon-radio-label block p-3 rounded-lg cursor-pointer">
                            <div class="flex justify-between items-center">
                                <span class="font-bold text-white">${coupon.discountValue} TK Discount</span>
                                <span class="text-xs text-gray-400">${disabledReason}</span>
                            </div>
                        </label>
                    </div>
                `;
            }).join('');
            couponsHTML = `<div class="p-4 bg-[#1e1e1e] border border-gray-700 rounded-lg">
                            <p class="text-sm text-green-400 font-bold mb-3">Apply Coupon</p>
                            <div class="space-y-2">${couponOptions}</div>
                          </div>`;
        }
        
        contentArea.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="flex-grow overflow-y-auto no-scrollbar">
                    <h1 class="text-2xl font-bold mb-6">Confirmation</h1>
                    <div class="space-y-4">
                        <div class="p-4 bg-[#1e1e1e] border border-gray-700 rounded-lg">
                            <p class="text-sm text-gray-400">MATCH</p>
                            <p class="text-lg font-bold">${bookingState.post.details.eventName}</p>
                        </div>
                        <div class="p-4 bg-[#1e1e1e] border border-gray-700 rounded-lg">
                            <p class="text-sm text-gray-400">YOUR ROSTER${teamName}</p>
                            <ul class="list-disc list-inside mt-2">${playersHTML}</ul>
                        </div>
                        ${couponsHTML}
                        <div class="p-4 bg-[#1e1e1e] border border-gray-700 rounded-lg space-y-2" id="price-summary">
                            <div class="flex justify-between items-center text-sm">
                                <p class="text-gray-400">Entry Fee</p>
                                <p class="font-semibold">${bookingState.post.entryFee > 0 ? bookingState.post.entryFee.toFixed(2) + ' TK' : 'FREE'}</p>
                            </div>
                            <div id="discount-row" class="hidden flex justify-between items-center text-sm">
                                <p class="text-green-400">Coupon Discount</p>
                                <p class="font-semibold text-green-400">-0.00 TK</p>
                            </div>
                            <div class="border-t border-gray-600 my-1"></div>
                            <div class="flex justify-between items-center">
                                <p class="text-lg font-bold">TOTAL</p>
                                <p class="text-2xl font-bold font-oswald text-green-400">${bookingState.post.entryFee > 0 ? bookingState.post.entryFee.toFixed(2) + ' TK' : 'FREE'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex-shrink-0 p-4 bg-black">
                    <div id="swipe-confirm" class="swipe-container">
                        <div class="swipe-track"></div>
                        <div class="swipe-handle"><i class="fa-solid fa-chevron-right text-white"></i><i class="fa-solid fa-chevron-right text-white -ml-2"></i></div>
                        <div class="swipe-text">SWIPE TO CONFIRM BOOKING</div>
                    </div>
                </div>
            </div>`;

        initSwipeToConfirm();
        
        const couponRadios = contentArea.querySelectorAll('input[name="coupon"]');
        couponRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const selectedCouponId = radio.value;
                bookingState.selectedCouponId = selectedCouponId;
                updatePriceSummary();
            });
        });
    }

    function updatePriceSummary() {
        const { post, selectedCouponId } = bookingState;
        const userCoupons = currentUserData.coupons || {};
        const selectedCoupon = selectedCouponId ? userCoupons[selectedCouponId] : null;

        const summary = document.getElementById('price-summary');
        if (!summary) return;
        const discountRow = summary.querySelector('#discount-row');
        const totalAmountEl = summary.querySelector('.text-green-400.font-oswald');

        let finalFee = post.entryFee;
        if (selectedCoupon) {
            const discountAmount = selectedCoupon.discountValue;
            finalFee -= discountAmount;
            
            discountRow.classList.remove('hidden');
            discountRow.querySelector('p:last-child').textContent = `-${discountAmount.toFixed(2)} TK`;
        } else {
            discountRow.classList.add('hidden');
        }
        
        totalAmountEl.textContent = finalFee > 0 ? `${finalFee.toFixed(2)} TK` : 'FREE';
    }

    function initSwipeToConfirm(onConfirm) {
        const swipeContainer = document.querySelector('#swipe-confirm, #payment-swipe-confirm');
        if (!swipeContainer) return;
        const handle = swipeContainer.querySelector('.swipe-handle');
        const track = swipeContainer.querySelector('.swipe-track');
        const text = swipeContainer.querySelector('.swipe-text');
        
        let isDragging = false, startX, currentX;

        const resetSwipe = () => {
            handle.style.transition = 'transform 0.3s ease';
            track.style.transition = 'width 0.3s ease';
            handle.style.transform = 'translateX(0px)';
            track.style.width = '0px';
            if (text) text.style.opacity = 1;
            setTimeout(() => {
                handle.style.transition = 'none';
                track.style.transition = 'none';
            }, 300);
        };

        const onDragMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = (e.type === 'touchmove' ? e.touches[0].clientX : e.clientX) - startX;
            const maxTranslate = swipeContainer.offsetWidth - handle.offsetWidth - 12;
            let newTranslate = Math.max(0, Math.min(currentX, maxTranslate));
            handle.style.transform = `translateX(${newTranslate}px)`;
            track.style.width = `${newTranslate + handle.offsetWidth / 2}px`;
            if (text) text.style.opacity = 1 - (newTranslate / maxTranslate);
        };
        
        const onDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            handle.style.cursor = 'grab';

            document.removeEventListener('mousemove', onDragMove);
            document.removeEventListener('touchmove', onDragMove);
            document.removeEventListener('mouseup', onDragEnd);
            document.removeEventListener('touchend', onDragEnd);
            
            const maxTranslate = swipeContainer.offsetWidth - handle.offsetWidth - 12;

            if (currentX > maxTranslate * 0.8) {
                handle.style.transform = `translateX(${maxTranslate}px)`;
                track.style.width = '100%';
                if (text) text.style.opacity = 0;
                
                if (onConfirm) {
                    onConfirm(resetSwipe);
                } else {
                    handleBookingConfirmation();
                }
            } else {
                resetSwipe();
            }
        };

        const onDragStart = (e) => {
            isDragging = true;
            startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            handle.style.transition = 'none';
            track.style.transition = 'none';
            handle.style.cursor = 'grabbing';
            
            document.addEventListener('mousemove', onDragMove);
            document.addEventListener('touchmove', onDragMove, { passive: false });
            document.addEventListener('mouseup', onDragEnd);
            document.addEventListener('touchend', onDragEnd);
        };
        
        handle.addEventListener('mousedown', onDragStart);
        handle.addEventListener('touchstart', onDragStart, { passive: false });
    }
    
    function initMyMatchesPage() { 
        const container = document.getElementById('my-matches-content'); 
        if (!container) return; 
        const tabs = container.querySelectorAll('.my-matches-tab'); 
        const sections = container.querySelectorAll('.tab-content-section');
        const headerTitle = document.querySelector('#my-matches-header h2');
        
        tabs.forEach(tab => { 
            tab.addEventListener('click', () => { 
                if (tab.classList.contains('active-tab')) return; 
                tabs.forEach(t => t.classList.remove('active-tab')); 
                sections.forEach(s => s.classList.remove('active-section')); 
                tab.classList.add('active-tab'); 
                const targetSection = document.getElementById(tab.dataset.target);
                if (targetSection) targetSection.classList.add('active-section');
                if (headerTitle) {
                    headerTitle.textContent = tab.dataset.title || "My Matches";
                }
            }); 
        }); 
        
        const activeTab = container.querySelector('.my-matches-tab.active-tab');
        if (!activeTab && tabs[0]) { 
            tabs[0].click();
        } else if (activeTab && headerTitle) {
             headerTitle.textContent = activeTab.dataset.title || "My Matches";
        }
    }

    function renderMyMatchesPage() {
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const bookings = Object.entries(currentUserData.bookings || {})
            .filter(([postId, booking]) => {
                const post = window.dbData.posts?.[postId];
                if (post && (post.status === 'completed' || post.status === 'cancelled')) {
                    const eventTime = new Date(post.completedAt || post.timestamp).getTime();
                    return eventTime > sevenDaysAgo;
                }
                return true;
            })
            .reduce((obj, [key, val]) => {
                obj[key] = val;
                return obj;
            }, {});

        const posts = window.dbData.posts || {};
        const upcomingContainer = document.getElementById('upcoming-matches-container');
        const liveContainer = document.getElementById('live-matches-container');
        const claimableContainer = document.getElementById('claimable-matches-container');
        const historyContainer = document.getElementById('history-matches-container');
        
        upcomingContainer.innerHTML = '';
        liveContainer.innerHTML = '';
        claimableContainer.innerHTML = '';
        historyContainer.innerHTML = '';
        
        let upcomingMatches = [], liveMatches = [], claimableMatches = [], historyMatches = [];
        const now = Date.now();

        Object.values(bookings).forEach(booking => {
            const post = posts[booking.postId];
            if (post) {
                const isBanned = (post.bannedUsers || []).includes(auth.currentUser.uid);
                const isClaimable = post.status === 'completed' && 
                                    now > (post.prizeReleaseTimestamp || 0) &&
                                    !isBanned &&
                                    (!post.claimedBy || !post.claimedBy[auth.currentUser.uid]);

                if (isClaimable) {
                    claimableMatches.push({post, isBanned});
                } else if (isBanned || post.status === 'completed' || post.status === 'cancelled') {
                    historyMatches.push({post, isBanned});
                } else if (post.status && post.status.startsWith('live')) {
                    liveMatches.push({post, isBanned});
                } else {
                    upcomingMatches.push({post, isBanned});
                }
            }
        });

        historyMatches.sort((a, b) => new Date(b.post.completedAt || b.post.timestamp) - new Date(a.post.completedAt || a.post.timestamp));
        claimableMatches.sort((a, b) => new Date(b.post.completedAt || b.post.timestamp) - new Date(a.post.completedAt || a.post.timestamp));
        
        upcomingContainer.innerHTML = upcomingMatches.length > 0 ? upcomingMatches.map(item => createMyMatchPostCardHTML(item.post, item.isBanned)).join('') : '<p class="text-gray-500 p-4 text-center">You have no upcoming matches.</p>';
        liveContainer.innerHTML = liveMatches.length > 0 ? liveMatches.map(item => createMyMatchPostCardHTML(item.post, item.isBanned)).join('') : '<p class="text-gray-500 p-4 text-center">No matches are live right now.</p>';
        claimableContainer.innerHTML = claimableMatches.length > 0 ? claimableMatches.map(item => createMyMatchPostCardHTML(item.post, item.isBanned)).join('') : '<p class="text-gray-500 p-4 text-center">No prizes to claim.</p>';
        historyContainer.innerHTML = historyMatches.length > 0 ? historyMatches.map(item => createMyMatchPostCardHTML(item.post, item.isBanned)).join('') + '<p class="text-center text-gray-600 mt-4 text-sm">ম্যাচের হিস্টোরি ৭ দিন পর স্বয়ংক্রিয়ভাবে মুছে যাবে।</p>' : '<p class="text-gray-500 p-4 text-center">No recent match history found.</p>';
    }

    
    function createMyMatchPostCardHTML(post, isBanned = false) {
        const isLive = post.status.startsWith('live');
        const participantInfo = Object.values(post.participants || {}).find(p => p.userId === auth.currentUser.uid);
        let bottomSectionHTML = '';
        let cardClass = isLive ? 'is-live-match' : '';
        let cardWrapperStart = '<div class="relative">';
        let cardWrapperEnd = '</div>';
        
        const now = Date.now();
        const isClaimable = post.status === 'completed' && now > (post.prizeReleaseTimestamp || 0) && !isBanned && (!post.claimedBy || !post.claimedBy[auth.currentUser.uid]);
        if (isClaimable) {
            cardWrapperStart = `<div class="relative"><div class="unclaimed-prize-badge">আপনার টাকা ওয়ালেটে যোগ করুন</div>`;
        }
        
        let slotOrDeleteHTML = '';
        if (post.status === 'completed' || post.status === 'cancelled') {
            slotOrDeleteHTML = `<button class="delete-history-btn" data-post-id="${post.id}"><i class="fa-solid fa-trash-can"></i></button>`;
        } else {
            const slotNumber = participantInfo ? participantInfo.slotNumber : '?';
            slotOrDeleteHTML = `<div class="bg-gray-700 w-12 h-12 flex flex-col items-center justify-center rounded-lg"><p class="text-xs -mb-1">SLOT</p><p class="font-bold text-xl text-green-400">#${slotNumber}</p></div>`;
        }

        if (isBanned) {
            cardClass = 'banned-card';
            bottomSectionHTML = `<div class="p-3 bg-red-900/50 text-center"><p class="font-bold text-red-300">Your team was banned from this match</p></div>`;
        } else if (post.status === 'completed' || post.status === 'cancelled') {
            if (post.status === 'cancelled') {
                bottomSectionHTML = `<div class="p-3 bg-red-900/50 text-center"><p class="font-bold text-red-400">ম্যাচটি বাতিল করা হয়েছে</p></div>`;
            } else {
                const finalRankings = Object.values(post.participants || {}).map(p => { let totalPoints = 0; if (post.approvedResults && post.approvedResults[p.userId]) { Object.values(post.approvedResults[p.userId]).forEach(mapResult => { totalPoints += calculatePoints(mapResult.kills, mapResult.position); }); } return { userId: p.userId, totalPoints }; }).sort((a, b) => b.totalPoints - a.totalPoints);
                const myRankIndex = finalRankings.findIndex(r => r.userId === auth.currentUser.uid);
                const myRank = myRankIndex !== -1 ? myRankIndex + 1 : 'N/A';
                const myPoints = myRankIndex !== -1 ? finalRankings[myRankIndex].totalPoints : 'N/A';
                
                if (post.details.matchType === 'Clash Squad') {
                     const myTeamId = currentUserData.team?.id;
                     const isWinner = post.csResults?.winner === myTeamId;
                     bottomSectionHTML = `<div class="p-3 ${isWinner ? 'bg-green-800/80' : 'bg-gray-800/80'}"><p class="text-center font-bold text-gray-300 mb-2">MATCH COMPLETED</p><div class="flex justify-around text-center"><div class="font-oswald"><p class="text-2xl font-bold ${isWinner ? 'text-green-400' : 'text-white'}">${isWinner ? 'VICTORY' : 'DEFEAT'}</p><p class="text-xs text-gray-400">RESULT</p></div></div></div>`;
                } else {
                    bottomSectionHTML = `<div class="p-3 bg-gray-800/80"><p class="text-center font-bold text-gray-300 mb-2">MATCH COMPLETED</p><div class="flex justify-around text-center"><div class="font-oswald"><p class="text-2xl font-bold text-green-400">#${myRank}</p><p class="text-xs text-gray-400">RANK</p></div><div class="font-oswald"><p class="text-2xl font-bold text-white">${myPoints}</p><p class="text-xs text-gray-400">POINTS</p></div></div></div>`;
                }
            }
        } else if (isLive) {
            if (post.roomId && post.roomPass) {
                bottomSectionHTML = `
                <div class="p-3 bg-green-900/50 text-center space-y-2">
                    <p class="font-bold text-green-300 animate-pulse">MATCH IS LIVE!</p>
                    <div class="flex justify-around items-center text-xs">
                        <div class="flex items-center gap-2"><span>ID: <strong>${post.roomId}</strong></span><button class="copy-btn-card bg-gray-600 hover:bg-gray-500 w-6 h-6 rounded-md flex items-center justify-center" data-copy-text="${post.roomId}"><i class="fa-solid fa-copy text-xs"></i></button></div>
                        <div class="flex items-center gap-2"><span>PASS: <strong>${post.roomPass}</strong></span><button class="copy-btn-card bg-gray-600 hover:bg-gray-500 w-6 h-6 rounded-md flex items-center justify-center" data-copy-text="${post.roomPass}"><i class="fa-solid fa-copy text-xs"></i></button></div>
                    </div>
                </div>`;
            } else {
                bottomSectionHTML = `<div class="p-3 bg-green-900/50 text-center"><p class="font-bold text-yellow-300 animate-pulse">LIVE: Waiting for ID/Pass...</p></div>`;
            }
        } else {
            bottomSectionHTML = `<div class="p-3 bg-black/30 flex justify-between items-center"><p class="text-sm font-semibold">Match Starts In:</p><div class="countdown-container" data-countdown="${post.matchDate}"></div></div>`;
        }

        const cardHTML = `<div class="post-card rounded-2xl overflow-hidden cursor-pointer ${cardClass}" data-post-id="${post.id}"><div class="p-4"><div class="flex justify-between items-start"><div class="flex items-center gap-3"><img src="${post.imageUrl}" class="w-16 h-16 rounded-lg object-cover border-2 border-gray-600" loading="lazy"><div><p class="font-bold text-lg text-green-400">${post.details.eventName}</p><p class="text-sm text-gray-400">Match Date: ${new Date(post.matchDate).toLocaleDateString()}</p></div></div>${slotOrDeleteHTML}</div></div>${bottomSectionHTML}</div>`;
        return `${cardWrapperStart}${cardHTML}${cardWrapperEnd}`;
    }

    document.getElementById('my-matches-content').addEventListener('click', e => { 
        const copyBtn = e.target.closest('.copy-btn-card');
        if (copyBtn) {
            e.stopPropagation(); 
            const textToCopy = copyBtn.dataset.copyText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showModal('success', 'Copied!', `"${textToCopy}" has been copied.`);
            });
            return;
        }

        const deleteBtn = e.target.closest('.delete-history-btn');
        if (deleteBtn) {
            e.stopPropagation();
            const postId = deleteBtn.dataset.postId;
            showCustomModal({
                type: 'error',
                title: 'Delete History?',
                message: 'Are you sure you want to remove this match from your history?',
                primaryButton: {
                    text: 'Delete',
                    onClick: () => {
                        database.ref(`users/${auth.currentUser.uid}/bookings/${postId}`).remove()
                            .catch(handleFirebaseError);
                    }
                },
                secondaryButton: { text: 'Cancel' }
            });
            return;
        }

        const card = e.target.closest('[data-post-id]'); 
        if(!card || card.classList.contains('banned-card')) return; 
        const postId = card.dataset.postId; 
        const post = window.dbData.posts[postId]; 
        if (!post) { return; }
        
        if (post.status.startsWith('live')) {
            handleNavigation('results-submission-content');
            renderLiveMatchPage(postId);
        } else if (post.status === 'completed' || post.status === 'cancelled') { 
            handleNavigation('results-submission-content');
            renderHistoryMatchDetailsPage(postId); 
        } else { 
            handleNavigation('participant-list-content');
            showParticipantList(postId); 
        } 
    });
    
    function showParticipantList(postId) {
        const post = window.dbData.posts[postId]; if (!post) return;
        const allBadges = window.dbData.admin?.config?.verifiedBadges || {};

        const participantsHTML = Object.values(post.participants || {}).map(p => { 
            const participantUser = window.dbData.users[p.userId];
            if (!participantUser) return '';

            const team = participantUser.team;
            const isSolo = post.details.teamType.toLowerCase() === 'solo';
            const teamName = isSolo ? p.players[0].name : (team ? team.name : 'Unknown Team');
            const teamLogo = isSolo ? participantUser.avatar || DEFAULT_AVATAR : (team ? team.logo || DEFAULT_TEAM_LOGO : DEFAULT_TEAM_LOGO);
            
            const stats = participantUser.stats || { totalMatches: 0, totalWins: 0 };
            const winRate = (stats.totalMatches > 0) ? ((stats.totalWins / stats.totalMatches) * 100).toFixed(0) : 0;
            
            let teamBadgeHTML = '';
            if (team && team.equippedBadge) { 
                const badgeData = allBadges[team.equippedBadge];
                if (badgeData && badgeData.type === 'team') {
                    teamBadgeHTML = `<img src="${badgeData.url}" alt="Team Badge" class="verification-badge" data-badge-index="${team.equippedBadge}" loading="lazy">`;
                }
            }

            return `<div class="bg-[#2a2a2a] rounded-lg p-3 flex justify-between items-center participant-list-entry" data-user-id="${p.userId}">
                        <div class="flex-grow">
                            <div class="flex items-center">
                                <p class="font-semibold text-white">#${p.slotNumber} ${teamName}</p>
                                ${teamBadgeHTML}
                            </div>
                            <div class="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                <span><i class="fa-solid fa-chart-line text-green-400"></i> ${winRate}% Win Rate</span>
                            </div>
                        </div>
                        <img src="${teamLogo}" class="w-14 h-14 rounded-md object-cover flex-shrink-0" loading="lazy">
                    </div>`;
        }).join('');
        const content = document.getElementById('participant-list-content');
        document.getElementById('participant-list-header-title').textContent = `${post.details.eventName} - Teams`;
        content.innerHTML = `<div class="p-4"><p class="text-lg mb-2">Slots Filled: <span class="font-bold">${post.participants ? Object.keys(post.participants).length : 0}/${post.slots.total}</span></p><div class="space-y-2 participant-list">${(post.participants && Object.keys(post.participants).length > 0) ? participantsHTML : '<p class="text-gray-500 p-4">No teams have booked yet.</p>'}</div></div>`;
        
        gsap.from(".participant-list > div", { x: -50, opacity: 0, stagger: 0.05, duration: 0.4 });
    }
    
    const lightbox = document.getElementById('image-lightbox'); const lightboxImg = document.getElementById('lightbox-img');
    function showLightbox(src) { if(src) { lightboxImg.src = src; lightbox.classList.remove('hidden'); gsap.fromTo(lightboxImg, {scale: 0.8}, {scale: 1, duration: 0.3, ease: "back.out(1.7)"}); } }
    function hideLightbox() { lightbox.classList.add('hidden'); }

    function calculatePoints(kills, position) { const pp = { 1: 12, 2: 9, 3: 8, 4: 7, 5: 6, 6: 5, 7: 4, 8: 3, 9: 2, 10: 1, 11: 0, 12: 0 }; return (parseInt(kills, 10) || 0) + (pp[parseInt(position, 10)] || 0); }
    
    function renderCSLiveMatchPage(postId) {
        const post = window.dbData.posts[postId];
        if (!post || !post.csResults) return '';

        const { team1, team2 } = post.csResults;
        if (!team1 || !team2) return '<p class="text-center text-gray-400">Waiting for match data...</p>';

        return `
            <div class="p-4">
                ${post.roomId ? `<div class="bg-gradient-to-br from-green-900 to-gray-800 border border-green-700 rounded-xl p-4 shadow-lg mb-6"><h3 class="text-lg font-bold text-center text-green-300 mb-3">Room Details</h3><div class="space-y-3"><div class="flex justify-between items-center bg-black/30 p-2 rounded-lg"><span class="text-gray-400 text-sm font-semibold">Room ID:</span><code class="text-white font-bold text-lg">${post.roomId}</code><button class="copy-btn bg-gray-600 hover:bg-gray-500 w-8 h-8 rounded-md flex items-center justify-center" data-copy-text="${post.roomId}"><i class="fa-solid fa-copy"></i></button></div><div class="flex justify-between items-center bg-black/30 p-2 rounded-lg"><span class="text-gray-400 text-sm font-semibold">Password:</span><code class="text-white font-bold text-lg">${post.roomPass}</code><button class="copy-btn bg-gray-600 hover:bg-gray-500 w-8 h-8 rounded-md flex items-center justify-center" data-copy-text="${post.roomPass}"><i class="fa-solid fa-copy"></i></button></div></div></div>` : ''}
                
                <div class="flex justify-between items-center">
                    <div class="flex-1 text-center">
                        <img src="${team1.logo || DEFAULT_TEAM_LOGO}" class="w-20 h-20 rounded-full mx-auto border-4 border-blue-500 object-cover" loading="lazy">
                        <p class="font-bold mt-2 truncate">${team1.name}</p>
                    </div>
                    <div class="text-center px-4">
                        <p class="text-6xl font-oswald font-bold">${team1.rounds || 0} - ${team2.rounds || 0}</p>
                        <p class="text-sm text-gray-400">Rounds</p>
                    </div>
                    <div class="flex-1 text-center">
                        <img src="${team2.logo || DEFAULT_TEAM_LOGO}" class="w-20 h-20 rounded-full mx-auto border-4 border-red-500 object-cover" loading="lazy">
                        <p class="font-bold mt-2 truncate">${team2.name}</p>
                    </div>
                </div>
                 <p class="text-center text-yellow-400 font-semibold mt-8 animate-pulse">Waiting for sponsor to update results...</p>
            </div>
        `;
    }

    function renderCSHistoryPage(postId) {
         const post = window.dbData.posts[postId];
        if (!post || !post.csResults) return '';

        const { team1, team2, winner, resultImage } = post.csResults;
        if (!team1 || !team2) return '<p class="text-center text-gray-400">Match data is incomplete.</p>';
        
        const winnerData = team1.id === winner ? team1 : team2;
        
        return `
            <div class="p-4">
                <div class="text-center mb-6">
                    <img src="${winnerData.logo || DEFAULT_TEAM_LOGO}" class="w-28 h-28 rounded-full mx-auto border-4 border-yellow-400 object-cover mb-2" loading="lazy">
                    <p class="text-xs text-yellow-400 font-bold">WINNER</p>
                    <h3 class="text-2xl font-bold">${winnerData.name}</h3>
                </div>
                <div class="flex justify-between items-center bg-[#1e1e1e] p-4 rounded-xl border border-gray-700">
                    <div class="flex-1 text-center">
                        <p class="font-bold text-lg truncate">${team1.name}</p>
                    </div>
                    <div class="text-center px-4">
                        <p class="text-5xl font-oswald font-bold">${team1.rounds || 0} - ${team2.rounds || 0}</p>
                    </div>
                     <div class="flex-1 text-center">
                        <p class="font-bold text-lg truncate">${team2.name}</p>
                    </div>
                </div>
                ${resultImage ? `<div class="mt-6"><h4 class="font-bold text-center mb-2">Final Result</h4><img src="${resultImage}" class="w-full h-auto object-contain rounded-lg cursor-pointer" onclick="event.stopPropagation(); showLightbox('${resultImage}')" loading="lazy"></div>` : ''}
            </div>
        `;
    }

    function renderHistoryMatchDetailsPage(postId) {
        const post = window.dbData.posts[postId];
        if (!post) return;
        const content = document.getElementById('results-submission-content');
        document.getElementById('results-submission-header-title').textContent = post.details.eventName;

        if (post.status === 'cancelled') {
            content.innerHTML = `<div class="p-6 text-center">
                                    <i class="fa-solid fa-circle-xmark text-5xl text-red-500 mb-4"></i>
                                    <h2 class="text-2xl font-bold">ম্যাচটি বাতিল করা হয়েছে</h2>
                                    <p class="text-gray-400 mt-2">আপনার এন্ট্রি ফি রিফান্ড করা হয়েছে।</p>
                                 </div>`;
            return;
        }

        if (post.details.matchType === 'Clash Squad') {
            content.innerHTML = renderCSHistoryPage(postId);
            // Future: Add voting for CS if needed
            return;
        }
        
        const myResults = post.approvedResults?.[auth.currentUser.uid] || {};
        const mySubmissionsHTML = Object.keys(myResults).length > 0 ? `
            <h3 class="text-xl font-bold mt-8 mb-3">My Match Summary</h3>
            <div class="space-y-3">
                ${post.details.maps.map(map => {
                    const result = myResults[map];
                    if (!result) return '';
                    return `<div class="p-4 bg-[#1e1e1e] border border-gray-700 rounded-xl flex items-center gap-4"><div class="flex-grow"><h4 class="font-bold text-lg text-green-400">${map}</h4><div class="flex gap-4 mt-1 text-sm"><span><i class="fa-solid fa-crosshairs text-red-400 mr-1"></i> Kills: <span class="font-semibold">${result.kills}</span></span><span><i class="fa-solid fa-trophy text-yellow-400 mr-1"></i> Position: <span class="font-semibold">#${result.position}</span></span></div></div></div>`;
                }).join('')}
            </div>` : '';

        const prizeAndVoteHTML = `<div id="prize-release-section" class="mt-8 p-4 bg-[#1e1e1e] border border-gray-700 rounded-xl"></div>`;
        
        const hasRated = post.feedback && Object.values(post.feedback).some(fb => fb.userId === auth.currentUser.uid);
        const feedbackFormHTML = hasRated ? 
            `<div class="p-4 bg-[#1e1e1e] rounded-xl text-center text-green-400 mt-6"><i class="fa-solid fa-check-circle mr-2"></i>আপনার ফিডব্যাকের জন্য ধন্যবাদ!</div>` : 
            `<div id="feedback-form-container" class="mt-6 p-4 bg-[#1e1e1e] rounded-xl"></div>`;

        content.innerHTML = `<div class="p-4" data-post-id="${postId}">
                                <div id="leaderboard-section" class="mb-6"></div>
                                ${mySubmissionsHTML}
                                ${prizeAndVoteHTML}
                                ${feedbackFormHTML}
                             </div>`;
        
        renderLeaderboard(postId, 'approvedResults', 'Final Standings');
        renderPrizeReleaseAndVoting(postId);
        if (!hasRated) {
            renderFeedbackForm(postId);
        }
    }
    
    function renderLiveMatchPage(postId) {
        const content = document.getElementById('results-submission-content');
        content.dataset.postId = postId; 
        const post = window.dbData.posts[postId]; if (!post) return;
        document.getElementById('results-submission-header-title').textContent = post.details.eventName;
        
        if(post.details.matchType === 'Clash Squad') {
            content.innerHTML = renderCSLiveMatchPage(postId);
             content.querySelectorAll('.copy-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const text = e.currentTarget.dataset.copyText;
                    navigator.clipboard.writeText(text).then(() => showModal('success', 'Copied!', 'Room details copied to clipboard.'));
                });
            });
            return;
        }

        content.innerHTML = `
            <div class="p-4">
                <div class="flex gap-2 mb-4">
                    <button class="tab-button live-match-tab" data-target="room-details-section">Room Details</button>
                    <button class="tab-button live-match-tab" data-target="live-leaderboard-section">Leaderboard</button>
                </div>
                <div id="room-details-section" class="tab-content-section"></div>
                <div id="live-leaderboard-section" class="tab-content-section"></div>
            </div>`;
        
        renderRoomDetailsTab(postId);
        renderLeaderboard(postId, 'approvedResults', 'Live Standings');
        
        setupTabs('results-submission-content', '.live-match-tab', '.tab-content-section');
        content.querySelector('.live-match-tab[data-target="room-details-section"]')?.click();
    }

    function renderLeaderboard(postId, resultsKey, title = 'Final Standings') {
        const post = window.dbData.posts[postId]; if (!post) return;
        const container = document.getElementById('live-leaderboard-section') || document.getElementById('leaderboard-section'); if (!container) return;
        const resultsSource = post[resultsKey] || {}; const isSolo = post.details.teamType.toLowerCase() === 'solo';

        const leaderboardData = Object.values(post.participants || {}).map(p => {
            const user = window.dbData.users[p.userId]; if (!user) return null;
            const team = user.team; const name = isSolo ? p.players[0].name : (team ? team.name : 'Unknown Team'); const logo = isSolo ? user.avatar || DEFAULT_AVATAR : (team ? team.logo || DEFAULT_TEAM_LOGO : DEFAULT_TEAM_LOGO);
            let totalPoints = 0, totalKills = 0, totalPP = 0;
            if (resultsSource[p.userId]) { Object.values(resultsSource[p.userId]).forEach(mapResult => { totalPoints += calculatePoints(mapResult.kills, mapResult.position); totalKills += parseInt(mapResult.kills) || 0; totalPP += calculatePoints(0, mapResult.position); }); }
            return { userId: p.userId, name: name, logo: logo, totalPoints, totalKills, totalPP };
        }).filter(Boolean).sort((a, b) => b.totalPoints - a.totalPoints);

        const listHTML = leaderboardData.map((team, index) => {
            const isMyTeam = team.userId === auth.currentUser.uid;
            return `<div class="grid grid-cols-12 items-center p-3 rounded-lg ${isMyTeam ? 'bg-green-500/20 border border-green-500' : 'bg-[#2a2a2a]'} text-sm"><span class="font-bold col-span-1 text-center">#${index + 1}</span><img src="${team.logo}" class="w-8 h-8 rounded-full col-span-1 object-cover" loading="lazy"><p class="font-semibold col-span-4 ml-2 truncate">${team.name}</p><p class="text-center font-semibold col-span-2">${team.totalKills}</p><p class="text-center font-semibold col-span-2">${team.totalPP}</p><p class="font-bold text-green-400 text-center col-span-2">${team.totalPoints}</p></div>`;
        }).join('');

        container.innerHTML = `<h3 class="text-3xl font-oswald font-bold text-center mb-4">${title}</h3>${leaderboardData.length > 0 ? `<div class="space-y-2 mt-6"><div class="grid grid-cols-12 text-xs text-gray-400 font-bold p-2"><span class="col-span-1 text-center">POS</span><span class="col-span-5 ml-3">TEAM</span><span class="text-center col-span-2">KILLS</span><span class="text-center col-span-2">PLACE</span><span class="text-center col-span-2">TOTAL</span></div>${listHTML}</div>` : '<p class="text-center text-gray-500 p-4">No results available yet.</p>'}`;
    }
    
    function renderFeedbackForm(postId) { const container = document.getElementById('feedback-form-container'); if(!container) return; container.innerHTML = `<h3 class="font-bold text-lg mb-2">Rate This Event</h3><div class="flex justify-center text-2xl gap-2 rating-stars mb-3" data-rating="0">${Array(5).fill(0).map((_, i) => `<i class="fa-regular fa-star" data-value="${i+1}"></i>`).join('')}</div><textarea id="feedback-comment" class="form-textarea" rows="3" placeholder="Write your feedback..."></textarea><button id="submit-feedback-btn" class="w-full py-2 mt-2 action-button rounded-lg" disabled>Submit Feedback</button>`; const stars = container.querySelectorAll('.rating-stars .fa-star'); stars.forEach(star => { star.addEventListener('mouseover', () => highlightStars(stars, star.dataset.value)); star.addEventListener('mouseout', () => highlightStars(stars, container.querySelector('.rating-stars').dataset.rating)); star.addEventListener('click', () => { container.querySelector('.rating-stars').dataset.rating = star.dataset.value; document.getElementById('submit-feedback-btn').disabled = false; }); }); document.getElementById('submit-feedback-btn').addEventListener('click', () => submitFeedback(postId)); }
    function highlightStars(stars, rating) { stars.forEach(star => { star.classList.toggle('fa-solid', star.dataset.value <= rating); star.classList.toggle('fa-regular', star.dataset.value > rating); star.classList.toggle('text-yellow-400', star.dataset.value <= rating); star.classList.toggle('text-gray-500', star.dataset.value > rating); }); }
    function submitFeedback(postId) { const rating = parseInt(document.querySelector('#feedback-form-container .rating-stars').dataset.rating); const comment = document.getElementById('feedback-comment').value; if(rating === 0) { showModal('error', 'Rating required', 'Please select at least one star.'); return; } const newFeedbackKey = database.ref(`posts/${postId}/feedback`).push().key; const newFeedback = { userId: auth.currentUser.uid, rating, comment, timestamp: new Date().toISOString() }; database.ref(`posts/${postId}/feedback/${newFeedbackKey}`).set(newFeedback).then(() => { showModal('success', 'Thank You!', 'Your feedback has been submitted successfully.'); }); }
    
    function handleLikeSponsor(sponsorId) {
        const likeBtn = document.getElementById('like-sponsor-profile-btn');
        const statsGrid = document.querySelector('#sponsor-profile-content .grid-cols-3');
        if (!likeBtn || !statsGrid) return;
        
        const likesCountEl = statsGrid.children[0].querySelector('p:first-child');
        let currentLikes = parseInt(likesCountEl.dataset.rawLikes) || 0;
        const hasLiked = likeBtn.classList.contains('bg-red-600');

        if (hasLiked) { currentLikes--; likeBtn.classList.remove('bg-red-600', 'hover:bg-red-700'); likeBtn.classList.add('action-button'); likeBtn.innerHTML = '<i class="fa-solid fa-heart mr-2"></i> Like'; } else { currentLikes++; likeBtn.classList.remove('action-button'); likeBtn.classList.add('bg-red-600', 'hover:bg-red-700'); likeBtn.innerHTML = '<i class="fa-solid fa-heart mr-2"></i> Unlike'; }
        likesCountEl.textContent = formatNumberCompact(currentLikes);
        likesCountEl.dataset.rawLikes = currentLikes;
        
        database.ref(`users/${sponsorId}/reputation`).transaction(reputation => {
            if (reputation === null) reputation = { likes: 0, likedBy: {} };
            reputation.likedBy = reputation.likedBy || {};
            if (reputation.likedBy[auth.currentUser.uid]) {
                reputation.likes = (reputation.likes || 1) - 1;
                delete reputation.likedBy[auth.currentUser.uid];
            } else {
                reputation.likes = (reputation.likes || 0) + 1;
                reputation.likedBy[auth.currentUser.uid] = true;
            }
            return reputation;
        });
    }

    function maskName(name) { if (!name) return ''; if (name.length <= 3) return name; return name.substring(0, 3) + '***'; }
    
    function renderSponsorProfile(sponsorId) {
        const sponsor = window.dbData.users[sponsorId]; if (!sponsor) return; 
        const content = document.getElementById('sponsor-profile-content'); 
        const sponsorPosts = Object.values(window.dbData.posts || {}).filter(p => p.authorId === sponsorId); 
        let totalRatings = 0, ratingCount = 0, successfulEvents = 0; 
        sponsorPosts.forEach(post => { if (post.status === 'completed') successfulEvents++; if (post.feedback) { Object.values(post.feedback).forEach(fb => { totalRatings += fb.rating; ratingCount++; }); } }); 
        const avgRating = ratingCount > 0 ? (totalRatings / ratingCount).toFixed(1) : '0.0'; 
        const hasLiked = sponsor.reputation?.likedBy?.[auth.currentUser.uid]; 
        
        const allBadges = window.dbData.admin?.config?.verifiedBadges || {};
        let verifiedBadgeHTML = '';
        if (sponsor.verifiedBadge !== undefined && sponsor.verifiedBadge !== null) {
            const badgeData = allBadges[sponsor.verifiedBadge];
            if (badgeData) {
                if(badgeData.type === 'video') {
                    verifiedBadgeHTML = `<video src="${badgeData.url}" class="verification-badge" data-badge-index="${sponsor.verifiedBadge}" autoplay loop muted playsinline></video>`;
                } else {
                    verifiedBadgeHTML = `<img src="${badgeData.url}" alt="Verified" class="verification-badge" data-badge-index="${sponsor.verifiedBadge}" loading="lazy">`;
                }
            }
        }

        let feedbacksHTML = '<h3 class="text-xl font-bold mt-8 mb-4 text-left">User Feedbacks</h3>'; 
        const allFeedbacks = sponsorPosts.flatMap(p => Object.values(p.feedback || {})).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)); 
        if (allFeedbacks.length > 0) { feedbacksHTML += `<div class="space-y-4 text-left">${allFeedbacks.map(fb => { const user = window.dbData.users[fb.userId]; const stars = Array(5).fill(0).map((_, i) => `<i class="fa-solid fa-star ${i < fb.rating ? 'text-yellow-400' : 'text-gray-600'}"></i>`).join(''); return `<div class="bg-[#1e1e1e] p-3 rounded-lg border border-gray-700"> <div class="flex justify-between items-center"> <p class="font-semibold text-sm">${user ? maskName(user.name) : 'Ano***'}</p> <div class="flex gap-1 text-xs">${stars}</div> </div> ${fb.comment ? `<p class="text-gray-300 text-sm mt-2 italic">"${fb.comment}"</p>` : ''} </div>`; }).join('')}</div>`; } else { feedbacksHTML += '<p class="text-gray-500 text-center">No feedback yet.</p>'; } 
        
        const rawLikes = sponsor.reputation?.likes || 0;
        content.innerHTML = `<div class="p-6 text-center"><img src="${sponsor.avatar || DEFAULT_AVATAR}" class="w-32 h-32 rounded-full mx-auto border-4 border-green-500" loading="lazy"><h2 class="text-3xl font-bold mt-4 flex items-center justify-center">${sponsor.name}${verifiedBadgeHTML}</h2><p class="text-gray-500 text-sm">${maskEmail(sponsor.email)}</p><div class="w-full max-w-md mx-auto mt-6 p-4 bg-[#1e1e1e] border border-gray-800 rounded-xl grid grid-cols-3 text-center divide-x divide-gray-700"><div><p class="text-2xl font-bold" data-raw-likes="${rawLikes}">${formatNumberCompact(rawLikes)}</p><p class="text-xs text-gray-400">Likes</p></div><div><p class="text-2xl font-bold">${avgRating}</p><p class="text-xs text-gray-400">Rating</p></div><div><p class="text-2xl font-bold">${successfulEvents}/${sponsorPosts.length}</p><p class="text-xs text-gray-400">Success</p></div></div><button id="like-sponsor-profile-btn" class="w-full max-w-md mx-auto mt-6 py-3 rounded-lg text-white font-bold transition-colors ${hasLiked ? 'bg-red-600 hover:bg-red-700' : 'action-button'}" data-sponsor-id="${sponsorId}"><i class="fa-solid fa-heart mr-2"></i> ${hasLiked ? 'Unlike' : 'Like'}</button></div><div class="px-2 w-full max-w-md mx-auto">${feedbacksHTML}</div>`; 
        
        content.querySelector('#like-sponsor-profile-btn').addEventListener('click', (e) => { handleLikeSponsor(e.target.dataset.sponsorId); }); 
    }
    function updateMailboxBadge() { const unreadCount = Object.values(currentUserData?.mailbox || {}).filter(m => !m.read).length; const badge = document.querySelector('#mailbox-button .notification-badge'); if (unreadCount > 0) { if (badge) { badge.textContent = unreadCount; } else { document.getElementById('mailbox-button').innerHTML += `<div class="notification-badge">${unreadCount}</div>`; } } else { if (badge) badge.remove(); } }
    
    function setupTabs(containerId, buttonClass, sectionClass) {
        const container = document.getElementById(containerId); if (!container) return;
        const tabs = container.querySelectorAll(buttonClass); const sections = container.querySelectorAll(sectionClass); if (tabs.length === 0) return;
        let activeTab = container.querySelector(`${buttonClass}.active-tab`);
        if (!activeTab && tabs[0]) {
            activeTab = tabs[0];
            tabs.forEach(t => t.classList.remove('active-tab'));
            sections.forEach(s => s.classList.remove('active-section'));
            if(activeTab) {
               activeTab.classList.add('active-tab');
               const targetSection = document.getElementById(activeTab.dataset.target);
               if (targetSection) targetSection.classList.add('active-section');
            }
        }
        tabs.forEach(tab => { tab.addEventListener('click', () => { if (tab.classList.contains('active-tab')) return; tabs.forEach(t => t.classList.remove('active-tab')); sections.forEach(s => s.classList.remove('active-section')); tab.classList.add('active-tab'); const targetSection = document.getElementById(tab.dataset.target); if (targetSection) targetSection.classList.add('active-section'); }); });
    }

    function setupHomeTabs() {
        const tabs = document.querySelectorAll('.home-tab-link');
        const contents = document.querySelectorAll('.home-tab-content');
        const sliderWrapper = document.getElementById('slider-wrapper');
        const storeLoader = document.getElementById('store-loading-overlay');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.target;
                const isActive = tab.classList.contains('active-home-tab');
                if (isActive) return;

                const switchTabs = () => {
                    tabs.forEach(t => t.classList.remove('active-home-tab'));
                    contents.forEach(c => c.classList.remove('active'));
                    tab.classList.add('active-home-tab');
                    const targetContent = document.getElementById(target);
                    if(targetContent) targetContent.classList.add('active');

                    sliderWrapper.style.display = (target === 'post-feed') ? 'block' : 'none';
                    document.getElementById('home-search-input').value = '';
                    handleHomeSearch();
                };

                if (target === 'home-store-feed') {
                    gsap.to(storeLoader, { autoAlpha: 1, duration: 0.3 });
                    switchTabs();
                    setTimeout(() => {
                        gsap.to(storeLoader, { autoAlpha: 0, duration: 0.5, onComplete: () => storeLoader.classList.add('hidden') });
                    }, 2500);
                } else {
                    switchTabs();
                }
            });
        });
    }

    async function addTransaction(userId, transactionData) {
        if (!userId || !transactionData) return;
        const newTransactionRef = database.ref(`users/${userId}/transactions`).push();
        const fullTransactionData = {
            ...transactionData,
            id: newTransactionRef.key,
            timestamp: transactionData.timestamp || new Date().toISOString()
        };
        await newTransactionRef.set(fullTransactionData);
    }

    async function renderWalletPage() {
        const contentArea = document.getElementById('wallet-content');
        const allPosts = Object.values(window.dbData.posts || {});
        const bookings = Object.values(currentUserData.bookings || {});
        let transactions = [];
        let totalWinnings = 0, totalEntryFees = 0;
        
        const stats = currentUserData.stats || { totalMatches: 0, totalWins: 0, totalKills: 0 };

        const depositsSnapshot = await database.ref('deposits').orderByChild('userId').equalTo(auth.currentUser.uid).once('value');
        const deposits = depositsSnapshot.val() || {};
        Object.values(deposits).forEach(dep => {
            transactions.push({ date: dep.timestamp, type: `Deposit via ${dep.method}`, description: `TrxID: ${dep.trxId || 'N/A'}`, amount: dep.status === 'rejected' ? 0 : dep.amount, status: dep.status });
        });

        const withdrawalsSnapshot = await database.ref('withdrawals').orderByChild('userId').equalTo(auth.currentUser.uid).once('value');
        const withdrawals = withdrawalsSnapshot.val() || {};
        Object.values(withdrawals).forEach(wd => {
            transactions.push({ date: wd.timestamp, type: `Withdrawal to ${wd.method}`, description: `Acc: ${wd.accountNumber}`, amount: -wd.amount, status: wd.status });
        });
        
        const userTransactionsSnapshot = await database.ref(`users/${auth.currentUser.uid}/transactions`).orderByChild('timestamp').once('value');
        const userTransactions = userTransactionsSnapshot.val() || {};
        Object.values(userTransactions).forEach(ut => {
             let amount = ut.amount;
            let isReward = false;
            if (ut.type === 'Spin Reward' || ut.type === 'Mission Reward' || ut.type === 'Box Reward' || ut.currency) {
                 isReward = true;
                 amount = `${!String(ut.amount).startsWith('-') ? '+' : ''}${ut.amount} ${ut.currency}`;
            }
            transactions.push({ 
                date: ut.timestamp, 
                type: ut.type, 
                description: ut.description, 
                amount: amount, 
                isReward: isReward,
                status: ut.status || 'completed' 
            });
        });
        
        bookings.forEach(booking => {
            const post = allPosts.find(p => p.id === booking.postId);
            if (post) {
                const feeToUse = booking.finalFee !== undefined ? booking.finalFee : post.entryFee;
                if(feeToUse > 0) { transactions.push({ date: booking.bookingDate, type: 'Booking Fee', description: `Entry for "${post.details.eventName}"`, amount: -feeToUse }); }
                
                if(post.status === 'cancelled' && feeToUse > 0) { 
                    let refundAmount = feeToUse;
                    if ((post.bannedUsers || []).includes(auth.currentUser.uid) || (post.kickedUsers || []).includes(auth.currentUser.uid)) {
                        // finalFee already accounts for coupon
                    } else {
                        if(booking.couponUsed) {
                            // The refund transaction should still show what they paid. The coupon restoration is a separate logic.
                        }
                    }
                    transactions.push({ date: post.cancelledAt || new Date().toISOString(), type: 'Refund', description: `Refund from "${post.details.eventName}"`, amount: refundAmount }); 
                }

                if (post.status === 'completed' && post.details.eventType !== 'practice') {
                    totalEntryFees += feeToUse;
                    if (post.details.matchType === 'Clash Squad') {
                        const myTeamId = currentUserData.team?.id;
                        if (post.csResults?.winner === myTeamId) {
                             const prizeInfo = (post.details.winningPrizes || []).find(prize => prize.rank === 'Top 1');
                             if(prizeInfo) {
                                 const prizeAmount = parseFloat(prizeInfo.prize);
                                 totalWinnings += prizeAmount;
                                 transactions.push({ date: post.completedAt || new Date().toISOString(), type: 'Winning Prize', description: `Winner in "${post.details.eventName}"`, amount: prizeAmount });
                             }
                        }
                    } else {
                        const finalRankings = Object.values(post.participants || {}).map(p => { let totalPoints = 0; if (post.approvedResults && post.approvedResults[p.userId]) { Object.values(post.approvedResults[p.userId]).forEach(mapResult => { totalPoints += calculatePoints(mapResult.kills, mapResult.position); }); } return { userId: p.userId, totalPoints }; }).sort((a, b) => b.totalPoints - a.totalPoints);
                        const myRankIndex = finalRankings.findIndex(r => r.userId === auth.currentUser.uid);
                        if (myRankIndex !== -1) {
                            const myRank = myRankIndex + 1;
                            const prizeInfo = (post.details.winningPrizes || []).find(prize => prize.rank === `Top ${myRank}`);
                            if (prizeInfo) { const prizeAmount = parseFloat(prizeInfo.prize); totalWinnings += prizeAmount; transactions.push({ date: post.completedAt || new Date().toISOString(), type: 'Winning Prize', description: `Rank #${myRank} in "${post.details.eventName}"`, amount: prizeAmount }); }
                        }
                    }
                }
            }
        });

        const profitLoss = totalWinnings - totalEntryFees;
        const losses = stats.totalMatches - stats.totalWins;
        const winRate = ((stats.totalMatches > 0 ? stats.totalWins/stats.totalMatches : 0) * 100).toFixed(0);

        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        const transactionsHTML = transactions.length > 0 ? transactions.map(t => {
            let isCredit = !t.isReward && t.amount > 0;

            let amountHTML;
            if (t.isReward) {
                const icon = t.amount.includes('coin') ? 'fa-coins text-yellow-400' : (t.amount.includes('diamond') ? 'fa-gem text-cyan-400' : 'fa-ticket text-yellow-300');
                amountHTML = `<p class="font-bold text-lg"><i class="fa-solid ${icon} mr-1"></i>${t.amount}</p>`;
            } else {
                amountHTML = `<p class="font-bold text-lg ${isCredit ? 'text-green-400' : 'text-red-400'}">${isCredit ? '+' : ''}${t.amount.toFixed(2)}</p>`;
            }

            let statusBadge = '';
            if (t.status && t.status !== 'completed') {
                const statusColors = { pending: 'bg-yellow-500', approved: 'bg-green-500', rejected: 'bg-red-500' };
                const statusText = t.status.charAt(0).toUpperCase() + t.status.slice(1);
                statusBadge = `<span class="text-xs font-semibold px-2 py-1 ${statusColors[t.status]} text-white rounded-full ml-2">${statusText}</span>`;
            }
            return `<div class="flex justify-between items-center p-3 bg-[#2a2a2a] rounded-lg">
                        <div>
                            <p class="font-semibold text-sm flex items-center">${t.type}${statusBadge}</p>
                            <p class="text-xs text-gray-400">${t.description}</p>
                            <p class="text-xs text-gray-500 mt-1">${new Date(t.date).toLocaleString()}</p>
                        </div>
                        ${amountHTML}
                    </div>`
        }).join('') : '<p class="text-center text-gray-500 p-4">No transactions found.</p>';

        contentArea.innerHTML = `
            <div class="p-4">
                <div class="flex gap-2 mb-4">
                    <button class="tab-button wallet-tab active-tab" data-target="wallet-dashboard-section">Dashboard</button>
                    <button class="tab-button wallet-tab" data-target="wallet-stats-section">Statistics</button>
                    <button class="tab-button wallet-tab" data-target="wallet-history-section">Transaction</button>
                </div>

                <div id="wallet-dashboard-section" class="tab-content-section active-section space-y-4">
                    <div class="bg-gradient-to-br from-blue-900 to-purple-900 border border-blue-700 rounded-3xl p-6 shadow-lg text-left">
                       <div class="flex justify-between items-center"><div><p class="text-lg text-blue-200">Live Balance</p><h2 class="text-4xl font-bold text-white my-1">${(currentUserData.wallet?.live || 0).toFixed(2)}<span class="text-xl font-normal"> TK</span></h2></div><i class="fa-solid fa-money-bill-wave text-5xl text-blue-500/50"></i></div>
                       <div class="grid grid-cols-2 gap-4 mt-4">
                           <button id="deposit-btn" class="w-full py-3 rounded-xl action-button text-base flex items-center justify-center"><i class="fa-solid fa-plus mr-2"></i> Deposit</button>
                           <button id="withdraw-btn" class="w-full py-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold flex items-center justify-center"><i class="fa-solid fa-arrow-down mr-2"></i> Withdraw</button>
                       </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700"><p class="text-sm text-gray-400">Total Winnings</p><p class="text-2xl font-bold text-green-400 mt-1">${totalWinnings.toFixed(2)} <span class="text-sm">TK</span></p></div>
                        <div class="bg-[#1e1e1e] p-4 rounded-xl border ${profitLoss >= 0 ? 'border-green-700' : 'border-red-700'}">
                            <p class="text-sm text-gray-400">P/L (from matches)</p>
                            <p class="text-2xl font-bold mt-1 ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}">${profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)} <span class="text-lg">TK</span></p>
                        </div>
                    </div>
                </div>

                <div id="wallet-stats-section" class="tab-content-section space-y-4">
                     <div class="grid grid-cols-2 gap-4">
                        <div class="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700 text-center"><p class="text-3xl font-bold font-oswald">${stats.totalMatches}</p><p class="text-xs text-gray-400 mt-1">Matches Played</p></div>
                        <div class="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700 text-center"><p class="text-3xl font-bold font-oswald text-green-400">${stats.totalWins}</p><p class="text-xs text-gray-400 mt-1">Matches Won</p></div>
                         <div class="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700 text-center"><p class="text-3xl font-bold font-oswald text-red-400">${losses}</p><p class="text-xs text-gray-400 mt-1">Matches Lost</p></div>
                        <div class="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700 text-center"><p class="text-3xl font-bold font-oswald">${winRate}%</p><p class="text-xs text-gray-400 mt-1">Win Rate</p></div>
                    </div>
                     <div class="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700">
                         <div class="grid grid-cols-2 divide-x divide-gray-700 text-center">
                            <div><p class="text-2xl font-bold font-oswald">${stats.totalKills}</p><p class="text-xs text-gray-400">Total Kills</p></div>
                            <div><p class="text-2xl font-bold font-oswald text-green-400">${totalWinnings.toFixed(2)}</p><p class="text-xs text-gray-400">Total Earning</p></div>
                         </div>
                    </div>
                </div>

                <div id="wallet-history-section" class="tab-content-section space-y-2">
                    ${transactionsHTML}
                </div>
            </div>
        `;
        setupTabs(contentArea.id, '.wallet-tab', '.tab-content-section');
        contentArea.querySelector('#deposit-btn')?.addEventListener('click', startDepositFlow);
        contentArea.querySelector('#withdraw-btn')?.addEventListener('click', startWithdrawFlow);
    }
    
    async function renderMailbox() {
        const content = document.getElementById('mailbox-content');
        
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const mailToDelete = {};
        Object.entries(currentUserData.mailbox || {}).forEach(([mailId, mail]) => {
            if (new Date(mail.timestamp).getTime() < thirtyDaysAgo) {
                mailToDelete[mailId] = null;
            }
        });
        if (Object.keys(mailToDelete).length > 0) {
            await database.ref(`users/${auth.currentUser.uid}/mailbox`).update(mailToDelete);
        }

        const sortedMail = Object.values(currentUserData.mailbox || {}).filter(m => !mailToDelete[m.id]).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        let mailHTML = sortedMail.map(createMailItemHTML).join('');

        content.innerHTML = `<div class="p-4"><div class="space-y-3">${sortedMail.length > 0 ? mailHTML : '<p class="text-center text-gray-500 mt-8">Your mailbox is empty.</p><div class="text-center text-gray-600 mt-4 text-sm">-------- End --------</div>'}</div>${sortedMail.length > 0 ? '<div class="text-center text-gray-600 mt-4 text-sm">-------- End --------</div>' : ''}</div>`;
        
        gsap.from(".mail-item-premium", { x: -20, opacity: 0, stagger: 0.05, duration: 0.4, ease: "power2.out" });

        content.querySelectorAll('.mail-item-premium').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('.delete-mail-btn, .claim-reward-btn')) return;
                
                const wasExpanded = item.classList.contains('expanded');
                content.querySelectorAll('.mail-item-premium').forEach(el => el.classList.remove('expanded'));
                if (!wasExpanded) {
                    item.classList.add('expanded');
                    const mailId = item.dataset.mailId;
                    if (item.classList.contains('unread')) {
                        database.ref(`users/${auth.currentUser.uid}/mailbox/${mailId}/read`).set(true);
                    }
                }
            });
        });

        content.querySelectorAll('.delete-mail-btn').forEach(btn => btn.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            const mailId = e.currentTarget.dataset.mailId;
            showCustomModal({
                type: 'error',
                title: 'Delete Mail?',
                message: 'Are you sure you want to permanently delete this mail?',
                primaryButton: { text: 'Delete', onClick: () => {
                    database.ref(`users/${auth.currentUser.uid}/mailbox/${mailId}`).remove()
                        .catch(handleFirebaseError);
                }},
                secondaryButton: { text: 'Cancel' }
            });
        }));

        content.querySelectorAll('.claim-reward-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                handleClaimReward(e.currentTarget.dataset.mailId, btn);
            });
        });

        document.getElementById('delete-all-mail-btn')?.addEventListener('click', () => {
            showCustomModal({
                type: 'error',
                title: 'Delete All Mail?',
                message: 'Are you sure you want to permanently delete all mail? This action cannot be undone.',
                primaryButton: { text: 'Delete All', onClick: () => {
                    database.ref(`users/${auth.currentUser.uid}/mailbox`).set(null)
                        .then(() => showModal('success', 'All Mail Deleted'))
                        .catch(handleFirebaseError);
                }},
                secondaryButton: { text: 'Cancel' }
            });
        });
    }

    function createMailItemHTML(mail) {
        let bodyContent = '';
        let iconClass = 'fa-info-circle text-blue-400';
        const deleteTimestamp = new Date(mail.timestamp).getTime() + (30 * 24 * 60 * 60 * 1000);

        if(mail.type === 'reward' && mail.body.rewards) {
            iconClass = 'fa-gift text-yellow-400';
            
            const rewardsHTML = mail.body.rewards.map(reward => {
                let rewardIcon, name, quantityHTML = '', durationHTML = '';
                if (reward.rewardType === 'coin' || reward.rewardType === 'diamond') {
                    rewardIcon = reward.rewardType === 'coin' ? 'https://cdn-icons-png.flaticon.com/512/217/217853.png' : 'https://firebasestorage.googleapis.com/v0/b/viptask-5c1fc.appspot.com/o/Levelup%2F1762763297995.png?alt=media&token=db9ebed1-ff51-49ed-a311-0327313dae56';
                    name = ``;
                    quantityHTML = `<span class="reward-item-quantity">x${reward.rewardValue}</span>`;
                } else {
                    const itemMap = { team_badge: 'verifiedBadges', profile_badge: 'verifiedBadges', frame: 'profileFrames', profile_effect: 'profileEffects', coupon: 'couponTypes', title: 'titles'};
                    const dbPath = reward.rewardDbPath || itemMap[reward.rewardType];
                    const itemData = window.dbData.admin?.config?.[dbPath]?.[reward.itemId];
                    rewardIcon = itemData?.url || '';
                    name = ``;

                    if (reward.expiryTimestamp) {
                        const diff = reward.expiryTimestamp - Date.now();
                        if(diff > 0) {
                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            durationHTML = `<span class="reward-item-duration">${days > 0 ? `${days}d` : `${hours}h`}</span>`;
                        }
                    } else {
                        durationHTML = `<span class="reward-item-duration">Permanent</span>`;
                    }
                }
                const mediaTag = rewardIcon.includes('.mp4') ? 'video' : 'img';
                return `<div class="reward-scroll-item">
                            ${durationHTML}
                            <${mediaTag} src="${rewardIcon}" class="reward-scroll-item-media" ${mediaTag === 'video' ? 'autoplay loop muted playsinline' : 'loading="lazy"'}></${mediaTag}>
                            ${quantityHTML}
                        </div>`;
            }).join('');

            bodyContent = `
            <p class="text-sm text-gray-300 mb-4">${mail.body.message || 'You have received a reward!'}</p>
            <div class="reward-scroll-container no-scrollbar">${rewardsHTML}</div>`;

        } else {
            switch(mail.type) {
                case 'reward':
                    iconClass = 'fa-gift text-yellow-400';
                    const reward = mail.body;
                    let rewardIcon = reward.rewardImage;
                    let quantityHTML = '', durationHTML = '';
                    if (reward.rewardType === 'coin' || reward.rewardType === 'diamond') {
                        quantityHTML = `<span class="reward-item-quantity">x${reward.rewardValue}</span>`;
                    } else if(reward.expiryTimestamp) {
                        const diff = reward.expiryTimestamp - Date.now();
                         if(diff > 0) {
                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                            durationHTML = `<span class="reward-item-duration">${days > 0 ? `${days}d` : '24h'}</span>`;
                        }
                    }
                    const mediaTag = rewardIcon?.includes('.mp4') ? 'video' : 'img';
                    bodyContent = `
                        <p class="text-sm text-gray-300 mb-4">${reward.message || 'You have received a reward!'}</p>
                        <div class="reward-scroll-container no-scrollbar">
                            <div class="reward-scroll-item">
                                ${durationHTML}
                                <${mediaTag} src="${rewardIcon}" class="reward-scroll-item-media" ${mediaTag === 'video' ? 'autoplay loop muted playsinline' : 'loading="lazy"'}></${mediaTag}>
                                ${quantityHTML}
                            </div>
                        </div>`;
                    break;
                case 'ban':
                    iconClass = 'fa-ban text-red-400';
                    bodyContent = `<p>${mail.body.reason}</p>${mail.body.screenshot ? `<p class="mt-2">Sponsor's Evidence:</p><img src="${mail.body.screenshot}" class="w-full max-w-xs h-auto object-cover rounded-md cursor-pointer mt-1" onclick="event.stopPropagation(); showLightbox('${mail.body.screenshot}')" loading="lazy">` : ''}${mail.body.videoLink ? `<p class="mt-2">Video Link: <a href="${mail.body.videoLink}" target="_blank" class="text-blue-400 hover:underline">Watch Video</a></p>` : ''}`;
                    break;
                default:
                    bodyContent = `<p class="text-sm text-gray-300">${mail.body.reason || mail.body.message}</p>`;
                    break;
            }
        }

        return `
        <div class="mail-item-premium ${mail.read ? '' : 'unread'}" data-mail-id="${mail.id}">
            <div class="p-4">
                <div class="flex items-start gap-4">
                    <i class="fa-solid ${iconClass} text-2xl mt-1 flex-shrink-0"></i>
                    <div class="flex-grow">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="font-bold text-white">${mail.subject}</p>
                                <p class="text-xs text-gray-500">${timeAgo(mail.timestamp)}</p>
                            </div>
                            <button class="delete-mail-btn text-gray-600 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 -mt-1 -mr-2" data-mail-id="${mail.id}"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                        <div class="mail-content">
                            <div class="border-t border-gray-700/50 my-3"></div>
                            ${bodyContent}
                            ${(mail.type === 'reward' && !mail.body.claimed) ? `<button class="w-full mt-4 py-2 rounded-lg text-sm font-bold claim-reward-btn" data-mail-id="${mail.id}">Claim Reward</button>` : ''}
                            ${(mail.type === 'reward' && mail.body.claimed) ? `<button class="w-full mt-4 py-2 rounded-lg text-sm font-bold claim-reward-btn" disabled><i class="fa-solid fa-check mr-2"></i>Claimed</button>` : ''}
                            <div class="text-right text-xs text-gray-600 mt-4">
                                Auto-deletes in: <span class="mail-delete-timer" data-delete-time="${new Date(deleteTimestamp).toISOString()}"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
    
    async function handleClaimReward(mailId, button) {
        const mail = currentUserData.mailbox[mailId];
        if (!mail || mail.body.claimed) return;

        button.disabled = true;
        button.innerHTML = '<div class="spinner mx-auto"></div>';

        const updates = {};
        let successMessage = 'Reward Claimed!';

        const processReward = (reward) => {
             if (reward.rewardType === 'coin' || reward.rewardType === 'diamond') {
                const currency = `${reward.rewardType}s`;
                updates[`/users/${auth.currentUser.uid}/wallet/${currency}`] = firebase.database.ServerValue.increment(reward.rewardValue);
            } else {
                let path;
                switch(reward.rewardType) {
                    case 'team_badge': 
                        if (!currentUserData.team) { throw new Error("You must be in a team to claim a team badge."); }
                        path = `users/${auth.currentUser.uid}/team/earnedBadges/${reward.itemId}`; 
                        break;
                    case 'profile_badge': path = `users/${auth.currentUser.uid}/earnedBadges/${reward.itemId}`; break;
                    case 'title': path = `users/${auth.currentUser.uid}/earnedTitles/${reward.itemId}`; break;
                    case 'frame': path = `users/${auth.currentUser.uid}/inventory/frames/${reward.itemId}`; break;
                    case 'profile_effect': path = `users/${auth.currentUser.uid}/inventory/effects/${reward.itemId}`; break;
                    case 'coupon': path = `users/${auth.currentUser.uid}/coupons/${reward.couponId}`; break;
                }
                if(path) {
                    updates[path] = reward.couponData || (reward.expiryTimestamp ? reward.expiryTimestamp : true);
                }
            }
        };
        
        try {
            if(mail.body.rewards) {
                mail.body.rewards.forEach(processReward);
                successMessage = `You've claimed multiple rewards! Check your inventory.`;
            } else {
                const reward = mail.body;
                if (reward.rewardType === 'badge') {
                    const badgeData = window.dbData.admin?.config?.verifiedBadges[reward.badgeId];
                    if (!badgeData) throw new Error("Badge data not found.");
                    
                    if (badgeData.type === 'team') {
                        if (!currentUserData.team) throw new Error("You must be in a team to claim this badge.");
                        updates[`/users/${auth.currentUser.uid}/team/earnedBadges/${reward.badgeId}`] = true;
                    } else {
                        updates[`/users/${auth.currentUser.uid}/earnedBadges/${reward.badgeId}`] = true;
                    }
                } else {
                     processReward(mail.body);
                }
                successMessage = `You have received a ${mail.body.rewardName}!`;
            }

            updates[`/users/${auth.currentUser.uid}/mailbox/${mailId}/body/claimed`] = true;
            
            await database.ref().update(updates);
            
            showCustomModal({
                title: "Congratulations!",
                iconHtml: `<dotlottie-wc src="https://lottie.host/808b26f5-072f-4c59-b17b-232d665a3962/qYI7k2RGvS.lottie" autoplay loop style="width: 120px; height: 120px;"></dotlottie-wc>`,
                message: successMessage,
                primaryButton: { text: "Awesome!" },
                autoClose: 3000
            });
            button.innerHTML = '<i class="fa-solid fa-check mr-2"></i>Claimed';

        } catch (error) {
            handleFirebaseError(error);
            button.disabled = false;
            button.innerHTML = 'Claim Reward';
        }
    }
    
        window.tempEquippedBadges = [];
        window.tempEquippedTitles = [];

        function renderBadgeManager() {
            window.tempEquippedBadges = [...(currentUserData.equippedBadges || [])].filter(Boolean);
            if(window.tempEquippedBadges.length > 7) window.tempEquippedBadges = window.tempEquippedBadges.slice(0,7);
            
            window.tempEquippedTitles = [...(currentUserData.equippedTitles || [])].filter(Boolean);
            if(window.tempEquippedTitles.length > 4) window.tempEquippedTitles = window.tempEquippedTitles.slice(0,4);

            checkItemExpirations();
            updateBadgeUI();
            updateTitleUI();
        }

        
function checkItemExpirations() {
    if (!currentUserData || !auth.currentUser) return;
    
    const now = Date.now();
    const updates = {};
    let needsUpdate = false;

    const expireItem = (type, id, collectionPath, equipPath) => {
        updates[`users/${auth.currentUser.uid}/${equipPath}`] = null;
        updates[`users/${auth.currentUser.uid}/${collectionPath}/${id}`] = null;
        needsUpdate = true;
    };

    const equippedFrame = currentUserData.equippedFrame;
    if (equippedFrame) {
        const expiry = currentUserData.inventory?.frames?.[equippedFrame];
        if (typeof expiry === 'number' && now > expiry) {
            expireItem('frame', equippedFrame, 'inventory/frames', 'equippedFrame');
        }
    }

    const equippedProfileBadge = currentUserData.equippedProfileBadge;
    if (equippedProfileBadge) {
         const expiry = currentUserData.earnedBadges?.[equippedProfileBadge];
         if (typeof expiry === 'number' && now > expiry) {
            expireItem('badge', equippedProfileBadge, 'earnedBadges', 'equippedProfileBadge');
        }
    }

    if(currentUserData.team) {
        const equippedTeamBadge = currentUserData.team.equippedBadge;
        if (equippedTeamBadge) {
            const expiry = currentUserData.team.earnedBadges?.[equippedTeamBadge];
            if (typeof expiry === 'number' && now > expiry) {
                updates[`users/${auth.currentUser.uid}/team/equippedBadge`] = null;
                updates[`users/${auth.currentUser.uid}/team/earnedBadges/${equippedTeamBadge}`] = null;
                needsUpdate = true;
            }
        }
    }

    const equippedEffect = currentUserData.equippedEffect;
    if (equippedEffect) {
        const expiry = currentUserData.inventory?.effects?.[equippedEffect];
        if (typeof expiry === 'number' && now > expiry) {
            expireItem('effect', equippedEffect, 'inventory/effects', 'equippedEffect');
        }
    }
    
    const equippedTitles = currentUserData.equippedTitles || [];
    const newTitles = equippedTitles.filter(id => {
        const expiry = currentUserData.earnedTitles?.[id];
        if(typeof expiry === 'number' && now > expiry) {
            updates[`users/${auth.currentUser.uid}/earnedTitles/${id}`] = null;
            needsUpdate = true;
            return false;
        }
        return true;
    });

    if(equippedTitles.length !== newTitles.length) {
        updates[`users/${auth.currentUser.uid}/equippedTitles`] = newTitles;
        needsUpdate = true;
    }
    
    if(needsUpdate) {
        database.ref().update(updates).then(() => {
            console.log("Expired items have been unequipped and removed.");
        }).catch(error => {
            console.error("Error removing expired items:", error);
        });
    }
}

        function updateBadgeUI() {
            const equipContainer = document.getElementById('badge-equip-slots');
            const availableContainer = document.getElementById('available-badges-container');
            const allBadges = window.dbData.admin?.config?.verifiedBadges || {};

            equipContainer.style.gridTemplateColumns = "repeat(7, 1fr)";
            let slotsHTML = '';
            for(let i=0; i<7; i++) {
                const id = window.tempEquippedBadges[i];
                if(id && allBadges[id]) {
                    slotsHTML += `<div class="relative w-full aspect-square bg-[#2a2a2a] border border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-900/20 group" onclick="unequipBadge('${id}')"><img src="${allBadges[id].url}" class="w-2/3 h-2/3 object-contain"><div class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-lg"><i class="fa-solid fa-minus text-red-500"></i></div></div>`;
                } else {
                    slotsHTML += `<div class="w-full aspect-square bg-[#1a1a1a] border border-dashed border-gray-700 rounded-lg flex items-center justify-center"><i class="fa-solid fa-plus text-gray-800 text-xs"></i></div>`;
                }
            }
            equipContainer.innerHTML = slotsHTML;

            const uniqueIds = [...new Set([...Object.keys(currentUserData.earnedBadges || {}), ...(currentUserData.team ? Object.keys(currentUserData.team.earnedBadges || {}) : [])])];
            let availableHTML = '';
            let hasAvailable = false;
            uniqueIds.forEach(id => {
                if(!allBadges[id] || window.tempEquippedBadges.includes(id)) return;
                let expiry = currentUserData.earnedBadges?.[id] || (currentUserData.team?.earnedBadges?.[id]);
                if(typeof expiry === 'number' && Date.now() > expiry) return;
                hasAvailable = true;
                availableHTML += `<div class="relative w-full aspect-square bg-[#2a2a2a] border border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500" onclick="equipBadge('${id}')"><img src="${allBadges[id].url}" class="w-2/3 h-2/3 object-contain"></div>`;
            });
            availableContainer.innerHTML = hasAvailable ? availableHTML : '<p class="col-span-full text-center text-gray-500 text-xs py-4">No available badges</p>';
            availableContainer.style.gridTemplateColumns = "repeat(5, 1fr)";
        }

        function updateTitleUI() {
            const equipContainer = document.getElementById('title-equip-slots');
            const availableContainer = document.getElementById('available-titles-container');
            const allTitles = window.dbData.admin?.config?.titles || {};

            equipContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
            let slotsHTML = '';
            for(let i=0; i<4; i++) {
                const id = window.tempEquippedTitles[i];
                if(id && allTitles[id]) {
                    const mediaTag = allTitles[id].url.endsWith('.mp4') ? 'video' : 'img';
                    slotsHTML += `<div class="relative w-full h-16 bg-[#2a2a2a] border border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-900/20 group" onclick="unequipTitle('${id}')"><${mediaTag} src="${allTitles[id].url}" class="h-10 w-auto object-contain" ${mediaTag === 'video' ? 'autoplay loop muted playsinline' : ''}><div class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-lg"><i class="fa-solid fa-minus text-red-500"></i></div></div>`;
                } else {
                    slotsHTML += `<div class="w-full h-16 bg-[#1a1a1a] border border-dashed border-gray-700 rounded-lg flex items-center justify-center"><i class="fa-solid fa-plus text-gray-800"></i></div>`;
                }
            }
            equipContainer.innerHTML = slotsHTML;

            const ownedTitles = Object.keys(currentUserData.earnedTitles || {});
            let availableHTML = '';
            let hasAvailable = false;
            ownedTitles.forEach(id => {
                if(!allTitles[id] || window.tempEquippedTitles.includes(id)) return;
                let expiry = currentUserData.earnedTitles?.[id];
                if(typeof expiry === 'number' && Date.now() > expiry) return;
                hasAvailable = true;
                const mediaTag = allTitles[id].url.endsWith('.mp4') ? 'video' : 'img';
                availableHTML += `<div class="relative w-full h-16 bg-[#2a2a2a] border border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-yellow-500" onclick="equipTitle('${id}')"><${mediaTag} src="${allTitles[id].url}" class="h-10 w-auto object-contain" ${mediaTag === 'video' ? 'autoplay loop muted playsinline' : ''}></div>`;
            });
            availableContainer.innerHTML = hasAvailable ? availableHTML : '<p class="col-span-full text-center text-gray-500 text-xs py-4">No available titles</p>';
        }

        window.equipBadge = function(id) {
            if(window.tempEquippedBadges.length >= 7) { showModal('error', 'Limit', 'Max 7 badges allowed.'); return; }
            window.tempEquippedBadges.push(id); updateBadgeUI();
        }
        window.unequipBadge = function(id) {
            window.tempEquippedBadges = window.tempEquippedBadges.filter(b => b !== id); updateBadgeUI();
        }
        window.equipTitle = function(id) {
            if(window.tempEquippedTitles.length >= 4) { showModal('error', 'Limit', 'Max 4 titles allowed.'); return; }
            window.tempEquippedTitles.push(id); updateTitleUI();
        }
        window.unequipTitle = function(id) {
            window.tempEquippedTitles = window.tempEquippedTitles.filter(t => t !== id); updateTitleUI();
        }
        
        
function setupProfilePageListeners() {
         document.addEventListener('click', e => {
            if(e.target.closest('#profile-edit-icon-btn')) {
                isProfileFormDirty = false;
                document.getElementById('edit-profile-avatar-preview').src = currentUserData.avatar || DEFAULT_AVATAR;
                document.getElementById('edit-profile-name').value = currentUserData.name || '';
                const customizations = currentUserData.profileCustomization || {};
                const blurSlider = document.getElementById('profile-bg-blur');
                const blurValueEl = document.getElementById('blur-value');
                blurSlider.value = customizations.bgBlur || 0;
                blurValueEl.textContent = customizations.bgBlur || 0;
                document.getElementById('profile-text-color').value = customizations.textColor || '#ffffff';
renderBadgeManager();
                handleNavigation('edit-profile-content');
            }
        });

        document.getElementById('wallet-button').addEventListener('click', () => { handleNavigation('wallet-content'); });
        document.getElementById('profile-wallet-button').addEventListener('click', () => { handleNavigation('wallet-content'); });
        document.getElementById('lup-wallet-button').addEventListener('click', () => { handleNavigation('lup-wallet-screen'); });
        
        const myTeamClickHandler = () => {
            renderMyTeamPage(); 
            handleNavigation('team-form-content');
        };

        document.getElementById('create-team-button').addEventListener('click', myTeamClickHandler);
        
        document.body.addEventListener('click', e => {
            if (e.target.closest('#my-team-card-clickable-wrapper')) {
                myTeamClickHandler();
            }
        });

        document.getElementById('manage-posts-button').addEventListener('click', () => { handleNavigation('manage-posts-content'); });
        document.getElementById('mailbox-button').addEventListener('click', () => { handleNavigation('mailbox-content'); });
        document.getElementById('help-button-profile').addEventListener('click', () => { handleNavigation('help-community-content'); });
        
        document.getElementById('logout-button-settings').addEventListener('click', async () => {
            showLoader('Logging out...');
            try {
                await auth.signOut();
            } catch (error) {
                handleFirebaseError(error);
            } finally {
                hideLoader();
            }
        });

        document.getElementById('change-password-button').addEventListener('click', () => {
            handleNavigation('change-password-content');
        });
        document.getElementById('season-details-btn').addEventListener('click', () => {
            handleNavigation('season-details-content');
        });

         document.getElementById('edit-team-name-btn').addEventListener('click', () => {
            const currentName = document.getElementById('team-name').value;
            showCustomModal({
                title: 'Change Team Name',
                message: `
                    <p class="text-sm text-gray-300 mb-4">Changing your team name costs <span class="font-bold text-yellow-400">1000 Coins</span>.</p>
                    <input id="new-team-name-input" class="form-input" value="${currentName}" placeholder="Enter new team name">`,
                primaryButton: {
                    text: 'Confirm (1000 Coins)',
                    onClick: async () => {
                        const newName = document.getElementById('new-team-name-input').value.trim();
                        if (!newName || newName === currentName) {
                            showModal('error', 'Invalid Name', 'Please enter a new, valid team name.');
                            return;
                        }

                        const requiredCoins = 1000;
                        if ((currentUserData.wallet.coins || 0) < requiredCoins) {
                            showModal('error', 'Insufficient Coins', `You need ${requiredCoins} coins. Your balance is ${currentUserData.wallet.coins || 0}.`);
                            return;
                        }

                        try {
                            showLoader('Updating Name...');
                            const updates = {};
                            updates[`users/${auth.currentUser.uid}/team/name`] = newName;
                            updates[`users/${auth.currentUser.uid}/wallet/coins`] = firebase.database.ServerValue.increment(-requiredCoins);
                            
                            await database.ref().update(updates);
                            await addTransaction(auth.currentUser.uid, {
                                type: 'Fee',
                                description: `Team name change from "${currentName}" to "${newName}"`,
                                amount: -requiredCoins,
                                currency: 'coin'
                            });

                            document.getElementById('team-name').value = newName;
                            hideLoader();
                            showModal('success', 'Name Changed', 'Your team name has been updated successfully.');
                        } catch (err) {
                            hideLoader();
                            handleFirebaseError(err);
                        }
                    }
                },
                secondaryButton: { text: 'Cancel' }
            });
        });

        const editProfileForm = document.getElementById('edit-profile-form');
        editProfileForm.addEventListener('input', () => { isProfileFormDirty = true; });
        document.getElementById('new-profile-image-upload').addEventListener('change', e => { 
            isProfileFormDirty = true;
            const file = e.target.files[0]; 
            if (file) { 
                const reader = new FileReader(); 
                reader.onload = (event) => { document.getElementById('edit-profile-avatar-preview').src = event.target.result; }; 
                reader.readAsDataURL(file); 
            } 
        });

        document.getElementById('edit-profile-form').addEventListener('submit', e => {
            e.preventDefault();
            const form = e.target;
            handleFormSubmit(form, 'Saving...', async () => {
                isProfileFormDirty = false;
                const newName = document.getElementById('edit-profile-name').value.trim();
                if (!newName) throw new Error('Please enter your full name.');
                
                const newAvatarFile = document.getElementById('new-profile-image-upload').files[0];
                let newAvatarUrl = currentUserData.avatar; let newAvatarSize = currentUserData.avatarSizeKB || 0;
                if (newAvatarFile) {
                    const uploadResult = await uploadImage(newAvatarFile, 'avatars');
                    if (!uploadResult || !uploadResult.url) throw new Error('Image upload failed. Please try again with a valid image file.');
                    newAvatarUrl = uploadResult.url; newAvatarSize = uploadResult.size;
                    updateTotalStorage(newAvatarSize - (currentUserData.avatarSizeKB || 0));
                }
                
                const newBgBlur = document.getElementById('profile-bg-blur').value;
                const newTextColor = document.getElementById('profile-text-color').value;

                await auth.currentUser.updateProfile({ displayName: newName, photoURL: newAvatarUrl });
                await database.ref('users/' + auth.currentUser.uid).update({
                     name: newName, 
                     avatar: newAvatarUrl, 
                     avatarSizeKB: newAvatarSize,
                     equippedBadges: window.tempEquippedBadges || [], 
equippedTitles: window.tempEquippedTitles || [], 
profileCustomization: {
                        ...currentUserData.profileCustomization,
                        bgBlur: parseInt(newBgBlur, 10),
                        textColor: newTextColor
                     }
                });

                goBackToProfile(); showModal('success', 'Profile Updated', 'Your changes have been saved successfully.');
            });
        });
        
        const blurSlider = document.getElementById('profile-bg-blur');
        const blurValueEl = document.getElementById('blur-value');
        const blurDecreaseBtn = document.getElementById('blur-decrease');
        const blurIncreaseBtn = document.getElementById('blur-increase');
        blurSlider.addEventListener('input', () => { blurValueEl.textContent = blurSlider.value; });
        blurDecreaseBtn.addEventListener('click', () => { blurSlider.value--; blurValueEl.textContent = blurSlider.value; });
        blurIncreaseBtn.addEventListener('click', () => { blurSlider.value++; blurValueEl.textContent = blurSlider.value; });

        document.getElementById('customize-profile-inventory-btn').addEventListener('click', () => {
            handleNavigation('lup-wallet-screen');
            setTimeout(() => {
                document.querySelector('.lup-wallet-tab[data-target="lup-wallet-inventory"]')?.click();
            }, 250);
        });

        document.getElementById('change-password-form').querySelectorAll('.password-toggle').forEach(el => { el.addEventListener('click', (e) => { const input = e.target.previousElementSibling; const type = input.getAttribute('type') === 'password' ? 'text' : 'password'; input.setAttribute('type', type); e.target.classList.toggle('fa-eye'); e.target.classList.toggle('fa-eye-slash'); }); });
        document.getElementById('change-password-form').addEventListener('submit', e => {
            e.preventDefault();
            const form = e.target;
            handleFormSubmit(form, 'Updating...', async () => {
                const currentPassword = document.getElementById('current-password').value;
                const newPassword = document.getElementById('new-password').value;
                const confirmNewPassword = document.getElementById('confirm-new-password').value;

                if (newPassword !== confirmNewPassword) throw new Error('The new passwords do not match.');
                if (newPassword.length < 6) throw new Error('Password should be at least 6 characters long.');

                const user = auth.currentUser;
                const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
                
                try {
                    await user.reauthenticateWithCredential(credential);
                    await user.updatePassword(newPassword);
                    form.reset(); goBackToProfile();
                    showModal('success', 'Password Updated', 'Your password has been changed. Please log in again.', 'OK', () => {
                        auth.signOut();
                    });
                } catch (error) {
                    if (error.code === 'auth/wrong-password' || error.code === 'auth/internal-error') throw { message: 'The current password you entered is incorrect.' };
                    else throw error;
                }
            });
        });
         document.getElementById('delete-account-btn').addEventListener('click', () => {
            showCustomModal({
                type: 'error',
                title: 'Are you absolutely sure?',
                message: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
                primaryButton: { text: 'Continue Deletion', onClick: () => {
                    showCustomModal({
                        type: 'error',
                        title: 'Final Confirmation',
                        message: `Please enter your password to confirm account deletion.<br><input type="password" id="delete-confirm-password" class="form-input mt-4" placeholder="Your Password">`,
                        primaryButton: { text: 'Confirm & Delete Account', closeOnClick: false, onClick: () => {
                            const password = document.getElementById('delete-confirm-password').value;
                            if (!password) {
                                showModal('error', 'Password Required', 'You must enter your password to proceed.');
                                return;
                            }
                            handleAccountDeletion(password);
                        }},
                        secondaryButton: { text: 'Cancel' }
                    });
                }},
                secondaryButton: { text: 'Cancel' }
            });
        });
    }

    async function handleAccountDeletion(password) {
        const user = auth.currentUser;
        if (!user) return;
        showLoader('Deleting Account...');
        try {
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
            await user.reauthenticateWithCredential(credential);
            await database.ref('users/' + user.uid).remove();
            await user.delete();
            hideLoader();
            localStorage.removeItem('accountCreated');
            showModal('success', 'Account Deleted', 'Your account has been permanently deleted.', 'OK', () => {
                // onAuthStateChanged will handle the rest
            });
        } catch (error) {
            hideLoader();
            if (error.code === 'auth/wrong-password') {
                handleFirebaseError({ message: 'The password you entered is incorrect. Account deletion failed.' });
            } else {
                handleFirebaseError({ message: 'An error occurred during account deletion. Please try again.' });
            }
        }
    }
    
    function startDepositFlow() { handleNavigation('payment-content'); document.querySelector('#payment-header h2').textContent = 'টাকা জমা দিন'; renderPaymentMethodSelection('deposit'); }
    function startWithdrawFlow() { handleNavigation('payment-content'); document.querySelector('#payment-header h2').textContent = 'টাকা উত্তোলন করুন'; renderPaymentMethodSelection('withdraw'); }
    
    function renderPaymentMethodSelection(type) {
        const contentArea = document.getElementById('payment-content'); contentArea.scrollTop = 0;
        contentArea.innerHTML = `<h2 class="text-xl font-bold text-center mb-6">পেমেন্ট মাধ্যম বেছে নিন</h2><div class="space-y-3 max-w-sm mx-auto">${Object.keys(paymentMethods).map(key => `<button class="w-full flex items-center p-3 rounded-xl payment-method-btn" data-method-key="${key}" data-type="${type}"><img src="${paymentMethods[key].logo}" class="payment-method-img !rounded-lg" loading="lazy"><span class="text-lg font-semibold">${paymentMethods[key].name}</span><i class="fa-solid fa-chevron-right text-gray-500 ml-auto"></i></button>`).join('')}</div>`;
        contentArea.querySelectorAll('.payment-method-btn').forEach(btn => { btn.addEventListener('click', () => { if (type === 'deposit') renderDepositForm(btn.dataset.methodKey); else if (type === 'withdraw') renderWithdrawForm(btn.dataset.methodKey); }); });
        gsap.from(".payment-method-btn", { y: 20, opacity: 0, stagger: 0.1, duration: 0.3 });
    }

    function renderDepositForm(methodKey) {
        const method = paymentMethods[methodKey]; currentPaymentData = { type: 'deposit', method: method.name, methodKey: methodKey };
        const contentArea = document.getElementById('payment-content'); contentArea.scrollTop = 0;
        contentArea.innerHTML = `<div class="max-w-md mx-auto space-y-5"><div class="text-center"><img src="${method.logo}" class="w-20 h-20 mx-auto mb-2 object-contain" loading="lazy"><h2 class="text-2xl font-bold">Deposit via ${method.name}</h2></div><div class="bg-gradient-to-br from-[#2a2a2e] to-[#202024] border border-gray-700 rounded-2xl p-4 space-y-3 shadow-lg"><h3 class="font-semibold text-green-400">নির্দেশনা</h3><p class="text-sm text-gray-300">আপনার ${method.name} অ্যাপ থেকে নিচের নম্বরে <strong class="text-white">${method.type}</strong> করুন।</p><div class="bg-black/50 p-3 rounded-lg flex justify-between items-center border border-gray-600"><code id="payment-number" class="text-2xl font-bold tracking-wider">${method.number}</code><button id="copy-payment-number-btn" class="bg-gray-600 hover:bg-gray-500 w-10 h-10 rounded-md flex items-center justify-center transition-colors"><i class="fa-solid fa-copy"></i></button></div></div><div class="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-4 space-y-4"><div><label for="payment-amount" class="form-label">টাকার পরিমাণ (Min: ${MIN_DEPOSIT} - Max: ${MAX_DEPOSIT})</label><input type="number" id="payment-amount" class="form-input" placeholder="e.g., 500" required></div><div><label for="payment-trxid" class="form-label">ট্রানজেকশন আইডি (TrxID)</label><input type="text" id="payment-trxid" class="form-input" placeholder="e.g., 9C4B8A71D3" required></div></div><div class="bg-red-900/50 border border-red-700 rounded-xl p-3 text-center text-xs text-red-300"><i class="fa-solid fa-triangle-exclamation mr-1"></i><strong>সতর্কতা:</strong> কোনো ভুল বা মিথ্যা তথ্য দিলে আপনার একাউন্ট ব্যান করা হতে পারে।</div><div class="sticky bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent"><div id="payment-swipe-confirm" class="swipe-container"><div class="swipe-track"></div><div class="swipe-handle"><i class="fa-solid fa-chevron-right text-white"></i><i class="fa-solid fa-chevron-right text-white -ml-2"></i></div><div class="swipe-text">জমা দেওয়ার জন্য সোয়াইপ করুন</div></div></div></div>`;
        document.getElementById('copy-payment-number-btn').addEventListener('click', () => { navigator.clipboard.writeText(method.number).then(() => showModal('success', 'নম্বর কপি হয়েছে!', `${method.number} নম্বরটি আপনার ক্লিপবোর্ডে কপি করা হয়েছে।`)); });
        initSwipeToConfirm(async (resetSwipe) => {
            const amount = parseFloat(document.getElementById('payment-amount').value);
            const trxId = document.getElementById('payment-trxid').value.trim().toUpperCase();
            const snapshot = await database.ref('deposits').orderByChild('trxId').equalTo(trxId).once('value');
            if (isNaN(amount) || !trxId) {
                showModal('error', 'তথ্য প্রয়োজন', 'অনুগ্রহ করে টাকার পরিমাণ এবং ট্রানজেকশন আইডি সঠিকভাবে দিন।');
                resetSwipe();
            } else if (amount < MIN_DEPOSIT || amount > MAX_DEPOSIT) {
                showModal('error', 'সীমা অতিক্রম করেছে', `আপনি সর্বনিম্ন ${MIN_DEPOSIT} টাকা এবং সর্বোচ্চ ${MAX_DEPOSIT} টাকা জমা দিতে পারবেন।`);
                resetSwipe();
            } else if (snapshot.exists()) {
                showModal('error', 'ডুপ্লিকেট ট্রানজেকশন', 'এই ট্রানজেকশন আইডি আগে ব্যবহার করা হয়েছে। অনুগ্রহ করে সঠিক তথ্য দিন।');
                resetSwipe();
            } else {
                currentPaymentData.amount = amount;
                currentPaymentData.trxId = trxId;
                submitDepositRequest();
            }
        });
    }

    async function renderWithdrawForm(methodKey) {
        const method = paymentMethods[methodKey];
        const today = new Date().toISOString().slice(0, 10);
        const withdrawalsSnapshot = await database.ref('withdrawals').orderByChild('userId').equalTo(auth.currentUser.uid).once('value');
        const todayWithdrawals = Object.values(withdrawalsSnapshot.val() || {}).filter(w => w.timestamp.startsWith(today));
        if (todayWithdrawals.length >= WITHDRAW_LIMIT_PER_DAY) { showModal('error', 'দৈনিক সীমা পূর্ণ', `আপনি আজ ইতিমধ্যে ${WITHDRAW_LIMIT_PER_DAY} বার টাকা উত্তোলন করেছেন। অনুগ্রহ করে আগামীকাল আবার চেষ্টা করুন।`, 'ঠিক আছে', () => startWithdrawFlow()); return; }
        currentPaymentData = { type: 'withdraw', method: method.name, methodKey: methodKey }; const contentArea = document.getElementById('payment-content'); contentArea.scrollTop = 0;
        contentArea.innerHTML = `<div class="max-w-md mx-auto space-y-5"><div class="text-center"><img src="${method.logo}" class="w-20 h-20 mx-auto mb-2 object-contain" loading="lazy"><h2 class="text-2xl font-bold">Withdraw to ${method.name}</h2></div><div class="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-4 space-y-4"><div><label for="payment-amount" class="form-label">টাকার পরিমাণ (Min: ${MIN_WITHDRAW} - Max: ${MAX_WITHDRAW})</label><input type="number" id="payment-amount" class="form-input" placeholder="e.g., 300" required></div><div><label for="account-number" class="form-label">আপনার ${method.name} একাউন্ট নম্বর</label><input type="tel" id="account-number" class="form-input" placeholder="e.g., 01xxxxxxxxx" required></div></div><div class="bg-blue-900/50 border border-blue-700 rounded-xl p-3 text-center text-xs text-blue-300"><i class="fa-solid fa-info-circle mr-1"></i>আপনার অনুরোধটি ২৪ ঘণ্টার মধ্যে প্রসেস করা হবে।</div><div class="sticky bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent"><div id="payment-swipe-confirm" class="swipe-container"><div class="swipe-track"></div><div class="swipe-handle"><i class="fa-solid fa-chevron-right text-white"></i><i class="fa-solid fa-chevron-right text-white -ml-2"></i></div><div class="swipe-text">উত্তোলনের জন্য সোয়াইপ করুন</div></div></div></div>`;
        initSwipeToConfirm((resetSwipe) => {
            const amount = parseFloat(document.getElementById('payment-amount').value);
            const accountNumber = document.getElementById('account-number').value.trim();
            const currentBalance = currentUserData.wallet?.live || 0;
            if (isNaN(amount) || !accountNumber) {
                showModal('error', 'তথ্য প্রয়োজন', 'অনুগ্রহ করে টাকার পরিমাণ এবং আপনার একাউন্ট নম্বর সঠিকভাবে দিন।');
                resetSwipe();
            } else if (amount > currentBalance) {
                showModal('error', 'অপর্যাপ্ত ব্যালেন্স', `আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই। আপনার বর্তমান ব্যালেন্স ${currentBalance.toFixed(2)} টাকা।`);
                resetSwipe();
            } else if (amount < MIN_WITHDRAW || amount > MAX_WITHDRAW) {
                showModal('error', 'সীমা অতিক্রম করেছে', `আপনি সর্বনিম্ন ${MIN_WITHDRAW} টাকা এবং সর্বোচ্চ ${MAX_WITHDRAW} টাকা উত্তোলন করতে পারবেন।`);
                resetSwipe();
            } else {
                currentPaymentData.amount = amount;
                currentPaymentData.accountNumber = accountNumber;
                submitWithdrawRequest();
            }
        });
    }
    
    async function submitDepositRequest() {
        const { method, amount, trxId } = currentPaymentData;
        try {
            showLoader('Submitting Request...');
            const depositId = database.ref('deposits').push().key;
            await database.ref('deposits/' + depositId).set({ id: depositId, userId: auth.currentUser.uid, userName: currentUserData.name, method, amount, trxId, timestamp: new Date().toISOString(), status: 'pending' });
            hideLoader();
            window.history.back();
            showCustomModal({ type: 'success', title: 'অনুরোধ সফল হয়েছে', message: 'আপনার জমার অনুরোধটি পর্যালোচনার জন্য পাঠানো হয়েছে। এডমিন অনুমোদন করলে আপনার ব্যালেন্সে টাকা যোগ হয়ে যাবে।', primaryButton: { text: 'ঠিক আছে' } });
        } catch (error) { hideLoader(); handleFirebaseError(error); renderPaymentMethodSelection('deposit'); }
    }
    
    async function submitWithdrawRequest() {
        const { method, amount, accountNumber } = currentPaymentData;
        try {
            showLoader('Submitting Request...');
            const newBalance = (currentUserData.wallet?.live || 0) - amount;
            await database.ref(`users/${auth.currentUser.uid}/wallet/live`).set(newBalance);
            const withdrawId = database.ref('withdrawals').push().key;
            await database.ref('withdrawals/' + withdrawId).set({ id: withdrawId, userId: auth.currentUser.uid, userName: currentUserData.name, method, amount, accountNumber, timestamp: new Date().toISOString(), status: 'pending' });
            hideLoader();
            window.history.back();
            showCustomModal({ type: 'success', title: 'অনুরোধ সফল হয়েছে', message: 'আপনার টাকা উত্তোলনের অনুরোধটি ২৪ ঘণ্টার মধ্যে প্রসেস করা হবে।', primaryButton: { text: 'ঠিক আছে' } });
        } catch (error) { await database.ref(`users/${auth.currentUser.uid}/wallet/live`).set(currentUserData.wallet?.live || 0); hideLoader(); handleFirebaseError(error); renderPaymentMethodSelection('withdraw'); }
    }

    function renderHomeGuildPosts() {
        const container = document.getElementById('home-guild-feed');
        const allGuildPosts = Object.values(window.dbData.guildPosts || {});
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const activePosts = allGuildPosts.filter(post => new Date(post.timestamp).getTime() > thirtyDaysAgo).sort((a, b) => new Date(b.timestamp) - a.timestamp);
        if (activePosts.length === 0) { container.innerHTML = `<div class="text-center text-gray-500 p-10 bg-gray-800/50 rounded-lg"><i class="fa-solid fa-users-slash text-4xl mb-4"></i><p>কোন গিল্ড পোস্ট এখন উপলব্ধ নেই।</p></div>`; return; }
        container.innerHTML = activePosts.map(createGuildPostCardHTML).join('');
        gsap.from("#home-guild-feed > div", { y: 50, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
    }

    function createGuildPostCardHTML(post) {
        const alreadyApplied = post.applications && post.applications[auth.currentUser.uid]; const isMyPost = post.creatorId === auth.currentUser.uid; let buttonHTML;
        if(isMyPost) { buttonHTML = `<button class="manage-my-guild-post-btn w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-sm">Manage Post</button>`;
        } else if(alreadyApplied) { buttonHTML = `<button class="w-full py-3 rounded-lg bg-yellow-600 font-bold text-sm" disabled>আবেদন করা হয়েছে</button>`;
        } else { buttonHTML = `<button class="guild-apply-btn w-full py-3 rounded-lg action-button font-bold text-sm" data-guild-post-id="${post.id}">আমি জয়েন হতে চাই</button>`; }
        return `<div class="guild-post-card rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a2a2a] to-[#202020] border border-gray-700" data-guild-post-id-wrapper="${post.id}">
            <div class="relative">
                <img src="${post.guildImage || 'https://via.placeholder.com/400x200?text=No+Image'}" class="w-full h-auto max-h-80 object-cover" alt="Guild Image" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-4 w-full">
                    <div class="flex justify-between items-end">
                        <div class="flex items-center gap-3 cursor-pointer user-profile-trigger" data-user-id="${post.creatorId}">
                            <img src="${post.creatorAvatar || DEFAULT_AVATAR}" class="w-10 h-10 rounded-full object-cover border-2 border-gray-500" loading="lazy">
                            <div>
                                <p class="font-semibold text-white text-sm">${post.creatorName}</p>
                                <p class="text-xs text-gray-400">${timeAgo(post.timestamp)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-4">
                <h3 class="text-2xl font-bold font-oswald text-green-300">${post.guildName}</h3>
                <div class="flex flex-wrap gap-2 mt-3">
                    <span class="card-tag"><i class="fa-solid fa-globe text-green-400"></i> ${post.region}</span>
                    <span class="card-tag"><i class="fa-solid fa-gamepad text-blue-400"></i> ${post.playerType}</span>
                    <span class="card-tag"><i class="fa-solid fa-shield-halved text-yellow-400"></i> ${post.guildType}</span>
                </div>
                <details class="border-t border-gray-700 pt-3 mt-4">
                    <summary class="font-semibold text-gray-300 cursor-pointer text-sm">Rules & Regulations</summary>
                    <ul class="list-disc list-inside text-gray-400 text-xs space-y-1 mt-2 pl-2">${post.rules.map(rule => `<li>${rule}</li>`).join('')}</ul>
                </details>
            </div>
            <div class="p-3 bg-black/30">${buttonHTML}</div>
        </div>`;
    }

    document.getElementById('home-content').addEventListener('click', e => {
        const applyBtn = e.target.closest('.guild-apply-btn'); 
        const manageBtn = e.target.closest('.manage-my-guild-post-btn');
        const contactBtn = e.target.closest('.contact-squad-post-btn');
        const userTrigger = e.target.closest('.user-profile-trigger');
        if (applyBtn) { const postId = applyBtn.dataset.guildPostId; startGuildApplicationFlow(postId); }
        if (manageBtn) { handleNavigation('manage-posts-content'); }
        if (contactBtn) { const number = contactBtn.dataset.whatsapp; if (number) { window.open(`https://wa.me/${number}`, '_blank'); } }
        if (userTrigger) { const userId = userTrigger.dataset.userId; handleNavigation('user-profile-content'); renderUserProfile(userId); }
    });

    function renderGuildPostForm() {
        const contentArea = document.getElementById('guild-post-form-content');
        contentArea.innerHTML = `<form id="guild-post-form" class="space-y-6"><div class="form-section p-4 rounded-xl space-y-4"><div><label class="form-label text-center block">Guild Image</label><div class="relative w-full h-40 mx-auto border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center"><input type="file" id="guild-image-upload" class="hidden" accept="image/*" required><label for="guild-image-upload" class="cursor-pointer group w-full h-full"><img id="guild-image-preview" src="" class="hidden absolute inset-0 w-full h-full object-cover rounded-lg" loading="lazy"><div id="guild-image-placeholder" class="flex flex-col items-center justify-center h-full text-gray-400"><i class="fa-solid fa-camera text-3xl"></i><p class="mt-2 text-sm">Select Image</p></div></label></div></div><div><label for="guild-name" class="form-label">Guild Name</label><input type="text" id="guild-name" class="form-input" required></div><div><label for="guild-code" class="form-label">Guild Code</label><input type="text" id="guild-code" class="form-input" required></div></div><div class="form-section p-4 rounded-xl space-y-4"><div><label class="form-label">Guild Region</label><div class="flex gap-2"><div><input type="radio" id="region-bd" name="guild-region" class="hidden custom-radio" value="Bangladesh" checked><label for="region-bd" class="block w-full text-center py-2 px-4 border border-gray-600 rounded-lg cursor-pointer">Bangladesh</label></div><div><input type="radio" id="region-nepal" name="guild-region" class="hidden custom-radio" value="Nepal"><label for="region-nepal" class="block w-full text-center py-2 px-4 border border-gray-600 rounded-lg cursor-pointer">Nepal</label></div></div></div><div><label class="form-label">Player Type</label><div class="flex gap-2"><div><input type="radio" id="player-esports" name="player-type" class="hidden custom-radio" value="E-SPORTS" checked><label for="player-esports" class="block w-full text-center py-2 px-4 border border-gray-600 rounded-lg cursor-pointer">E-SPORTS</label></div><div><input type="radio" id="player-normal" name="player-type" class="hidden custom-radio" value="Normal"><label for="player-normal" class="block w-full text-center py-2 px-4 border border-gray-600 rounded-lg cursor-pointer">Normal</label></div><div><input type="radio" id="player-any" name="player-type" class="hidden custom-radio" value="Any"><label for="player-any" class="block w-full text-center py-2 px-4 border border-gray-600 rounded-lg cursor-pointer">Any</label></div></div></div><div><label class="form-label">Guild Type</label><div class="flex gap-2"><div><input type="radio" id="guild-esport" name="guild-type" class="hidden custom-radio" value="Esport" checked><label for="guild-esport" class="block w-full text-center py-2 px-4 border border-gray-600 rounded-lg cursor-pointer">Esport</label></div><div><input type="radio" id="guild-friendly" name="guild-type" class="hidden custom-radio" value="Friendly"><label for="guild-friendly" class="block w-full text-center py-2 px-4 border border-gray-600 rounded-lg cursor-pointer">Friendly</label></div><div><input type="radio" id="guild-normal" name="guild-type" class="hidden custom-radio" value="Normal"><label for="guild-normal" class="block w-full text-center py-2 px-4 border border-gray-600 rounded-lg cursor-pointer">Normal</label></div></div></div></div><div class="form-section p-4 rounded-xl space-y-4"><div class="flex justify-between items-center"><label class="form-label mb-0">Rules & Regulation</label><button type="button" id="add-rule-btn" class="text-green-400"><i class="fa-solid fa-plus-circle"></i> Add Rule</button></div><div id="rules-container" class="space-y-2"><input type="text" class="form-input guild-rule" placeholder="Rule 1" required></div></div><button type="submit" class="w-full py-4 mt-6 rounded-xl action-button text-lg flex items-center justify-center h-[52px]">Post</button></form>`;
        document.getElementById('guild-image-upload').addEventListener('change', e => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (event) => { document.getElementById('guild-image-preview').src = event.target.result; document.getElementById('guild-image-preview').classList.remove('hidden'); document.getElementById('guild-image-placeholder').classList.add('hidden'); }; reader.readAsDataURL(file); } });
        document.getElementById('add-rule-btn').addEventListener('click', () => { const container = document.getElementById('rules-container'); const ruleCount = container.children.length + 1; const newInput = document.createElement('input'); newInput.type = 'text'; newInput.className = 'form-input guild-rule'; newInput.placeholder = `Rule ${ruleCount}`; newInput.required = true; container.appendChild(newInput); });
        document.getElementById('guild-post-form').addEventListener('submit', handleGuildPostSubmit);
    }
    
    function handleGuildPostSubmit(e) {
        e.preventDefault();
        const form = e.target;
        handleFormSubmit(form, 'Posting...', async () => {
            const guildPostImageFile = document.getElementById('guild-image-upload').files[0];
            if (!guildPostImageFile) throw new Error('Guild Image is required.');

            const rules = Array.from(form.querySelectorAll('.guild-rule')).map(input => input.value.trim()).filter(Boolean);
            if (rules.length === 0) throw new Error('Please add at least one rule.');
            const uploadResult = await uploadImage(guildPostImageFile, 'guild-images');
            if (!uploadResult) throw new Error('Image upload failed. Make sure you selected a valid image.');
            const postData = { creatorId: auth.currentUser.uid, creatorName: currentUserData.name, creatorAvatar: currentUserData.avatar || DEFAULT_AVATAR, guildImage: uploadResult.url, guildName: form.querySelector('#guild-name').value, guildCode: form.querySelector('#guild-code').value, region: form.querySelector('input[name="guild-region"]:checked').value, playerType: form.querySelector('input[name="player-type"]:checked').value, guildType: form.querySelector('input[name="guild-type"]:checked').value, rules: rules, timestamp: new Date().toISOString() };
            const newPostRef = database.ref('guildPosts').push();
            await newPostRef.set({ ...postData, id: newPostRef.key });
            handleNavigation('manage-posts-content');
            showModal('success', 'পোস্ট সফল হয়েছে!', 'আপনার গিল্ড পোস্ট সফলভাবে তৈরি করা হয়েছে।');
        });
    }
    
    async function startGuildApplicationFlow(postId) {
        const post = window.dbData.guildPosts?.[postId];
        if(!post) { showModal('error', 'পোস্ট পাওয়া যায় নি', 'এই পোস্টটি আর উপলব্ধ নেই।'); return; }
        handleNavigation('guild-application-content');
        renderGuildApplicationStep1_Rules(post);
    }

    function renderGuildApplicationStep1_Rules(post) {
        const contentArea = document.getElementById('guild-application-content');
        const rulesHTML = post.rules.map(rule => `<li class="flex items-start"><i class="fa-solid fa-check text-green-400 mt-1 mr-2"></i><span>${rule}</span></li>`).join('');
        contentArea.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="flex-grow overflow-y-auto no-scrollbar">
                    <div class="p-4 bg-[#1e1e1e] border border-gray-700 rounded-lg mb-6">
                        <ul class="space-y-2 text-gray-300">${rulesHTML}</ul>
                    </div>
                    <label for="agree-guild-rules" class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" id="agree-guild-rules" class="hidden">
                        <div class="w-6 h-6 border-2 border-gray-500 rounded flex items-center justify-center check-icon-container">
                            <i class="fa-solid fa-check text-white hidden"></i>
                        </div>
                        <span class="text-gray-300">আমি নিয়মগুলো পড়েছি এবং সম্মত আছি।</span>
                    </label>
                </div>
                <div class="flex-shrink-0 p-4 bg-black">
                    <button id="guild-app-next-btn" class="w-full py-3 rounded-lg action-button" disabled>Next</button>
                </div>
            </div>`;

        const agreeCheckbox = contentArea.querySelector('#agree-guild-rules'), nextBtn = contentArea.querySelector('#guild-app-next-btn');
        agreeCheckbox.addEventListener('change', () => { contentArea.querySelector('.check-icon-container .fa-check').classList.toggle('hidden', !agreeCheckbox.checked); nextBtn.disabled = !agreeCheckbox.checked; });
        nextBtn.addEventListener('click', () => renderGuildApplicationStep2_Form(post));
    }

    function renderGuildApplicationStep2_Form(post) {
        const contentArea = document.getElementById('guild-application-content');
        contentArea.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="flex-grow overflow-y-auto no-scrollbar">
                    <form id="guild-application-form" class="space-y-4">
                        <div class="bg-[#1e1e1e] border border-gray-700 rounded-xl p-4 space-y-3">
                            <h3 class="font-semibold text-green-400">১. গিল্ডে রিকুয়েস্ট পাঠান</h3>
                            <p class="text-sm text-gray-300">এই কোডটি কপি করে গেমে গিল্ডে রিকুয়েস্ট পাঠান।</p>
                            <div class="bg-black/30 p-3 rounded-lg flex justify-between items-center">
                                <code class="text-xl font-bold tracking-wider">${post.guildCode}</code>
                                <button type="button" class="copy-guild-code-btn bg-gray-600 hover:bg-gray-700 w-10 h-10 rounded-md flex items-center justify-center"><i class="fa-solid fa-copy"></i></button>
                            </div>
                        </div>
                        <div class="bg-[#1e1e1e] border border-gray-700 rounded-xl p-4 space-y-4">
                            <h3 class="font-semibold text-green-400">২. আপনার তথ্য দিন</h3>
                            <label class="form-label">আপনি কি রিকুয়েস্ট দিয়েছেন?</label>
                            <select id="request-sent-confirm" class="form-select" required>
                                <option value="">Select</option>
                                <option value="yes">হ্যাঁ</option>
                            </select>
                            <div>
                                <label for="applicant-game-name" class="form-label">আপনার ইন-গেম নাম</label>
                                <input type="text" id="applicant-game-name" class="form-input" required>
                            </div>
                            <div>
                                <label for="applicant-game-uid" class="form-label">আপনার ইন-গেম UID</label>
                                <input type="text" id="applicant-game-uid" class="form-input" required>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="flex-shrink-0 p-4 bg-black">
                    <button id="submit-guild-app-btn" class="w-full py-3 rounded-lg action-button">Submit Application</button>
                </div>
            </div>`;
        contentArea.querySelector('.copy-guild-code-btn').addEventListener('click', () => navigator.clipboard.writeText(post.guildCode).then(() => showModal('success', 'কপি হয়েছে!', `গিল্ড কোড কপি করা হয়েছে।`)));
        contentArea.querySelector('#submit-guild-app-btn').addEventListener('click', () => handleGuildApplicationSubmit(post));
    }

    async function handleGuildApplicationSubmit(post) {
        const confirmSelect = document.getElementById('request-sent-confirm'); const gameName = document.getElementById('applicant-game-name').value.trim(); const gameUid = document.getElementById('applicant-game-uid').value.trim();
        if(confirmSelect.value !== 'yes' || !gameName || !gameUid) { showModal('error', 'ফর্ম পূরণ করুন', 'অনুগ্রহ করে সব তথ্য সঠিকভাবে পূরণ করুন।'); return; }
        const applicationData = { applicantId: auth.currentUser.uid, applicantName: currentUserData.name, applicantInGameName: gameName, applicantInGameUid: gameUid, timestamp: new Date().toISOString(), status: 'pending' };
        try {
            await database.ref(`guildPosts/${post.id}/applications/${auth.currentUser.uid}`).set(applicationData);
            window.history.back();
            showCustomModal({ type: 'success', title: 'আবেদন সফল হয়েছে!', message: 'আপনার আবেদনটি সফলভাবে জমা দেওয়া হয়েছে।', autoClose: 3000 });
        } catch(error) { handleFirebaseError(error); }
    }
    
    function renderManageNeedPage() {
        const container = document.getElementById('manage-posts-content');
        setupTabs(container.id, '.manage-need-tab', '.tab-content-section');
        
        const currentActiveTab = container.querySelector('.manage-need-tab.active-tab');
        if (!currentActiveTab) {
            const firstTab = container.querySelector('.manage-need-tab');
            if (firstTab) firstTab.click(); 
        }
        
        renderManagePostTab(); renderApprovalsTab(); renderMyRequestsTab();
    }

    function renderManagePostTab() {
        const container = document.getElementById('my-posts-section'); container.innerHTML = `<div class="spinner mx-auto"></div>`;
        const myGuildPosts = Object.values(window.dbData.guildPosts || {}).filter(p => p.creatorId === auth.currentUser.uid);
        const myPlayerSquadPosts = Object.values(window.dbData.playerSquadPosts || {}).filter(p => p.creatorId === auth.currentUser.uid);
        const myPosts = [...myGuildPosts, ...myPlayerSquadPosts].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        if (myPosts.length === 0) { container.innerHTML = `<p class="text-center text-gray-500">You haven't created any posts yet.</p>`; return; }
        container.innerHTML = myPosts.map(post => {
            const isGuildPost = !!post.guildName; const title = isGuildPost ? post.guildName : 'Player/Squad Post'; const image = isGuildPost ? post.guildImage : post.imageUrl; const stats = isGuildPost ? `${Object.keys(post.applications || {}).length} Applications` : 'Player/Squad Post'; const postId = post.id; const postType = isGuildPost ? 'guildPosts' : 'playerSquadPosts';
            return `<div class="bg-[#2a2a2a] p-3 rounded-lg"><div class="flex justify-between items-center"><div class="flex items-center gap-3"><img src="${image || 'https://via.placeholder.com/48'}" class="w-12 h-12 object-cover rounded-md" loading="lazy"><div><p class="font-semibold">${title}</p><p class="text-xs text-gray-400">${stats}</p></div></div><button class="delete-need-post-btn text-red-500 hover:text-red-400" data-post-id="${postId}" data-post-type="${postType}"><i class="fa-solid fa-trash-can text-xl"></i></button>
                </div>
                 <p class="text-xs text-gray-500 mt-2">Post ID: ${postId}</p>
            </div>`
        }).join('');

        container.querySelectorAll('.delete-need-post-btn').forEach(btn => {
            btn.addEventListener('click', e => {
            const { postId, postType } = e.currentTarget.dataset;
                showCustomModal({
                    type: 'error',
                    title: 'আপনি কি নিশ্চিত?',
                    message: 'এই পোস্টটি মুছে ফেলা হলে আর পুনরুদ্ধার করা যাবে না।',
                    primaryButton: { text: 'হ্যাঁ, মুছুন', onClick: () => {
                        database.ref(`${postType}/${postId}`).remove().then(() => {
                            showModal('success', 'পোস্ট মুছে ফেলা হয়েছে', 'আপনার পোস্ট সফলভাবে মুছে ফেলা হয়েছে।');
                        }).catch(handleFirebaseError);
                    }},
                    secondaryButton: { text: 'না' }
                });
            });
        });
    }

    function renderApprovalsTab() {
        const container = document.getElementById('approvals-section');
        container.innerHTML = `<div class="spinner mx-auto"></div>`;
        const myPosts = Object.values(window.dbData.guildPosts || {}).filter(p => p.creatorId === auth.currentUser.uid);
        const allApplications = myPosts.flatMap(post => 
            Object.values(post.applications || {}).map(app => ({...app, postName: post.guildName, postId: post.id }))
        );
        
        if (allApplications.length === 0) {
            container.innerHTML = `<p class="text-center text-gray-500">You have no pending approvals.</p>`;
            return;
        }

        container.innerHTML = allApplications.map(app => {
            let statusHTML;
            if (app.status === 'pending') {
                statusHTML = `
                <div class="flex gap-2 mt-2">
                    <button class="approve-guild-app-btn flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs" data-post-id="${app.postId}" data-applicant-id="${app.applicantId}">Approve</button>
                    <button class="reject-guild-app-btn flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs" data-post-id="${app.postId}" data-applicant-id="${app.applicantId}">Reject</button>
                </div>`;
            } else {
                const statusClass = app.status === 'approved' ? 'text-green-400' : 'text-red-400';
                statusHTML = `<p class="text-sm font-bold mt-2 ${statusClass}">${app.status.toUpperCase()}</p>`;
            }

            return `
            <div class="bg-[#2a2a2a] p-3 rounded-lg">
                <p class="text-xs text-gray-400">For Guild: <span class="font-semibold text-white">${app.postName}</span></p>
                <div class="border-t border-gray-700 my-2"></div>
                <p><strong>Applicant:</strong> ${app.applicantName}</p>
                <p><strong>Game Name:</strong> ${app.applicantInGameName}</p>
                <p><strong>Game UID:</strong> ${app.applicantInGameUid}</p>
                ${statusHTML}
            </div>
        `;
        }).join('');

        container.querySelectorAll('.approve-guild-app-btn').forEach(btn => btn.addEventListener('click', e => {
            const { postId, applicantId } = e.currentTarget.dataset;
            database.ref(`guildPosts/${postId}/applications/${applicantId}/status`).set('approved');
        }));
        container.querySelectorAll('.reject-guild-app-btn').forEach(btn => btn.addEventListener('click', e => {
            const { postId, applicantId } = e.currentTarget.dataset;
            showCustomModal({
                type: 'error',
                title: 'রিজেক্ট করার কারণ',
                message: `<textarea id="rejection-reason-input" class="form-textarea w-full" rows="3" placeholder="একটি কারণ লিখুন..."></textarea>`,
                primaryButton: { text: 'Submit Rejection', closeOnClick: false, onClick: () => {
                     const reason = document.getElementById('rejection-reason-input').value.trim();
                     if (!reason) {
                         alert('Please provide a reason.');
                         return;
                     }
                     database.ref(`guildPosts/${postId}/applications/${applicantId}`).update({ status: 'rejected', rejectionReason: reason })
                        .then(() => {
                            document.getElementById('modal-screen').classList.add('hidden');
                        });
                }},
                secondaryButton: { text: 'Cancel'}
            });
        }));
    }

    function renderMyRequestsTab() {
        const container = document.getElementById('my-requests-section');
        container.innerHTML = `<div class="spinner mx-auto"></div>`;
        
        const allPosts = Object.values(window.dbData.guildPosts || {});
        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);

        const myApps = allPosts.flatMap(post => 
            post.applications && post.applications[auth.currentUser.uid]
            ? [{ ...post.applications[auth.currentUser.uid], postName: post.guildName, postId: post.id }]
            : []
        ).filter(app => new Date(app.timestamp).getTime() > threeDaysAgo);

        if (myApps.length === 0) {
            container.innerHTML = `<p class="text-center text-gray-500">You have not applied to any guilds recently.</p>`;
            return;
        }

        container.innerHTML = myApps.map(app => {
            let statusHTML;
            const statusClass = {
                pending: 'text-yellow-400',
                approved: 'text-green-400',
                rejected: 'text-red-400'
            }[app.status];
            
            if (app.status === 'approved') {
                statusHTML = `<p class="font-bold ${statusClass}">Congratulations! আপনাকে নেওয়া হয়েছে</p>`;
            } else if (app.status === 'rejected') {
                statusHTML = `
                <p class="font-bold ${statusClass}">আপনাকে রিজেক্ট করা হয়েছে। 
                    <button class="view-reason-btn text-blue-400 underline text-sm ml-1" data-reason="${app.rejectionReason || 'No reason provided.'}">কারণ দেখুন</button>
                </p>`;
            } else {
                statusHTML = `<p class="font-bold ${statusClass}">Pending</p>`;
            }
            
            return `
            <div class="bg-[#2a2a2a] p-3 rounded-lg">
                <p class="font-semibold">Application to: <span class="text-green-400">${app.postName}</span></p>
                <p class="text-xs text-gray-400">${timeAgo(app.timestamp)}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="text-sm">${statusHTML}</div>
            </div>
            `;
        }).join('');

        container.querySelectorAll('.view-reason-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                showModal('error', 'রিজেক্ট এর কারণ', e.currentTarget.dataset.reason, 'ঠিক আছে');
            });
        });
    }
    
    function renderUserProfile(userId) {
        const user = window.dbData.users[userId];
        if (!user) {
            showModal('error', 'User Not Found', 'Could not retrieve user details.');
            window.history.back();
            return;
        }
    
        const bannerMedia = document.getElementById('user-profile-banner-media');
        const defaultBanner = "https://firebasestorage.googleapis.com/v0/b/viptask-5c1fc.appspot.com/o/Levelup%2F2e8e97546eae310a4edfaa46874232ef.jpg?alt=media&token=3f5dd29a-24d8-4aec-80e6-11504b80bdf7";
        
        if (user.equippedEffect && window.dbData.admin?.config?.profileEffects?.[user.equippedEffect]) {
            const effect = window.dbData.admin.config.profileEffects[user.equippedEffect];
            bannerMedia.innerHTML = `<video src="${effect.url}" autoplay loop muted playsinline></video>`;
        } else {
            bannerMedia.innerHTML = `<img src="${defaultBanner}" alt="Default Banner">`;
        }
    
        document.getElementById('user-profile-avatar').src = user.avatar || DEFAULT_AVATAR;
        const avatarFrame = document.getElementById('user-profile-avatar-frame');
        avatarFrame.classList.add('hidden');
        if (user.equippedFrame && window.dbData.admin?.config?.profileFrames?.[user.equippedFrame]) {
            avatarFrame.src = window.dbData.admin.config.profileFrames[user.equippedFrame].url;
            avatarFrame.classList.remove('hidden');
        }
    
        let badgeHTML = '';
        if (user.equippedProfileBadge && window.dbData.admin?.config?.verifiedBadges?.[user.equippedProfileBadge]) {
            const badge = window.dbData.admin.config.verifiedBadges[user.equippedProfileBadge];
            if (badge.type === 'profile') {
                badgeHTML = `<img src="${badge.url}" class="profile-badge-view verification-badge" data-badge-index="${user.equippedProfileBadge}">`;
            }
        }
        document.getElementById('user-profile-username-container').innerHTML = `<h2 id="user-profile-username" class="text-3xl font-bold font-oswald inline">${user.name || 'User'}</h2>${badgeHTML}`;
    
        document.getElementById('user-profile-follow-stats').innerHTML = `
            <div class="text-center"><p class="text-3xl font-bold font-oswald">${formatNumberCompact(user.followersCount || 0)}</p><p class="text-xs text-gray-400 uppercase tracking-wider">Followers</p></div>
            <div class="w-px h-8 bg-gray-700"></div>
            <div class="text-center"><p class="text-3xl font-bold font-oswald">${formatNumberCompact(user.followingCount || 0)}</p><p class="text-xs text-gray-400 uppercase tracking-wider">Following</p></div>`;
    
        const followBtn = document.getElementById('user-profile-follow-toggle-btn');
        followBtn.dataset.targetUid = userId;
        followBtn.onclick = () => handleFollowToggle(userId);
        if (userId === auth.currentUser.uid) {
            followBtn.style.display = 'none';
        } else {
            followBtn.style.display = 'block';
            const isFollowing = currentUserData.following && currentUserData.following[userId];
            if (isFollowing) {
                followBtn.textContent = 'Unfollow';
                followBtn.className = 'w-full py-3 rounded-lg text-sm unfollow-button';
            } else {
                followBtn.textContent = 'Follow';
                followBtn.className = 'w-full py-3 rounded-lg text-sm follow-button';
            }
        }
    
        renderPublicProfileBadges(user);
        renderPublicProfileTitles(user);
        renderPublicProfileTeam(user);
    }
    
    async function handleFollowToggle(targetUserId) {
        const followBtn = document.getElementById('user-profile-follow-toggle-btn');
        if (followBtn.disabled) return;
        followBtn.disabled = true;

        const isCurrentlyFollowing = currentUserData.following && currentUserData.following[targetUserId];
        const updates = {};
        
        if (isCurrentlyFollowing) {
            updates[`/users/${auth.currentUser.uid}/following/${targetUserId}`] = null;
            updates[`/users/${targetUserId}/followers/${auth.currentUser.uid}`] = null;
            updates[`/users/${auth.currentUser.uid}/followingCount`] = firebase.database.ServerValue.increment(-1);
            updates[`/users/${targetUserId}/followersCount`] = firebase.database.ServerValue.increment(-1);
        } else {
            updates[`/users/${auth.currentUser.uid}/following/${targetUserId}`] = true;
            updates[`/users/${targetUserId}/followers/${auth.currentUser.uid}`] = true;
            updates[`/users/${auth.currentUser.uid}/followingCount`] = firebase.database.ServerValue.increment(1);
            updates[`/users/${targetUserId}/followersCount`] = firebase.database.ServerValue.increment(1);
        }
        
        try {
            await database.ref().update(updates);
        } catch (error) {
            console.error("Follow/Unfollow failed:", error);
            showModal('error', "Action Failed", "An error occurred. Please try again.");
        } finally {
            followBtn.disabled = false;
        }
    }
    
    function renderPublicProfileBadges(user) {
        const section = document.getElementById('user-profile-badges-section');
        const container = document.getElementById('user-profile-badges-container');
        const allDbBadges = window.dbData.admin?.config?.verifiedBadges || {};
        const equippedBadges = (user.equippedBadges || []).filter(id => id && allDbBadges[id]);
        if (equippedBadges.length === 0) {
            section.style.display = 'none';
            return;
        }
        section.style.display = 'block';
        container.innerHTML = equippedBadges.map(id => {
            const badge = allDbBadges[id];
            const mediaTag = badge.type === 'video' ? 'video' : 'img';
            return `<div class="badge-slot"><${mediaTag} src="${badge.url}" alt="badge" ${mediaTag === 'video' ? 'autoplay loop muted playsinline' : ''}></${mediaTag}></div>`;
        }).join('');
    }
    
    function renderPublicProfileTitles(user) {
        const section = document.getElementById('user-profile-titles-section');
        const container = document.getElementById('user-profile-titles-grid');
        const allDbTitles = window.dbData.admin?.config?.titles || {};
        const equippedTitles = (user.equippedTitles || []).filter(id => id && allDbTitles[id]);
        if (equippedTitles.length === 0) {
            section.style.display = 'none';
            return;
        }
        section.style.display = 'block';
        container.innerHTML = equippedTitles.map(id => {
            const title = allDbTitles[id];
            const mediaTag = title.url.endsWith('.mp4') ? 'video' : 'img';
            return `<div class="title-slot"><${mediaTag} src="${title.url}" alt="title" ${mediaTag === 'video' ? 'autoplay loop muted playsinline' : ''}></${mediaTag}></div>`;
        }).join('');
    }
    
    function renderPublicProfileTeam(user) {
        const section = document.getElementById('user-profile-team-section');
        const container = document.getElementById('user-profile-team-container');
        const team = user.team;
        if (!team) {
            section.style.display = 'none';
            return;
        }
        section.style.display = 'block';
        const leaderboardData = getFullLeaderboardData();
        const teamRankData = leaderboardData.find(t => t.team.id === team.id);
        const rankScore = teamRankData ? teamRankData.points : (team.rankScore || 0);
        const teamUID = team.teamUid ? `@${team.teamUid}` : `Joined: ${new Date(team.id).toLocaleDateString()}`;
        
        container.innerHTML = `
            <div class="team-card flex items-center justify-between gap-4">
                <div class="flex items-center gap-4 flex-1 min-w-0">
                    <img src="${team.logo || DEFAULT_TEAM_LOGO}" class="team-logo">
                    <div class="flex-1 min-w-0">
                        <p class="font-bold text-lg truncate">${team.name}</p>
                        <p class="text-xs text-gray-500">${teamUID}</p>
                    </div>
                </div>
                <div class="text-center flex-shrink-0">
                    <div class="flex items-center">
                        <p class="rank-score">${rankScore}</p>
                        <div class="rank-change-arrows"><i class="fa-solid fa-caret-up text-green-500"></i><i class="fa-solid fa-caret-down text-red-500"></i></div>
                    </div>
                    <p class="text-xs text-gray-400 uppercase tracking-wider">Rank Score</p>
                </div>
            </div>`;
    }

    function renderHomePlayerSquadPosts() {
        const container = document.getElementById('home-player-squad-feed');
        const allPosts = Object.values(window.dbData.playerSquadPosts || {});
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const activePosts = allPosts.filter(p => new Date(p.timestamp).getTime() > thirtyDaysAgo).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

        if(activePosts.length === 0) {
            container.innerHTML = `<div class="text-center text-gray-500 p-10 bg-gray-800/50 rounded-lg"><i class="fa-solid fa-user-plus text-4xl mb-4"></i><p>No one is looking for players or squads right now.</p></div>`;
            return;
        }
        container.innerHTML = activePosts.map(createPlayerSquadPostCardHTML).join('');
        gsap.from("#home-player-squad-feed > div", { y: 50, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
    }
    
    function createPlayerSquadPostCardHTML(post) {
        return `
        <div class="player-squad-post-card rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a2a2a] to-[#202020] border border-gray-700" data-playersquad-post-id-wrapper="${post.id}">
            ${post.imageUrl ? `<img src="${post.imageUrl}" class="w-full h-auto max-h-96 object-contain" alt="Post Image" loading="lazy">` : ''}
            <div class="p-4">
                 <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3 cursor-pointer user-profile-trigger" data-user-id="${post.creatorId}">
                        <img src="${post.creatorAvatar || DEFAULT_AVATAR}" class="w-10 h-10 rounded-full object-cover border-2 border-gray-500" loading="lazy">
                        <div>
                            <p class="font-semibold text-white">${post.creatorName}</p>
                            <p class="text-xs text-gray-400">${timeAgo(post.timestamp)}</p>
                        </div>
                    </div>
                 </div>
                <p class="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">${post.description}</p>
                <button class="w-full mt-4 py-2.5 rounded-lg bg-green-600/20 text-green-300 border border-green-600/50 font-bold text-sm hover:bg-green-600/40 transition-colors contact-squad-post-btn" data-whatsapp="${post.whatsapp}">
                    <i class="fa-brands fa-whatsapp mr-2"></i>Contact User
                </button>
            </div>
        </div>`;
    }

    function renderPlayerSquadPostForm() {
        const contentArea = document.getElementById('player-squad-post-form-content');
        contentArea.innerHTML = `
            <div class="p-4">
                <form id="player-squad-post-form" class="space-y-4">
                    <div>
                        <label for="ps-description" class="form-label">Description (Max 100 words)</label>
                        <textarea id="ps-description" class="form-textarea" rows="5" maxlength="550" placeholder="Describe what you're looking for..." required></textarea>
                        <p id="word-count" class="text-right text-xs text-gray-500 mt-1">0 / 100 words</p>
                    </div>
                    <div>
                        <label for="ps-whatsapp" class="form-label">WhatsApp Number</label>
                        <div class="flex items-center w-full rounded-md bg-[#121212] border border-gray-600 px-3">
                            <i class="fa-brands fa-whatsapp text-gray-400 mr-2"></i>
                            <span class="text-gray-400 text-sm pr-2">+880</span>
                            <input id="ps-whatsapp" type="tel" placeholder="1xxxxxxxxx" required class="flex-1 bg-transparent py-2 text-sm text-white placeholder-gray-400 border-none focus:outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="form-label">Image (Optional)</label>
                        <input type="file" id="ps-image-upload" class="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-700" accept="image/*">
                    </div>
                    <button type="submit" class="w-full py-3 mt-4 rounded-xl action-button text-lg">Post</button>
                </form>
            </div>
        `;
        
        const textarea = document.getElementById('ps-description');
        const wordCountEl = document.getElementById('word-count');
        textarea.addEventListener('input', () => {
            const words = textarea.value.trim().split(/\s+/).filter(Boolean);
            const wordCount = words.length > 100 ? 100 : words.length;
            wordCountEl.textContent = `${wordCount} / 100 words`;
            if(words.length > 100) {
                textarea.value = words.slice(0, 100).join(' ');
            }
        });
        
        document.getElementById('ps-image-upload').addEventListener('change', e => {});
        document.getElementById('player-squad-post-form').addEventListener('submit', handlePlayerSquadPostSubmit);
    }

    function handlePlayerSquadPostSubmit(e) {
        e.preventDefault();
        const form = e.target;
        handleFormSubmit(form, 'Posting...', async () => {
            const description = document.getElementById('ps-description').value.trim();
            const whatsappNumber = document.getElementById('ps-whatsapp').value.trim();
            if (!/^\d{10}$/.test(whatsappNumber)) {
                throw new Error('Please enter a valid 10-digit WhatsApp number.');
            }
            const fullWhatsapp = `880${whatsappNumber}`;
            
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const promoKeywords = ['buy', 'sell', 'promote', 'follow me', 'subscribe', 'shop', 'discount'];
            if(urlRegex.test(description) || promoKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
                throw new Error('Posts cannot contain links or promotional language.');
            }
            
            const playerSquadPostImageFile = document.getElementById('ps-image-upload').files[0];
            let imageUrl = null;
            if(playerSquadPostImageFile) {
                const uploadResult = await uploadImage(playerSquadPostImageFile, 'player-squad-posts');
                if(!uploadResult) throw new Error('Image upload failed');
                imageUrl = uploadResult.url;
            }
            const postData = { id: '', creatorId: auth.currentUser.uid, creatorName: currentUserData.name, creatorAvatar: currentUserData.avatar, description, whatsapp: fullWhatsapp, imageUrl, timestamp: new Date().toISOString() };
            const newPostRef = database.ref('playerSquadPosts').push();
            postData.id = newPostRef.key;
            await newPostRef.set(postData);

            handleNavigation('manage-posts-content');
            setTimeout(() => document.querySelector('.manage-need-tab[data-target="my-posts-section"]').click(), 250);
            showModal('success', 'Post Created', 'Your post has been successfully created.');
        });
    }
    
    function setupSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const toggleBtn = document.getElementById('sidebar-toggle');
        const nav = document.getElementById('sidebar-nav');
        const scrollIndicator = document.getElementById('sidebar-scroll-indicator');

        const closeSidebar = () => {
            sidebar.classList.remove('open');
            overlay.classList.add('hidden');
        };
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.add('open');
            overlay.classList.remove('hidden');
        });
        overlay.addEventListener('click', closeSidebar);

        nav.addEventListener('scroll', () => {
            const isAtBottom = nav.scrollHeight - nav.scrollTop <= nav.clientHeight + 1;
            const isAtTop = nav.scrollTop === 0;
            
            if (isAtBottom) {
                scrollIndicator.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
            } else {
                scrollIndicator.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
            }
            
            if (nav.scrollHeight <= nav.clientHeight) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        });
        
        setTimeout(() => nav.dispatchEvent(new Event('scroll')), 500);
        
        document.getElementById('sidebar-profile-header').addEventListener('click', () => {
            closeSidebar();
            handleNavigation('profile-content');
        });

        document.getElementById('sidebar-store').addEventListener('click', () => {
             closeSidebar();
             handleNavigation('home-content');
             setTimeout(() => {
                document.querySelector('.home-tab-link[data-target="home-store-feed"]').click();
             }, 100);
        });
        
        document.getElementById('sidebar-history').addEventListener('click', () => {
            closeSidebar();
            handleNavigation('history-content');
        });

        document.getElementById('sidebar-leaderboard').addEventListener('click', () => {
            closeSidebar();
            handleNavigation('leaderboard-content');
        });

        document.getElementById('sidebar-redeem').addEventListener('click', () => {
            closeSidebar();
            handleNavigation('redeem-content');
        });

        document.getElementById('sidebar-lucky-box').addEventListener('click', () => {
            closeSidebar();
            handleNavigation('lucky-box-content');
        });

        document.getElementById('sidebar-topup').addEventListener('click', () => {
            closeSidebar();
            handleNavigation('topup-screen');
        });
        
        document.getElementById('sidebar-buy-sell').addEventListener('click', (e) => {
            e.preventDefault();
            closeSidebar();
            handleNavigation('buy-sell-content');
        });

        document.getElementById('sidebar-partner').addEventListener('click', (e) => {
            e.preventDefault();
            closeSidebar();
            handleNavigation('partner-content');
        });

        document.getElementById('sidebar-help-community').addEventListener('click', (e) => {
            e.preventDefault();
            closeSidebar();
            handleNavigation('help-community-content');
        });
        
        document.getElementById('sidebar-video-tutorials').addEventListener('click', (e) => {
            e.preventDefault();
            closeSidebar();
            handleNavigation('video-tutorials-content');
        });

        const showBalanceTooltip = (element, fullAmount) => {
            let tooltip = document.querySelector('.balance-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'balance-tooltip';
                document.body.appendChild(tooltip);
            }
            
            tooltip.textContent = parseFloat(fullAmount).toFixed(2);
            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 35}px`;
            tooltip.style.transform = `translateX(-50%) translateY(10px)`;

            setTimeout(() => {
                tooltip.classList.add('show');
                tooltip.style.transform = `translateX(-50%) translateY(0)`;
            }, 10);

            setTimeout(() => {
                tooltip.classList.remove('show');
                tooltip.style.transform = `translateX(-50%) translateY(10px)`;
            }, 3000);
        };

        document.getElementById('sidebar-coin-balance').addEventListener('click', (e) => {
            showBalanceTooltip(e.target, currentUserData.wallet?.coins || 0);
        });

        document.getElementById('sidebar-diamond-balance').addEventListener('click', (e) => {
            showBalanceTooltip(e.target, currentUserData.wallet?.diamonds || 0);
        });
        
        const redirectToMissions = () => {
            closeSidebar();
            handleNavigation('home-content');
            setTimeout(() => {
                document.querySelector('.home-tab-link[data-target="home-missions-feed"]').click();
            }, 100);
        };
        
        document.getElementById('sidebar-coin-plus').addEventListener('click', redirectToMissions);
        document.getElementById('sidebar-diamond-plus').addEventListener('click', redirectToMissions);
    }

    const luckyBoxPrizes = [
        { type: 'coin', value: 100, id: '100C' },
        { type: 'bad_luck', value: 0, id: 'BL1' },
        { type: 'diamond', value: 25, id: '25D' },
        { type: 'diamond', value: 0.01, id: '0.01D' },
        { type: 'bad_luck', value: 0, id: 'BL2' },
        { type: 'coin', value: 0.5, id: '0.5C' },
        { type: 'coin', value: 0.1, id: '0.1C' },
        { type: 'coin', value: 1, id: '1C' }
    ];

    function renderLuckyBoxPage() {
        const container = document.getElementById('lucky-box-content').firstElementChild;
        const tickets = currentUserData.tickets || 0;
        const adMissionConfig = window.dbData.admin?.config?.adMission;
        let watchAdBtnHTML = '';

        if (adMissionConfig?.enabled) {
            const userProgress = currentUserData.missionProgress?.['adForTicket'] || { lastCompleted: 0 };
            let isOnCooldown = false;
            let cooldownEndTime = 0;
            let btnContent = '<i class="fa-solid fa-video mr-2"></i> WATCH AD FOR TICKET';
            let btnDisabled = '';
            
            if (userProgress.lastCompleted) {
                const fifteenMinutes = 15 * 60 * 1000;
                cooldownEndTime = userProgress.lastCompleted + fifteenMinutes;
                if (Date.now() < cooldownEndTime) {
                    isOnCooldown = true;
                    btnDisabled = 'disabled';
                    btnContent = `<span class="ad-cooldown-timer" data-cooldown-end="${new Date(cooldownEndTime).toISOString()}"></span>`;
                }
            }
            
            watchAdBtnHTML = `<button id="watch-ad-for-ticket-btn" class="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm mt-4" ${btnDisabled}>${btnContent}</button>`;
        }
        
        container.innerHTML = `
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
            <div class="mb-8 relative z-10">
                <h2 class="text-5xl font-oswald font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 drop-shadow-sm filter drop-shadow(0 4px 0px rgba(0,0,0,0.5))">MYSTERY CRATE</h2>
                <p class="text-xs text-gray-400 tracking-[0.3em] font-bold mt-2 uppercase">Try Your Luck</p>
            </div>
            <div class="bg-black/80 backdrop-blur-md border border-gray-800 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative z-10">
                 <div class="flex justify-between items-center mb-6 bg-gradient-to-r from-gray-900 to-gray-800 p-2 px-4 rounded-full border border-gray-700 shadow-inner">
                    <span class="text-gray-400 text-[10px] font-bold tracking-wider">BALANCE</span>
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-ticket text-xl text-yellow-300 filter drop-shadow-lg"></i>
                        <span class="text-xl font-bold text-white font-oswald" id="lucky-box-ticket-count">${tickets}</span>
                    </div>
                </div>
                <div id="lucky-box-game-container" class="mb-8 w-full">
                    <div class="lucky-box-container active">
                        ${Array(8).fill(0).map((_, i) => `
                            <div class="lucky-box floating-box" style="animation-delay: ${i * 0.1}s" data-box-id="${i}">
                                <div class="box-flipper">
                                    <div class="box-face box-front">
                                        <span class="question-mark"><i class="fa-solid fa-question"></i></span>
                                    </div>
                                    <div class="box-face box-back"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <p id="lucky-box-instruction" class="text-green-400 font-bold text-xs tracking-widest uppercase mb-4 h-4"></p>
                <button id="play-lucky-box-btn" class="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white text-lg font-bold tracking-wider font-oswald shadow-[0_4px_0_rgb(160,80,0)] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed" ${tickets < 1 ? 'disabled' : ''}>
                    OPEN CRATE <span class="text-sm font-normal opacity-80 ml-1">(1 Ticket)</span>
                </button>
                ${watchAdBtnHTML}
            </div>
        `;
        
        document.getElementById('play-lucky-box-btn').addEventListener('click', handleLuckyBoxPlay);
        const watchAdBtn = document.getElementById('watch-ad-for-ticket-btn');
        if (watchAdBtn) {
            watchAdBtn.addEventListener('click', () => handleWatchAdTask('adForTicket', { title: "Watch Ad for a Ticket" }, watchAdBtn));
        }
    }
    function getLuckyBoxPrize() {
        const boxSpins = currentUserData.spinStats?.boxSpins || 0;

        if (boxSpins + 1 === 1000) {
            return luckyBoxPrizes.find(p => p.id === '100C');
        }

        const weightedPrizes = [
            { id: 'BL1', weight: 40 }, 
            { id: '0.1C', weight: 35 },
            { id: '0.5C', weight: 10 },
            { id: '1C', weight: 8 },
            { id: '0.01D', weight: 7 },
            { id: '25D', weight: 0 },
        ];

        const totalWeight = weightedPrizes.reduce((sum, p) => sum + p.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const prize of weightedPrizes) {
            if (random < prize.weight) {
                return luckyBoxPrizes.find(p => p.id === prize.id);
            }
            random -= prize.weight;
        }
    }

    async function handleLuckyBoxPlay() {
        const playBtn = document.getElementById('play-lucky-box-btn');
        if (playBtn.disabled) return;

        const userTickets = currentUserData.tickets || 0;
        if (userTickets < 1) {
            showModal('error', 'No Tickets!', 'You need at least 1 ticket to play.');
            return;
        }

        playBtn.disabled = true;
        const instruction = document.getElementById('lucky-box-instruction');
        instruction.textContent = "Good Luck!";
        
        const boxSpins = (currentUserData.spinStats?.boxSpins || 0) + 1;
        await database.ref(`users/${auth.currentUser.uid}`).update({
            'tickets': firebase.database.ServerValue.increment(-1),
            'spinStats/boxSpins': boxSpins
        });
        
        const winningPrize = getLuckyBoxPrize();
        let prizePool = [...luckyBoxPrizes].filter(p => p.id !== winningPrize.id).sort(() => Math.random() - 0.5);
        
        const boxes = document.querySelectorAll('.lucky-box');
        const winningBoxIndex = Math.floor(Math.random() * boxes.length);

        boxes.forEach((box, i) => {
            const prize = (i === winningBoxIndex) ? winningPrize : prizePool.pop();
            box.dataset.prize = JSON.stringify(prize);
        });
        
        const spinDuration = 3000;
        const intervalTime = 75;
        let shuffleInterval = setInterval(() => {
            boxes.forEach(box => box.classList.remove('box-highlight'));
            const randomIndex = Math.floor(Math.random() * boxes.length);
            boxes[randomIndex].classList.add('box-highlight');
        }, intervalTime);

        setTimeout(() => {
            clearInterval(shuffleInterval);
            boxes.forEach(box => box.classList.remove('box-highlight'));
            boxes[winningBoxIndex].classList.add('box-highlight');
            
            setTimeout(() => {
                instruction.textContent = "Revealing...";
                const winningBox = boxes[winningBoxIndex];
                const backFace = winningBox.querySelector('.box-back');
                backFace.classList.add('winner');
                
                const prize = JSON.parse(winningBox.dataset.prize);
                if(prize.type === 'bad_luck') {
                   backFace.innerHTML = `<i class="fa-solid fa-face-frown text-4xl text-gray-500"></i><p class="font-bold text-gray-400 mt-1 text-sm">Try Again</p>`;
                } else if (prize.type === 'coin') {
                   backFace.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/217/217853.png" alt="Coin"><p class="font-bold text-yellow-300 mt-1">${prize.value}</p>`;
                } else if (prize.type === 'diamond') {
                   backFace.innerHTML = `<img src="https://firebasestorage.googleapis.com/v0/b/viptask-5c1fc.appspot.com/o/Levelup%2F1762763297995.png?alt=media&token=db9ebed1-ff51-49ed-a311-0327313dae56" alt="Diamond"><p class="font-bold text-cyan-300 mt-1">${prize.value}</p>`;
                }
                winningBox.classList.add('flipped');
                
                setTimeout(() => {
                    boxes.forEach((boxEl, i) => {
                        if(i === winningBoxIndex) return;
                        const prize = JSON.parse(boxEl.dataset.prize);
                        const backFace = boxEl.querySelector('.box-back');
                        backFace.classList.add('loser');
                        if(prize.type === 'bad_luck') {
                            backFace.innerHTML = `<i class="fa-solid fa-face-frown text-4xl text-gray-500"></i><p class="font-bold text-gray-400 mt-1 text-sm">Try Again</p>`;
                        } else if (prize.type === 'coin') {
                            backFace.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/217/217853.png" alt="Coin"><p class="font-bold text-yellow-300 mt-1">${prize.value}</p>`;
                        } else if (prize.type === 'diamond') {
                             backFace.innerHTML = `<img src="https://firebasestorage.googleapis.com/v0/b/viptask-5c1fc.appspot.com/o/Levelup%2F1762763297995.png?alt=media&token=db9ebed1-ff51-49ed-a311-0327313dae56" alt="Diamond"><p class="font-bold text-cyan-300 mt-1">${prize.value}</p>`;
                        }
                        setTimeout(() => boxEl.classList.add('flipped'), i * 80);
                    });
                }, 500);

                setTimeout(() => {
                    showLuckyBoxResult(winningPrize);
                    resetLuckyBoxUI();
                }, 2500);

            }, 500);
        }, spinDuration);
    }
    
    async function showLuckyBoxResult(prize) {
         const modal = screens.spinResult;
         let lottieSrc, title, message, textColorClass, iconHTML;

        if (prize.type === 'bad_luck') {
            iconHTML = `<dotlottie-wc src="https://lottie.host/81a8c39e-b9b2-4d56-a193-a4147c2b53b8/D6p2Dvr9ge.lottie" autoplay loop style="width: 150px; height: 150px;"></dotlottie-wc>`;
            title = "Better Luck Next Time!";
            message = "You didn't win a prize this time. Keep trying!";
            textColorClass = 'text-gray-400';
        } else {
            const isCoin = prize.type === 'coin';
            iconHTML = isCoin 
                ? `<img src="https://cdn-icons-png.flaticon.com/512/217/217853.png" class="w-28 h-28" loading="lazy">`
                : `<img src="https://firebasestorage.googleapis.com/v0/b/viptask-5c1fc.appspot.com/o/Levelup%2F1762763297995.png?alt=media&token=db9ebed1-ff51-49ed-a311-0327313dae56" class="w-28 h-28" loading="lazy">`;
            title = "Congratulations!";
            textColorClass = isCoin ? 'text-yellow-400' : 'text-cyan-400';
            message = `You won <strong class="${textColorClass}">${prize.value} ${prize.type.charAt(0).toUpperCase() + prize.type.slice(1)}s!</strong>`;
            
            const currency = prize.type === 'diamond' ? 'diamonds' : 'coins';
            await database.ref(`users/${auth.currentUser.uid}/wallet/${currency}`).transaction(current => (current || 0) + prize.value);
            await addTransaction(auth.currentUser.uid, {
                type: 'Box Reward',
                description: 'From Lucky Box',
                amount: prize.value,
                currency: prize.type
            });
        }
        
         showCustomModal({
            title: title,
            message: message,
            iconHtml: iconHTML,
            primaryButton: { text: 'Continue' },
            autoClose: 3000
         });

         if(prize.type !== 'bad_luck') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
    
    function resetLuckyBoxUI() {
        const tickets = currentUserData.tickets || 0;
        document.getElementById('play-lucky-box-btn').disabled = tickets < 1;
        document.getElementById('lucky-box-ticket-count').textContent = tickets;
        document.getElementById('lucky-box-instruction').textContent = "";
        document.querySelectorAll('.lucky-box').forEach(box => {
            box.classList.remove('flipped', 'box-highlight');
            const flipper = box.querySelector('.box-flipper');
            if(flipper) flipper.style.transform = '';
            const backFace = box.querySelector('.box-back');
            backFace.innerHTML = '';
            backFace.classList.remove('winner', 'loser');
            delete box.dataset.prize;
        });
    }

    document.getElementById('home-search-btn').addEventListener('click', () => {
        const mainHeader = document.getElementById('main-header');
        const searchHeader = document.getElementById('home-search-header');
        const searchInput = document.getElementById('home-search-input');

        searchHeader.classList.remove('hidden');
        gsap.timeline()
            .to(mainHeader, { y: -100, opacity: 0, duration: 0.4, ease: 'power3.in', onComplete: () => mainHeader.classList.add('hidden') })
            .fromTo(searchHeader, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, "-=0.2")
            .call(() => searchInput.focus());
    });

    document.querySelector('#home-search-header .header-back-btn')?.addEventListener('click', () => {
        const mainHeader = document.getElementById('main-header');
        const searchHeader = document.getElementById('home-search-header');
        document.getElementById('home-search-input').value = '';
        handleHomeSearch();

        mainHeader.classList.remove('hidden');
         gsap.timeline()
            .to(searchHeader, { y: -100, opacity: 0, duration: 0.4, ease: 'power3.in', onComplete: () => searchHeader.classList.add('hidden') })
            .fromTo(mainHeader, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, "-=0.2");
    });

    document.getElementById('home-search-input').addEventListener('input', handleHomeSearch);

    async function renderStorePage(){
        const container = document.getElementById('home-store-feed');
        container.innerHTML = '';
        const topupItems = window.dbData.admin?.store?.topups || {};
        
        const topupDiamondsHTML = Object.entries(topupItems).filter(([id, item]) => item.type === 'diamond').map(([id, item]) => createStoreItemHTML(id, item, 'topup')).join('');

        container.innerHTML = `<div class="space-y-6">
            <div><h3 class="section-header">TOP-UP DIAMONDS</h3><div class="horizontal-scroll-container no-scrollbar">${topupDiamondsHTML || '<p class="text-gray-500 w-full text-center">No diamond top-ups available.</p>'}</div></div>
        </div>`;

        container.querySelectorAll('.buy-store-item-btn').forEach(btn => btn.addEventListener('click', () => {
            const { itemId, itemType } = btn.dataset;
            if (itemType === 'topup') {
                handleTopupPurchase(itemId, btn);
            }
        }));
    }

    function createStoreItemHTML(id, item, type) {
        const userCoins = currentUserData.wallet?.coins || 0;
        const isStockOut = item.stockOut === true;
        const canAfford = userCoins >= item.price;
        let title = `${item.amount} Diamonds`;

        return `
        <div class="store-item-h">
            <img src="${item.image}" class="store-item-h-image" alt="${title}" loading="lazy">
            ${isStockOut ? `<div class="absolute inset-0 bg-black/70 flex items-center justify-center"><span class="font-bold text-red-500">Stock Out</span></div>` : ''}
            <div class="store-item-h-content">
                <h4 class="store-item-h-title">${title}</h4>
                <button class="store-item-h-button action-button buy-store-item-btn" data-item-id="${id}" data-item-type="${type}" ${isStockOut || !canAfford ? 'disabled' : ''}>
                   <i class="fa-solid fa-coins"></i><span>${formatNumberCompact(item.price)}</span>
                </button>
            </div>
        </div>`;
    }

    function handleTopupPurchase(topupId, btn) {
         const item = window.dbData.admin?.store?.topups?.[topupId];
         if (!item || btn.disabled) return;
        
         showCustomModal({
            title: 'Confirm Purchase',
            message: `
                <div class="text-center p-4">
                    <img src="${item.image}" class="w-48 h-auto object-cover rounded-xl mx-auto mb-4 border-2 border-gray-600" loading="lazy">
                    <p class="text-gray-300 text-base">Are you sure you want to buy <span class="font-bold text-white">${item.amount} Diamonds</span> for <span class="font-bold text-yellow-400">${item.price} Coins</span>?</p>
                </div>`,
            primaryButton: { 
                text: 'Confirm & Buy', 
                onClick: () => {
                   showPurchaseResultModal('topup', item, topupId, btn);
                }
            },
            secondaryButton: { text: 'Cancel' }
         });
    }

    function generateRedeemCode(prefix, value) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 7; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `${prefix}-${value}-${result}`;
    }

    async function submitTopupPurchase(item, topupId, btn) {
        const redeemCode = generateRedeemCode('LEVELUP-DIAMOND', item.amount);
        
        const updates = {};
        updates[`/users/${auth.currentUser.uid}/wallet/coins`] = firebase.database.ServerValue.increment(-item.price);
        updates[`/redeemCodes/${redeemCode}`] = {
            itemId: topupId,
            amount: item.amount,
            type: item.type,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            ownerId: auth.currentUser.uid,
            used: false
        };

        const userTransactionRef = database.ref(`users/${auth.currentUser.uid}/transactions`).push();
        updates[`/users/${auth.currentUser.uid}/transactions/${userTransactionRef.key}`] = {
            id: userTransactionRef.key,
            type: 'Top-up Purchase',
            description: `Bought ${item.amount} Diamonds`,
            amount: -item.price,
            currency: 'coin',
            redeemCode: redeemCode,
            status: 'completed',
            timestamp: new Date().toISOString()
        };

        try {
            await database.ref().update(updates);
            return redeemCode;
        } catch (error) {
            await database.ref(`users/${auth.currentUser.uid}/wallet/coins`).transaction(current => (current || 0) + item.price);
            handleFirebaseError(error);
            btn.disabled = false;
            return null;
        }
    }
    
    function renderRedeemPage() {
        const container = document.getElementById('redeem-content');
        const history = getRedeemHistory();

        const historyHTML = history.length > 0 ? `
            <div class="mt-8">
                <h3 class="section-header px-0">Redeem History</h3>
                <div class="space-y-2 overflow-y-auto max-h-60 no-scrollbar">
                    ${history.map(item => `
                        <div class="bg-[#2a2a2a] p-3 rounded-lg">
                            <p class="font-mono text-sm text-green-400 break-all">${item.code}</p>
                            <p class="text-xs text-gray-400 mt-1">${item.rewardText}</p>
                            <p class="text-xs text-gray-500 mt-1">${timeAgo(item.timestamp)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        container.innerHTML = `
        <div class="flex flex-col h-full p-4">
            <div class="bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] border border-gray-700 rounded-2xl p-6 text-center max-w-sm mx-auto shadow-2xl flex-shrink-0">
                <i class="fa-solid fa-gift text-6xl text-green-400 mb-4"></i>
                <h3 class="text-2xl font-bold font-oswald text-green-300 mb-2">REDEEM CODE</h3>
                <p class="text-gray-400 mb-6 text-sm">Enter a code from a top-up purchase or a gift coupon to claim your reward.</p>
                <form id="redeem-form" class="space-y-4">
                    <input type="text" id="redeem-code-input" class="form-input text-center tracking-widest font-mono uppercase bg-black/30 border-gray-600 focus:border-green-500" placeholder="LEVELUP-..." required>
                    <button type="submit" class="w-full py-3 action-button rounded-lg font-bold">REDEEM NOW</button>
                </form>
            </div>
            <div class="flex-grow min-h-0">${historyHTML}</div>
        </div>`;
        document.getElementById('redeem-form').addEventListener('submit', handleRedeemCode);
    }

    async function handleRedeemCode(e) {
        e.preventDefault();
        const form = e.target;
        const codeInput = document.getElementById('redeem-code-input');
        const code = codeInput.value.trim().toUpperCase();

        handleFormSubmit(form, 'Redeeming...', async () => {
            await processRedeemCode(code, () => {
                if(form) form.reset();
            });
        });
    }
    
    async function processRedeemCode(code, onComplete) {
        const adminCodeRef = database.ref(`admin/redeemableCodes/${code}`);
        const adminCodeSnapshot = await adminCodeRef.once('value');
        const adminCodeData = adminCodeSnapshot.val();

        if (adminCodeData) {
            if (adminCodeData.claimCount >= adminCodeData.limit) throw new Error("This code has reached its usage limit.");
            if (adminCodeData.claimers && adminCodeData.claimers[auth.currentUser.uid]) throw new Error("You have already claimed this code.");

            const updates = {};
            const newMailRef = database.ref(`users/${auth.currentUser.uid}/mailbox`).push();
            
            const mailData = {
                id: newMailRef.key,
                subject: 'You Redeemed a Code!',
                type: 'reward',
                body: {
                    message: `Congratulations! Here are your rewards for redeeming the code: ${code}`,
                    rewards: adminCodeData.rewards.map(r => {
                        if (r.durationMs) {
                            r.expiryTimestamp = Date.now() + r.durationMs;
                        }
                        return r;
                    }),
                    claimed: false
                },
                timestamp: new Date().toISOString(),
                read: false,
                deliveryTimestamp: Date.now() + (adminCodeData.deliveryDelayMinutes || 0) * 60 * 1000
            };
            
            updates[`/users/${auth.currentUser.uid}/mailbox/${newMailRef.key}`] = mailData;
            updates[`/admin/redeemableCodes/${code}/claimCount`] = firebase.database.ServerValue.increment(1);
            updates[`/admin/redeemableCodes/${code}/claimers/${auth.currentUser.uid}`] = true;
            
            await database.ref().update(updates);
            addRedeemHistory(code, `${adminCodeData.rewards.length} item(s)`);
            showModal('success', 'Code Accepted!', `Your rewards will be delivered to your mailbox in ${adminCodeData.deliveryDelayMinutes || 0} minutes.`);
            
        } else {
            const codeRef = database.ref(`redeemCodes/${code}`);
            const snapshot = await codeRef.once('value');
            const codeData = snapshot.val();
            if (!codeData) throw new Error('Invalid code. Please check and try again.');

             if (codeData.type === 'coupon') {
                if (codeData.used) throw new Error('This coupon code has already been redeemed.');
                if (codeData.ownerId && codeData.ownerId !== auth.currentUser.uid) throw new Error('This code is not for you.');

                const couponId = database.ref(`users/${auth.currentUser.uid}/coupons`).push().key;
                const updates = {};
                updates[`/redeemCodes/${code}/used`] = true;
                updates[`/redeemCodes/${code}/redeemedBy`] = auth.currentUser.uid;
                updates[`/users/${auth.currentUser.uid}/coupons/${couponId}`] = { ...codeData.couponData, id: couponId, used: false };
                
                await database.ref().update(updates);
                addRedeemHistory(code, codeData.couponData.title);
                showModal('success', 'Coupon Redeemed!', `A ${codeData.couponData.title} has been added to your wallet!`);
            } else {
                 const result = await codeRef.transaction(currentData => {
                    if (currentData && currentData.ownerId === auth.currentUser.uid && !currentData.used) {
                        currentData.used = true;
                        currentData.usedAt = firebase.database.ServerValue.TIMESTAMP;
                        return currentData;
                    }
                    return;
                });
                if (result.committed) {
                    const redeemedData = result.snapshot.val();
                    await database.ref(`users/${auth.currentUser.uid}/wallet/diamonds`).transaction(current => (current || 0) + redeemedData.amount);
                    
                    await addTransaction(auth.currentUser.uid, { type: 'Redeem Code', description: `Redeemed ${redeemedData.amount} Diamonds`, amount: redeemedData.amount, currency: 'diamond' });
                    addRedeemHistory(code, `${redeemedData.amount} Diamonds`);
                    showCustomModal({
                        type: 'success', title: 'Success!', message: `You have successfully redeemed ${redeemedData.amount} Diamonds!`,
                        iconHtml: `<dotlottie-wc src="https://lottie.host/808b26f5-072f-4c59-b17b-232d665a3962/qYI7k2RGvS.lottie" autoplay style="width: 150px; height: 150px;"></dotlottie-wc>`,
                        primaryButton: {text: 'Awesome!'}, autoClose: 3000
                    });
                } else {
                    if (codeData.ownerId !== auth.currentUser.uid) throw new Error('This code does not belong to you.');
                    if (codeData.used) throw new Error('This code has already been used.');
                    throw new Error('An unknown error occurred. Please try again.');
                }
            }
        }
        if(onComplete) onComplete();
    }

    function getRedeemHistory() {
        try {
            return JSON.parse(localStorage.getItem('redeemHistory') || '[]');
        } catch (e) {
            return [];
        }
    }
    function addRedeemHistory(code, rewardText) {
        let history = getRedeemHistory();
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        history = history.filter(item => new Date(item.timestamp).getTime() > thirtyDaysAgo);
        history.unshift({ code, rewardText, timestamp: new Date().toISOString() });
        localStorage.setItem('redeemHistory', JSON.stringify(history));
    }
    function cleanupRedeemHistory() {
        let history = getRedeemHistory();
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const filteredHistory = history.filter(item => new Date(item.timestamp).getTime() > thirtyDaysAgo);
        if(filteredHistory.length < history.length) {
            localStorage.setItem('redeemHistory', JSON.stringify(filteredHistory));
        }
    }


    async function renderHistoryPage() {
         const contentArea = document.getElementById('history-content');
         let transactions = [];

         const depositsSnapshot = await database.ref('deposits').orderByChild('userId').equalTo(auth.currentUser.uid).once('value');
         Object.values(depositsSnapshot.val() || {}).forEach(t => transactions.push({ ...t, txType: 'Deposit', sortTimestamp: t.timestamp }));

         const withdrawalsSnapshot = await database.ref('withdrawals').orderByChild('userId').equalTo(auth.currentUser.uid).once('value');
         Object.values(withdrawalsSnapshot.val() || {}).forEach(t => transactions.push({ ...t, txType: 'Withdrawal', sortTimestamp: t.timestamp }));

         const userTransactionsSnapshot = await database.ref(`users/${auth.currentUser.uid}/transactions`).once('value');
         Object.values(userTransactionsSnapshot.val() || {}).forEach(t => transactions.push({ ...t, txType: 'General', sortTimestamp: t.timestamp }));
        
         transactions.sort((a, b) => new Date(b.sortTimestamp) - new Date(a.sortTimestamp));

         const transactionsHTML = transactions.map(t => {
             let amountHTML, description, title, status;
             status = t.status || 'completed';

             switch(t.txType) {
                 case 'Deposit':
                     title = `Deposit via ${t.method}`;
                     description = `TrxID: ${t.trxId || 'N/A'}`;
                     amountHTML = `<p class="font-bold text-lg text-green-400">+${t.amount.toFixed(2)} TK</p>`;
                     break;
                 case 'Withdrawal':
                     title = `Withdrawal to ${t.method}`;
                     description = `Acc: ${t.accountNumber}`;
                     amountHTML = `<p class="font-bold text-lg text-red-400">${-t.amount.toFixed(2)} TK</p>`;
                     break;
                 case 'General':
                     title = t.type;
                     description = t.redeemCode ? `Code: ${t.redeemCode}` : t.description;
                     if (t.currency) {
                         const icon = t.currency === 'coin' ? 'fa-coins text-yellow-400' : (t.currency === 'diamond' ? 'fa-gem text-cyan-400' : 'fa-ticket text-yellow-300');
                         const isCredit = !String(t.amount).startsWith('-');
                         amountHTML = `<p class="font-bold text-lg ${isCredit ? '' : 'text-red-400'}"><i class="fa-solid ${icon} mr-1"></i>${parseFloat(t.amount)}</p>`;
                     } else {
                        const isCredit = t.amount > 0;
                        amountHTML = `<p class="font-bold text-lg ${isCredit ? 'text-green-400' : 'text-red-400'}">${isCredit ? '+' : ''}${t.amount.toFixed(2)} TK</p>`;
                     }
                     break;
             }
             
             const statusColors = { pending: 'bg-yellow-500', approved: 'bg-green-500', completed: 'bg-green-500', rejected: 'bg-red-500' };
             const statusText = status.charAt(0).toUpperCase() + status.slice(1);
             const statusBadge = `<span class="text-xs font-semibold px-2 py-1 ${statusColors[status]} text-white rounded-full ml-2">${statusText}</span>`;

             return `<div class="flex justify-between items-center p-3 bg-[#2a2a2a] rounded-lg">
                        <div>
                            <p class="font-semibold text-sm flex items-center">${title}${statusBadge}</p>
                            <p class="text-xs text-gray-400">${description}</p>
                            <p class="text-xs text-gray-500 mt-1">${new Date(t.timestamp).toLocaleString()}</p>
                        </div>
                        ${amountHTML}
                    </div>`;
         }).join('');

         contentArea.innerHTML = `<div class="space-y-2">${transactions.length > 0 ? transactionsHTML : '<p class="text-center text-gray-500 p-4">No transactions found.</p>'}</div>`;
    }
    
    function renderMissionsPage() {
        const container = document.getElementById('home-missions-feed');
        let tasks = { ...(window.dbData.admin?.missions || {}) };
        const adMissionConfig = window.dbData.admin?.config?.adMission;

        if (adMissionConfig?.enabled && adMissionConfig.urls?.filter(Boolean).length >= 5) {
            tasks['adForTicket'] = {
                title: "Watch Ad for a Ticket",
                description: "Watch a short ad to earn a free Lucky Box ticket.",
                rewardType: 'ticket',
                rewardAmount: 1,
                limit: 1, 
                type: 'watchAd',
                icon: 'fa-ticket'
            };
        }

        if (Object.keys(tasks).length === 0) {
            container.innerHTML = `<div class="text-center text-gray-500 p-10 bg-gray-800/50 rounded-lg"><i class="fa-solid fa-list-check text-4xl mb-4"></i><p>No missions available right now.</p></div>`;
            return;
        }

        let tasksHTML = Object.entries(tasks).map(([taskId, task]) => createTaskCardHTML(taskId, task)).join('');
        container.innerHTML = tasksHTML;
        updateAllCountdowns();

        container.querySelectorAll('.task-action-btn-premium').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.currentTarget.dataset.taskId;
                const task = tasks[taskId];
                if (task.type === 'watchAd') {
                    handleWatchAdTask(taskId, task, btn);
                } else if (task.type === 'redeem') {
                    handleNavigation('redeem-task-content');
                    renderRedeemTaskPage(taskId, task);
                }
            });
        });
    }

    function createTaskCardHTML(taskId, task) {
        const userProgress = currentUserData.missionProgress?.[taskId] || { count: 0, lastCompletedDate: '' };
        const todayBst = getBangladeshDateString();
        const isCompletedToday = userProgress.lastCompletedDate === todayBst && userProgress.count >= (task.limit || 1);
        
        let isOnCooldown = false;
        let cooldownEndTime = 0;
        if(taskId === 'adForTicket' && userProgress.lastCompleted) {
            const fifteenMinutes = 15 * 60 * 1000;
            cooldownEndTime = userProgress.lastCompleted + fifteenMinutes;
            if (Date.now() < cooldownEndTime) {
                isOnCooldown = true;
            }
        }
        const isDisabled = isCompletedToday || isOnCooldown;

        let iconHtml;
        if (task.icon) { iconHtml = `<i class="fa-solid ${task.icon}"></i>`; } 
        else { iconHtml = `<i class="fa-solid fa-star"></i>`; }

        let rewardCurrencyIcon;
        if (task.rewardType === 'diamond') { rewardCurrencyIcon = 'https://firebasestorage.googleapis.com/v0/b/viptask-5c1fc.appspot.com/o/Levelup%2F1762763297995.png?alt=media&token=db9ebed1-ff51-49ed-a311-0327313dae56'; } 
        else if (task.rewardType === 'ticket') { rewardCurrencyIcon = "fa-solid fa-ticket"; } 
        else { rewardCurrencyIcon = 'https://cdn-icons-png.flaticon.com/512/217/217853.png'; }
        
        const rewardIconHTML = task.rewardType === 'ticket' ? `<i class="${rewardCurrencyIcon} text-yellow-300"></i>` : `<img src="${rewardCurrencyIcon}" alt="${task.rewardType}" loading="lazy">`;
        
        let buttonContent = task.type === 'redeem' ? 'View' : 'Watch';
        if (isCompletedToday) buttonContent = 'Completed';
        else if (isOnCooldown) buttonContent = `<span class="ad-cooldown-timer" data-cooldown-end="${new Date(cooldownEndTime).toISOString()}"></span>`;
        
        let currentCount = userProgress.lastCompletedDate === todayBst ? userProgress.count : 0;
        const progressPercentage = task.limit > 0 ? (currentCount / task.limit) * 100 : (isCompletedToday ? 100 : 0);

        return `
            <div class="task-card-premium ${isCompletedToday ? 'completed' : ''}">
                <div class="task-card-icon-bg">${iconHtml}</div>
                <div class="task-card-content">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="task-card-title">${task.title}</h4>
                            <p class="task-card-description">${task.description || 'Complete this task to earn rewards.'}</p>
                        </div>
                        <div class="task-reward-premium ml-2">
                            ${rewardIconHTML} <span>${task.rewardAmount}</span>
                        </div>
                    </div>
                    ${task.limit ? `
                    <div class="mt-2 flex items-center gap-2">
                        <div class="task-progress-bar-premium flex-grow"><div class="task-progress-fill-premium" style="width: ${progressPercentage}%"></div></div>
                        <span class="text-xs font-bold text-gray-400">${currentCount}/${task.limit}</span>
                    </div>` : ''}
                </div>
                <div class="task-card-action">
                    <button class="task-action-btn-premium" data-task-id="${taskId}" ${isDisabled ? 'disabled' : ''}>${buttonContent}</button>
                </div>
            </div>`;
    }

    function handleWatchAdTask(taskId, task, btn) {
        const adScreen = screens.adView;
        const adMissionConfig = window.dbData.admin?.config?.adMission;
        
        const adViews = currentUserData.adViews || 0;
        const adUrl = adMissionConfig.urls[adViews % adMissionConfig.urls.length];
        
        let countdown = 30;
        
        adScreen.innerHTML = `
            <header class="w-full p-4 bg-gray-900 flex justify-between items-center z-10 opacity-0 transition-opacity duration-500" id="ad-header">
                <h2 class="font-bold text-white">${task.title}</h2>
                <div class="flex items-center gap-2 text-white font-bold bg-black/50 px-3 py-1 rounded-full">
                    <div class="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                    <span id="ad-countdown-timer">${countdown}</span>s
                </div>
            </header>
            <iframe src="${adUrl}" class="w-full flex-grow border-0"></iframe>`;
        adScreen.classList.remove('hidden');

        const adHeader = document.getElementById('ad-header');
        const timerEl = document.getElementById('ad-countdown-timer');
        
        setTimeout(() => adHeader.classList.remove('opacity-0'), 2000);
        
        const intervalId = setInterval(async () => {
            countdown--;
            if (timerEl) timerEl.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(intervalId);
                document.removeEventListener("visibilitychange", visibilityHandler);
                adScreen.classList.add('hidden');
                
                const updates = {};
                updates[`/users/${auth.currentUser.uid}/tickets`] = firebase.database.ServerValue.increment(1);
                updates[`/users/${auth.currentUser.uid}/missionProgress/${taskId}/lastCompleted`] = firebase.database.ServerValue.TIMESTAMP;
                updates[`/users/${auth.currentUser.uid}/adViews`] = firebase.database.ServerValue.increment(1);
                
                await database.ref().update(updates);
                
                await addTransaction(auth.currentUser.uid, { type: 'Mission Reward', description: `Completed: ${task.title}`, amount: 1, currency: 'ticket' });
                showModal('success', 'Task Completed!', 'You earned 1 Ticket.');
            }
        }, 1000);

        const visibilityHandler = () => {
            if (document.visibilityState === 'hidden' && countdown > 0) {
                clearInterval(intervalId);
                adScreen.classList.add('hidden');
                showModal('error', 'Task Incomplete', 'You must stay on the page to complete the task.');
                document.removeEventListener("visibilitychange", visibilityHandler);
            }
        };
        document.addEventListener("visibilitychange", visibilityHandler);
    }

    function renderRedeemTaskPage(taskId, task) {
        const contentArea = document.getElementById('redeem-task-content');
        const rewardIconHTML = task.rewardType === 'ticket' 
            ? `<i class="fa-solid fa-ticket text-yellow-300"></i>` 
            : `<img src="${task.rewardType === 'diamond' ? 'https://firebasestorage.googleapis.com/v0/b/viptask-5c1fc.appspot.com/o/Levelup%2F1762763297995.png?alt=media&token=db9ebed1-ff51-49ed-a311-0327313dae56' : 'https://cdn-icons-png.flaticon.com/512/217/217853.png'}" class="w-5 h-5" loading="lazy">`;


        contentArea.innerHTML = `
            <div class="space-y-6">
                <div class="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700">
                    <h3 class="font-bold text-green-400 mb-2">Rules & Instructions</h3>
                    <p class="text-sm text-gray-300 whitespace-pre-wrap">${task.rules}</p>
                </div>
                 <div class="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700">
                    <h3 class="font-bold text-green-400 mb-2">Download Link</h3>
                     <div class="bg-black/30 p-3 rounded-lg flex justify-between items-center">
                        <code class="text-sm text-gray-300 truncate">${task.url}</code>
                        <button id="copy-task-url-btn" class="bg-gray-600 hover:bg-gray-700 w-10 h-10 rounded-md flex items-center justify-center transition-colors flex-shrink-0 ml-2"><i class="fa-solid fa-copy"></i></button>
                    </div>
                </div>
                <div class="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700">
                     <h3 class="font-bold text-green-400 mb-2">Submit Your Code</h3>
                     <form id="submit-redeem-code-form" class="space-y-3">
                        <input type="text" id="redeem-task-code-input" class="form-input text-center" placeholder="Enter code here..." required>
                        <button type="submit" class="w-full py-3 action-button rounded-lg font-bold flex items-center justify-center gap-2">
                            Claim ${rewardIconHTML} ${task.rewardAmount}
                        </button>
                     </form>
                </div>
            </div>
        `;

        contentArea.querySelector('#copy-task-url-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(task.url).then(() => showModal('success', 'Link Copied!'));
        });
        contentArea.querySelector('#submit-redeem-code-form').addEventListener('submit', (e) => handleRedeemTaskSubmit(e, taskId, task));
    }

    async function handleRedeemTaskSubmit(e, taskId, task) {
         e.preventDefault();
         const form = e.target;
         const inputCode = document.getElementById('redeem-task-code-input').value.trim();
         
         handleFormSubmit(form, 'Verifying Code...', async () => {
            if (inputCode === task.redeemCode) {
                const userProgressRef = database.ref(`users/${auth.currentUser.uid}/missionProgress/${taskId}`);
                await userProgressRef.transaction(progress => {
                    progress = progress || { count: 0, lastCompletedDate: '' };
                    const todayBst = getBangladeshDateString();
                    
                    if (progress.lastCompletedDate !== todayBst) {
                        progress.count = 0;
                    }
                    
                    progress.count++;
                    progress.lastCompletedDate = todayBst;
                    return progress;
                });

                const currency = task.rewardType === 'diamond' ? 'diamonds' : (task.rewardType === 'ticket' ? 'tickets' : 'coins');
                if(currency === 'tickets') {
                     await database.ref(`users/${auth.currentUser.uid}/tickets`).transaction(current => (current || 0) + task.rewardAmount);
                } else {
                     await database.ref(`users/${auth.currentUser.uid}/wallet/${currency}`).transaction(current => (current || 0) + task.rewardAmount);
                }
                await addTransaction(auth.currentUser.uid, {
                    type: 'Mission Reward',
                    description: `Completed: ${task.title}`,
                    amount: task.rewardAmount,
                    currency: task.rewardType
                });
                
                window.history.back();
                showModal('success', 'Task Completed!', `You earned ${task.rewardAmount} ${task.rewardType}s.`);

            } else {
                throw new Error("Invalid code. Please make sure you copied the correct code.");
            }
         });
    }

     function renderPartnerScreen() {
        const screen = document.getElementById('partner-content');
        
        screen.querySelector('#copy-partner-link-btn').addEventListener('click', (e) => {
            const link = document.getElementById('partner-link-text').textContent;
            navigator.clipboard.writeText(link).then(() => {
                showModal('success', 'লিঙ্ক কপি হয়েছে!', 'লিঙ্কটি আপনার ক্লিপবোর্ডে কপি করা হয়েছে।');
            });
        });
    }
    
    function renderLupWalletPage() {
        const contentArea = document.getElementById('lup-wallet-screen');
        contentArea.innerHTML = `
            <div class="p-4">
                <div class="flex gap-2 mb-4">
                    <button class="tab-button lup-wallet-tab active-tab" data-target="lup-wallet-dashboard">Dashboard</button>
                    <button class="tab-button lup-wallet-tab" data-target="lup-wallet-coupons">My Coupons</button>
                    <button class="tab-button lup-wallet-tab" data-target="lup-wallet-inventory">Inventory</button>
                </div>
                <div id="lup-wallet-dashboard" class="tab-content-section active-section"></div>
                <div id="lup-wallet-coupons" class="tab-content-section"></div>
                <div id="lup-wallet-inventory" class="tab-content-section"></div>
            </div>
        `;
        renderLupDashboard();
        renderLupCoupons();
        renderLupInventory();
        setupTabs('lup-wallet-screen', '.lup-wallet-tab', '.tab-content-section');
    }

    function renderLupDashboard() {
        const contentArea = document.getElementById('lup-wallet-dashboard');
        const coins = currentUserData.wallet?.coins || 0;
        const diamonds = currentUserData.wallet?.diamonds || 0;
        const liveBalance = currentUserData.wallet?.live || 0;
        
        contentArea.innerHTML = `
        <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-gradient-to-br from-yellow-700 to-yellow-900 border border-yellow-600 rounded-2xl p-4 text-center">
                    <img src="https://cdn-icons-png.flaticon.com/512/217/217853.png" class="w-12 h-12 mx-auto mb-2" loading="lazy">
                    <p class="text-3xl font-bold font-oswald text-yellow-300">${formatNumberCompact(coins)}</p>
                    <p class="text-xs text-yellow-400">Coins</p>
                </div>
                <div class="bg-gradient-to-br from-cyan-700 to-cyan-900 border border-cyan-600 rounded-2xl p-4 text-center">
                    <img src="https://firebasestorage.googleapis.com/v0/b/viptask-5c1fc.appspot.com/o/Levelup%2F1762763297995.png?alt=media&token=db9ebed1-ff51-49ed-a311-0327313dae56" class="w-12 h-12 mx-auto mb-2" loading="lazy">
                    <p class="text-3xl font-bold font-oswald text-cyan-300">${formatNumberCompact(diamonds)}</p>
                    <p class="text-xs text-cyan-400">Diamonds</p>
                </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700">
                 <h3 class="font-bold text-green-400 mb-3">Exchange TK to Coins</h3>
                 <p class="text-xs text-gray-400 mb-3">Rate: 30 TK = 1000 Coins</p>
                 <form id="exchange-form" class="space-y-4">
                    <div>
                        <label for="tk-amount-input" class="form-label">Amount in TK (Your balance: ${liveBalance.toFixed(2)} TK)</label>
                        <input type="number" id="tk-amount-input" class="form-input" placeholder="e.g., 30" required>
                    </div>
                    <div>
                        <label class="form-label">You will get:</label>
                        <p id="coins-to-get" class="text-2xl font-bold font-oswald text-yellow-300">0 Coins</p>
                    </div>
                    <button type="submit" class="w-full py-3 action-button rounded-lg font-bold">Exchange Now</button>
                 </form>
            </div>
        </div>`;

        const tkInput = contentArea.querySelector('#tk-amount-input');
        const coinsOutput = contentArea.querySelector('#coins-to-get');
        
        tkInput.addEventListener('input', () => {
            const tkAmount = parseFloat(tkInput.value) || 0;
            if (tkAmount > 0) {
                const coinsAmount = Math.floor((tkAmount / 30) * 1000);
                coinsOutput.textContent = `${coinsAmount.toLocaleString()} Coins`;
            } else {
                coinsOutput.textContent = '0 Coins';
            }
        });

        contentArea.querySelector('#exchange-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const tkAmount = parseFloat(tkInput.value);
            if (isNaN(tkAmount) || tkAmount <= 0) {
                showModal('error', 'Invalid Amount', 'Please enter a valid amount in TK.');
                return;
            }
            if (tkAmount > liveBalance) {
                showModal('error', 'Insufficient Balance', `You only have ${liveBalance.toFixed(2)} TK in your live balance.`);
                return;
            }
            const coinsAmount = Math.floor((tkAmount / 30) * 1000);

            showCustomModal({
                title: 'Confirm Exchange',
                message: `Are you sure you want to exchange <strong class="text-white">${tkAmount.toFixed(2)} TK</strong> for <strong class="text-yellow-400">${coinsAmount.toLocaleString()} Coins</strong>?`,
                primaryButton: { text: 'Confirm', onClick: async () => {
                    try {
                        showLoader('Processing Exchange...');
                        const updates = {};
                        updates[`/users/${auth.currentUser.uid}/wallet/live`] = firebase.database.ServerValue.increment(-tkAmount);
                        updates[`/users/${auth.currentUser.uid}/wallet/coins`] = firebase.database.ServerValue.increment(coinsAmount);

                        await database.ref().update(updates);
                        await addTransaction(auth.currentUser.uid, {
                            type: 'Exchange',
                            description: `Exchanged ${tkAmount.toFixed(2)} TK for ${coinsAmount} Coins`,
                            amount: -tkAmount,
                            status: 'completed'
                        });
                        hideLoader();
                        showModal('success', 'Exchange Successful!', `You have received ${coinsAmount.toLocaleString()} Coins.`);
                    } catch (error) {
                        hideLoader();
                        handleFirebaseError(error);
                    }
                }},
                secondaryButton: { text: 'Cancel' }
            });
        });
    }
    
    function createCouponHTML(coupon, statusOverride = null) {
        const now = Date.now();
        const isExpired = new Date(coupon.expiryDate).getTime() <= now;
        let statusClass = '';
        let statusText = '';

        if (statusOverride) {
            statusClass = statusOverride.toLowerCase();
            statusText = statusOverride.toUpperCase();
        } else {
            statusClass = coupon.used ? 'used' : (isExpired ? 'expired' : '');
            statusText = coupon.used ? 'USED' : (isExpired ? 'EXPIRED' : '');
        }
        
        return `
        <div class="coupon-wrapper" data-coupon-id="${coupon.id}">
            <div class="coupon-image-container ${statusClass}">
                ${!statusText ? `<span class="coupon-expiry-timer" data-countdown-to="${coupon.expiryDate}"></span>` : ''}
                <img src="${coupon.imageUrl || 'https://i.imgur.com/83U7L2F.png'}" class="w-full h-auto" loading="lazy">
                ${statusText ? `
                <div class="coupon-ticket-status-overlay">
                    <span class="coupon-ticket-status-text">${statusText}</span>
                </div>` : ''}
            </div>
        </div>`;
    }


    function renderLupCoupons() {
        const container = document.getElementById('lup-wallet-coupons');
        const userCoupons = currentUserData.coupons || {};
        const now = Date.now();
        
        const sortedCoupons = Object.values(userCoupons).sort((a,b) => {
            const aIsActive = !a.used && new Date(a.expiryDate).getTime() > now;
            const bIsActive = !b.used && new Date(b.expiryDate).getTime() > now;
            if (aIsActive && !bIsActive) return -1;
            if (!aIsActive && bIsActive) return 1;
            return new Date(b.expiryDate) - new Date(a.expiryDate);
        });

        if (sortedCoupons.length === 0) {
            container.innerHTML = `<p class="text-center text-gray-500 mt-8">You don't have any coupons yet.</p>`;
            return;
        }

        const couponsHTML = sortedCoupons.map((coupon, index) => {
            const separator = index < sortedCoupons.length - 1 ? '<hr class="border-dashed border-gray-700 my-4">' : '';
            return createCouponHTML(coupon) + separator;
        }).join('');
        
        container.innerHTML = `<div class="space-y-4 max-w-sm mx-auto">${couponsHTML}</div>`;
        
        container.querySelectorAll('.coupon-wrapper').forEach(wrapper => {
            wrapper.addEventListener('click', () => {
                container.querySelectorAll('.coupon-wrapper').forEach(w => w.classList.remove('selected'));
                wrapper.classList.add('selected');
            });
        });
    }

    function renderLupInventory() {
        const container = document.getElementById('lup-wallet-inventory');
        
        const allItems = {
            badges: { ...window.dbData.admin?.config?.verifiedBadges },
            titles: { ...window.dbData.admin?.config?.titles }, // NEW
            frames: { ...window.dbData.admin?.config?.profileFrames },
            effects: { ...window.dbData.admin?.config?.profileEffects }
        };

        const teamBadges = Object.keys(currentUserData.team?.earnedBadges || {}).map(id => ({ id, ...allItems.badges[id], itemType: 'team', expiry: currentUserData.team.earnedBadges[id] })).filter(b => b.title && b.type === 'team');
        const profileBadges = Object.keys(currentUserData.earnedBadges || {}).map(id => ({ id, ...allItems.badges[id], itemType: 'profile_badge', expiry: currentUserData.earnedBadges[id] })).filter(b => b.title && b.type === 'profile');
        const profileTitles = Object.keys(currentUserData.earnedTitles || {}).map(id => ({ id, ...allItems.titles[id], itemType: 'title', expiry: currentUserData.earnedTitles[id] })).filter(t => t.url); // NEW
        const profileFrames = Object.keys(currentUserData.inventory?.frames || {}).map(id => ({ id, ...allItems.frames[id], itemType: 'frame', expiry: currentUserData.inventory.frames[id] })).filter(f => f.url);
        const profileEffects = Object.keys(currentUserData.inventory?.effects || {}).map(id => ({ id, ...allItems.effects[id], itemType: 'profile_effect', expiry: currentUserData.inventory.effects[id] })).filter(e => e.url);

        const inventoryItems = [...teamBadges, ...profileBadges, ...profileTitles, ...profileFrames, ...profileEffects];

        if (inventoryItems.length === 0) {
            container.innerHTML = `<div class="text-center text-gray-500 p-10"><i class="fa-solid fa-box-open text-5xl mb-4"></i><h3 class="text-2xl font-bold">Inventory is Empty</h3><p>Earn items from matches and events!</p></div>`;
            return;
        }
        
        const createSection = (title, items, equippedId, gridClass) => {
            if (items.length === 0) return '';
            const itemsHTML = items.map(item => {
                const isEquipped = item.id === equippedId;
                const media = (item.type === 'video' || item.itemType === 'profile_effect' || item.itemType === 'title')
                    ? `<video src="${item.url}" class="inventory-item-media" autoplay loop muted playsinline></video>`
                    : `<img src="${item.url}" class="inventory-item-media" loading="lazy">`;
                
                const timerHTML = (typeof item.expiry === 'number') ? `<div class="item-timer" data-expiry="${new Date(item.expiry).toISOString()}"></div>` : '';

                const equipBtnHTML = `
                    <div id="inventory-item-actions">
                       <button class="w-full text-xs font-bold py-2 rounded-md ${isEquipped ? 'bg-red-600' : 'bg-green-600'}">${isEquipped ? 'Unequip' : 'Equip'}</button>
                    </div>
                `;

                return `<div class="inventory-item ${isEquipped ? 'equipped' : ''}" data-item-id="${item.id}" data-item-type="${item.itemType}">
                            ${timerHTML}
                            ${media}
                            ${equipBtnHTML}
                        </div>`;
            }).join('');
            return `<div class="mb-6"><h3 class="section-header">${title}</h3><div class="${gridClass}">${itemsHTML}</div></div>`;
        };

        container.innerHTML = `
            <div id="inventory-grid-container">
                ${createSection('Team Badges', teamBadges, currentUserData.team?.equippedBadge, 'inventory-grid')}
                ${createSection('Profile Badges', profileBadges, currentUserData.equippedProfileBadge, 'inventory-grid')}
                ${createSection('Profile Titles', profileTitles, null, 'inventory-grid')} 
                ${createSection('Profile Frames', profileFrames, currentUserData.equippedFrame, 'inventory-grid')}
                ${createSection('Profile Backgrounds', profileEffects, currentUserData.equippedEffect, 'inventory-grid-fullwidth')}
            </div>`;

        container.querySelectorAll('.inventory-item').forEach(itemEl => {
            itemEl.addEventListener('click', (e) => {
                if (itemEl.classList.contains('processing')) return;
                const btn = itemEl.querySelector('button');
                container.querySelectorAll('.inventory-item').forEach(el => el.classList.remove('selected'));
                itemEl.classList.add('selected');
                if (e.target === btn) {
                    const itemId = itemEl.dataset.itemId;
                    const itemType = itemEl.dataset.itemType;
                    itemEl.classList.add('processing');
                    handleEquipBadge(itemId, itemType);
                }
            });
        });
    }


    function renderTopUpPage() {
        renderTopUpPurchaseSection();
        
        document.getElementById('topup-history-btn')?.addEventListener('click', () => {
            handleNavigation('topup-history-content');
        });
    }

    function renderTopUpPurchaseSection() {
        const container = document.getElementById('topup-screen');
        const userDiamonds = currentUserData.wallet?.diamonds || 0;

        const packsHTML = diamondPacks.map((pack) => `
            <div class="diamond-pack" data-diamonds="${pack.diamonds}" data-price="${pack.price}">
                <div class="flex items-center gap-4">
                    <i class="fa-solid fa-gem text-3xl text-cyan-400"></i>
                    <div>
                        <p class="text-lg font-bold text-left">${pack.diamonds} Diamonds</p>
                        <p class="text-sm text-gray-400 text-left">${pack.price} Diamonds</p>
                    </div>
                </div>
                <div class="select-indicator"><i class="fa-solid fa-check"></i></div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="p-4">
                <img src="https://firebasestorage.googleapis.com/v0/b/viptask-5c1fc.appspot.com/o/Levelup%2F1748982666_walletlogo.png?alt=media&token=c5d83ca3-21c9-4d5e-829c-13d576006fbb" class="w-full h-auto rounded-xl mb-4" alt="Topup Banner">
                <div class="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700 text-center mb-6">
                    <p class="text-sm text-gray-400">Your Diamond Balance</p>
                    <p class="text-3xl font-bold font-oswald text-cyan-300 flex items-center justify-center gap-2"><i class="fa-solid fa-gem"></i> ${userDiamonds}</p>
                </div>
                <div class="space-y-3 mb-6">${packsHTML}</div>
                <form id="topup-form" class="space-y-4">
                    <div>
                        <label for="topup-player-uid" class="form-label">Player Game UID</label>
                        <input type="text" id="topup-player-uid" class="form-input" placeholder="Enter your Free Fire UID" required>
                    </div>
                    <button type="submit" class="w-full py-3 action-button rounded-lg font-bold">Submit TopUp</button>
                </form>
            </div>`;

        const packs = container.querySelectorAll('.diamond-pack');
        packs.forEach(pack => {
            pack.addEventListener('click', () => {
                packs.forEach(p => p.classList.remove('selected'));
                pack.classList.add('selected');
            });
        });

        container.querySelector('#topup-form').addEventListener('submit', handleTopUpSubmit);
    }

    async function renderTopUpHistorySection() {
        const container = document.getElementById('topup-history-content');
        container.innerHTML = '<div class="spinner mx-auto mt-8"></div>';

        const topupsSnapshot = await database.ref('topupRequests').orderByChild('userId').equalTo(auth.currentUser.uid).once('value');
        const topups = Object.values(topupsSnapshot.val() || {}).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (topups.length === 0) {
            container.innerHTML = `<p class="text-center text-gray-400 mt-8">You have no top-up history.</p>`;
            return;
        }

        const historyHTML = topups.map(item => `
            <div class="bg-[#2a2a2a] p-3 rounded-lg mb-2">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-bold text-white">${item.diamonds} Diamonds</p>
                        <p class="text-xs text-gray-400">UID: ${item.gameUid}</p>
                    </div>
                    <p class="font-bold status-${item.status}">${item.status.toUpperCase()}</p>
                </div>
                <p class="text-xs text-gray-500 mt-1">${new Date(item.timestamp).toLocaleString()}</p>
            </div>
        `).join('');

        container.innerHTML = `<div class="space-y-2">${historyHTML}</div>`;
    }

    function handleTopUpSubmit(e) {
        e.preventDefault();
        const selectedPack = document.querySelector('.diamond-pack.selected');
        const playerUid = document.getElementById('topup-player-uid').value.trim();

        if (!selectedPack) {
            showModal('error', 'Selection Required', 'Please select a diamond pack.');
            return;
        }
        if (!playerUid) {
            showModal('error', 'UID Required', 'Please enter your Player Game UID.');
            return;
        }

        const diamonds = parseInt(selectedPack.dataset.diamonds);
        const price = parseInt(selectedPack.dataset.price);
        const userDiamonds = currentUserData.wallet?.diamonds || 0;

        if (userDiamonds < price) {
            showModal('error', 'Insufficient Diamonds', `You need ${price} diamonds for this top-up. Your balance is ${userDiamonds}.`);
            return;
        }

        showCustomModal({
            title: 'Confirm Top-Up',
            iconHtml: `<i class="fa-solid fa-gem text-5xl text-cyan-400 mb-2"></i>`,
            message: `Are you sure you want to top-up <strong class="text-white">${diamonds} diamonds</strong> for UID <strong class="text-white">${playerUid}</strong>? This will cost <strong class="text-cyan-400">${price} diamonds</strong>.`,
            primaryButton: { text: 'Confirm', onClick: async () => {
                try {
                    showLoader('Submitting Request...');
                    const newDiamondBalance = userDiamonds - price;

                    const newRequestRef = database.ref('topupRequests').push();
                    const requestData = {
                        id: newRequestRef.key,
                        userId: auth.currentUser.uid,
                        userName: currentUserData.name,
                        gameUid: playerUid,
                        diamonds: diamonds,
                        price: price,
                        timestamp: new Date().toISOString(),
                        status: 'pending'
                    };

                    const updates = {};
                    updates[`users/${auth.currentUser.uid}/wallet/diamonds`] = newDiamondBalance;
                    updates[`topupRequests/${newRequestRef.key}`] = requestData;

                    await database.ref().update(updates);

                    hideLoader();
                    showModal('success', 'Request Submitted', 'Your top-up request has been sent and is pending approval.');
                    renderTopUpPage();
                } catch (error) {
                    hideLoader();
                    handleFirebaseError(error);
                }
            }},
            secondaryButton: { text: 'Cancel' }
        });
    }

    function renderNewsFeed() {
        const container = document.getElementById('home-news-feed');
        const newsPosts = Object.values(window.dbData.newsPosts || {}).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        if(newsPosts.length === 0) {
            container.innerHTML = `<div class="text-center text-gray-500 p-10 bg-gray-800/50 rounded-lg"><i class="fa-solid fa-newspaper text-4xl mb-4"></i><p>No news right now. Check back later!</p></div>`;
            return;
        }
        container.innerHTML = newsPosts.map(createNewsPostCardHTML).join('');
        initializeNewsEventListeners();
    }

    function createNewsPostCardHTML(post) {
        const allBadges = window.dbData.admin?.config?.verifiedBadges || {};
        let badgeHTML = '';
        if (post.badgeIndex !== undefined && post.badgeIndex !== null) {
            const badgeData = allBadges[post.badgeIndex];
            if(badgeData){
                badgeHTML = badgeData.type === 'video'
                    ? `<video src="${badgeData.url}" class="verification-badge" data-badge-index="${post.badgeIndex}" autoplay loop muted playsinline></video>`
                    : `<img src="${badgeData.url}" alt="Badge" class="verification-badge" data-badge-index="${post.badgeIndex}" loading="lazy">`;
            }
        } else {
             badgeHTML = `<img src="https://firebasestorage.googleapis.com/v0/b/viptask-5c1fc.appspot.com/o/1678272828555.png?alt=media&token=42395568-7313-4318-8742-553ded11a25e" alt="Verified" class="verification-badge" loading="lazy">`;
        }

        const noteHTML = post.note ? `<p class="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">${post.note}</p>` : '';
        const imageHTML = post.imageUrl ? `<img src="${post.imageUrl}" class="w-full h-auto max-h-96 object-contain rounded-lg mt-4" alt="News Image" loading="lazy">` : '';
        const urlHTML = post.url ? `<a href="${post.url}" target="_blank" class="block w-full mt-4 py-2.5 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-600/50 font-bold text-sm hover:bg-blue-600/40 transition-colors text-center"><i class="fa-solid fa-link mr-2"></i>${post.urlText || 'Open Link'}</a>` : '';
        
        const userVote = currentUserData.votes?.[post.id];
        const pollHTML = post.poll ? (userVote !== undefined ? createPollResultsHTML(post, userVote) : createPollOptionsHTML(post)) : '';

        return `
        <div class="news-post-card rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a2a2a] to-[#202020] border border-gray-700" data-news-post-id="${post.id}">
            <div class="p-4">
                <div class="flex items-center gap-3">
                    <img src="${APP_LOGO_URL}" class="w-10 h-10 rounded-full object-cover border-2 border-yellow-500" loading="lazy">
                    <div>
                        <div class="flex items-center">
                            <p class="font-semibold text-white">LEVEL UP Official</p>
                            ${badgeHTML}
                        </div>
                        <p class="text-xs text-gray-400">${timeAgo(post.timestamp)}</p>
                    </div>
                </div>
            </div>
            <div class="p-4 pt-0 space-y-4">
                ${noteHTML}
                ${imageHTML}
                ${pollHTML}
                ${urlHTML}
            </div>
        </div>`;
    }

    function createPollOptionsHTML(post) {
        const optionsHTML = post.poll.options.map((option, index) => 
            `<button class="poll-option-btn w-full text-left p-3 rounded-lg font-semibold transition-colors duration-200" data-option-index="${index}">${option.text}</button>`
        ).join('');
        return `<div class="mt-4"><p class="font-bold mb-3">${post.poll.question}</p><div class="space-y-2">${optionsHTML}</div><button class="vote-btn w-full mt-4 py-2 action-button rounded-lg font-bold hidden">Vote</button></div>`;
    }

    function createPollResultsHTML(post, userVote) {
        const totalVotes = Object.values(post.poll.options).reduce((sum, opt) => sum + (opt.votes || 0), 0);
        const resultsHTML = post.poll.options.map((option, index) => {
            const votes = option.votes || 0;
            const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(0) : 0;
            const isVotedOption = index === userVote;
            return `
            <div class="poll-result-item ${isVotedOption ? 'voted' : ''}">
                <div class="flex justify-between items-center text-sm font-semibold mb-1">
                    <span class="flex items-center">${option.text} ${isVotedOption ? '<i class="fa-solid fa-check text-green-400 ml-2"></i>' : ''}</span>
                    <span>${percentage}%</span>
                </div>
                <div class="poll-result-bar w-full h-2 rounded-full overflow-hidden">
                    <div class="poll-result-fill h-full rounded-full" style="width: ${percentage}%"></div>
                </div>
            </div>`;
        }).join('');
        return `<div class="mt-4"><p class="font-bold mb-3">${post.poll.question}</p><div class="space-y-3">${resultsHTML}</div><p class="text-xs text-gray-500 text-center mt-3">${totalVotes} total votes</p></div>`;
    }

    function initializeNewsEventListeners() {
        document.querySelectorAll('.news-post-card').forEach(card => {
            const voteBtn = card.querySelector('.vote-btn');
            const options = card.querySelectorAll('.poll-option-btn');
            let selectedOption = null;

            options.forEach(optionBtn => {
                optionBtn.addEventListener('click', () => {
                    selectedOption = optionBtn.dataset.optionIndex;
                    options.forEach(opt => opt.classList.remove('selected'));
                    optionBtn.classList.add('selected');
                    voteBtn.classList.remove('hidden');
                });
            });

            if (voteBtn) {
                voteBtn.addEventListener('click', () => {
                    if (selectedOption !== null) {
                        handleVote(card.dataset.newsPostId, parseInt(selectedOption));
                    }
                });
            }
        });
    }

    async function handleVote(postId, optionIndex) {
        if (currentUserData.votes && currentUserData.votes[postId] !== undefined) {
            showModal('error', 'Already Voted', 'You have already participated in this poll.');
            return;
        }

        showLoader('Casting Vote...');
        const updates = {};
        updates[`/newsPosts/${postId}/poll/options/${optionIndex}/votes`] = firebase.database.ServerValue.increment(1);
        updates[`/newsPosts/${postId}/poll/voters/${auth.currentUser.uid}`] = optionIndex; // Track voter
        updates[`/users/${auth.currentUser.uid}/votes/${postId}`] = optionIndex;
        
        try {
            await database.ref().update(updates);
            // MODIFICATION: No longer need hideLoader() here, the realtime listener will re-render
        } catch (error) {
            handleFirebaseError(error);
        } finally {
            hideLoader(); // Keep hideLoader in case of error
        }
    }
    
    // --- PREMIUM LEADERBOARD FUNCTIONS ---
    function renderLeaderboardPage() {
        const contentArea = document.getElementById('leaderboard-content');
        const adminSettings = window.dbData.admin?.leaderboard || {};
        const bannerUrl = adminSettings.bannerUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPxVDr9trNNTRTuHh26ZxcW86Gf5wVx9R2IjSvi20GjA&s=10";
        
        contentArea.querySelector('#leaderboard-banner-img').src = bannerUrl;

        const countdownTimer = document.getElementById('season-countdown-timer');
        const countdownLabel = document.getElementById('season-countdown-label');

        const seasonStartDateString = adminSettings.seasonStartDate;

        if (seasonStartDateString) {
            const startDate = new Date(seasonStartDateString);
            const now = new Date();

            if (now < startDate) {
                countdownLabel.textContent = "Season Starts In";
                countdownTimer.dataset.countdownTo = startDate.toISOString();
            } else {
                countdownLabel.textContent = "Season Ends In";
                const endDate = new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000);
                countdownTimer.dataset.countdownTo = endDate.toISOString();
            }
        } else {
            countdownLabel.textContent = "Season";
            countdownTimer.textContent = "Not Active";
            delete countdownTimer.dataset.countdownTo;
        }
        
        renderBRLeaderboard();
    }

    function getFullLeaderboardData() {
        const allPosts = Object.values(window.dbData.posts || {});
        const teamStats = {};
        
        const seasonStartDateString = window.dbData.admin?.leaderboard?.seasonStartDate;
        if (!seasonStartDateString) return [];
        const seasonStartDate = new Date(seasonStartDateString);
         if (new Date() < seasonStartDate) return []; // Don't calculate if season hasn't started

        const seasonEndDate = new Date(seasonStartDate.getTime() + 60 * 24 * 60 * 60 * 1000);

        // [FIXED] Include practice matches in leaderboard calculation
        const seasonPosts = allPosts.filter(p => 
            p.status === 'completed' &&
            new Date(p.timestamp) >= seasonStartDate &&
            new Date(p.timestamp) <= seasonEndDate
        );

        seasonPosts.forEach(post => {
            const isCS = post.details.matchType === 'Clash Squad';
            if (isCS) {
                if (post.csResults && post.csResults.winner) {
                    const winnerTeamId = post.csResults.winner;
                    const winnerTeam = findTeamById(winnerTeamId);
                    if (winnerTeam) {
                        if (!teamStats[winnerTeamId]) {
                            teamStats[winnerTeamId] = { name: winnerTeam.name, logo: winnerTeam.logo, wins: 0, kills: 0, points: 0, team: winnerTeam };
                        }
                        teamStats[winnerTeamId].wins += 1;
                        if(post.details.eventType !== 'practice') { // Only add points for non-practice CS matches
                            teamStats[winnerTeamId].points += 6;
                        }
                    }
                }
            } else { // BR Match
                Object.values(post.participants || {}).forEach(participant => {
                    const user = window.dbData.users[participant.userId];
                    if (user && user.team && !user.team.bannedFromLeaderboard) {
                        const teamId = user.team.id;
                        if (!teamStats[teamId]) {
                            teamStats[teamId] = { name: user.team.name, logo: user.team.logo, wins: 0, kills: 0, points: 0, team: user.team };
                        }
                        
                        if (post.approvedResults && post.approvedResults[participant.userId]) {
                            Object.values(post.approvedResults[participant.userId]).forEach(mapResult => {
                                const mapKills = parseInt(mapResult.kills, 10) || 0;
                                const mapPosition = parseInt(mapResult.position, 10) || 0;
                                teamStats[teamId].kills += mapKills;
                                if(post.details.eventType !== 'practice') { // Only add points for non-practice BR matches
                                    teamStats[teamId].points += calculatePoints(mapKills, mapPosition);
                                }
                                if (mapPosition === 1) teamStats[teamId].wins++;
                            });
                        }
                    }
                });
            }
        });
        
        Object.values(teamStats).forEach(teamStat => { if (teamStat.team.pointAdjustment) teamStat.points += (parseInt(teamStat.team.pointAdjustment, 10) || 0); });

        return Object.values(teamStats).sort((a, b) => b.points - a.points);
    }

    function renderBRLeaderboard() {
        const container = document.getElementById('br-leaderboard-container');
        container.innerHTML = `<div class="flex items-center justify-center p-8"><div class="spinner mr-3"></div><p class="text-gray-400">Ranks are being updated...</p></div>`;

        const leaderboardData = getFullLeaderboardData();
        
        if (leaderboardData.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 mt-8">No teams have earned points this season yet.</p>';
            return;
        }

        let myTeamEntryHTML = '';
        const myTeamId = currentUserData.team?.id;
        const myTeamIndex = leaderboardData.findIndex(t => t.team.id === myTeamId);
        
        const top12HTML = leaderboardData.slice(0, 12).map((team, index) => createLeaderboardEntryHTML(team, index, 'br')).join('');
        
        if (myTeamId && myTeamIndex > 11) {
            myTeamEntryHTML = `
                <div class="my-4 text-center"><i class="fa-solid fa-ellipsis-v text-gray-600"></i></div>
                ${createLeaderboardEntryHTML(leaderboardData[myTeamIndex], myTeamIndex, 'br')}
            `;
        }

        container.innerHTML = top12HTML + myTeamEntryHTML;
    }
    
    function findTeamById(teamId) {
        const allUsers = Object.values(window.dbData.users || {});
        for(const user of allUsers) {
            if(user.team && user.team.id == teamId) {
                return user.team;
            }
        }
        return null;
    }

    function createLeaderboardEntryHTML(team, index) {
        const rank = index + 1;
        const isMyTeam = currentUserData.team?.id === team.team.id;
        let badgeHTML = '';
        if(team.team.equippedBadge) {
            const badgeData = window.dbData.admin?.config?.verifiedBadges[team.team.equippedBadge];
            if(badgeData && badgeData.type === 'team') badgeHTML = `<img src="${badgeData.url}" class="verification-badge" data-badge-index="${team.team.equippedBadge}" loading="lazy">`;
        }

        return `
        <div class="leaderboard-entry rank-${rank} ${isMyTeam ? 'my-team' : ''} grid grid-cols-12 items-center p-3 rounded-lg text-sm">
            ${rank === 1 ? '<i class="fa-solid fa-crown crown-icon"></i>' : ''}
            <div class="col-span-1 text-center font-bold">
                <span class="rank-badge">${rank}</span>
            </div>
            <div class="col-span-5 flex items-center gap-3">
                <img src="${team.logo || DEFAULT_TEAM_LOGO}" class="w-10 h-10 rounded-full object-cover border-2 border-gray-600" loading="lazy">
                <p class="font-semibold truncate flex items-center">${team.name} ${badgeHTML}</p>
            </div>
            <div class="col-span-2 text-center font-semibold">${team.wins}</div>
            <div class="col-span-2 text-center font-semibold">${team.kills}</div>
            <div class="col-span-2 text-center font-bold text-green-400">${team.points}</div>
        </div>`;
    }

    function renderSeasonDetailsPage() {
        const content = document.getElementById('season-details-content');
        const adminSettings = window.dbData.admin?.leaderboard || {};
        
        const countdownLabel = document.getElementById('season-details-countdown-label');
        const countdownTimer = document.getElementById('season-details-countdown-timer');

        const seasonStartDateString = adminSettings.seasonStartDate;
        if (seasonStartDateString) {
            const startDate = new Date(seasonStartDateString);
            const now = new Date();
            
            if (now < startDate) {
                countdownLabel.textContent = "Season Starts In";
                countdownTimer.dataset.countdownTo = startDate.toISOString();
            } else {
                countdownLabel.textContent = "Season Ends In";
                const endDate = new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000);
                countdownTimer.dataset.countdownTo = endDate.toISOString();
            }
        } else {
             countdownLabel.textContent = "Season Status";
             countdownTimer.innerHTML = `<p class="text-2xl text-gray-400">Not Active</p>`;
             delete countdownTimer.dataset.countdownTo;
        }
        
        const winners = adminSettings.previousWinners || [];
        const winnersContainer = content.querySelector('#previous-winners-container');
        if (winners.length > 0) {
            winnersContainer.innerHTML = winners.slice(0, 12).map((winner, index) => {
                let badgeHTML = '';
                if(winner.badge) {
                    const badgeData = window.dbData.admin?.config?.verifiedBadges[winner.badge];
                    if(badgeData) badgeHTML = `<img src="${badgeData.url}" class="verification-badge" data-badge-index="${winner.badge}" loading="lazy">`;
                }
                return `
                <div class="previous-winner-entry rank-${index+1} flex items-center p-3 rounded-lg">
                    <span class="rank-badge w-10 text-center">#${index+1}</span>
                    <img src="${winner.logo || DEFAULT_TEAM_LOGO}" class="w-10 h-10 rounded-full object-cover mx-4 border-2 border-gray-600" loading="lazy">
                    <p class="font-semibold flex-grow truncate flex items-center">${winner.name} ${badgeHTML}</p>
                </div>
                `;
            }).join('');
        } else {
            winnersContainer.innerHTML = '<p class="text-center text-gray-500">Previous season data is not available yet.</p>';
        }
    }
    
    function renderHelpPage() {
        const container = document.getElementById('help-community-content');
        container.innerHTML = `
        <div class="max-w-sm mx-auto space-y-4">
            <p class="text-center text-gray-400 mb-6">আপনার যেকোনো সমস্যায় নিচের মাধ্যমগুলোতে আমাদের সাথে যোগাযোগ করুন। আমাদের এডমিন আপনাকে সাহায্য করবে।</p>

            <div class="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700">
                <div class="flex items-center gap-4">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvvAEWFfbsS5dVZLCvODoVulfyuplntxKyAbWyEXunNQ&s" class="w-12 h-12 rounded-full object-cover">
                    <div>
                        <h3 class="font-bold text-lg">Discord Server</h3>
                        <p class="text-xs text-gray-400">কমিউনিটিতে যোগ দিন</p>
                    </div>
                </div>
                <div class="flex gap-2 mt-4">
                    <button id="copy-discord-link" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-lg text-sm">Copy Link</button>
                    <a href="https://discord.gg/HkdG4fbx7s" target="_blank" class="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-sm">Open Discord</a>
                </div>
            </div>

             <div class="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700">
                <div class="flex items-center gap-4">
                    <img src="https://create.wa.link/static/WhatsApp-0e878a0fa68c61b06e781cee2e6bc71f.svg" class="w-12 h-12 rounded-full object-cover">
                    <div>
                        <h3 class="font-bold text-lg">WhatsApp Support</h3>
                        <p class="text-xs text-gray-400">01889221262</p>
                    </div>
                </div>
                <div class="flex gap-2 mt-4">
                    <button id="copy-whatsapp-number" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-lg text-sm">Copy Number</button>
                    <a href="https://wa.link/o5ys5a" target="_blank" class="flex-1 text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg text-sm">Open WhatsApp</a>
                </div>
            </div>

            <div class="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700">
                 <div class="flex items-center gap-4">
                    <i class="fa-brands fa-telegram text-5xl text-cyan-400"></i>
                    <div class="text-left">
                        <h3 class="font-bold text-lg">Telegram Support</h3>
                        <p class="text-xs text-gray-400">Admin ID: @Blackmoney54</p>
                        <p class="text-xs text-gray-400">Channel: @levelupbd</p>
                    </div>
                </div>
                <div class="flex gap-2 mt-4">
                    <a href="https://t.me/Blackmoney54" target="_blank" class="flex-1 text-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-3 rounded-lg text-sm">Contact Admin</a>
                    <a href="https://t.me/levelupbd" target="_blank" class="flex-1 text-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-3 rounded-lg text-sm">Join Channel</a>
                </div>
            </div>
        </div>`;

        document.getElementById('copy-discord-link').addEventListener('click', () => navigator.clipboard.writeText('https://discord.gg/HkdG4fbx7s').then(() => showModal('success', 'লিঙ্ক কপি হয়েছে!')));
        document.getElementById('copy-whatsapp-number').addEventListener('click', () => navigator.clipboard.writeText('01889221262').then(() => showModal('success', 'নম্বর কপি হয়েছে!')));
    }

    function renderVideoTutorialsPage() {
        const container = document.getElementById('video-tutorials-content');
        const customTutorials = Object.values(window.dbData.admin?.config?.videoTutorials || {});
        const ytLogoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGyW5d478Kq_ufzvDEQJsU9oNTSE7P6W6edn9Riy2_tg&s=10";
        const defaultVideo1 = { title: "লেভেল আপ অ্যাপ কিভাবে ব্যবহার করবেন?", link: window.dbData.admin?.config?.youtubeVideo1 || "#", image: ytLogoUrl, subtitle: "Watch on YouTube" };
        const defaultVideo2 = { title: "আয়োজক অ্যাপ কিভাবে ব্যবহার করবেন?", link: window.dbData.admin?.config?.youtubeVideo2 || "#", image: ytLogoUrl, subtitle: "Watch on YouTube" };
        const allTutorials = [defaultVideo1, defaultVideo2, ...customTutorials];
        

        if (allTutorials.filter(t => t.link && t.link !== '#').length === 0) {
            container.innerHTML = `<p class="text-center text-gray-400 mt-8">No video tutorials available.</p>`;
            return;
        }
        
        const tutorialsHTML = allTutorials.map(tut => {
            if (!tut.link || tut.link === '#') return '';
            return `
             <a href="${tut.link}" target="_blank" class="block bg-[#1e1e1e] p-4 rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300">
                <div class="flex items-center gap-4">
                    <img src="${tut.image || ytLogoUrl}" class="w-16 h-16 rounded-full object-cover flex-shrink-0">
                    <div>
                        <h3 class="font-bold text-lg text-red-400">${tut.title}</h3>
                        <p class="text-xs text-gray-400 mt-1">${tut.subtitle || 'Watch on YouTube'}</p>
                    </div>
                </div>
            </a>
        `}).join('');

        container.innerHTML = `<div class="space-y-4">${tutorialsHTML}</div>`;
    }
    
    function renderBuySellPage() {
        const contentArea = document.getElementById('buy-sell-content');
        contentArea.innerHTML = `
            <div class="flex gap-2 mb-4">
                <button class="tab-button buy-sell-tab active-tab" data-target="buy-sell-buy-section">Buy</button>
                <button class="tab-button buy-sell-tab" data-target="buy-sell-sell-section">Sell</button>
                <button class="tab-button buy-sell-tab" data-target="buy-sell-deal-section">Deal</button>
            </div>

            <div id="buy-sell-buy-section" class="tab-content-section active-section">
                 <div class="text-center text-gray-500 p-10"><i class="fa-solid fa-tools text-5xl mb-4"></i><h3 class="text-2xl font-bold">Coming Soon</h3><p>This section is under development.</p></div>
            </div>
            <div id="buy-sell-sell-section" class="tab-content-section">
                 <div class="text-center text-gray-500 p-10"><i class="fa-solid fa-tools text-5xl mb-4"></i><h3 class="text-2xl font-bold">Coming Soon</h3><p>This section is under development.</p></div>
            </div>
            <div id="buy-sell-deal-section" class="tab-content-section">
                 <div class="text-center text-gray-500 p-10"><i class="fa-solid fa-tools text-5xl mb-4"></i><h3 class="text-2xl font-bold">Coming Soon</h3><p>This section is under development.</p></div>
            </div>
        `;
        setupTabs('buy-sell-content', '.buy-sell-tab', '.tab-content-section');
    }

    function renderCompleteProfilePage() {
        const content = document.getElementById('complete-profile-content');
        const form = content.querySelector('#complete-profile-form');

        document.getElementById('complete-profile-name').value = auth.currentUser.displayName || '';
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            showLoader('Saving...');

            const name = document.getElementById('complete-profile-name').value.trim();
            const whatsapp = document.getElementById('complete-profile-whatsapp').value.trim();
            const gender = form.querySelector('input[name="complete-gender"]:checked').value;

            if (!name || !whatsapp || !gender) {
                hideLoader();
                showModal('error', 'Required Fields', 'Please fill in all the required information.');
                btn.disabled = false;
                return;
            }

            if (!/^\d{10}$/.test(whatsapp)) {
                hideLoader();
                showModal('error', 'Invalid Number', 'Please enter a valid 10-digit WhatsApp number.');
                btn.disabled = false;
                return;
            }

            try {
                await auth.currentUser.updateProfile({ displayName: name });
                await database.ref('users/' + auth.currentUser.uid).update({
                    name: name,
                    whatsapp: '+880' + whatsapp,
                    gender: gender,
                    isProfileComplete: true
                });
                hideLoader();
                showModal('success', 'প্রোফাইল সম্পন্ন!', 'আপনার তথ্য সফলভাবে সেভ করা হয়েছে।', 'Continue', () => {
                    handleNavigation('profile-content');
                });
            } catch (error) {
                hideLoader();
                handleFirebaseError(error);
                btn.disabled = false;
            }
        });
    }


    function processMatchCompletions(oldPosts, newPosts, userId) {
        if (!oldPosts || !newPosts) return;

        Object.keys(newPosts).forEach(async postId => {
            const oldPost = oldPosts[postId];
            const newPost = newPosts[postId];
            
            if (newPost.status === 'completed' && oldPost?.status !== 'completed' && currentUserData.bookings?.[postId] && !currentUserData.completionPopupsShown?.[postId]) {
                const updates = {};
                let myKillsInMatch = 0;
                let isWinner = false;
                
                if (newPost.details.matchType === 'Clash Squad') {
                    if (newPost.csResults?.winner === currentUserData.team?.id) {
                        isWinner = true;
                    }
                } else {
                    if (newPost.approvedResults && newPost.approvedResults[userId]) {
                        Object.values(newPost.approvedResults[userId]).forEach(mapResult => {
                            myKillsInMatch += parseInt(mapResult.kills) || 0;
                            if (parseInt(mapResult.position) === 1) {
                                isWinner = true;
                            }
                        });
                    }
                }

                updates[`/users/${userId}/stats/totalMatches`] = firebase.database.ServerValue.increment(1);
                updates[`/users/${userId}/stats/totalKills`] = firebase.database.ServerValue.increment(myKillsInMatch);
                if (isWinner) {
                    updates[`/users/${userId}/stats/totalWins`] = firebase.database.ServerValue.increment(1);
                }
                
                updates[`/users/${userId}/tickets`] = firebase.database.ServerValue.increment(1);
                updates[`/users/${userId}/completionPopupsShown/${postId}`] = true;

                try {
                    await database.ref().update(updates);
                    await addTransaction(userId, { type: 'Match Reward', description: `Participation in "${newPost.details.eventName}"`, amount: 1, currency: 'ticket' });
                    showMatchCompletionPopup(newPost, myKillsInMatch);
                } catch(e) {
                    console.error("Error updating stats after match completion:", e);
                }
            }
        });
    }
    
    function showMatchCompletionPopup(post, userKills) {
         const finalRankings = Object.values(post.participants || {}).map(p => { 
            let totalPoints = 0; 
            if (post.approvedResults && post.approvedResults[p.userId]) { 
                Object.values(post.approvedResults[p.userId]).forEach(mapResult => { 
                    totalPoints += calculatePoints(mapResult.kills, mapResult.position); 
                }); 
            } 
            return { userId: p.userId, totalPoints }; 
        }).sort((a, b) => b.totalPoints - a.totalPoints);
        const myRankIndex = finalRankings.findIndex(r => r.userId === auth.currentUser.uid);
        const myRank = myRankIndex !== -1 ? myRankIndex + 1 : 'N/A';
        const myPoints = myRankIndex !== -1 ? finalRankings[myRankIndex].totalPoints : 'N/A';

        let resultStatsHTML = '';
        if (post.details.matchType === 'Clash Squad') {
            const isWinner = post.csResults?.winner === currentUserData.team?.id;
            resultStatsHTML = `
                <div class="user-profile-stat !bg-transparent !border-none">
                    <p class="user-profile-stat-value ${isWinner ? 'text-green-400' : 'text-red-400'}">${isWinner ? 'VICTORY' : 'DEFEAT'}</p>
                    <p class="user-profile-stat-label">Result</p>
                </div>
            `;
        } else {
             resultStatsHTML = `
                <div class="user-profile-stat !bg-transparent !border-none">
                    <p class="user-profile-stat-value text-red-400">${userKills}</p>
                    <p class="user-profile-stat-label">Your Kills</p>
                </div>
                <div class="user-profile-stat !bg-transparent !border-none">
                    <p class="user-profile-stat-value text-green-400">#${myRank}</p>
                    <p class="user-profile-stat-label">Your Rank</p>
                </div>
                 <div class="user-profile-stat !bg-transparent !border-none">
                    <p class="user-profile-stat-value text-blue-400">${myPoints}</p>
                    <p class="user-profile-stat-label">Total Points</p>
                </div>
             `;
        }

        const messageHTML = `
            <div class="text-center w-full">
                <p class="text-sm text-gray-400 mb-2">For completing</p>
                <h4 class="text-xl font-bold mb-4">${post.details.eventName}</h4>
                <div class="grid grid-cols-3 divide-x divide-gray-700 my-4">
                    ${resultStatsHTML}
                </div>
                <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-center justify-center gap-3">
                    <i class="fa-solid fa-ticket text-3xl text-yellow-300"></i>
                    <div>
                        <p class="text-lg font-bold text-yellow-300">+1 Ticket</p>
                        <p class="text-xs text-yellow-500">Added to your account</p>
                    </div>
                </div>
            </div>
        `;
        
        showCustomModal({
            title: "Congratulations!",
            iconHtml: `<dotlottie-wc src="https://lottie.host/808b26f5-072f-4c59-b17b-232d665a3962/qYI7k2RGvS.lottie" autoplay loop style="width: 120px; height: 120px;"></dotlottie-wc>`,
            message: messageHTML,
            primaryButton: { text: "Awesome!" },
            showCloseButton: true
        });
    }
    
    
    async function showPurchaseResultModal(type, item, itemId, btn) {
        const modal = screens.topupPurchase;
        btn.disabled = true;
        
        const submitFunction = submitTopupPurchase; 
        const itemStyle = `background-image: url('${item.image}');`;
        
        modal.classList.remove('hidden');
        
        modal.innerHTML = `
        <div class="modal-box relative" style="opacity: 1; transform: scale(1);">
             <button class="purchase-result-close-btn absolute top-2 right-3 text-gray-400 hover:text-white text-3xl z-20">&times;</button>
             <div class="topup-card-flipper">
                <div class="topup-card-face" style="${itemStyle}"></div>
                <div class="topup-card-face topup-card-back">
                     <dotlottie-wc src="https://lottie.host/e21415f9-b849-4323-8646-a2e3f1699933/i57m53VT2e.lottie" autoplay loop style="width: 150px; height: 150px;"></dotlottie-wc>
                     <p class="text-gray-400 text-xs mt-2">Buying...</p>
                </div>
            </div>
            <div class="purchase-result-footer text-center mt-6 opacity-0 transition-opacity duration-500">
                <div class="flex gap-2">
                    <button class="copy-redeem-code-btn flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-200">
                        <i class="fa-solid fa-copy"></i> Copy
                    </button>
                    <button class="redeem-now-btn flex-1 action-button py-3 px-4 rounded-lg text-sm font-bold">
                        Redeem Now
                    </button>
                </div>
            </div>
        </div>`;

        const modalBox = modal.querySelector('.modal-box');
        gsap.fromTo(modalBox, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });

        const flipper = modal.querySelector('.topup-card-flipper');
        const cardBack = modal.querySelector('.topup-card-back');
        const footer = modal.querySelector('.purchase-result-footer');
        
        let redeemCode = null;
        try {
            redeemCode = await submitFunction(item, itemId, btn);
        } catch(e) { console.error(e); }
        
        if (!redeemCode) {
            modal.classList.add('hidden');
            btn.disabled = false;
            return;
        }

        setTimeout(() => {
            flipper.classList.add('is-flipped');
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, zIndex: 1003 });
        }, 100);

        setTimeout(() => {
            const iconClass = 'fa-gem text-cyan-400';
            cardBack.innerHTML = `
                <i class="fa-solid ${iconClass} text-5xl mb-2"></i>
                <h3 class="font-bold text-2xl text-green-400">Successful!</h3>
                <div class="redeem-code-wrapper scan-overlay">
                    <p class="redeem-code-text text-center text-sm">${redeemCode}</p>
                </div>
            `;
            footer.classList.remove('opacity-0');
        }, 1000);

        const copyBtn = modal.querySelector('.copy-redeem-code-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(redeemCode).then(() => {
                copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied`;
                copyBtn.classList.add('bg-green-600');
                setTimeout(() => {
                    copyBtn.innerHTML = `<i class="fa-solid fa-copy"></i> Copy`;
                    copyBtn.classList.remove('bg-green-600');
                }, 2000);
            });
        });

        const redeemNowBtn = modal.querySelector('.redeem-now-btn');
        redeemNowBtn.addEventListener('click', async () => {
            redeemNowBtn.disabled = true;
            redeemNowBtn.innerHTML = '<div class="spinner mx-auto"></div>';
            try {
                await processRedeemCode(redeemCode, () => {
                    modal.classList.add('hidden');
                    btn.disabled = false;
                });
            } catch(error) {
                modal.classList.add('hidden');
                btn.disabled = false;
            }
        });
        
        modal.querySelector('.purchase-result-close-btn').addEventListener('click', () => {
             modal.classList.add('hidden');
             btn.disabled = false;
        });
    }
});

function initializeItemExpiryChecker() {
    setInterval(checkItemExpirations, 1000 * 60);
}

function checkItemExpirations() {
    if (!currentUserData || !auth.currentUser) return;
    
    const now = Date.now();
    const updates = {};
    let needsUpdate = false;

    const expireItem = (type, id, collectionPath, equipPath) => {
        updates[`users/${auth.currentUser.uid}/${equipPath}`] = null;
        updates[`users/${auth.currentUser.uid}/${collectionPath}/${id}`] = null;
        needsUpdate = true;
    };

    const equippedFrame = currentUserData.equippedFrame;
    if (equippedFrame) {
        const expiry = currentUserData.inventory?.frames?.[equippedFrame];
        if (typeof expiry === 'number' && now > expiry) {
            expireItem('frame', equippedFrame, 'inventory/frames', 'equippedFrame');
        }
    }

    const equippedProfileBadge = currentUserData.equippedProfileBadge;
    if (equippedProfileBadge) {
         const expiry = currentUserData.earnedBadges?.[equippedProfileBadge];
         if (typeof expiry === 'number' && now > expiry) {
            expireItem('badge', equippedProfileBadge, 'earnedBadges', 'equippedProfileBadge');
        }
    }

    const equippedTeamBadge = currentUserData.team?.equippedBadge;
    if (equippedTeamBadge) {
        const expiry = currentUserData.team?.earnedBadges?.[equippedTeamBadge];
         if (typeof expiry === 'number' && now > expiry) {
            updates[`users/${auth.currentUser.uid}/team/equippedBadge`] = null;
            updates[`users/${auth.currentUser.uid}/team/earnedBadges/${equippedTeamBadge}`] = null;
            needsUpdate = true;
        }
    }
    
    if(needsUpdate) {
        database.ref().update(updates).then(() => {
            console.log("Expired items have been unequipped and removed.");
        }).catch(error => {
            console.error("Error removing expired items:", error);
        });
    }
}

function renderRoomDetailsTab(postId) {
        const post = window.dbData.posts[postId];
        const container = document.getElementById('room-details-section');
        if (!container || !post) return;

        container.innerHTML = (post.roomId && post.roomPass) ? `
            <div class="bg-gradient-to-br from-green-900 to-gray-800 border border-green-700 rounded-xl p-4 shadow-lg">
                <h3 class="text-lg font-bold text-center text-green-300 mb-3">Room Details</h3>
                <div class="space-y-3">
                    <div class="flex justify-between items-center bg-black/30 p-2 rounded-lg">
                        <span class="text-gray-400 text-sm font-semibold">Room ID:</span>
                        <code class="text-white font-bold text-lg">${post.roomId}</code>
                        <button class="copy-btn bg-gray-600 hover:bg-gray-500 w-8 h-8 rounded-md flex items-center justify-center" data-copy-text="${post.roomId}">
                            <i class="fa-solid fa-copy"></i>
                        </button>
                    </div>
                    <div class="flex justify-between items-center bg-black/30 p-2 rounded-lg">
                        <span class="text-gray-400 text-sm font-semibold">Password:</span>
                        <code class="text-white font-bold text-lg">${post.roomPass}</code>
                        <button class="copy-btn bg-gray-600 hover:bg-gray-500 w-8 h-8 rounded-md flex items-center justify-center" data-copy-text="${post.roomPass}">
                            <i class="fa-solid fa-copy"></i>
                        </button>
                    </div>
                </div>
            </div>
        ` : '<p class="text-center text-yellow-400 font-semibold my-4 animate-pulse">Waiting for sponsor to provide Room ID & Pass...</p>';

        container.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.currentTarget.dataset.copyText;
                navigator.clipboard.writeText(text).then(() => showModal('success', 'Copied!', 'Room details copied to clipboard.'));
            });
        });
    }
    
    function renderPrizeReleaseAndVoting(postId) {
        const post = window.dbData.posts[postId];
        const container = document.getElementById('prize-release-section');
        if (!container || !post || post.status !== 'completed') return;

        const prizeReleaseTime = post.prizeReleaseTimestamp || 0;
        const now = Date.now();
        
        let finalHTML = '';

        if (now < prizeReleaseTime) {
            finalHTML = `<div class="text-center">
                            <p class="text-sm text-gray-400">প্রাইজ দেওয়া হবে:</p>
                            <p class="text-2xl font-bold font-oswald text-yellow-300" data-countdown-to="${new Date(prizeReleaseTime).toISOString()}">--:--:--</p>
                         </div>`;
        } else {
            const finalRankings = Object.values(post.participants || {}).map(p => { let totalPoints = 0; if (post.approvedResults && post.approvedResults[p.userId]) { Object.values(post.approvedResults[p.userId]).forEach(mapResult => { totalPoints += calculatePoints(mapResult.kills, mapResult.position); }); } return { userId: p.userId, totalPoints }; }).sort((a, b) => b.totalPoints - a.totalPoints);
            const myRankIndex = finalRankings.findIndex(r => r.userId === auth.currentUser.uid);
            const myRank = myRankIndex !== -1 ? myRankIndex + 1 : 'N/A';
            const myPoints = myRankIndex !== -1 ? finalRankings[myRankIndex].totalPoints : 'N/A';

            let prizeAmount = 0;
            if (myRankIndex !== -1) {
                const prizeInfo = (post.details.winningPrizes || []).find(prize => prize.rank === `Top ${myRank}`);
                if (prizeInfo) {
                    prizeAmount = parseFloat(prizeInfo.prize);
                }
            }
            
            const isClaimed = post.claimedBy && post.claimedBy[auth.currentUser.uid];

            finalHTML = `
                <div class="text-center">
                    <p class="text-sm text-gray-400">আপনার র‍্যাঙ্ক: <strong class="text-white">#${myRank}</strong> | আপনার পয়েন্ট: <strong class="text-white">${myPoints}</strong></p>
                    <p class="text-lg mt-2">আপনার জেতা প্রাইজ: <strong class="text-2xl font-bold text-green-400">${prizeAmount.toFixed(2)} TK</strong></p>
                    <div class="mt-4">
                        ${prizeAmount > 0 && !isClaimed ? `<button class="w-full py-3 action-button rounded-lg claim-reward-btn" data-post-id="${postId}" data-prize-amount="${prizeAmount}">Claim Reward</button>` : ''}
                        ${prizeAmount > 0 && isClaimed ? `<button class="w-full py-3 rounded-lg bg-green-800 text-green-300" disabled><i class="fa-solid fa-check mr-2"></i>Claimed</button>` : ''}
                        ${prizeAmount <= 0 ? `<p class="text-gray-500">Sorry, no prize for this rank.</p>` : ''}
                    </div>
                </div>
            `;
            if (isClaimed) {
                document.querySelector(`.post-card[data-post-id="${postId}"]`)?.parentElement.querySelector('.unclaimed-prize-badge')?.remove();
            }
        }
        
        container.innerHTML = finalHTML;
        container.querySelector('.claim-reward-btn')?.addEventListener('click', handleClaimPrize);
    }

    async function handleClaimPrize(event) {
        const btn = event.target;
        if (btn.disabled) return;
        const postId = btn.dataset.postId;
        const prizeAmount = parseFloat(btn.dataset.prizeAmount);
        const post = window.dbData.posts[postId];

        if (!post || post.claimedBy?.[auth.currentUser.uid]) return;

        btn.disabled = true;
        btn.innerHTML = '<div class="spinner mx-auto"></div>';

        try {
            const updates = {};
            updates[`/users/${auth.currentUser.uid}/wallet/live`] = firebase.database.ServerValue.increment(prizeAmount);
            updates[`/posts/${postId}/claimedBy/${auth.currentUser.uid}`] = true;
            
            await database.ref().update(updates);

            await addTransaction(auth.currentUser.uid, {
                type: 'Prize Claimed',
                description: `From "${post.details.eventName}"`,
                amount: prizeAmount,
                status: 'completed'
            });

            showModal('success', 'Congratulations!', `${prizeAmount.toFixed(2)} TK has been added to your Live Wallet.`);
        } catch (error) {
            handleFirebaseError(error);
            btn.disabled = false;
            btn.innerHTML = 'Claim Reward';
        }
    }

    window.handleUserVote = async function(postId, vote) {
        const updates = {};
        updates[`/posts/${postId}/votes/${auth.currentUser.uid}`] = vote;
        
        showLoader('Submitting vote...');
        try {
            await database.ref().update(updates);
            const postSnapshot = await database.ref(`posts/${postId}`).once('value');
            const post = postSnapshot.val();
            
            const participants = Object.values(post.participants || {});
            const votes = post.votes || {};

            let allVotedYes = participants.length > 0;
            if (allVotedYes) {
                for (const p of participants) {
                    if (votes[p.userId] !== true) {
                        allVotedYes = false;
                        break;
                    }
                }
            }

            if (allVotedYes) {
                const newReleaseTime = Date.now() + 5 * 60 * 1000;
                await database.ref(`posts/${postId}/prizeReleaseTimestamp`).set(newReleaseTime);
                showModal('success', 'সবাই সম্মত!', 'সকল অংশগ্রহণকারী সন্তুষ্ট হওয়ায় ৫ মিনিটের মধ্যে প্রাইজ দেওয়া হবে।');
            }
            
        } catch (error) {
            handleFirebaseError(error);
        } finally {
            hideLoader();
        }
    }