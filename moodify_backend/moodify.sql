CREATE DATABASE IF NOT EXISTS moodify;
USE moodify;

DROP TABLE IF EXISTS publications;
DROP TABLE IF EXISTS follow;
DROP TABLE IF EXISTS mood_register;
DROP TABLE IF EXISTS todo_list;
DROP TABLE IF EXISTS user;

CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL, -- @
  password_hash_salt VARCHAR(250) NOT NULL,
  type_user ENUM('admin','user'),
  points INT DEFAULT 0,
  streak INT DEFAULT 0,
  date TIMESTAMP NULL,
  streak_login TIMESTAMP NULL
  );

CREATE TABLE mood_register(
	id INT AUTO_INCREMENT PRIMARY KEY,
    mood ENUM('happy', 'glad','excited','calm', 'proud','confident', 'grateful', 'in_love', 'peaceful', 'sad', 'angry', 'scared', 'anxious', 'annoyed', 'frustared', 'embarrassed', 'lonely', 'worried', 'furious', 'tired', 'sleepy', 'bored', 'confused', 'surprised', 'serious', 'shy', 'hungry'),
    date TIMESTAMP NULL,
    user_id INT,
    daily_text TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE todo_list(
	title VARCHAR(100) NOT NULL,
    time_quantity VARCHAR(100) NOT NULL,
    times_for_week VARCHAR(100) NOT NULL,
    completed ENUM('true', 'false'),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE follow(
	follower_id INT,
    followed_id INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (follower_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE publications(
	id INT AUTO_INCREMENT PRIMARY KEY,
    text_publications TEXT NOT NULL,
    date TIMESTAMP NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

INSERT INTO user (name, email, password_hash_salt, type_user, username)
VALUES ('valeria', 'valeria@gmail.com', '$2y$10$MFiZuj0OjiSbn2A5QXZgGON2TiPWJMIBmJzNk2S.kG0ren9kD/Z6q','admin','@valeria');
