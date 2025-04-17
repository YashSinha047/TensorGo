Communication Platform
A web application that enables users to authenticate via Google OAuth, manage their accounts, and communicate with peers. The platform features a React frontend, an Express.js backend, MongoDB for data storage, and SendGrid for email notifications (e.g., welcome emails and password resets).
Features

Google OAuth Login: Securely authenticate users using Google accounts.
Password Reset: Request password reset emails via SendGrid.
User Dashboard: Redirects authenticated users to a dashboard for communication.
Email Notifications: Sends welcome emails to new users and tracks email interactions.
MongoDB Integration: Stores user data and email records.

Prerequisites
Before setting up the project, ensure you have the following installed:

Node.js (v16 or higher)
MongoDB (local or cloud instance)
Git (for cloning the repository)

You’ll also need accounts for:

Google Cloud Console (for OAuth credentials)
SendGrid (for email services)

Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/communication-platform.git
cd communication-platform

2. Backend Setup

Navigate to the backend directory:cd backend


Install dependencies:npm install


Create a .env file in backend/ with the following:GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SENDGRID_API_KEY=your-sendgrid-api-key
MONGODB_URI=mongodb://localhost:27017/communication-platform
SESSION_SECRET=your-session-secret
PORT=5000


Replace your-google-client-id and your-google-client-secret with credentials from Google Cloud Console.
Get your-sendgrid-api-key from SendGrid.
Use a strong, unique your-session-secret.


Configure Google OAuth:
Go to Google Cloud Console.
Create an OAuth 2.0 Client ID under APIs & Services → Credentials.
Set Authorized JavaScript origins: http://localhost:5173
Set Authorized redirect URIs: http://localhost:5000/auth/google/callback
Enable Google People API and OAuth 2.0 in APIs & Services → Library.


Configure SendGrid:
Verify the sender email (TensorGo@communicationapp.shop) in SendGrid.


Start MongoDB:
Ensure MongoDB is running locally or use a cloud instance (update MONGODB_URI accordingly).

mongod


Start the backend:npm start


The server runs on http://localhost:5000.



3. Frontend Setup

Navigate to the frontend directory:cd frontend


Install dependencies:npm install


Start the frontend:npm run dev


The app runs on http://localhost:5173 (Vite default).



4. Verify Setup

Open http://localhost:5173 in your browser.
Click "Login with Google" to authenticate via Google OAuth.
After login, you should be redirected to the dashboard (/dashboard).
Test password reset by entering an email in the reset form.

Project Structure
communication-platform/
├── backend/
│   ├── config/
│   │   └── passport.js        # Passport Google OAuth configuration
│   ├── controllers/
│   │   └── authController.js  # Authentication logic
│   ├── models/
│   │   ├── user.js           # User schema
│   │   └── email.js          # Email schema
│   ├── routes/
│   │   └── authRoutes.js     # Authentication routes
│   ├── services/
│   │   └── emailService.js   # SendGrid email service
│   ├── index.js              # Express server entry point
│   ├── .env                  # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx     # Login page with Google OAuth
│   │   │   └── Dashboard.jsx # User dashboard
│   │   └── App.jsx           # React app entry point
│   ├── vite.config.js        # Vite configuration
│   └── package.json
├── README.md                 # Project documentation
└── .gitignore

Technologies Used

Frontend:
React.js
Vite
Tailwind CSS (assumed for styling)
Axios (for API requests)


Backend:
Express.js
MongoDB (Mongoose)
Passport.js (Google OAuth)
SendGrid (email notifications)


Others:
Node.js
dotenv (environment variables)
CORS (cross-origin requests)



Usage

Login:
Visit http://localhost:5173.
Click "Login with Google" to authenticate.
Redirects to /dashboard after successful login.


Password Reset:
Enter your email in the reset form on the login page.
Check your inbox for a reset link.


Dashboard:
Access communication features (e.g., messaging peers) after login.



Troubleshooting

Google OAuth Error (InternalOAuthError):
Verify GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and redirect URI (http://localhost:5000/auth/google/callback) in Google Cloud Console.
Ensure Google People API is enabled.
Check network connectivity to https://oauth2.googleapis.com/token.


MongoDB Connection Error:
Ensure MongoDB is running (mongod) and MONGODB_URI is correct.
Test with mongosh:mongosh
use communication-platform
db.users.find()




SendGrid Email Failure:
Verify SENDGRID_API_KEY and sender email in SendGrid.


404 on /auth/google/callback:
Ensure backend/routes/authRoutes.js exists and is imported correctly in index.js.
Clear browser cache or test in Incognito mode.



Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.

License
This project is licensed under the MIT License.
Contact
For issues or questions, contact [your-email@example.com] or open an issue on GitHub.
