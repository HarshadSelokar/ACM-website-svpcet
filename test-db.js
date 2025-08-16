const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabase() {
    try {
        console.log('Testing database connection...');
        
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'anuj@123',
            database: process.env.DB_NAME || 'acm_dashboard',
            multipleStatements: true
        });
        
        // Test connection
        const connection = await pool.getConnection();
        console.log('✅ Database connection successful');
        
        // Check if members table exists
        const [tables] = await connection.execute('SHOW TABLES LIKE "members"');
        if (tables.length === 0) {
            console.log('❌ Members table does not exist');
        } else {
            console.log('✅ Members table exists');
            
            // Check members count
            const [members] = await connection.execute('SELECT COUNT(*) as count FROM members');
            console.log(`📊 Total members in database: ${members[0].count}`);
            
            // Show all members
            const [allMembers] = await connection.execute('SELECT * FROM members');
            console.log('📋 All members:', allMembers);
        }
        
        connection.release();
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Database test failed:', error);
        process.exit(1);
    }
}

testDatabase();
