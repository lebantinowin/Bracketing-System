-- Create the database
CREATE DATABASE IF NOT EXISTS nexus_league;
USE nexus_league;

-- Create tournaments table
-- We use a hybrid approach here: tracking essential relational metadata 
-- while storing the full, complex nested bracket JSON in the 'data' column.
CREATE TABLE IF NOT EXISTS tournaments (
  id VARCHAR(100) PRIMARY KEY,
  code VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  gameType VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  data LONGTEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
