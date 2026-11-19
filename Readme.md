
# My Book Journal

## Project Overview

My Book Journal is a web application that helps readers organize books they have read, save personal notes, and remember important lessons from books.

The application uses the Open Library API to search for books and display their covers.

## Features

- Search books using Open Library API.
- Display book covers and authors.
- Add books to a personal collection.
- Save personal notes and ratings.
- Update book information.
- Delete books.
- Sort books by title, rating, and reading date.
- Store information in PostgreSQL.

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- EJS
- PostgreSQL
- Axios
- Open Library API

## Installation

1. Download or clone the project.
2. Open the project folder in VS Code.
3. Install the required packages:

   npm install

4. Create a PostgreSQL database named book_notes.
5. Run the SQL commands in db.sql to create the books table.
6. Create a .env file and enter your PostgreSQL connection details.

## Run the Application

Start the development server:

npm run dev

Or use:

npm start

Open your browser:

http://localhost:3000

## Database

PostgreSQL is used to store book titles, authors, ratings, notes, reading dates, and cover images.

## API

Open Library API:
https://openlibrary.org/dev/docs/api/covers

## Author

My Book Journal - Capstone Project
