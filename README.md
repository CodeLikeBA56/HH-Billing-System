## Project Title

A simple billing management system designed for a client running a small scale business, built with Next.js and Firebase. It helps businesses manage clients, products, and invoices in one place. Users can create, edit, and track invoices, manage payments, and monitor remaining balances through a clean and responsive interface.

## Features

- Client, product, and invoice management using Firestore.
- Add multiple items per invoice with quantity, price, and size.
- Automatic calculation of totals and remaining balance.
- Dynamic invoice labeling for paid, unpaid, and partially paid invoices.
- Filter invoices by payment status.
- Real-time data sync with Firebase.
- Clean UI built with shadcn and Tailwind CSS.

## Tech Stack

- Next.js 14 (React 18)
- TypeScript
- Firebase (Firestore + Auth)
- Tailwind CSS + Shadcn ui
- React context api for state management

## How it Works

- Each client, product, and invoice is stored in Firebase Firestore.
- When a new invoice is created, the user selects a client and adds items.
- The system calculates item totals, grand total, paid amount, and remaining balance automatically.
- The system assign invoice status such as **Paid**, **Partially Paid**, **Unpaid** by comparing paid amount and grandTotal.
- Users can view and filter invoices directly in the dashboard, edit them anytime, and track outstanding balances.

## Key Learnings

- Managing shared state across multiple contexts, including invoices, clients, and products.
- Handling Firestore collections through async CRUD functions.
- Using filtered and memoized rendering in React to keep the UI fast.
- Building a modular interface with reusable table and form components using shadcn/ui.
- Working with TypeScript generics to update form fields safely.
- Seeing real-time TypeScript errors during development when types or interfaces are defined incorrectly.

## Setup & Run

#### 1. Clone the repository
    git clone https://github.com/CodeLikeBA56/hh-billing-system.git

#### 2. Navigate into the project folder
    cd hh-billing-system

#### 3. Install dependencies
    npm install

#### 4. Create a .env file
Add all Firebase environment variables used in this project.  
These values allow the app to connect with Firebase services in the browser.

    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

This project is designed for a single user.
The admin UID ensures only one authenticated user can access protected routes.

    NEXT_PUBLIC_FIREBASE_ADMIN_UID=your_admin_uid

Use development during local work.
Switch this to "production" when deploying.

    NODE_ENV=development

#### 5. Start the development server
    npm run dev

The app will be available at `http://localhost:3000`.
## License

This project is open source and available under the [MIT License](https://choosealicense.com/licenses/mit/)

## Links

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://sameer-shamshad-portfolio.vercel.app/)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=LinkedIn&logoColor=white)](https://www.linkedin.com/in/sameer-shamshad/)

[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=X&logoColor=white)](https://x.com/samu101325?s=21)
