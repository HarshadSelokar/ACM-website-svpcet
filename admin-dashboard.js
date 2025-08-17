// Firebase config (replace with your own from Firebase Console)
// Firebase config (replace with your own from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyDOoWDdtnWL5NrXd__XNkTB0NTjR1R0nMw",
    authDomain: "acm-backend-22e90.firebaseapp.com",
    projectId: "acm-backend-22e90",
    storageBucket: "acm-backend-22e90.appspot.com",
    messagingSenderId: "975303596959",
    appId: "1:975303596959:web:56622d171e34ed6d683baa"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let currentSection = 'dashboard';
const API_BASE = 'http://localhost:3000/api';

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            showSection(section);
        });
    });
}

function showSection(section) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Show content
    document.querySelectorAll('.section-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');

    currentSection = section;

    // Load data based on section
    switch(section) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'members':
            loadMembers();
            break;
        case 'events':
            loadEvents();
            break;
        case 'contacts':
            loadContacts();
            break;
        case 'community-submissions':
            loadCommunitySubmissions();
            break;
    }
}

// Modal functions
// Edit Member logic
let editingMemberId = null;

async function editMember(id) {
    // Fetch member data by ID
    try {
        const response = await fetch(`${API_BASE}/members/${id}`);
        if (!response.ok) throw new Error('Failed to fetch member');
        const member = await response.json();

        // Populate modal fields
            // Sort events by session year (descending, newer first)
            events.sort((a, b) => {
                // Expect session_year format: '2026-27', fallback to year
                const getSessionYear = e => e.session_year || e.year || '';
                // Compare by first 4 digits (YYYY)
                return getSessionYear(b).localeCompare(getSessionYear(a));
            });
        document.getElementById('addMemberModal').style.display = 'flex';
        document.querySelector('#addMemberModal .form-title').textContent = 'Edit Member';
        document.querySelector('#addMemberForm [name="name"]').value = member.name || '';
        document.querySelector('#addMemberForm [name="role"]').value = member.role || '';
        document.querySelector('#addMemberForm [name="year"]').value = member.year || '';
        document.querySelector('#addMemberForm [name="session_year"]').value = member.session_year || '';
        document.querySelector('#addMemberForm [name="description"]').value = member.description || '';
        document.querySelector('#addMemberForm [name="expertise"]').value = member.expertise || '';
        document.querySelector('#addMemberForm [name="linkedin"]').value = member.linkedin || '';
        document.querySelector('#addMemberForm [name="github"]').value = member.github || '';
        document.querySelector('#addMemberForm [name="instagram"]').value = member.instagram || '';
        // Image field left blank for security

        editingMemberId = id;
    } catch (error) {
        alert('Error loading member for edit');
        editingMemberId = null;
    }
}
function showAddMemberForm() {
    document.getElementById('addMemberModal').style.display = 'flex';
}

function showAddEventForm() {
    document.getElementById('addEventModal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    if (modalId === 'addMemberModal') {
        document.getElementById('addMemberForm').reset();
        hideCustomSessionInput('member');
        editingMemberId = null;
        document.querySelector('#addMemberModal .form-title').textContent = 'Add New Member';
    } else if (modalId === 'addEventModal') {
        document.getElementById('addEventForm').reset();
        hideCustomSessionInput('event');
    }
}

// API functions
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE}/dashboard/stats`);
        const stats = await response.json();
        
        document.getElementById('totalMembers').textContent = stats.totalMembers;
        document.getElementById('totalEvents').textContent = stats.totalEvents;
        document.getElementById('upcomingEvents').textContent = stats.upcomingEvents;
        document.getElementById('newContacts').textContent = stats.newContacts;
        document.getElementById('newCommunitySubmissions').textContent = stats.newCommunitySubmissions || 0;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}
 let editingEventId = null;
async function loadMembers() {
    try {
        const response = await fetch(`${API_BASE}/members`);
        const members = await response.json();
        
        const tbody = document.getElementById('membersTableBody');
        tbody.innerHTML = '';
        
        // Edit Event logic
       
window.editEvent = editEvent;
        async function editEvent(id) {
            
            // Fetch event data by ID
            try {
                const response = await fetch(`${API_BASE}/events/${id}`);
                if (!response.ok) throw new Error('Failed to fetch event');
                const event = await response.json();

                // Populate modal fields
                document.getElementById('addEventModal').style.display = 'flex';
                document.querySelector('#addEventModal .form-title').textContent = 'Edit Event';
                document.querySelector('#addEventForm [name="title"]').value = event.title || '';
                document.querySelector('#addEventForm [name="category"]').value = event.category || '';
                document.querySelector('#addEventForm [name="status"]').value = event.status || '';
                document.querySelector('#addEventForm [name="event_date"]').value = event.event_date ? event.event_date.split('T')[0] : '';
                document.querySelector('#addEventForm [name="event_time"]').value = event.event_time || '';
                document.querySelector('#addEventForm [name="location"]').value = event.location || '';
                document.querySelector('#addEventForm [name="duration"]').value = event.duration || '';
                document.querySelector('#addEventForm [name="description"]').value = event.description || '';
                document.querySelector('#addEventForm [name="year"]').value = event.year || '';
                    document.querySelector('#addEventForm [name="session_year"]').value = event.session_year || event.year || '';
                document.querySelector('#addEventForm [name="event_page_url"]').value = event.event_page_url || '';
                // Image field left blank for security

                editingEventId = id;
            } catch (error) {
                alert('Error loading event for edit');
                editingEventId = null;
            }
        }
        members.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${member.image_path || './images/team/core-team/default.jpg'}" 
                         alt="${member.name}" class="image-preview">
                </td>
                <td>${member.name}</td>
                <td>${member.role}</td>
                <td>${member.year}</td>
                <td>${member.session_year}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-sm" onclick="editMember(${member.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteMember(${member.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading members:', error);
    }
}

async function loadEvents() {
    try {
        const response = await fetch(`${API_BASE}/events`);
        const events = await response.json();
        
        const tbody = document.getElementById('eventsTableBody');
        tbody.innerHTML = '';
        
        // Group events by session year
        const grouped = {};
        events.forEach(event => {
            const session = event.session_year || event.year || 'Unknown';
            if (!grouped[session]) grouped[session] = [];
            grouped[session].push(event);
        });

        // Sort session years descending (newest first)
        const sessions = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
        tbody.innerHTML = '';
        sessions.forEach(session => {
            // Add session header row
            const headerRow = document.createElement('tr');
            headerRow.className = 'session-header-row';
            headerRow.innerHTML = `<td colspan="7" style="font-weight:bold;background:#f3f4f6;">Session: ${session}</td>`;
            tbody.appendChild(headerRow);
            // Add event rows for this session
            grouped[session].forEach(event => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <img src="${event.image_path || './images/events/default.jpg'}" 
                             alt="${event.title}" class="image-preview">
                    </td>
                    <td>${event.title}</td>
                    <td>${event.category}</td>
                    <td>
                        <select class="status-select" onchange="window.updateEventStatus(${event.id}, this.value)">
                            <option value="upcoming" ${event.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
                            <option value="completed" ${event.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </td>
                    <td>${new Date(event.event_date).toLocaleDateString()}</td>
                    <td>${session}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-secondary btn-sm" onclick="editEvent(${event.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteEvent(${event.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });
// Update event status from dashboard
async function updateEventStatus(id, status) {
    try {
        const response = await fetch(`${API_BASE}/events/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });
        if (response.ok) {
            loadEvents();
            loadDashboardStats();
        } else {
            alert('Failed to update status');
        }
    } catch (error) {
        alert('Error updating status');
    }
}
window.updateEventStatus = updateEventStatus;
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

async function loadContacts() {
    try {
        const response = await fetch(`${API_BASE}/contact-submissions`);
        const contacts = await response.json();
        
        const tbody = document.getElementById('contactsTableBody');
        tbody.innerHTML = '';
        
        contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.first_name} ${contact.last_name}</td>
                <td>${contact.email}</td>
                <td>${contact.subject}</td>
                <td><span class="status-badge status-${contact.status}">${contact.status}</span></td>
                <td>${new Date(contact.created_at).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-sm" onclick="viewContact(${contact.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-success btn-sm" onclick="updateContactStatus(${contact.id}, 'read')">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteContact(${contact.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

// Load community submissions
async function loadCommunitySubmissions() {
    try {
        const response = await fetch(`${API_BASE}/community-submissions`);
        const submissions = await response.json();
        
        const tableBody = document.getElementById('communitySubmissionsTableBody');
        tableBody.innerHTML = '';
        
        submissions.forEach(submission => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${submission.fullname}</td>
                <td>${submission.email}</td>
                <td>${submission.rollno}</td>
                <td>${submission.year}</td>
                <td>${submission.branch}</td>
                <td>
                    <select class="status-select" onchange="updateCommunitySubmissionStatus(${submission.id}, this.value)">
                        <option value="new" ${submission.status === 'new' ? 'selected' : ''}>New</option>
                        <option value="contacted" ${submission.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                        <option value="joined" ${submission.status === 'joined' ? 'selected' : ''}>Joined</option>
                    </select>
                </td>
                <td>${new Date(submission.created_at).toLocaleDateString('en-IN')}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteCommunitySubmission(${submission.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading community submissions:', error);
    }
}

// Update community submission status
async function updateCommunitySubmissionStatus(id, status) {
    try {
        const response = await fetch(`${API_BASE}/community-submissions/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            showNotification('Status updated successfully', 'success');
            loadDashboardStats(); // Refresh dashboard stats
        } else {
            showNotification('Failed to update status', 'error');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showNotification('Failed to update status', 'error');
    }
}

// Delete community submission
async function deleteCommunitySubmission(id) {
    if (!confirm('Are you sure you want to delete this submission?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/community-submissions/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Submission deleted successfully', 'success');
            loadCommunitySubmissions();
            loadDashboardStats();
        } else {
            showNotification('Failed to delete submission', 'error');
        }
    } catch (error) {
        console.error('Error deleting submission:', error);
        showNotification('Failed to delete submission', 'error');
    }
}

// Export community submissions to Excel
async function exportCommunitySubmissions() {
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    
    if (fromDate && toDate && fromDate > toDate) {
        showNotification('From date cannot be after to date', 'error');
        return;
    }
    
    try {
        let url = `${API_BASE}/community-submissions/export`;
        const params = new URLSearchParams();
        
        if (fromDate) params.append('fromDate', fromDate);
        if (toDate) params.append('toDate', toDate);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url);
        
        if (response.ok) {
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `community_submissions_${fromDate || 'all'}_${toDate || new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
            
            showNotification('Export completed successfully', 'success');
        } else {
            const errorData = await response.json();
            showNotification(errorData.error || 'Export failed', 'error');
        }
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Export failed', 'error');
    }
}

// Form submissions
document.getElementById('addMemberForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch(`${API_BASE}/members`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Member added successfully!');
            closeModal('addMemberModal');
            loadMembers();
            loadDashboardStats();
        } else {
            alert('Error adding member');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding member');
    }
});

document.getElementById('addEventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
        // If session_year exists, use it for year
        if (formData.get('session_year')) {
            formData.set('year', formData.get('session_year'));
        }
    
    try {
        const response = await fetch(`${API_BASE}/events`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Event added successfully!');
            closeModal('addEventModal');
            loadEvents();
            loadDashboardStats();
        } else {
            alert('Error adding event');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding event');
    }
});

// Delete functions
async function deleteMember(id) {
    if (confirm('Are you sure you want to delete this member?')) {
        try {
            const response = await fetch(`${API_BASE}/members/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Member deleted successfully!');
                loadMembers();
                loadDashboardStats();
            } else {
                alert('Error deleting member');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting member');
        }
    }
}

async function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        try {
            const response = await fetch(`${API_BASE}/events/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Event deleted successfully!');
                loadEvents();
                loadDashboardStats();
            } else {
                alert('Error deleting event');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting event');
        }
    }
}

async function deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact submission?')) {
        try {
            const response = await fetch(`${API_BASE}/contact-submissions/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Contact submission deleted successfully!');
                loadContacts();
                loadDashboardStats();
            } else {
                alert('Error deleting contact submission');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting contact submission');
        }
    }
}

// Contact functions
async function viewContact(id) {
    try {
        const response = await fetch(`${API_BASE}/contact-submissions`);
        const contacts = await response.json();
        const contact = contacts.find(c => c.id === id);
        
        if (contact) {
            document.getElementById('contactDetails').innerHTML = `
                <div style="padding: 1rem 0;">
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <p>${contact.first_name} ${contact.last_name}</p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <p>${contact.email}</p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone</label>
                        <p>${contact.phone || 'Not provided'}</p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Subject</label>
                        <p>${contact.subject}</p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Message</label>
                        <p>${contact.message}</p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Newsletter Subscription</label>
                        <p>${contact.newsletter ? 'Yes' : 'No'}</p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date Submitted</label>
                        <p>${new Date(contact.created_at).toLocaleString()}</p>
                    </div>
                </div>
            `;
            document.getElementById('viewContactModal').style.display = 'flex';
        }
    } catch (error) {
        console.error('Error loading contact details:', error);
    }
}

async function updateContactStatus(id, status) {
    try {
        const response = await fetch(`${API_BASE}/contact-submissions/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            alert('Status updated successfully!');
            loadContacts();
            loadDashboardStats();
        } else {
            alert('Error updating status');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating status');
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Logout button functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            auth.signOut();
        });
    }
    // Firebase Auth State Observer
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            document.querySelector('.dashboard-container').style.display = 'block';
            document.getElementById('login-container').style.display = 'none';
            loadDashboardStats();
            loadSessionYears();
            setupNavigation();
        } else {
            // User is signed out
            document.querySelector('.dashboard-container').style.display = 'none';
            document.getElementById('login-container').style.display = 'flex';
        }
    });

    // Login form submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('login-error');
            errorDiv.style.display = 'none';
            auth.signInWithEmailAndPassword(email, password)
                .catch(function(error) {
                    errorDiv.textContent = error.message;
                    errorDiv.style.display = 'block';
                });
        });
    }
});

// Session year management functions
function showCustomSessionInput(type) {
    const inputDiv = document.getElementById(`customSessionInput${type.charAt(0).toUpperCase() + type.slice(1)}`);
    inputDiv.style.display = 'block';
}

function hideCustomSessionInput(type) {
    const inputDiv = document.getElementById(`customSessionInput${type.charAt(0).toUpperCase() + type.slice(1)}`);
    inputDiv.style.display = 'none';
    const input = document.getElementById(`newSessionYear${type.charAt(0).toUpperCase() + type.slice(1)}`);
    input.value = '';
}

function addNewSessionYear(type) {
    const input = document.getElementById(`newSessionYear${type.charAt(0).toUpperCase() + type.slice(1)}`);
    const newValue = input.value.trim();
    
    if (!newValue) {
        alert('Please enter a session year');
        return;
    }
    
    // Validate format
    // Both members and events: expect format like "2026-27"
    if (!/^\d{4}-\d{2}$/.test(newValue)) {
        alert('Please enter session year in format: YYYY-YY (e.g., 2026-27)');
        return;
    }
    
    const selectId = type === 'member' ? 'memberSessionYear' : 'eventSessionYear';
    const select = document.getElementById(selectId);
    
    // Check if option already exists
    const existingOption = Array.from(select.options).find(option => option.value === newValue);
    if (existingOption) {
        alert('This session year already exists in the dropdown');
        return;
    }
    
    // Add new option
    const newOption = document.createElement('option');
    newOption.value = newValue;
    newOption.textContent = newValue;
    select.appendChild(newOption);
    
    // Select the new option
    select.value = newValue;
    
    // Hide the input
    hideCustomSessionInput(type);
    
    // Save to localStorage for persistence
    saveSessionYears();
}

function saveSessionYears() {
    const memberYears = Array.from(document.getElementById('memberSessionYear').options)
        .map(option => option.value)
        .filter(value => value !== '');
    
    const eventYears = Array.from(document.getElementById('eventYear').options)
        .map(option => option.value)
        .filter(value => value !== '');
    
    localStorage.setItem('acm_member_session_years', JSON.stringify(memberYears));
    localStorage.setItem('acm_event_years', JSON.stringify(eventYears));
}

function loadSessionYears() {
    // Load member session years
    const savedMemberYears = localStorage.getItem('acm_member_session_years');
    if (savedMemberYears) {
        const memberYears = JSON.parse(savedMemberYears);
        const memberSelect = document.getElementById('memberSessionYear');
        
        // Clear existing options except the first one
        memberSelect.innerHTML = '<option value="">Select Session</option>';
        
        // Add saved years
        memberYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            memberSelect.appendChild(option);
        });
    }
    
    // Load event session years
    const savedEventYears = localStorage.getItem('acm_event_years');
    if (savedEventYears) {
        const eventYears = JSON.parse(savedEventYears);
        const eventSelect = document.getElementById('eventSessionYear');
        // Clear existing options except the first one
        eventSelect.innerHTML = '<option value="">Select Session</option>';
        // Add saved years
        eventYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            eventSelect.appendChild(option);
        });
    }
}

// Close modals when clicking outside
document.querySelectorAll('.form-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.display = 'none';
        }
    });
});
