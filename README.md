# Proactively Backend Assignment
## API Endpoints
Refer the document: https://docs.google.com/document/d/1a5IDVq3qI53HB7s1rmdM85PPMyV6THXGUvUkbtXvbxE/edit?usp=sharing
This project is a **Session Management API** that allows users to book sessions with speakers, block time slots, and manage schedules effectively. The API also integrates email notifications and Google Calendar events to enhance user experience.

## Features

- **Session Booking**: Users can book sessions with speakers for specific dates and time slots.
- **Time Slot Blocking**: Speakers can block time slots to avoid overlapping bookings.
- **Email Notifications**: Automated email notifications sent to both speakers and users upon successful booking.
- **Google Calendar Integration**: Adds booked sessions to both parties' Google Calendars as events.
- **Protected Routes**: JWT-based authentication for secure API access.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL (with Sequelize ORM)
- **Email Service**: Nodemailer
- **Google Calendar API**: Integration for creating calendar events
- **Authentication**: JWT (JSON Web Token)

---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/vlen4114/proactively-backend-assignment.git
cd proactively-backend-assignment
```

### 2. Install Dependencies
```bash
npm install express mysql2 sequelize jsonwebtoken bcrypt dotenv nodemailer googleapis

```

### 3. Set Environment Variables
Create a `.env` file in the root directory and configure the following:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=session_management
JWT_SECRET=your_jwt_secret
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
```

### 4. Setup Database
Ensure MySQL is running on your system and create the database:
```sql
-- Create the database
CREATE DATABASE speaker_booking;

-- Use the database
USE speaker_booking_platform;

-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    userType ENUM('user', 'speaker') NOT NULL,
    isVerified TINYINT(1) DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the speakers table
CREATE TABLE speakers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expertise VARCHAR(255) NOT NULL,
    pricePerSession DECIMAL(10, 2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the sessions table
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    timeSlot VARCHAR(255) NOT NULL,
    status ENUM('booked', 'completed', 'cancelled') DEFAULT 'booked',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userId INT NOT NULL,
    speakerId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (speakerId) REFERENCES speakers(id) ON DELETE CASCADE
);

```
Run migrations to create tables:
```bash
npx sequelize-cli db:migrate
```

### 5. Start the Server
```bash
npx nodemon src/app.js
```
The server will run on `http://localhost:3000`.

---

## API Endpoints
Refer the document: https://docs.google.com/document/d/1a5IDVq3qI53HB7s1rmdM85PPMyV6THXGUvUkbtXvbxE/edit?usp=sharing

---

## License

This project is licensed under the [MIT License](LICENSE).
