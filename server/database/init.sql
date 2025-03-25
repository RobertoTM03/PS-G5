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
            description VARCHAR(100) UNIQUE NOT NULL,
            idPropietary SERIAL  UNIQUE NOT NULL
);

CREATE TABLE group_users (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (group_id, user_id)
);
