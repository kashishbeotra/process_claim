
```
# Claim Process


## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (https://nodejs.org) - Ensure that Node.js is installed on your machine.

## Getting Started


1. Navigate to the project directory:

 
   cd claim-management
 

2. Install dependencies using npm:

   ```
   npm install
   ```

## Configuration

1. Open the `index.js` file in the project directory.

2. Update the MySQL connection details in the following section:

   ```javascript
   // Create a MySQL connection
   const connection = mysql.createConnection({
     host: 'localhost',
     database: 'claim_process',
     user: 'root',
     password: 'your-password'
   });
   ```

   Replace `'your-password'` with your actual MySQL password.

## Running the Application

1. Start the server:

   ```
   node index.js
   ```

2. Open your web browser and visit `http://localhost:3000` to access the application.

## Routes

The application exposes the following routes:

- `/`: Home page.
- `/fetch-data`: Retrieves and displays member details based on the specified member ID.
- `/submit-claim`: Handles the submission of claim documents.
- `/update-claim-status`: Updates the claim status for a specific member.


