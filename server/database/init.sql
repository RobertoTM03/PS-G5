CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(100) UNIQUE NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       firebase_uid VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO users (name, email, firebase_uid) VALUES
    ('Alice', 'alice@example.com', 'firebase_uid_alice_123'),
    ('Bob', 'bob@example.com', 'firebase_uid_bob_456');

CREATE TABLE groups (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            description VARCHAR(100) UNIQUE NOT NULL,
            idPropietary SERIAL  UNIQUE NOT NULL

);
