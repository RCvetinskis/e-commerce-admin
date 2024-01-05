
E-Commerce Admin Dashboard
Welcome to the E-Commerce Admin Dashboard! This project is designed to help you manage and customize your E-Commerce store efficiently. It is tightly integrated with the E-Commerce Store project, allowing you to create and modify your online store seamlessly.

Getting Started
Prerequisites
Before you begin, make sure you have the following installed:

Node.js and npm
Git
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/e-commerce-admin.git
Navigate to the project directory:

bash
Copy code
cd e-commerce-admin
Install dependencies:

bash
Copy code
npm install
Configuration
Create a .env file in the root of your project and set the following environment variables:

env
Copy code
# URL of your E-Commerce Store (replace with your actual store URL)
FRONTEND_STORE_URL=http://localhost:3001

# API URL of your E-Commerce Store (replace with your actual API URL)
NEXT_PUBLIC_API_URL=http://localhost:3000/api/c6ee20aa-d1f4-446a-abe8-426519c40712

# If your project is live, update the Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
Usage
Start the development server:

bash
Copy code
npm run dev
Visit http://localhost:3000 to access the E-Commerce Admin Dashboard.

Features
Dashboard: View key metrics and insights about your online store.
Store Management: Create and modify your E-Commerce store settings.
Important Notes
Store Connection: To connect your store, make sure to set the FRONTEND_STORE_URL and NEXT_PUBLIC_API_URL environment variables in the .env file.

Stripe Webhook Secret: If your project is live, remember to update the STRIPE_WEBHOOK_SECRET environment variable with your actual Stripe webhook secret.
