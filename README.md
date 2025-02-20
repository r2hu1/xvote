# Anonymous Polling App / XVote

This is an anonymous polling application built using Firebase for the backend and Next.js for the frontend. The UI components are styled using Shadcn and Tailwind CSS.

## Features

- Create polls with multiple options.
- Users can vote anonymously.
- Real-time updates on poll results.
- Responsive and user-friendly UI.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.
- **Firebase**: Used for authentication, real-time database, and hosting.
- **Shadcn**: A UI component library used for styling the application.
- **Tailwind CSS**: Utility-first CSS framework for designing the UI.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- Firebase account and project setup.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/r2hu1/xvote-app.git
   cd anonymous-polling-app
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Create a `.env.local` file in the root directory and add your Firebase configuration:

     ```plaintext
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000`.

## Deployment

To deploy the app, you can use Vercel or Firebase Hosting. Ensure that your Firebase configuration is set up in the production environment.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.
