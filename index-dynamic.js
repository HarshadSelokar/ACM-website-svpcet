// Dynamic Events Loading for index.html homepage
const API_BASE = 'http://localhost:3000/api';

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to create event card HTML for homepage
function createHomepageEventCard(event) {
    return `
        <div class="event-card">
            <div class="event-image">
                <img src="${event.image_path || './images/events/default.jpg'}" alt="${event.title}">
                <div class="event-category">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</div>
            </div>
            <div class="event-content">
                <div class="event-date">
                    <i class="fas fa-calendar-alt"></i>
                    ${formatDate(event.event_date)}
                </div>
                <h3>${event.title}</h3>
                <p>${event.event_short_description || event.short_description }</p>
                ${event.event_page_url ? `
                <button onclick="window.location.href='${event.event_page_url}'" class="btn btn-outline">
                    Learn More
                    <i class="fas fa-chevron-right"></i>
                </button>
                ` : `
                <button onclick="showEventDetails('${event.title}', '${event.description || 'No description available.'}', '${event.event_date}', '${event.event_time || ''}', '${event.location || ''}', '${event.duration || ''}')" class="btn btn-outline">
                    Learn More
                    <i class="fas fa-chevron-right"></i>
                </button>
                `}
            </div>
        </div>
    `;
}

// Function to show event details in a modal
function showEventDetails(title, description, date, time, location, duration) {
    const modal = document.createElement('div');
    modal.className = 'event-modal-overlay';
    modal.innerHTML = `
        <div class="event-modal">
            <div class="event-modal-header">
                <h3>${title}</h3>
                <button class="close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="event-modal-content">
                <div class="event-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${formatDate(date)}</span>
                    </div>
                    ${time ? `
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${time}</span>
                    </div>
                    ` : ''}
                    ${location ? `
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${location}</span>
                    </div>
                    ` : ''}
                    ${duration ? `
                    <div class="detail-item">
                        <i class="fas fa-hourglass-half"></i>
                        <span>${duration}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="event-description">
                    <h4>Description</h4>
                    <p>${description}</p>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    if (!document.getElementById('event-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'event-modal-styles';
        styles.textContent = `
            .event-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .event-modal {
                background: white;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }
            .event-modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .event-modal-header h3 {
                margin: 0;
                color: #1e293b;
            }
            .close-modal {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #64748b;
            }
            .event-modal-content {
                padding: 1.5rem;
            }
            .event-details {
                margin-bottom: 1.5rem;
            }
            .detail-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
                color: #64748b;
            }
            .detail-item i {
                width: 16px;
                color: #3b82f6;
            }
            .event-description h4 {
                margin-bottom: 0.5rem;
                color: #1e293b;
            }
            .event-description p {
                line-height: 1.6;
                color: #475569;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Function to load and display upcoming events on homepage
async function loadUpcomingEvents() {
    try {
        const response = await fetch(`${API_BASE}/events/upcoming`);
        const upcomingEvents = await response.json();
        
        if (upcomingEvents.length === 0) {
            console.log('No upcoming events found');
            return;
        }
        
        const eventsGrid = document.querySelector('.events-preview .events-grid');
        if (!eventsGrid) {
            console.log('Events grid not found');
            return;
        }
        
        // Add upcoming events to the beginning of the grid
        upcomingEvents.forEach(event => {
            const eventCard = createHomepageEventCard(event);
            eventsGrid.insertAdjacentHTML('afterbegin', eventCard);
        });
        
        // Limit to 6 total events (3 static + 3 dynamic max)
        const allEventCards = eventsGrid.querySelectorAll('.event-card');
        if (allEventCards.length > 6) {
            // Remove excess cards from the end (keep the newest ones)
            for (let i = 6; i < allEventCards.length; i++) {
                allEventCards[i].remove();
            }
        }
        
    } catch (error) {
        console.error('Error loading upcoming events:', error);
    }
}

// Load upcoming events when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load upcoming events
    loadUpcomingEvents();
});
