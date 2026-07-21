# Findly — AI-Powered Lost & Found System for University Campuses

Findly is a full-stack lost and found platform designed for university campuses. It helps students report lost and found items, uses AI to suggest possible matches, allows admins to review matches, and enables students to communicate safely after a match is confirmed.

The system includes a web admin dashboard, a mobile student application, an ASP.NET Core backend API, PostgreSQL database, Supabase Storage, Supabase Realtime chat, n8n workflow automation, and Gemini AI matching.

---

## Project Overview

Traditional lost and found systems inside universities are often manual, scattered, and inefficient. Students may need to check multiple offices, ask in social media groups, or expose their phone numbers publicly.

Findly solves this problem by centralizing lost and found reports and supporting the recovery process through:

- Student registration and verification
- Lost and found item reporting
- Image upload for item identification
- AI-assisted matching
- Admin match review
- Push notifications
- Private realtime chat
- Report resolution after item recovery

---

## Main Users

| User Role | Description |
|---|---|
| Owner | Has full access to the system and manages universities, admins, categories, students, reports, and matches |
| University Admin | Manages students, reports, and matches for one assigned university branch |
| Student | Uses the mobile app to register, report items, receive matches, chat, and resolve reports |

---

## Tech Stack

### Backend

- ASP.NET Core Web API
- C#
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- BCrypt Password Hashing
- Role-Based Authorization

### Admin Web Dashboard

- React.js
- TypeScript
- Vite
- Axios
- React Router

### Mobile App

- React Native
- Expo
- Expo SecureStore
- Expo ImagePicker
- Expo Push Notifications
- Axios

### Database and Storage

- Supabase PostgreSQL
- Supabase Storage
- Supabase Realtime

### AI and Automation

- n8n Workflow Automation
- Gemini AI

---

## Main Features

### Student Features

- Register with university information
- Upload university card image
- Wait for admin verification
- Login after verification
- Report lost items
- Report found items
- Upload item images
- View possible confirmed matches
- Receive notifications
- Chat with the matched student
- Resolve recovered reports

### Admin Features

- Login with JWT authentication
- View dashboard statistics
- Manage students
- Verify or reject student registrations
- Manage lost and found reports
- Review AI-generated matches
- Confirm or reject matches
- Manage categories
- Manage universities and admins according to role

### AI Matching Features

- Backend triggers n8n after item creation
- n8n requests candidate items from backend
- Backend filters candidates before AI
- Gemini compares item details
- Matches with high similarity are saved as pending
- Admin reviews AI suggestions before students are connected

---

## System Architecture

```text
Student Mobile App
      |
      | Axios + JWT
      v
ASP.NET Core Backend API
      |
      | EF Core
      v
Supabase PostgreSQL Database

Admin React Dashboard
      |
      | Axios + JWT
      v
ASP.NET Core Backend API

Image Upload Flow:
Mobile/Web → Supabase Storage → Public URL → Backend → Database

Realtime Chat Flow:
Backend saves message → Supabase Realtime detects INSERT → Mobile chat updates live

AI Matching Flow:
Backend creates item → n8n webhook → Candidate search → Gemini AI → Save pending match → Admin review
```

---

## Main Workflow

```text
Student registers
→ Admin verifies student
→ Student reports lost or found item
→ Image is uploaded to Supabase Storage
→ Backend saves report
→ Backend triggers n8n workflow
→ n8n gets filtered candidates from backend
→ Gemini compares item details
→ Strong matches are saved as Pending
→ Admin confirms or rejects the match
→ Students receive notifications
→ Students chat privately
→ Student resolves the case after item recovery
```

---

## Matching Workflow

The matching process uses two filtering stages.

### Backend Candidate Filtering

Before sending items to AI, the backend filters candidates using:

- Opposite item type
- Same university
- Same category
- Open status
- Different student
- Close date range
- Candidate limit

### n8n and Gemini Filtering

After candidates are retrieved:

- n8n checks if candidates exist
- Gemini compares item name, description, color, location, date, category, and image URL if useful
- n8n keeps only possible matches with similarity score greater than or equal to 70%
- Backend validates the match again before saving it as Pending

---

## Authentication and Authorization

Findly uses JWT authentication.

After login:

```text
Backend verifies credentials
→ Backend generates JWT
→ Frontend stores token
→ Axios sends token in Authorization header
→ Backend validates token using [Authorize]
```

The JWT contains important claims such as:

- User ID
- Email
- Role
- University ID
- Student verification status

Role-based authorization separates access between Owner, University Admin, and Student.

---

## Image Storage

Findly does not store image files directly in PostgreSQL.

Instead:

```text
User selects image
→ Image is uploaded to Supabase Storage
→ Supabase returns public URL
→ Backend stores URL in database
```

Examples:

| Image Type | Stored In |
|---|---|
| University card image | Supabase Storage |
| Lost item image | Supabase Storage |
| Found item image | Supabase Storage |

Database stores only URLs such as:

- `UniversityCardImageUrl`
- `ImageUrl`

---

## Realtime Chat

Chat becomes available after an admin confirms a match.

Message flow:

```text
Student sends message
→ Backend saves message in Messages table
→ Backend creates notification
→ Supabase Realtime detects new message insert
→ Mobile chat screen updates live
```

Supabase Realtime is used only for live UI updates. The backend still controls message saving and validation.

---

## Notifications

Findly supports two types of notifications:

| Notification Type | Description |
|---|---|
| Database Notification | Saved in the database and shown in the mobile app |
| Expo Push Notification | Sent to the student’s phone through Expo |

Push notification flow:

```text
Student allows notifications
→ Mobile app gets Expo push token
→ Token is sent to backend
→ Backend stores token
→ Match/message event happens
→ Backend sends request to Expo
→ Student receives phone notification
```

---

## Project Structure

```text
Findly
├── backend
│   ├── Controllers
│   ├── Services
│   ├── Models
│   ├── Data
│   ├── Validators
│   └── Migrations
│
├── admin
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── services
│   │   └── api
│
└── mobile
    ├── src
    │   ├── screens
    │   ├── services
    │   ├── api
    │   ├── navigation
    │   └── storage
```

---

## Screenshots

### Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

### Student Verification

![Student Verification](screenshots/student-verification.png)

### Mobile Home

![Mobile Home](screenshots/mobile-home.jpg)

### Report Item Screen

![Report Item](screenshots/report-item.jpg)

### Match Review

![Match Review](screenshots/match-review.png)

### Chat Screen

![Chat Screen](screenshots/chat-screen.jpg)

---

## Demo Video

Demo Video: https://drive.google.com/file/d/1v0SOa4yqmMoDwy0Iu_RnM6rnAb1L9V1M/view?usp=sharing

---

## Setup Instructions

### Backend Setup

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

Backend runs on:

```text
http://localhost:5192
```

### Admin Setup

```bash
cd admin
npm install
npm run dev
```

### Mobile Setup

```bash
cd mobile
npm install
npx expo start
```

---

## Environment Variables

Create environment configuration files for backend, admin, and mobile.

Examples:

- Database connection string
- JWT secret key
- Supabase URL
- Supabase anon key
- n8n webhook URL
- n8n secret
- Gemini API key

Do not commit real secret keys to GitHub.

---

## Future Improvements

- Deploy backend and admin dashboard online
- Add refresh tokens
- Add stronger backend checks for unverified students
- Add stricter message participant validation
- Improve AI matching with weighted scoring
- Add read receipts for chat
- Add advanced notification settings
- Improve image privacy and access rules
- Add analytics dashboard

---

## Author

Sami Farhat  
Computer Science Graduate  
GitHub: https://github.com/SF-47  
LinkedIn: www.linkedin.com/in/sami-farhat-46692641a
