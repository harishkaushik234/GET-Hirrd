# 🚀 Job Portal Web Application

A full-stack **Job Portal Web Application** where **candidates** can explore and apply for jobs, and **recruiters** can post and manage job listings.  
The project is built using **React (Vite)** on the frontend, **Supabase** as backend (database + storage), and **Clerk** for authentication.

---

## ✨ Features

### 👤 Authentication (Clerk)

- Secure Login & Signup
- Role-based access (Candidate / Recruiter)
- Session handling & protected routes

### 🧑‍💼 Candidate Features

- Browse all available jobs
- Filter jobs by location and company
- Save / Unsave jobs
- Apply for jobs with resume upload
- View applied jobs

### 🧑‍💻 Recruiter Features

- Create and manage companies
- Post new job openings
- Open / Close job status
- View applications for posted jobs
- Manage hiring status

### 🗄️ Backend (Supabase)

- PostgreSQL database
- Row Level Security (RLS)
- Secure file storage (Resumes & Company Logos)
- Foreign key constraints for data integrity

---

## 🛠️ Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS
- React Hook Form + Zod
- React Router DOM

### Backend / Services

- Supabase (Database + Storage)
- Clerk (Authentication)
- Cloudflare (via Clerk, internally)

---

## 📂 Database Schema (Main Tables)

- `companies`
- `jobs`
- `saved_jobs`
- `applications`

All tables are protected using **Supabase RLS policies**.

---

## 🔐 Security

- Role-based access control
- Supabase Row Level Security
- Secure resume uploads
- Clerk session-based authentication

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

▶️ Run Locally
1.npm install
2.npm run dev
The app will run on:
http://localhost:5173

🌍 Deployment
rontend deployed on Vercel

upabase used as managed backend

lerk Production keys used for authentication

🧠 Key Learnings
Implemented secure authentication with Clerk

Used Supabase RLS for data protection

Built role-based UI for recruiters and candidates

Managed file uploads and relational data

Solved real-world database constraints and policies

👨‍💻 Author
Harish
B.Tech CSE
Full Stack Developer (MERN + Supabase)
