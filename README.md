# AquaTrade CRM

AquaTrade CRM is a robust and modern web application designed to streamline the operations of a fish trading company. It provides a comprehensive set of tools to manage sales, purchases, trading partners (parties), loans, and financial data, all within a user-friendly interface. The application leverages AI to provide insightful financial overviews and data-driven suggestions.

## Key Features

- **Dashboard**: Get a high-level overview of your business with key metrics like total revenue, outstanding loans, and recent transactions.
- **Sell & Buy Modules**: Dedicated sections for managing sales and purchase invoices, each with its own dashboard to track costs, revenues, and pending amounts.
- **Party Management**: A unified system to manage all trading partners, whether they are buyers, sellers, or both. You can create, view, edit, and delete party profiles with ease.
- **Loan Management**: Track loans provided to fishers, including details on principal, interest rates, repayment schedules, and outstanding balances.
- **Invoice Management**: Full CRUD (Create, Read, Update, Delete) functionality for both sell and buy invoices, allowing for detailed itemization and status tracking.
- **AI-Powered Insights**:
    - **Financial Overview**: Generate a comprehensive financial summary of all transactions and loans using AI to identify trends and provide recommendations.
    - **Smart Suggestions**: Receive AI-driven suggestions for operational settings, such as optimal invoice archiving periods based on company policies and legal requirements.
- **Responsive Design**: A fully responsive interface that works seamlessly on both desktop and mobile devices.

## Tech Stack

This project is built with a modern, performant, and scalable tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation

## Getting Started

To get the application running locally, follow these steps:

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    The application uses Genkit for its AI features. To run the app and the Genkit flows simultaneously, you can use the development script.

    In one terminal, run the Genkit development server:
    ```bash
    npm run genkit:dev
    ```

    In another terminal, run the Next.js development server:
    ```bash
    npm run dev
    ```

3.  **Open the application**:
    Open [http://localhost:9002](http://localhost:9002) in your browser to see the result.
