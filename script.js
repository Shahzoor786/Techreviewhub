// DOM Elements
const header = document.querySelector('header');
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');
const newsletterForm = document.querySelector('.newsletter-form');
const reviewCards = document.querySelectorAll('.review-card');
const categoryFilters = document.getElementById('category-filter');
const ratingFilters = document.getElementById('rating-filter');
const sortBySelect = document.getElementById('sort-by');
const heroSection = document.querySelector('.hero');
const scrollIndicator = document.querySelector('.scroll-indicator');
const menuOverlay = document.querySelector('.menu-overlay');

// Sticky Header with Hide/Show on Scroll
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class to header when scrolled
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Hide navbar when scrolling down, show when scrolling up
    if (scrollTop > lastScrollTop && scrollTop > 200) {
        header.classList.add('hide');
    } else {
        header.classList.remove('hide');
    }
    
    lastScrollTop = scrollTop;
});

// Mobile Menu Toggle
mobileMenuBtn?.addEventListener('click', () => {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    if (menuOverlay) menuOverlay.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.mobile-menu')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
    }
});

// Search Functionality
let searchTimeout;

searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.toLowerCase();
        filterReviews(searchTerm);
    }, 300);
});

searchButton?.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    filterReviews(searchTerm);
});

function filterReviews(searchTerm) {
    reviewCards?.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const content = card.querySelector('p').textContent.toLowerCase();
        const category = card.querySelector('.category').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm) || category.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Newsletter Form
newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    
    if (emailInput.value) {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'newsletter-success';
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for subscribing!';
        
        newsletterForm.innerHTML = '';
        newsletterForm.appendChild(successMessage);
    }
});

// Review Filtering and Sorting
function applyFilters() {
    if (!categoryFilters || !ratingFilters || !sortBySelect) return;

    const selectedCategory = categoryFilters.value;
    const selectedRating = parseFloat(ratingFilters.value);
    const sortBy = sortBySelect.value;

    const reviews = Array.from(document.querySelectorAll('.review-card'));

    reviews.forEach(review => {
        const category = review.querySelector('.category').textContent.toLowerCase();
        const rating = parseFloat(review.querySelector('.rating span').textContent);
        const shouldShow = (selectedCategory === 'all' || category.includes(selectedCategory.toLowerCase())) &&
                         (isNaN(selectedRating) || rating >= selectedRating);
        
        review.style.display = shouldShow ? 'block' : 'none';
    });

    // Sort reviews
    const reviewsContainer = document.querySelector('.reviews-grid');
    if (!reviewsContainer) return;

    const visibleReviews = reviews.filter(review => review.style.display !== 'none');
    
    visibleReviews.sort((a, b) => {
        const aRating = parseFloat(a.querySelector('.rating span').textContent);
        const bRating = parseFloat(b.querySelector('.rating span').textContent);
        const aDate = new Date(a.dataset.date);
        const bDate = new Date(b.dataset.date);
        
        switch(sortBy) {
            case 'rating-desc':
                return bRating - aRating;
            case 'rating-asc':
                return aRating - bRating;
            case 'date-desc':
                return bDate - aDate;
            case 'date-asc':
                return aDate - bDate;
            default:
                return 0;
        }
    });

    visibleReviews.forEach(review => reviewsContainer.appendChild(review));
}

categoryFilters?.addEventListener('change', applyFilters);
ratingFilters?.addEventListener('change', applyFilters);
sortBySelect?.addEventListener('change', applyFilters);

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Get the target element
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        // Calculate the scroll position
        const headerOffset = header.offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition - headerOffset;

        // Scroll smoothly to the target
        window.scrollBy({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Image Lazy Loading
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Comment System Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Show/hide reply forms
    const replyButtons = document.querySelectorAll('.comment-action.reply');
    
    if (replyButtons.length) {
        replyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const replyId = this.getAttribute('data-reply-id');
                const replyForm = document.getElementById(`reply-form-${replyId}`);
                
                if (replyForm) {
                    // Close all other open reply forms
                    document.querySelectorAll('.reply-form.active').forEach(form => {
                        if (form !== replyForm) {
                            form.classList.remove('active');
                        }
                    });
                    
                    // Toggle current form
                    replyForm.classList.toggle('active');
                    
                    // Focus on textarea if form is active
                    if (replyForm.classList.contains('active')) {
                        replyForm.querySelector('textarea').focus();
                    }
                }
            });
        });
    }
    
    // Cancel reply buttons
    const cancelButtons = document.querySelectorAll('.reply-form-buttons .cancel');
    
    if (cancelButtons.length) {
        cancelButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const replyForm = this.closest('.reply-form');
                
                if (replyForm) {
                    replyForm.classList.remove('active');
                }
            });
        });
    }
    
    // Submit replies
    const submitReplyButtons = document.querySelectorAll('.reply-form-buttons .submit');
    
    if (submitReplyButtons.length) {
        submitReplyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const replyForm = this.closest('.reply-form');
                
                if (replyForm) {
                    const textarea = replyForm.querySelector('textarea');
                    const replyText = textarea.value.trim();
                    
                    if (replyText) {
                        // Get parent comment
                        const parentComment = replyForm.closest('.comment-content');
                        
                        // Create new reply
                        createReply(parentComment, replyText);
                        
                        // Clear textarea and hide form
                        textarea.value = '';
                        replyForm.classList.remove('active');
                    }
                }
            });
        });
    }
    
    // Upvote and downvote functionality
    const voteButtons = document.querySelectorAll('.comment-action.upvote, .comment-action.downvote');
    
    if (voteButtons.length) {
        voteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const isUpvote = this.classList.contains('upvote');
                const countSpan = this.querySelector('span');
                
                if (this.classList.contains('voted')) {
                    // If already voted, remove vote
                    this.classList.remove('voted');
                    let count = parseInt(countSpan.textContent);
                    countSpan.textContent = count - 1;
                } else {
                    // Add vote
                    this.classList.add('voted');
                    let count = parseInt(countSpan.textContent);
                    countSpan.textContent = count + 1;
                    
                    // If upvoting, remove downvote if exists (and vice versa)
                    const siblingType = isUpvote ? 'downvote' : 'upvote';
                    const siblingButton = this.closest('.comment-actions').querySelector(`.${siblingType}`);
                    
                    if (siblingButton && siblingButton.classList.contains('voted')) {
                        siblingButton.classList.remove('voted');
                        const siblingSpan = siblingButton.querySelector('span');
                        let siblingCount = parseInt(siblingSpan.textContent);
                        siblingSpan.textContent = siblingCount - 1;
                    }
                }
                
                // Animate the counter
                countSpan.classList.add('vote-animate');
                setTimeout(() => {
                    countSpan.classList.remove('vote-animate');
                }, 300);
            });
        });
    }
    
    // Comment form submission
    const commentForm = document.getElementById('commentForm');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('#name');
            const emailInput = this.querySelector('#email');
            const commentInput = this.querySelector('#comment');
            
            if (nameInput.value.trim() && emailInput.value.trim() && commentInput.value.trim()) {
                // Simulate submitting comment
                addNewComment(nameInput.value, commentInput.value);
                
                // Clear form
                nameInput.value = '';
                emailInput.value = '';
                commentInput.value = '';
                
                // Show success message
                showNotification('Your comment has been posted!', 'success');
            }
        });
    }
    
    // Load more comments button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            // Simulate loading delay
            setTimeout(() => {
                // Load more comments (in a real application, this would be an AJAX call)
                loadMoreComments();
                
                // Reset button
                this.innerHTML = 'Load More Comments';
                this.disabled = false;
            }, 1500);
        });
    }
    
    // Function to create a new reply
    function createReply(parentComment, replyText) {
        // Check if replies section exists, if not create it
        let repliesSection = parentComment.querySelector('.comment-replies');
        
        if (!repliesSection) {
            repliesSection = document.createElement('div');
            repliesSection.className = 'comment-replies';
            parentComment.appendChild(repliesSection);
        }
        
        // Create reply HTML
        const replyElement = document.createElement('div');
        replyElement.className = 'comment';
        replyElement.innerHTML = `
            <div class="comment-avatar">
                <img src="images/avatars/user-default.jpg" alt="Your Avatar">
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <div class="comment-author">You</div>
                    <div class="comment-date">Just now</div>
                </div>
                <div class="comment-body">
                    <p>${replyText}</p>
                </div>
                <div class="comment-actions">
                    <div class="comment-action upvote">
                        <i class="fas fa-thumbs-up"></i> <span>0</span>
                    </div>
                    <div class="comment-action downvote">
                        <i class="fas fa-thumbs-down"></i> <span>0</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add to DOM with animation
        replyElement.style.opacity = '0';
        replyElement.style.transform = 'translateY(20px)';
        repliesSection.appendChild(replyElement);
        
        // Trigger animation
        setTimeout(() => {
            replyElement.style.transition = 'all 0.3s ease';
            replyElement.style.opacity = '1';
            replyElement.style.transform = 'translateY(0)';
        }, 10);
        
        // Add event listeners to new vote buttons
        const newVoteButtons = replyElement.querySelectorAll('.comment-action.upvote, .comment-action.downvote');
        
        newVoteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const isUpvote = this.classList.contains('upvote');
                const countSpan = this.querySelector('span');
                
                if (this.classList.contains('voted')) {
                    this.classList.remove('voted');
                    let count = parseInt(countSpan.textContent);
                    countSpan.textContent = count - 1;
                } else {
                    this.classList.add('voted');
                    let count = parseInt(countSpan.textContent);
                    countSpan.textContent = count + 1;
                    
                    const siblingType = isUpvote ? 'downvote' : 'upvote';
                    const siblingButton = this.closest('.comment-actions').querySelector(`.${siblingType}`);
                    
                    if (siblingButton && siblingButton.classList.contains('voted')) {
                        siblingButton.classList.remove('voted');
                        const siblingSpan = siblingButton.querySelector('span');
                        let siblingCount = parseInt(siblingSpan.textContent);
                        siblingSpan.textContent = siblingCount - 1;
                    }
                }
                
                countSpan.classList.add('vote-animate');
                setTimeout(() => {
                    countSpan.classList.remove('vote-animate');
                }, 300);
            });
        });
    }
    
    // Function to add a new comment
    function addNewComment(name, commentText) {
        const commentList = document.querySelector('.comment-list');
        
        if (!commentList) return;
        
        // Create new comment element
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-avatar">
                <img src="images/avatars/user-default.jpg" alt="User Avatar">
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <div class="comment-author">${name}</div>
                    <div class="comment-date">Just now</div>
                </div>
                <div class="comment-body">
                    <p>${commentText}</p>
                </div>
                <div class="comment-actions">
                    <div class="comment-action upvote">
                        <i class="fas fa-thumbs-up"></i> <span>0</span>
                    </div>
                    <div class="comment-action downvote">
                        <i class="fas fa-thumbs-down"></i> <span>0</span>
                    </div>
                    <div class="comment-action reply" data-reply-id="comment-new">
                        <i class="fas fa-reply"></i> Reply
                    </div>
                </div>
                <div class="reply-form" id="reply-form-comment-new">
                    <textarea placeholder="Write your reply..."></textarea>
                    <div class="reply-form-buttons">
                        <button class="cancel">Cancel</button>
                        <button class="submit">Reply</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add to the beginning of the comment list
        commentList.prepend(commentElement);
        
        // Update comment count
        const commentsTitle = document.querySelector('.comments-section h3');
        if (commentsTitle) {
            const currentCount = parseInt(commentsTitle.textContent.match(/\d+/)[0]);
            commentsTitle.textContent = commentsTitle.textContent.replace(/\d+/, currentCount + 1);
        }
        
        // Add event listeners to new elements
        const replyButton = commentElement.querySelector('.comment-action.reply');
        if (replyButton) {
            replyButton.addEventListener('click', function() {
                const replyId = this.getAttribute('data-reply-id');
                const replyForm = document.getElementById(`reply-form-${replyId}`);
                
                if (replyForm) {
                    document.querySelectorAll('.reply-form.active').forEach(form => {
                        if (form !== replyForm) {
                            form.classList.remove('active');
                        }
                    });
                    
                    replyForm.classList.toggle('active');
                    
                    if (replyForm.classList.contains('active')) {
                        replyForm.querySelector('textarea').focus();
                    }
                }
            });
        }
        
        const cancelButton = commentElement.querySelector('.reply-form-buttons .cancel');
        if (cancelButton) {
            cancelButton.addEventListener('click', function(e) {
                e.preventDefault();
                const replyForm = this.closest('.reply-form');
                
                if (replyForm) {
                    replyForm.classList.remove('active');
                }
            });
        }
        
        const submitButton = commentElement.querySelector('.reply-form-buttons .submit');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                const replyForm = this.closest('.reply-form');
                
                if (replyForm) {
                    const textarea = replyForm.querySelector('textarea');
                    const replyText = textarea.value.trim();
                    
                    if (replyText) {
                        const parentComment = replyForm.closest('.comment-content');
                        createReply(parentComment, replyText);
                        textarea.value = '';
                        replyForm.classList.remove('active');
                    }
                }
            });
        }
        
        const voteButtons = commentElement.querySelectorAll('.comment-action.upvote, .comment-action.downvote');
        voteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const isUpvote = this.classList.contains('upvote');
                const countSpan = this.querySelector('span');
                
                if (this.classList.contains('voted')) {
                    this.classList.remove('voted');
                    let count = parseInt(countSpan.textContent);
                    countSpan.textContent = count - 1;
                } else {
                    this.classList.add('voted');
                    let count = parseInt(countSpan.textContent);
                    countSpan.textContent = count + 1;
                    
                    const siblingType = isUpvote ? 'downvote' : 'upvote';
                    const siblingButton = this.closest('.comment-actions').querySelector(`.${siblingType}`);
                    
                    if (siblingButton && siblingButton.classList.contains('voted')) {
                        siblingButton.classList.remove('voted');
                        const siblingSpan = siblingButton.querySelector('span');
                        let siblingCount = parseInt(siblingSpan.textContent);
                        siblingSpan.textContent = siblingCount - 1;
                    }
                }
                
                countSpan.classList.add('vote-animate');
                setTimeout(() => {
                    countSpan.classList.remove('vote-animate');
                }, 300);
            });
        });
        
        // Highlight new comment
        commentElement.classList.add('highlight-comment');
        setTimeout(() => {
            commentElement.classList.remove('highlight-comment');
        }, 3000);
    }
    
    // Function to simulate loading more comments
    function loadMoreComments() {
        const commentList = document.querySelector('.comment-list');
        
        if (!commentList) return;
        
        // Add 3 more comments
        for (let i = 0; i < 3; i++) {
            const randomNames = ['Alex Thompson', 'Taylor Wilson', 'Jordan Parker', 'Casey Morgan', 'Riley Adams'];
            const randomComments = [
                'This review helped me make my decision. Thanks for the detailed analysis!',
                'I was on the fence about this product but after reading your review I\'m convinced it\'s worth the investment.',
                'Have you tested how this performs in low light conditions? That\'s really important for my use case.',
                'The comparison with last year\'s model was especially helpful. I can see the improvements are substantial.',
                'I\'ve had this for a few weeks now and my experience matches your review perfectly.'
            ];
            
            const randomDays = Math.floor(Math.random() * 14) + 1;
            const randomUpvotes = Math.floor(Math.random() * 20);
            const randomDownvotes = Math.floor(Math.random() * 5);
            
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <div class="comment-avatar">
                    <img src="images/avatars/user${Math.floor(Math.random() * 5) + 1}.jpg" alt="User Avatar">
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <div class="comment-author">${randomNames[Math.floor(Math.random() * randomNames.length)]}</div>
                        <div class="comment-date">${randomDays} days ago</div>
                    </div>
                    <div class="comment-body">
                        <p>${randomComments[Math.floor(Math.random() * randomComments.length)]}</p>
                    </div>
                    <div class="comment-actions">
                        <div class="comment-action upvote">
                            <i class="fas fa-thumbs-up"></i> <span>${randomUpvotes}</span>
                        </div>
                        <div class="comment-action downvote">
                            <i class="fas fa-thumbs-down"></i> <span>${randomDownvotes}</span>
                        </div>
                        <div class="comment-action reply" data-reply-id="comment-loaded-${i}">
                            <i class="fas fa-reply"></i> Reply
                        </div>
                    </div>
                    <div class="reply-form" id="reply-form-comment-loaded-${i}">
                        <textarea placeholder="Write your reply..."></textarea>
                        <div class="reply-form-buttons">
                            <button class="cancel">Cancel</button>
                            <button class="submit">Reply</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add with animation
            commentElement.style.opacity = '0';
            commentElement.style.transform = 'translateY(20px)';
            commentList.appendChild(commentElement);
            
            // Stagger animations
            setTimeout(() => {
                commentElement.style.transition = 'all 0.3s ease';
                commentElement.style.opacity = '1';
                commentElement.style.transform = 'translateY(0)';
            }, i * 200);
        }
        
        // Update comment count
        const commentsTitle = document.querySelector('.comments-section h3');
        if (commentsTitle) {
            const currentCount = parseInt(commentsTitle.textContent.match(/\d+/)[0]);
            commentsTitle.textContent = commentsTitle.textContent.replace(/\d+/, currentCount + 3);
        }
        
        // Hide load more button if we've "loaded all comments"
        if (Math.random() > 0.3) {  // 70% chance to hide the button
            const loadMoreContainer = document.querySelector('.load-more-container');
            if (loadMoreContainer) {
                loadMoreContainer.innerHTML = '<p>No more comments to load</p>';
            }
        }
    }
    
    // Function to show notification
    function showNotification(message, type = 'info') {
        // Check if notification container exists, if not create it
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Show animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
        
        // Add close button functionality
        const closeButton = notification.querySelector('.notification-close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
        }
    }
    
    // Remove loading placeholders after content loads
    setTimeout(() => {
        const placeholders = document.querySelectorAll('.comment-placeholder');
        
        if (placeholders.length) {
            placeholders.forEach((placeholder, index) => {
                setTimeout(() => {
                    placeholder.style.opacity = '0';
                    setTimeout(() => {
                        placeholder.remove();
                    }, 300);
                }, index * 200);
            });
        }
    }, 2000);
});

// Add CSS for new elements
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for notification system and other dynamic elements
    const styleElement = document.createElement('style');
    
    styleElement.textContent = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .notification {
            padding: 12px 15px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            min-width: 300px;
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification.success {
            border-left: 4px solid var(--success-color, #10b981);
        }
        
        .notification.info {
            border-left: 4px solid var(--primary-color, #3b82f6);
        }
        
        .notification.error {
            border-left: 4px solid var(--danger-color, #ef4444);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        .notification.success .notification-content i {
            color: var(--success-color, #10b981);
        }
        
        .notification.info .notification-content i {
            color: var(--primary-color, #3b82f6);
        }
        
        .notification.error .notification-content i {
            color: var(--danger-color, #ef4444);
        }
        
        .notification-close {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-light, #9ca3af);
            font-size: 0.9rem;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s ease;
        }
        
        .notification-close:hover {
            color: var(--text-dark, #1f2937);
        }
        
        .comment-action.voted.upvote {
            color: var(--success-color, #10b981);
            font-weight: 600;
        }
        
        .comment-action.voted.downvote {
            color: var(--danger-color, #ef4444);
            font-weight: 600;
        }
        
        .vote-animate {
            animation: pulse 0.3s ease;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .highlight-comment {
            background-color: rgba(var(--primary-color-rgb, 59, 130, 246), 0.05);
            animation: highlight 3s ease;
        }
        
        @keyframes highlight {
            0% { background-color: rgba(var(--primary-color-rgb, 59, 130, 246), 0.2); }
            100% { background-color: rgba(var(--primary-color-rgb, 59, 130, 246), 0); }
        }
        
        .load-more-btn {
            padding: 0.75rem 1.5rem;
            background-color: white;
            color: var(--primary-color, #3b82f6);
            border: 1px solid var(--primary-color, #3b82f6);
            border-radius: 4px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .load-more-btn:hover {
            background-color: var(--primary-color, #3b82f6);
            color: white;
        }
        
        .load-more-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    `;
    
    document.head.appendChild(styleElement);
});

// Mobile Menu Swipe Detection
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold && navLinks) {
        // Swipe left - close menu
        navLinks.classList.remove('active');
    } else if (touchEndX > touchStartX + swipeThreshold && navLinks) {
        // Swipe right - open menu
        navLinks.classList.add('active');
    }
}

// Back to Top Button
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopButton.className = 'back-to-top';
document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add active class to nav links based on scroll position
function highlightNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + header.offsetHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelector('.nav-links a[href="#' + sectionId + '"]')?.classList.add('active');
        } else {
            document.querySelector('.nav-links a[href="#' + sectionId + '"]')?.classList.remove('active');
        }
    });
}

// Call highlightNavLinks on scroll
window.addEventListener('scroll', highlightNavLinks);

// Animate elements on scroll
const animatedElements = document.querySelectorAll('.animate-on-scroll');

function checkAnimatedElements() {
    const triggerBottom = window.innerHeight * 0.8;
    
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < triggerBottom) {
            element.classList.add('animated');
        }
    });
}

// Call checkAnimatedElements on scroll
window.addEventListener('scroll', checkAnimatedElements);

// Initial call to check animated elements
checkAnimatedElements();

// Handle scroll indicator click
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
        const featuredSection = document.querySelector('.featured-reviews');
        if (featuredSection) {
            const headerOffset = header.offsetHeight;
            const elementPosition = featuredSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition - headerOffset;
            
            window.scrollBy({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// Filter functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter toggle on mobile
    const filterToggle = document.querySelector('.filter-toggle');
    const filterControls = document.querySelector('.filter-controls');
    
    if (filterToggle && filterControls) {
        filterToggle.addEventListener('click', function() {
            filterControls.classList.toggle('active');
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-times"></i> Hide Filters';
            } else {
                this.innerHTML = '<i class="fas fa-sliders-h"></i> Show Filters';
            }
        });
    }
    
    // Range slider functionality
    const priceRange = document.getElementById('price');
    const priceValues = document.querySelector('.range-values');
    
    if (priceRange && priceValues) {
        const minValueSpan = priceValues.querySelector('span:first-child');
        const maxValueSpan = priceValues.querySelector('span:last-child');
        
        priceRange.addEventListener('input', function() {
            maxValueSpan.textContent = '$' + this.value + (this.value == this.max ? '+' : '');
        });
    }
    
    // Filter buttons functionality
    const applyFilterBtn = document.querySelector('.filter-btn.apply');
    const resetFilterBtn = document.querySelector('.filter-btn.reset');
    const activeFilters = document.querySelector('.active-filters');
    const filterResultsCount = document.querySelector('.filter-results-count');
    
    if (applyFilterBtn && resetFilterBtn) {
        // Apply filters
        applyFilterBtn.addEventListener('click', function() {
            // Get all filter values
            const category = document.getElementById('category').value;
            const brand = document.getElementById('brand').value;
            const price = document.getElementById('price').value;
            const sort = document.getElementById('sort').value;
            const ratingCheckboxes = document.querySelectorAll('input[name="rating"]:checked');
            
            // Clear previous active filters
            if (activeFilters) {
                activeFilters.innerHTML = '';
            }
            
            // Add new filter tags
            if (category) {
                addFilterTag('Category: ' + document.getElementById('category').options[document.getElementById('category').selectedIndex].text);
            }
            
            if (brand) {
                addFilterTag('Brand: ' + document.getElementById('brand').options[document.getElementById('brand').selectedIndex].text);
            }
            
            if (price < 2000) {
                addFilterTag('Max Price: $' + price);
            }
            
            ratingCheckboxes.forEach(function(checkbox) {
                addFilterTag('Rating: ' + checkbox.parentNode.textContent.trim());
            });
            
            // Update results count (this would be dynamic in a real implementation)
            if (filterResultsCount) {
                // Simulate filtering results
                const randomCount = Math.floor(Math.random() * 20) + 1;
                filterResultsCount.textContent = 'Showing ' + randomCount + ' results';
            }
            
            // Add animation to results
            animateResults();
        });
        
        // Reset filters
        resetFilterBtn.addEventListener('click', function() {
            // Reset all filter inputs
            document.getElementById('category').value = '';
            document.getElementById('brand').value = '';
            document.getElementById('price').value = 2000;
            document.querySelectorAll('input[name="rating"]:checked').forEach(function(checkbox) {
                checkbox.checked = false;
            });
            document.getElementById('sort').value = 'latest';
            
            // Reset price range display
            if (priceValues) {
                priceValues.querySelector('span:last-child').textContent = '$2000+';
            }
            
            // Clear active filters
            if (activeFilters) {
                activeFilters.innerHTML = '';
            }
            
            // Reset results count
            if (filterResultsCount) {
                filterResultsCount.textContent = 'Showing all results';
            }
            
            // Reset animation
            animateResults();
        });
    }
    
    // Function to add filter tag
    function addFilterTag(text) {
        if (!activeFilters) return;
        
        const filterTag = document.createElement('div');
        filterTag.className = 'filter-tag';
        filterTag.innerHTML = text + ' <i class="fas fa-times"></i>';
        
        // Add remove functionality
        filterTag.querySelector('i').addEventListener('click', function() {
            filterTag.remove();
        });
        
        activeFilters.appendChild(filterTag);
    }
    
    // Function to animate results when filters change
    function animateResults() {
        const reviewCards = document.querySelectorAll('.review-card');
        if (!reviewCards.length) return;
        
        reviewCards.forEach(function(card, index) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(function() {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }
}); 