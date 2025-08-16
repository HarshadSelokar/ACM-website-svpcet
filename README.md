# ACM SVPCET Admin Dashboard

A comprehensive admin dashboard for managing ACM SVPCET Student Chapter website content including members, events, and contact form submissions.

## Features

### 🎯 Dashboard Overview
- Real-time statistics for members, events, and contact submissions
- Quick action buttons for common tasks
- Modern, responsive design

### 👥 Member Management
- Add new team members with profile images
- Edit existing member information
- Delete members
- Organize by session years (2023-24, 2024-25, 2025-26)
- Support for social media links (LinkedIn, GitHub, Twitter, Instagram)

### 📅 Event Management
- Add upcoming and completed events
- Upload event images
- Set event categories (Workshop, Competition, Seminar, Hackathon, Webinar)
- Manage event details (date, time, location, duration)
- Link to detailed event pages

### 📧 Contact Form Management
- View all contact form submissions
- Mark messages as read/replied
- Delete submissions
- Track newsletter subscriptions

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **File Upload**: Multer
- **Styling**: Custom CSS with modern design

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd a-v-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Create a MySQL database named `acm_dashboard`
   - Update the database configuration in `config.env`:
     ```
     DB_HOST=localhost
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=acm_dashboard
     PORT=3000
     ```

4. **Start the server**
   ```bash
   npm start
   ```
   or for development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Access the admin dashboard**
   - Open your browser and go to `http://localhost:3000/admin`
   - The main website remains accessible at `http://localhost:3000`

## Database Schema

### Members Table
```sql
CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    year VARCHAR(50) NOT NULL,
    description TEXT,
    expertise TEXT,
    image_path VARCHAR(500),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    twitter VARCHAR(255),
    instagram VARCHAR(255),
    session_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    status ENUM('upcoming', 'completed') NOT NULL,
    event_date DATE NOT NULL,
    event_time VARCHAR(100),
    location VARCHAR(255),
    duration VARCHAR(100),
    image_path VARCHAR(500),
    event_page_url VARCHAR(500),
    year VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Contact Submissions Table
```sql
CREATE TABLE contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    newsletter BOOLEAN DEFAULT FALSE,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:sessionYear` - Get members by session year
- `POST /api/members` - Add new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Events
- `GET /api/events` - Get all events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/completed` - Get completed events
- `POST /api/events` - Add new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Contact Submissions
- `GET /api/contact-submissions` - Get all submissions
- `POST /api/contact-submissions` - Submit contact form
- `PUT /api/contact-submissions/:id/status` - Update submission status
- `DELETE /api/contact-submissions/:id` - Delete submission

### Dashboard Stats
- `GET /api/dashboard/stats` - Get dashboard statistics

## Usage

### Adding a Member
1. Navigate to the Members section
2. Click "Add Member"
3. Fill in the required information:
   - Name and Role
   - Year and Session Year
   - Description and Expertise
   - Social media links (optional)
   - Upload profile image
4. Click "Add Member"

### Adding an Event
1. Navigate to the Events section
2. Click "Add Event"
3. Fill in the event details:
   - Title and Description
   - Category and Status (upcoming/completed)
   - Date, Time, and Location
   - Upload event image
   - Link to detailed page (optional)
4. Click "Add Event"

### Managing Contact Submissions
1. Navigate to the Contact Forms section
2. View all submissions with their status
3. Click the eye icon to view full details
4. Mark as read or delete as needed

## File Structure

```
a-v-1/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── config.env               # Environment configuration
├── admin-dashboard.html     # Admin dashboard interface
├── admin-dashboard.css      # Dashboard styles
├── admin-dashboard.js       # Dashboard functionality
├── uploads/                 # Uploaded images
├── index.html              # Main website
├── team.html               # Team page
├── events.html             # Events page
├── contact.html            # Contact page
└── ...                     # Other website files
```

## Integration with Website

### Dynamic Member Display
Members added through the dashboard will automatically appear on the team page under their respective session year sections.

### Dynamic Event Display
- Upcoming events will appear on the homepage under "Upcoming & Recent Events"
- All events will be displayed on the events page with proper filtering

### Contact Form Integration
The contact form on the website automatically submits to the backend and appears in the admin dashboard.

## Security Considerations

- File upload validation (images only, 5MB limit)
- SQL injection prevention with parameterized queries
- CORS configuration for API access
- Input validation and sanitization

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `config.env`
   - Ensure database `acm_dashboard` exists

2. **File Upload Issues**
   - Ensure `uploads/` directory exists and is writable
   - Check file size (max 5MB)
   - Verify file type (images only)

3. **CORS Errors**
   - Ensure the frontend is accessing the correct API URL
   - Check that the server is running on the expected port

### Development Tips

- Use `npm run dev` for development with auto-restart
- Check browser console for JavaScript errors
- Monitor server logs for backend issues
- Use browser dev tools to inspect API requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the ACM SVPCET team or create an issue in the repository.
