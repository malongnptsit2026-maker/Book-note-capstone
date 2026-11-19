
CREATE DATABASE book_notes;

-- Connect to the book_notes database before running this table command.

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    rating INTEGER DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
    notes TEXT,
    read_date DATE,
    cover TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example book for testing

INSERT INTO books (title, author, rating, notes, read_date)
VALUES (
    'The Purpose Driven Life',
    'Rick Warren',
    5,
    'A book about understanding Gods purpose for human life.',
    '2026-01-15'
);
