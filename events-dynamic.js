// Dynamic Events Loading for events.html
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

// Function to create event card HTML
function createEventCard(event) {
    const statusClass = event.status === 'upcoming' ? 'upcoming' : 'completed';
    const statusText = event.status === 'upcoming' ? 'Upcoming' : 'Completed';
    
    return `
        <div class="event-card" data-category="${event.category}" data-year="${event.year}">
            <div class="event-image">
                <img src="${event.image_path || './images/events/default.jpg'}" alt="${event.title}" />
                <div class="event-category">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</div>
                <div class="event-status ${statusClass}">${statusText}</div>
            </div>
            <div class="event-content">
                <div class="event-meta">
                    <div class="event-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${formatDate(event.event_date)}
                    </div>
                    ${event.event_time ? `
                    <div class="event-time">
                        <i class="fas fa-clock"></i>
                        ${event.event_time}
                    </div>
                    ` : ''}
                    ${event.duration ? `
                    <div class="event-time">
                        <i class="fas fa-clock"></i>
                        ${event.duration}
                    </div>
                    ` : ''}
                    ${event.location ? `
                    <div class="event-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${event.location}
                    </div>
                    ` : ''}
                </div>
                <h3>${event.title}</h3>
                <p>${event.description || 'No description available.'}</p>
                ${event.event_page_url ? `
                <a href="${event.event_page_url}" class="btn btn-outline">
                    View Details
                    <i class="fas fa-chevron-right"></i>
                </a>
                ` : `
                <button class="btn btn-outline" onclick="showEventDetails('${event.title}', '${event.description || 'No description available.'}', '${event.event_date}', '${event.event_time || ''}', '${event.location || ''}', '${event.duration || ''}')">
                    View Details
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

// Function to load and display dynamic events
async function loadDynamicEvents() {
    try {
        const response = await fetch(`${API_BASE}/events`);
        const events = await response.json();
        
        if (events.length === 0) {
            console.log('No dynamic events found');
            return;
        }
        
        // Group events by year
        const eventsByYear = {};
        events.forEach(event => {
            if (!eventsByYear[event.year]) {
                eventsByYear[event.year] = [];
            }
            eventsByYear[event.year].push(event);
        });
        
        // Add dynamic events to the page
        Object.keys(eventsByYear).forEach(year => {
            let yearSection = document.querySelector(`[data-year="${year}"]`);
            
            // Create year section if it doesn't exist
            if (!yearSection) {
                yearSection = document.createElement('div');
                yearSection.className = 'events-year-section';
                yearSection.setAttribute('data-year', year);
                yearSection.innerHTML = `<h2>SESSION ${year}</h2><div class="events-grid" id="events-grid-${year}"></div>`;
                
                // Insert after the last existing year section or at the beginning
                const existingSections = document.querySelectorAll('.events-year-section');
                if (existingSections.length > 0) {
                    existingSections[existingSections.length - 1].after(yearSection);
                } else {
                    const eventsSection = document.querySelector('.events-section .container');
                    eventsSection.appendChild(yearSection);
                }
            }
            
            const eventsGrid = yearSection.querySelector('.events-grid');
            
            // Add dynamic events to the grid
            eventsByYear[year].forEach(event => {
                const eventCard = createEventCard(event);
                eventsGrid.insertAdjacentHTML('beforeend', eventCard);
            });
        });
        
        // Update year filter options
        updateYearFilter();
        
        // Re-apply filters to include new events
        if (typeof applyFilters === 'function') {
            applyFilters();
        }
        
    } catch (error) {
        console.error('Error loading dynamic events:', error);
    }
}

// Function to update year filter dropdown
function updateYearFilter() {
    const yearFilter = document.getElementById('year-filter');
    if (!yearFilter) return;
    
    // Get all unique years from event cards
    const eventCards = document.querySelectorAll('.event-card');
    const years = new Set();
    
    eventCards.forEach(card => {
        const year = card.getAttribute('data-year');
        if (year) {
            years.add(year);
        }
    });
    
    // Add new years to the filter
    years.forEach(year => {
        const existingOption = yearFilter.querySelector(`option[value="${year}"]`);
        if (!existingOption) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        }
    });
}

// Load dynamic events when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load dynamic events
    loadDynamicEvents();
    
    // Wait a bit for dynamic events to load, then re-apply filters
    setTimeout(() => {
        if (typeof applyFilters === 'function') {
            applyFilters();
        }
    }, 1000);
});
