const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config.env' });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'anuj@123',
    database: process.env.DB_NAME || 'acm_dashboard'
};

async function setupDatabase() {
    let connection;
    
    try {
        // First, connect without database to create it if it doesn't exist
        const { database, ...configWithoutDB } = dbConfig;
        connection = await mysql.createConnection(configWithoutDB);
        
        console.log('Connected to MySQL server...');
        
        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
        console.log(`Database '${database}' created or already exists.`);
        
        // Use the database
        await connection.query(`USE ${database}`);
        
        // Create tables
        console.log('Creating tables...');
        
        // Members table
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
                twitter VARCHAR(255),
                instagram VARCHAR(255),
                session_year VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Members table created');
        
        // Events table
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
        console.log('✓ Events table created');
        
        // Contact submissions table
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
        console.log('✓ Contact submissions table created');
        
        // Admin users table
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
        console.log('✓ Admin users table created');

        // Community submissions table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS community_submissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fullname VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                rollno VARCHAR(50) NOT NULL,
                year VARCHAR(50) NOT NULL,
                branch VARCHAR(255) NOT NULL,
                status ENUM('new', 'contacted', 'joined') DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Community submissions table created');
        
        // Insert sample data
        console.log('Inserting sample data...');
        
        // Sample members
        const sampleMembers = [
            {
                name: 'John Doe',
                role: 'ACM Chair',
                year: '3rd Year',
                description: 'Leading the chapter with vision and dedication.',
                expertise: 'Leadership, Project Management, Full Stack Development',
                session_year: '2025-26'
            }
        ];
        
        for (const member of sampleMembers) {
            await connection.execute(
                'INSERT IGNORE INTO members (name, role, year, description, expertise, session_year) VALUES (?, ?, ?, ?, ?, ?)',
                [member.name, member.role, member.year, member.description, member.expertise, member.session_year]
            );
        }
        console.log('✓ Sample members added');
        
        // Sample events
        const sampleEvents = [
            {
                title: 'Web Development Workshop',
                description: 'Learn modern web development techniques and best practices.',
                category: 'workshop',
                status: 'upcoming',
                event_date: '2025-02-15',
                event_time: '2:00 PM - 4:00 PM',
                location: 'BF-05',
                duration: '2 Hours',
                year: '2025'
            },
            {
                title: 'Coding Competition',
                description: 'Test your programming skills in this competitive coding event.',
                category: 'competition',
                status: 'completed',
                event_date: '2025-01-30',
                event_time: '10:00 AM - 12:00 PM',
                location: 'Computer Lab',
                duration: '2 Hours',
                year: '2025'
            }
        ];
        
        for (const event of sampleEvents) {
            await connection.execute(
                'INSERT IGNORE INTO events (title, description, category, status, event_date, event_time, location, duration, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [event.title, event.description, event.category, event.status, event.event_date, event.event_time, event.location, event.duration, event.year]
            );
        }
        console.log('✓ Sample events added');

        // Insert sample community submissions
        console.log('Inserting sample community submissions...');
        await connection.execute(`
            INSERT IGNORE INTO community_submissions (fullname, email, rollno, year, branch, status) VALUES 
            ('John Doe', 'john.doe@example.com', '2024CS001', '2nd Year', 'Computer Science', 'new'),
            ('Jane Smith', 'jane.smith@example.com', '2024CS002', '3rd Year', 'Computer Science', 'contacted'),
            ('Mike Johnson', 'mike.johnson@example.com', '2024IT001', '1st Year', 'Information Technology', 'joined')
        `);
        console.log('✓ Sample community submissions added');
        
        console.log('\n🎉 Database setup completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Start the server: npm start');
        console.log('2. Access admin dashboard: http://localhost:3000/admin');
        console.log('3. Access main website: http://localhost:3000');
        
    } catch (error) {
        console.error('❌ Error setting up database:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run setup
setupDatabase();
