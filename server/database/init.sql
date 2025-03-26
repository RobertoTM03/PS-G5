CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(100) UNIQUE NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       firebase_uid VARCHAR(100) UNIQUE NOT NULL
);

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


-- Insertando usuarios
INSERT INTO users (name, email, firebase_uid) VALUES
    ('Alice', 'alice@example.com', 'ZhTfziUyocUVKV5UfDOQoW7AzPn2'),
    ('Bob', 'bob@example.com', 'zuHd4X3cMvcOKHzjn0tFUmrTH6H2'),
    ('Carlos', 'carlos@example.com', 'VkYSFA88o4XGeno6xKf4xgnGhDn2'),
    ('Diana', 'diana@example.com', 'RxS2gngetFOosWvhZeyz4v0UuSR2');

-- Insertando grupos
INSERT INTO groups (name, description, idPropietary) VALUES
    ('Grupo de Lectura', 'Amantes de los libros', 1),
    ('Gamers', 'Grupo de videojuegos', 2),
    ('Cine Club', 'Amantes del cine', 3);

-- Insertando relaciones usuarios-grupos
INSERT INTO group_users (group_id, user_id) VALUES
    -- Grupo de Lectura
    (1, 1),  -- Alice
    (1, 2),  -- Bob
    (1, 3),  -- Carlos
    (1, 4),  -- Diana

    -- Gamers Unidos
    (2, 2),  -- Bob
    (2, 1),  -- Alice
    (2, 3),  -- Carlos
    (2, 4),  -- Diana

    -- Cine Club
    (3, 3),  -- Carlos
    (3, 4),  -- Diana
    (3, 1);  -- Alice