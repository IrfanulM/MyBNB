# MyBNB 🏡

A simplified, full-stack web application inspired by Airbnb. Browse, search, book listings, and manage your account. This project is built entirely with Next.js, utilizing its API Routes for all backend functionality, including user authentication and database management.

## Features

* **User Authentication:** Secure sign-up, sign-in, and sign-out functionality using JWT (JSON Web Tokens) for session management. Passwords are encrypted with `bcryptjs`.
* **Protected Profile Page:** Once signed in, users can access a personal profile page to view their account details and booking history.
* **Browse Listings:** View an initial set of randomly selected property listings on the homepage.
* **Dynamic Search & Filtering:** Search for listings by location and filter results by property type and the number of bedrooms.
* **Date-Aware Bookings:** The booking system prevents booking past dates, ensures check-out is after check-in, and checks for date availability to prevent double-booking.
* **View Booking Confirmations:** After a successful booking, users are redirected to a confirmation page with all the relevant details.

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)
* **Authentication:** [jose](https://github.com/panva/jose) for JWTs, [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for password hashing.
* **Styling:** Custom CSS with a modern, dark theme.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* [Node.js](https://nodejs.org/en/) (v18 or later)
* [npm](https://www.npmjs.com/)
* [Git](https://git-scm.com/)
* A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account with the sample `sample_airbnb` dataset loaded.

### Installation

1.  **Clone the repository:**

        git clone https://github.com/IrfanulM/MyBNB

2.  **Navigate to the project directory:**

        cd MyBNB

3.  **Install dependencies:**

        npm install

4.  **Set up environment variables:**
    * Create a copy of the `.env.example` file and rename it to `.env.local`.
    * Open `.env.local` and add your MongoDB Atlas connection string and a JWT secret. See the section below for details.

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

    # A secret for signing JSON Web Tokens for user authentication.
    JWT_SECRET=""

**Generating a JWT_SECRET:**

You must generate a secure, random string for the `JWT_SECRET`. You can do this by running the following command in your terminal:

    node -e "console.log(require('crypto').randomBytes(32).toString('base64'));"

Copy the output and paste it as the value for `JWT_SECRET` in your `.env.local` file.

**Important:** Ensure your MongoDB Atlas cluster's Network Access list is configured to allow connections from your IP address or from anywhere (`0.0.0.0/0`) for development.

## API Endpoints

The backend is handled by Next.js API Routes.

### Public & Listings

| Method | Endpoint              | Description                               |
| :----- | :-------------------- | :---------------------------------------- |
| `GET`  | `/api/initial`        | Fetches 15 random listings.               |
| `GET`  | `/api/property-types` | Gets all distinct property types.         |
| `GET`  | `/api/bedrooms`       | Gets all distinct bedroom counts.         |
| `GET`  | `/api/listings/[id]`  | Gets a single listing by its ID.          |
| `POST` | `/api/search`         | Searches for listings based on filters.   |
| `POST` | `/api/book`           | Creates a new booking for a listing.      |

### Authentication & User

| Method | Endpoint             | Description                               | Protected |
| :----- | :------------------- | :---------------------------------------- | :-------- |
| `POST` | `/api/auth/signup`   | Registers a new user.                     | No        |
| `POST` | `/api/auth/signin`   | Logs in a user and returns a JWT cookie.  | No        |
| `POST` | `/api/auth/signout`  | Clears the JWT cookie to log the user out.| No        |
| `GET`  | `/api/auth/status`   | Checks if the user's JWT is valid.        | No        |
| `GET`  | `/api/user/bookings` | Gets all bookings for the logged-in user. | Yes       |
| `GET`  | `/api/user/details`  | Gets account details for the logged-in user. | Yes       |

## Acknowledgements

* This project uses the `sample_airbnb` dataset provided by MongoDB Atlas.
* This project was initially developed for a university assignment and has since been refactored and expanded in my personal time to improve its architecture, features, and overall code quality.