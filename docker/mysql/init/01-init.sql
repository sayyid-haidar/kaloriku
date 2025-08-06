-- Initialize KaloriKu Database
-- This file will be executed when MySQL container starts for the first time

-- Create additional databases if needed
-- CREATE DATABASE IF NOT EXISTS kaloriku_test;

-- Set proper charset and collation
ALTER DATABASE kaloriku CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant privileges
GRANT ALL PRIVILEGES ON kaloriku.* TO 'kaloriku'@'%';
FLUSH PRIVILEGES;
