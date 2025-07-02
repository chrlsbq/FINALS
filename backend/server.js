const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const db = require('./db');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query the user_table for authentication
        const [rows] = await db.execute(
            'SELECT * FROM users_table WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length > 0) {
            const user = rows[0];
            res.json({ 
                success: true, 
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    // Don't send password back to client
                }
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

// Verify user endpoint (optional - for checking if user is still valid)
app.get('/api/verify-user/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const [rows] = await db.execute(
            'SELECT id, username FROM users_table WHERE username = ?',
            [username]
        );

        if (rows.length > 0) {
            res.json({ 
                success: true, 
                user: rows[0] 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
    } catch (error) {
        console.error('User verification error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during user verification' 
        });
    }
});

// Get all users endpoint (for admin purposes)
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, username FROM user_table'
        );
        res.json({ 
            success: true, 
            users: rows 
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching users' 
        });
    }
});

app.post('/api/send-email', async (req, res) =>{
    const {to, subject, message } = req.body;

            try {
            const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
               user: process.env.EMAIL_USER, 
               pass: process.env.EMAIL_PASS,
            },
            tls: {
            rejectUnauthorized: false // ← this allows self-signed certs
               }
            });
             const mailOptions = {
                from: process.env.EMAIL_USER,
                to,
                subject,
                text: message
             }
             await transporter.sendMail(mailOptions);

             await db.execute(
                'INSERT INTO logs (recipient, subject, message, sent_at) VALUES (?,?,?, NOW())',
                [to, subject, message]
             );
             res.json({ success: true, message: 'Email Sent logged!'});

             }


            catch (error) {
                console.error(error);
                res.status(500).json({success: false, message: 'Failed to send the email'})
            }
       
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    try {
        // Check if username already exists
        const [existing] = await db.execute(
            'SELECT id FROM users_table WHERE username = ?',
            [username]
        );
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: 'Username already exists' });
        }
        // Insert new user
        await db.execute(
            'INSERT INTO users_table (username, password) VALUES (?, ?)',
            [username, password]
        );
        res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
});

app.listen(5000, () =>{
    console.log('Server running on http://localhost:5000')
});