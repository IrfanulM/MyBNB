# MyBNB 🏡

A simplified, full-stack web application inspired by Airbnb. Browse, search, and book listings from the MongoDB Atlas sample dataset. This project is built entirely with Next.js, utilizing its API Routes for backend functionality.




## Features
* **Browse Listings:** View an initial set of randomly selected property listings on the homepage.
* **Dynamic Search:** Search for listings by location (e.g., "Sydney", "Oahu").
* **Advanced Filtering:** Filter search results by property type and the number of bedrooms.
* **View Details:** Click on any listing to see a more detailed view (functionality to be built on the booking page).
* **Simulate Bookings:** A simple booking form to demonstrate creating embedded documents in MongoDB.


## Tech Stack
* **Framework:** [Next.js](https://nextjs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)
* **Styling:** Global CSS


## Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
* [Node.js](https://nodejs.org/en/) (v18 or later)
* [npm](https://www.npmjs.com/)
* [Git](https://git-scm.com/)
* A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account with the sample airbnb dataset loaded.

### Installation
1.  **Clone the repository:**

        git clone https://github.com/IrfanulM/MyBNB

2.  **Navigate to the project directory:**
    
        cd MyBNB

3.  **Install dependencies:**
    
        npm install

4.  **Set up environment variables:**
    * Create a copy of the `.env.example` file and rename it to `.env.local`.
    * Open `.env.local` and add your MongoDB Atlas connection string. See the section below for details.

5.  **Run the development server:**
    
        npm run dev

6.  **Open your browser:** Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## Environment Variables
To run this project, you need to create a `.env.local` file in the root of the project with the following variables:

    # Your personal MongoDB connection string.
    # Get this from your MongoDB Atlas dashboard.
    MONGODB_URI=""

    # The default database name.
    # This should be "sample_airbnb" if using the sample dataset.
    DB_NAME="sample_airbnb"

**Important:** Ensure your MongoDB Atlas cluster's Network Access list is configured to allow connections from your IP address or from anywhere (`0.0.0.0/0`) for development.


## API Endpoints
The backend for this project is handled by Next.js API Routes. The available endpoints are:

| Method | Endpoint               | Description                               |
| :----- | :--------------------- | :---------------------------------------- |
| `GET`    | `/api/initial`         | Fetches 15 random listings.               |
| `GET`    | `/api/property-types`  | Gets all distinct property types.         |
| `GET`    | `/api/bedrooms`        | Gets all distinct bedroom counts.         |
| `GET`    | `/api/listings/[id]`   | Gets a single listing by its ID.          |
| `POST`   | `/api/search`          | Searches for listings based on filters.   |
| `POST`   | `/api/book`            | Creates a new booking for a listing.      |



## Acknowledgements
* This project uses the `sample_airbnb` dataset provided by MongoDB Atlas.
* This project was initially developed for a university assignment and has since been refactored and expanded in my personal time to improve its architecture, features, and overall code quality.