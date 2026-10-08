# Zarb Store

A modern perfume e-commerce website built for **Zarb**, a growing perfume brand. The platform provides customers with a simple way to browse products and allows the store owner to manage products and orders through an administrative interface.

## 🌐 Live Website

**Production:** https://zarb.store

## 📌 Project Overview

Zarb Store was developed as a practical e-commerce solution for a small perfume business. The goal was to provide the brand with a professional online presence while keeping product and order management simple for the store owner.

The project was developed and deployed as a real-world application rather than a demonstration-only project.

## ✨ Features

### Customer Side
- Responsive e-commerce interface
- Product listing
- Dynamic product detail pages
- Product information and pricing
- Shopping experience optimized for mobile and desktop
- Custom domain with HTTPS

### Admin Side
- Secure admin access
- Product management
- Add new products
- Update existing products
- Delete products
- Manage store data
- Database-backed product information

### Backend
- REST API operations
- GET, POST, PUT and DELETE requests
- Form data submitted directly to the database
- Server-side database interaction
- Dynamic data retrieval

## 🛠️ Technologies Used

- **Next.js**
- **React**
- **JavaScript**
- **Tailwind CSS**
- **Drizzle ORM**
- **Neon PostgreSQL**
- **Vercel**
- **Spaceship** for domain registration

## 🗄️ Database

The application uses **PostgreSQL** through Neon and **Drizzle ORM** for database operations.

The database is responsible for storing application data such as products and other store-related information.

## 🚀 Deployment

The application is deployed using Vercel.

The production domain is:

**https://zarb.store**

The domain is registered through Spaceship and connected to the Vercel deployment using DNS records.

## 🔐 Environment Variables

Create a `.env.local` file for local development.

Example:

```env
DATABASE_URL=your_database_connection_string

NEXT_PUBLIC_APP_URL=https://zarb.store
```

Additional environment variables may be required depending on the authentication and application configuration.

**Never commit `.env.local` or other files containing private credentials to GitHub.**

## 📁 Project Structure

The project follows the Next.js application structure.

```text
zarb-store/
├── app/
│   ├── api/
│   ├── admin/
│   ├── productDetail/
│   └── ...
├── components/
├── db/
├── public/
├── ...
├── .env.local
├── package.json
└── README.md
```

## 💻 Local Development

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Move into the project directory:

```bash
cd YOUR_PROJECT_FOLDER
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
touch .env.local
```

Add the required environment variables and then start the development server:

```bash
npm run dev
```

The application will be available locally at:

```text
http://localhost:3000
```

## 🎯 Purpose

This project was created to provide a practical and easy-to-use online store for a small perfume business.

It also served as a real-world development project for implementing:

- Full-stack web development
- Database integration
- CRUD operations
- API development
- Dynamic routing
- Authentication
- Deployment
- Custom domain configuration

## 📈 Future Improvements

Possible future additions include:

- Online payment integration
- Order tracking
- Customer accounts
- Product search
- Product categories and filters
- Inventory management
- Discount and coupon system
- Sales analytics
- Email notifications
- Image upload and cloud storage
- Improved admin dashboard

## 👨‍💻 Developer

Developed as a real-world full-stack web project for the Zarb perfume brand.

Built using modern JavaScript web technologies with a focus on simplicity, maintainability and practical business use.
