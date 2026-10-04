# Reaction Time Test

A modern web-based reaction time test application built with typescript,next.js and tailwind css. Train tour reaction time,compete with the others on leaderboard, and track your progress over time.

# Features

1. Reaction time test : interactive reaction time test with customizable difficulty
2. Statistic tracking : information of personal performance and progress
3. Leaderboard        : global ranking to compete with other users
4. Admin dashboard    : user management and system statistics for administrators
5. Database           : MySQL database with Prisma ORM for data management

# Tech Stack

-  Frontend    : Next.js,React,Typescript
-  Styling     : Tailwind CSS
-  Auth        : NextAuth.js
-  Database    : MySQL with Prisma ORM
-  Development : Docker Compose

# Prerequisites

- Node.js (v18 or Higher)
- npm 
- MySQL
- Git

# Installation

1. Clone The Repository

```bash
git clone https://github.com/jesper245/Aplikasi-Reaction-Time-Test.git
cd aimtrainer
```

2. install dependencies

```bash
npm install
```

3. Environment Setup

create a  ".env" file in the root directory :
```env
#authentication(auth.js)
AUTH_SECRET="your-auth-secret-here"

4. Database 

DATABASE_URL="mysql://root:secret@localhost:3306/aimtrainer"```

**Note**: You can generate an `AUTH_SECRET` by running `npx auth secret` or use any secure random string.


# Option 1 : Using Docker

1. Start MySQL with Docker Compose

```bash
docker-compose -f docker-compose.dev.yaml up -d
```

2. Setup Database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

3. Start Development Server

```bash
npm run dev
```



# Acces the Aplication

- Main App   : http://localhost:3000
- Admin      : http://localhost:3000/admin
- User stats : http://localhost:3000/me/stats



# Available Scripts

```bash
# Development
- npm run dev          # Start development server
- npm run build        # Build for production
- npm run start        # Start production server
- npm run lint         # Run ESLint 

# Database

- npx prisma studio    # open prisma studio
- npx prisma migrate   # run migrations database
- npx prisma db seed   # seed database with sample data


# Usage

## For Players
1. **Register/Login**: Create an account or sign in
2. **Play**: Click "Start Training" on the home page
3. **Track Progress**: View your statistics in the "Stats" section
4. **Compete**: Check your ranking on the leaderboard

## For Administrators
1. **Login** with admin credentials
2. **Access Admin Panel**: Navigate to `/admin`
3. **Manage Users**: View, edit, or delete user accounts
4. **View Statistics**: Monitor system-wide performance metrics

# Database Schema

## Core Models:
- **User**: User accounts with authentication and roles
- **Score**: Individual game scores and performance data
- **BestScore**: Personal best scores per game type

## Supported Game Types:
- **AIMTARGET**: Click accuracy and speed training



** HAPPY TRAINING !!! **