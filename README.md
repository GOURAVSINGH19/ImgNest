📁 File Management System

A modern, secure, and responsive file management system built with Next.js 14. Features include folder organization, secure file uploads, trash management, and a beautiful UI.

🚀 Tech Stack

🖥 Frontend
```
Next.js 14 – App Router powered React framework

TypeScript – Type-safe JavaScript

Tailwind CSS – Utility-first CSS framework

Lucide Icons – Elegant, consistent icon set

React Toastify – Toast notifications

Axios – Promise-based HTTP client

cicd - continuous integration and continuous delivery 

```
🔧 Backend
```
Next.js API Routes – Serverless backend

Drizzle ORM – Type-safe SQL ORM

Neon – Scalable, serverless PostgreSQL database

ImageKit – Media upload, transformation, and CDN

Clerk – Complete auth solution
```
```
📋 Prerequisites
Before getting started, make sure you have:
Node.js v18.x or higher
A Neon database account
An ImageKit account
A Clerk account
```
🔐 Environment Variables
Create a .env file in the root and add the following:
```
# Database
DATABASE_URL="your_neon_database_url"

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="your_imagekit_url_endpoint"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

```
🛠️ Installation

Clone the repo
```
git clone https://github.com/GOURAVSINGH19/ImgNest.git
cd ImgNest
Install dependencies 
```
```
npm install
# or
yarn install
```
```
npm run dev
# or
yarn dev
Visit http://localhost:3000
```
📁 Project Structure
```
├── app/                    # Next.js app directory
│   ├── api/                # API routes (server functions)
│   └── (routes)/           # App routes
├── components/             # Shared React components
├── drizzle/                # DB schema, migrations
├── lib/                    # Utility functions
├── public/                 # Static assets
└── styles/                 # Global styles (Tailwind)
```


✨ Features
```
📂 Organize files in folders
⭐ Star your favorite files
🗑️ Trash system with undo option
🔒 Secure file uploads & downloads
📱 Mobile-responsive UI
🔍 Search & filter files
📤 Upload & download with ImageKit
👤 Auth & sessions powered by Clerk
📦 API Endpoints
📄 File Operations
```
```
Method	Endpoint	Description
GET	/api/files	List all files
POST	/api/files	Upload a new file
DELETE	/api/files/[fileId]	Delete a file
PATCH	/api/files/[fileId]/star	Star/unstar a file
POST	/api/files/[fileId]/trash	Move file to trash

📁 Folder Operations
Method	Endpoint	Description
GET	/api/folders	List all folders
POST	/api/folders	Create a folder
DELETE	/api/folders/[folderId]	Delete a folder
```

🤝 Like the repo if you like

## Using the CLI with Clerk Session Token

To use the CLI, you need your Clerk session token. Follow these steps:

1. **Log in to the web app.**
2. **Click the `Token` button** (usually in the navbar or profile area) to reveal your CLI token. This uses the `ShowCLIToken` component.
3. **Copy the token** to your clipboard.
4. **Login to the CLI with your token:**
   ```bash
   Inest login --token <your_clerk_session_token>
   ```
5. **Now you can upload files or list your files using the CLI!**

Example:
```bash
Inest upload myfile.jpg
Inest list
```

**Note:** Keep your token secure. If you log out of the web app, your token may expire and you will need to repeat these steps.
