# System Information and Environment
Developer Details:
  - Developers: Mac and Nard
  - Project Name: WAD Activity Finals E-store
  - Operating System: Windows 10 / Windows 11

Technical Stack:
  - Frameworks: Laravel 12.x and Inertia.js (React)
  - Frontend Tooling: Vite v6.4.2 and Tailwind CSS
  - Database: SQLite (database.sqlite)
  - Repository: https://github.com/mcccc07/WAD-Activity-Finals.git



# Project Overview
E-store Management System WAD 2 By Pair Final Project: Laravel Application

Description:
  - In this project, we developed a fully functional E-commerce system utilizing the
    Laravel and Inertia.js stack. Our primary focus was the implementation of a
    robust authorization system and Role-Based Access Control (RBAC). We designed
    the application to support three distinct roles: Admin, Seller, and Customer.
    This structure ensures that only authorized users can manage specific products
    while providing the Admin with a unified view of all platform activities.



# Key Features and Improvements:
Advanced Authorization System
  - Global Gates: We implemented the isAdmin gate within the AppServiceProvider
    to protect sensitive routes and restrict access to administrative functions.

  - Policies: We created ProductPolicy and SellerPolicy to ensure that sellers
    can only modify or delete their own items, while our system grants Admins
    the authority to manage all site content.

  - Refactored Controllers: We replaced manual conditional logic with the
    standard Gate::authorize() method to maintain a cleaner, industry-standard
    security architecture.

Database and Data Integrity
  - Role-Based Access Control: We integrated a custom role column in the users
    table to distinguish between Admin, Seller, and User accounts.

  - Ownership Tracking: We linked products to specific user IDs to strictly
    enforce ownership permissions and data security.

  - Automated Seeding: We configured a ready-to-use testing environment that
    allows for immediate deployment with a default admin account.

Admin Management Suite:
  - Unified Dashboard: We developed a centralized dashboard where Admins can
    manage registered users and monitor all platform products in a single view.

  - Seller Approval Logic: We prepared a system logic for an is_approved status
    to facilitate vendor management and quality control.

Enhanced User Experience
  - Shared Auth State: Using the HandleInertiaRequests middleware, we pass user
    roles directly to the React frontend to customize the interface.

  - Dynamic UI: We designed our sidebar and dashboard elements to adjust
    automatically based on the authenticated user's role.



# Installation and Setup for Other Devices:
Step 1: Clone the Repository
  - git clone https://github.com/mcccc07/WAD-Activity-Finals.git
  - cd WAD-Activity-Finals

Step 2: Install Dependencies
  - composer install
  - npm install

Step 3: Environment Configuration
1.  Copy the example environment file:
  - cp .env.example .env

2.  Generate the application key:
  - php artisan key:generate

3.  Ensure your .env file is set to DB_CONNECTION=sqlite.

4.  If database.sqlite is missing, create an empty file in the database folder.

Step 4: Database Setup and Seeding
  - php artisan migrate:fresh --seed

Default Admin Credentials:
  - Email: macrobert@admin.com
  - Password: ********

Step 5: Run the Application
  - In our development workflow, we recommend using a single command to initiate
    both the backend and frontend services. This is facilitated by the Laravel "dev"
    script.

Execution Command:
  - composer run dev

To run our application, please ensure the following are installed:
  - PHP 8.2 or higher
  - Composer
  - Node.js and NPM
  - Laravel Breeze (Inertia/React stack)
  - Tailwind CSS



# Git Workflow
To Save and Push Work
  - git add .
  - git commit -m "Update: Added Authorization Policies and Admin Dashboard"
  - git push origin main

To Get Latest Changes
  - git pull origin main
  - composer install
  - npm install
  - php artisan migrate



# UI Overviews and Screenshots
For a visual guide to our system, please refer to the project folder for UI
previews:
  - Admin Dashboard: Used for viewing users, editing roles, and deleting
    products.
  - Seller UI: Used by vendors to manage their personal inventory and shop
    items.
  - Customer UI: Used by users to browse products, read reviews, and manage
    their shopping cart.



# Developed for WAD 2 Finals