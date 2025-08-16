// Dynamic Members Loading for team.html
const API_BASE = 'http://localhost:3000/api';

// Function to create member card HTML
function createMemberCard(member) {
    console.log('Creating member card for:', member); // Debug log
    
    const socialLinks = [];
    if (member.linkedin) socialLinks.push(`<a class="social-link" href="${member.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>`);
    if (member.github) socialLinks.push(`<a class="social-link" href="${member.github}" target="_blank"><i class="fab fa-github"></i></a>`);
    if (member.twitter) socialLinks.push(`<a class="social-link" href="${member.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>`);
    if (member.instagram) socialLinks.push(`<a class="social-link" href="${member.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>`);
    
    // If no social links, add placeholder links
    if (socialLinks.length === 0) {
        socialLinks.push(`<a class="social-link" href="#"><i class="fab fa-linkedin"></i></a>`);
        socialLinks.push(`<a class="social-link" href="#"><i class="fab fa-github"></i></a>`);
        socialLinks.push(`<a class="social-link" href="#"><i class="fab fa-twitter"></i></a>`);
    }
    
    const expertiseTags = member.expertise ? 
        member.expertise.split(',').map(skill => `<span class="expertise-tag">${skill.trim()}</span>`).join('') : 
        '<span class="expertise-tag">Leadership</span>';
    
    return `
        <div class="team-card">
            <div class="member-image">
                <img alt="${member.name}" src="${member.image_path || './images/team/core-team/default.jpg'}" />
                <div class="member-overlay">
                    <div class="social-links">
                        ${socialLinks.join('')}
                    </div>
                </div>
            </div>
            <div class="member-info">
                <h3>${member.name}</h3>
                <p class="member-role">${member.role}</p>
                <p class="member-year">${member.year}</p>
                <p class="member-description">
                    ${member.description || 'Dedicated team member contributing to the success of ACM SVPCET Student Chapter.'}
                </p>
                <div class="member-expertise">
                    ${expertiseTags}
                </div>
            </div>
        </div>
    `;
}

// Function to find existing team section for a session year
function findTeamSection(sessionYear) {
    const allSections = document.querySelectorAll('.team-section');
    
    for (let section of allSections) {
        // Check if section has data-year attribute that matches
        const dataYear = section.getAttribute('data-year');
        if (dataYear && dataYear === sessionYear.split('-')[0]) {
            console.log(`Found existing section with data-year="${dataYear}" for session ${sessionYear}`);
            return section;
        }
        
        // Check if section title contains the session year
        const title = section.querySelector('h2.section-title');
        if (title && title.textContent.includes(sessionYear)) {
            console.log(`Found existing section with title containing "${sessionYear}"`);
            return section;
        }
    }
    
    return null;
}

// Function to load and display dynamic members
async function loadDynamicMembers() {
    try {
        console.log('Loading dynamic members from API...'); // Debug log
        
        const response = await fetch(`${API_BASE}/members`);
        console.log('API Response status:', response.status); // Debug log
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const members = await response.json();
        console.log('Fetched members:', members); // Debug log
        
        if (members.length === 0) {
            console.log('No dynamic members found');
            return;
        }
        
        // Group members by session year
        const membersBySession = {};
        members.forEach(member => {
            if (!membersBySession[member.session_year]) {
                membersBySession[member.session_year] = [];
            }
            membersBySession[member.session_year].push(member);
        });
        
        console.log('Members grouped by session:', membersBySession); // Debug log
        
        // Add dynamic members to the page
        Object.keys(membersBySession).forEach(sessionYear => {
            console.log('Processing session year:', sessionYear); // Debug log
            
            // Find existing section for this session year
            let targetSection = findTeamSection(sessionYear);
            
            // Create new section if it doesn't exist
            if (!targetSection) {
                console.log('Creating new section for session year:', sessionYear); // Debug log
                targetSection = document.createElement('section');
                targetSection.className = 'team-section';
                targetSection.innerHTML = `
                    <div class="container">
                        <div class="section-header">
                            <h2 class="section-title">${sessionYear} ACM Officers</h2>
                            <p class="section-description">The driving force behind our chapter's activities</p>
                        </div>
                        <div class="team-grid">
                        </div>
                    </div>
                `;
                
                // Insert before the first existing team section (at the top)
                const existingSections = document.querySelectorAll('.team-section');
                if (existingSections.length > 0) {
                    existingSections[0].before(targetSection);
                } else {
                    const mainContainer = document.querySelector('main') || document.body;
                    mainContainer.prepend(targetSection);
                }
            }
            
            const teamGrid = targetSection.querySelector('.team-grid');
            console.log('Found team grid:', teamGrid); // Debug log
            
            // Add dynamic members to the grid
            membersBySession[sessionYear].forEach(member => {
                const memberCard = createMemberCard(member);
                teamGrid.insertAdjacentHTML('beforeend', memberCard);
                console.log('Added member card for:', member.name); // Debug log
            });
        });
        
        console.log('Dynamic members loading completed'); // Debug log
        
    } catch (error) {
        console.error('Error loading dynamic members:', error);
        // Show error message on page
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'background: #fee; color: #c33; padding: 10px; margin: 10px; border: 1px solid #fcc; border-radius: 4px;';
        errorDiv.innerHTML = `<strong>Error loading members:</strong> ${error.message}`;
        document.body.insertBefore(errorDiv, document.body.firstChild);
    }
}

// Load dynamic members when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting to load dynamic members...'); // Debug log
    // Load dynamic members
    loadDynamicMembers();
});
