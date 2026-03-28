
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS bookings;
--=============================
--PLACES TABLE
--=============================
 CREATE TABLE places (
     id SERIAL PRIMARY KEY,
     name VARCHAR(200) NOT NULL,
     district VARCHAR(100),
     category VARCHAR(150),
    description TEXT,
    entry_fee VARCHAR(50),   -- because some entries may be 'Free'
     best_time VARCHAR(100),
     activities TEXT,
     latitude DECIMAL(10,6),
     longitude DECIMAL(10,6),
    rating DECIMAL(2,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );
--===============================
-- IMPORT CSV DATA
--===============================
COPY places(name, district, category, description, entry_fee, best_time, activities, latitude, longitude, rating)
FROM 'C:\Program Files\PostgreSQL\16\data\Telangana_Tourism_Data_160_Final_Realistic.csv'DELIMITER ','CSV HEADER;

-- Check data
 SELECT COUNT(*) FROM places;
 -- ===============================
 -- USERS TABLE
 -- ===============================
 CREATE TABLE users (
     id SERIAL PRIMARY KEY,
    name VARCHAR(100),
     email VARCHAR(100) UNIQUE,
     password TEXT
 );
-- ===============================
-- BOOKINGS TABLE
-- ===============================
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    place_name VARCHAR(150),
    members INT,
     travel_date DATE,
     payment_status VARCHAR(50),
    booking_status VARCHAR(50)
 );
SELECT * FROM bookings;
