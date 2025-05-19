CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    firebase_uid VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100),
    user_owner_id SERIAL NOT NULL
);

CREATE TABLE group_users (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (group_id, user_id)
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL,
    title VARCHAR(32) NOT NULL,
    amount FLOAT NOT NULL,
    author_id INT NOT NULL,
    tags TEXT[],
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE expense_contributions (
    expense_id INT NOT NULL,
    contributor_id INT NOT NULL,
    amount FLOAT NOT NULL,
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
    FOREIGN KEY (contributor_id) REFERENCES users(id),
    PRIMARY KEY (expense_id, contributor_id)
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    created_by INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE activity_participants (
    id SERIAL PRIMARY KEY,
    activity_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (activity_id, user_id)
);

CREATE TABLE map_locations (
                               id SERIAL PRIMARY KEY,
                               group_id INT NOT NULL,
                               title VARCHAR(255) NOT NULL,
                               location POINT NOT NULL,
                               created_by INT NOT NULL,
                               created_at TIMESTAMP DEFAULT NOW(),
                               FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
                               FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, firebase_uid) VALUES
    ('Alice', 'alice@example.com', 'ZhTfziUyocUVKV5UfDOQoW7AzPn2'),
    ('Bob', 'bob@example.com', 'zuHd4X3cMvcOKHzjn0tFUmrTH6H2'),
    ('Carlos', 'carlos@example.com', 'VkYSFA88o4XGeno6xKf4xgnGhDn2'),
    ('Diana', 'diana@example.com', 'RxS2gngetFOosWvhZeyz4v0UuSR2');

INSERT INTO groups (name, description, user_owner_id) VALUES
    ('Grupo de Lectura', 'Amantes de los libros', 1),
    ('Gamers', 'Grupo de videojuegos', 2),
    ('Cine Club', 'Amantes del cine', 3);

INSERT INTO group_users (group_id, user_id) VALUES
    -- Group 1
    (1, 1),  -- Alice
    (1, 2),  -- Bob
    (1, 3),  -- Carlos
    (1, 4),  -- Diana

    -- Group 2
    (2, 2),  -- Bob
    (2, 1),  -- Alice
    (2, 3),  -- Carlos
    (2, 4),  -- Diana

    -- Group 3
    (3, 3),  -- Carlos
    (3, 4),  -- Diana
    (3, 1);  -- Alice


INSERT INTO expenses (group_id, title, amount, author_id, tags) VALUES
    (1, 'Billetes de avión', 200.0, 1, NULL),
    (1, 'Café', 30.0, 1, NULL),
    (1, 'Impuesto de chocolate', 16.5, 2, ARRAY['Comida', 'Provisiones', 'Misceláneos']),
    (1, 'Cenita', 120, 2, ARRAY['Comida']),
    (1, 'Próximo asadero', 120, 2, ARRAY['Provisiones']);

INSERT INTO expense_contributions (expense_id, contributor_id, amount) VALUES
    (2, 2, 30.0),
    (4, 1, 100.0),
    (4, 2, 20.0),
    (5, 4, 50.0);
