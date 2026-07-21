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
