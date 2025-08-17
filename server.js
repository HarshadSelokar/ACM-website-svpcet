const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));
app.use('/uploads', express.static('uploads'));

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'anuj@123',
  database: process.env.DB_NAME || 'acm_dashboard'
};

    // Create database connection pool
    const pool = mysql.createPool({
        ...dbConfig,
        multipleStatements: true
    });

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Database initialization
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create members table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        year VARCHAR(50) NOT NULL,
        description TEXT,
        expertise TEXT,
        image_path VARCHAR(500),
        linkedin VARCHAR(255),
        github VARCHAR(255),
        instagram VARCHAR(255),
        session_year VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create events table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS events (
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
      )
    `);

    // Create contact submissions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
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
      )
    `);

    // Create admin users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role ENUM('admin', 'super_admin') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create community join submissions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS community_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        rollno VARCHAR(100) NOT NULL,
        year VARCHAR(50) NOT NULL,
        branch VARCHAR(100) NOT NULL,
        status ENUM('new', 'contacted', 'joined') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// API Routes

// Members API
app.get('/api/members', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM members ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

app.get('/api/members/:sessionYear', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM members WHERE session_year = ? ORDER BY created_at DESC', [req.params.sessionYear]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

app.post('/api/members', upload.single('image'), async (req, res) => {
  try {
  const { name, role, year, description, expertise, linkedin, github, instagram, session_year } = req.body;
    const image_path = req.file ? `/uploads/${req.file.filename}` : null;
    
    const [result] = await pool.execute(
  'INSERT INTO members (name, role, year, description, expertise, image_path, linkedin, github, instagram, session_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  [name, role, year, description, expertise, image_path, linkedin, github, instagram, session_year]
    );
    
    res.json({ id: result.insertId, message: 'Member added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add member' });
  }
});

app.put('/api/members/:id', upload.single('image'), async (req, res) => {
  try {
  const { name, role, year, description, expertise, linkedin, github, instagram, session_year } = req.body;
    const image_path = req.file ? `/uploads/${req.file.filename}` : req.body.image_path;
    
    await pool.execute(
  'UPDATE members SET name=?, role=?, year=?, description=?, expertise=?, image_path=?, linkedin=?, github=?, instagram=?, session_year=? WHERE id=?',
  [name, role, year, description, expertise, image_path, linkedin, github, instagram, session_year, req.params.id]
    );
    
    res.json({ message: 'Member updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update member' });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM members WHERE id = ?', [req.params.id]);
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

// Events API
app.put('/api/events/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.execute('UPDATE events SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Event status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event status' });
  }
});

app.get('/api/events', async (req, res) => {
// Get single event by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});
  try {
    const [rows] = await pool.execute('SELECT * FROM events ORDER BY event_date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/api/events/upcoming', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM events WHERE status = "upcoming" ORDER BY event_date ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming events' });
  }
});

app.get('/api/events/completed', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM events WHERE status = "completed" ORDER BY event_date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch completed events' });
  }
});

app.post('/api/events', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, status, event_date, event_time, location, duration, event_page_url, year } = req.body;
    const image_path = req.file ? `/uploads/${req.file.filename}` : null;
    
    const [result] = await pool.execute(
      'INSERT INTO events (title, description, category, status, event_date, event_time, location, duration, image_path, event_page_url, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, category, status, event_date, event_time, location, duration, image_path, event_page_url, year]
    );
    
    res.json({ id: result.insertId, message: 'Event added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add event' });
  }
});

app.put('/api/events/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, status, event_date, event_time, location, duration, event_page_url, year } = req.body;
    const image_path = req.file ? `/uploads/${req.file.filename}` : req.body.image_path;
    
    await pool.execute(
      'UPDATE events SET title=?, description=?, category=?, status=?, event_date=?, event_time=?, location=?, duration=?, image_path=?, event_page_url=?, year=? WHERE id=?',
      [title, description, category, status, event_date, event_time, location, duration, image_path, event_page_url, year, req.params.id]
    );
    
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Contact Submissions API
app.get('/api/contact-submissions', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contact_submissions ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
});

app.post('/api/contact-submissions', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, subject, message, newsletter } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO contact_submissions (first_name, last_name, email, phone, subject, message, newsletter) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, subject, message, newsletter === 'true']
    );
    
    res.json({ id: result.insertId, message: 'Contact submission received successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

app.put('/api/contact-submissions/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.execute('UPDATE contact_submissions SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.delete('/api/contact-submissions/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM contact_submissions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Contact submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact submission' });
  }
});

// Community Join Submissions API
app.get('/api/community-submissions', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM community_submissions ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch community submissions' });
  }
});

app.post('/api/community-submissions', async (req, res) => {
  try {
    const { fullname, email, rollno, year, branch } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO community_submissions (fullname, email, rollno, year, branch) VALUES (?, ?, ?, ?, ?)',
      [fullname, email, rollno, year, branch]
    );
    
    res.json({ id: result.insertId, message: 'Community submission received successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit community form' });
  }
});

app.put('/api/community-submissions/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.execute('UPDATE community_submissions SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Community submission status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update community submission status' });
  }
});

app.delete('/api/community-submissions/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM community_submissions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Community submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete community submission' });
  }
});

// Excel Export for Community Submissions
app.get('/api/community-submissions/export', async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    
    let query = 'SELECT * FROM community_submissions';
    let params = [];
    
    if (fromDate && toDate) {
      query += ' WHERE DATE(created_at) BETWEEN ? AND ?';
      params = [fromDate, toDate];
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await pool.execute(query, params);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No data found for the specified date range' });
    }
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows.map(row => ({
      'ID': row.id,
      'Full Name': row.fullname,
      'Email': row.email,
      'Roll Number': row.rollno,
      'Year': row.year,
      'Branch': row.branch,
      'Status': row.status,
      'Submitted Date': new Date(row.created_at).toLocaleString('en-IN')
    })));
    
    // Set column widths
    const columnWidths = [
      { wch: 5 },  // ID
      { wch: 20 }, // Full Name
      { wch: 25 }, // Email
      { wch: 15 }, // Roll Number
      { wch: 10 }, // Year
      { wch: 15 }, // Branch
      { wch: 12 }, // Status
      { wch: 20 }  // Submitted Date
    ];
    worksheet['!cols'] = columnWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Community Submissions');
    
    // Generate filename with date range
    const filename = fromDate && toDate 
      ? `community_submissions_${fromDate}_to_${toDate}.xlsx`
      : `community_submissions_all_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Write to buffer and send
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.send(buffer);
    
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export community submissions' });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [memberCount] = await pool.execute('SELECT COUNT(*) as count FROM members');
    const [eventCount] = await pool.execute('SELECT COUNT(*) as count FROM events');
    const [upcomingEventCount] = await pool.execute('SELECT COUNT(*) as count FROM events WHERE status = "upcoming"');
    const [contactCount] = await pool.execute('SELECT COUNT(*) as count FROM contact_submissions WHERE status = "new"');
    const [communityCount] = await pool.execute('SELECT COUNT(*) as count FROM community_submissions WHERE status = "new"');
    
    res.json({
      totalMembers: memberCount[0].count,
      totalEvents: eventCount[0].count,
      upcomingEvents: upcomingEventCount[0].count,
      newContacts: contactCount[0].count,
      newCommunitySubmissions: communityCount[0].count
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Serve admin dashboard
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase();
});
