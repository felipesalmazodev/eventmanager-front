# Event Manager Frontend

This is the frontend application for the **Event Manager** platform,
built with **Next.js (App Router)**, **React**, **TypeScript**, and
**Bootstrap**.\
It integrates with a Spring Boot backend to provide authentication,
event management, place management, and address enrichment via ViaCEP.

The application focuses on: - Secure authentication with Google OAuth -
Integration with a REST API backend - Form handling and validation with
React Hook Form - Global state management with Zustand - Clean
separation between pages, components, services, hooks, and store

------------------------------------------------------------------------

## Main Features

-   **Google OAuth Login**
    -   Users authenticate via Google
    -   Backend issues a JWT token
    -   Frontend stores the token and sends it in
        `Authorization: Bearer <token>` headers
-   **Authentication Handling**
    -   Token stored in `localStorage`
    -   Protected routes for authenticated areas
    -   Logout clears token and session
    -   Centralized auth state using Zustand
-   **ViaCEP Integration**
    -   The frontend exposes an internal API route to fetch CEP data
    -   When the user types a CEP, the address is fetched and fields are
        auto-filled
    -   Address fields are shown as read-only after enrichment
-   **Forms and Validation**
    -   Forms built with **React Hook Form**
    -   Client-side validation before sending data to the backend
    -   Clear feedback for invalid or missing fields
-   **API Error Handling**
    -   Centralized fetch wrapper in the services layer
    -   Displays meaningful messages returned by the backend
    -   Handles authentication and validation errors consistently

------------------------------------------------------------------------

## Tech Stack

-   **Next.js (App Router)**
-   **React**
-   **TypeScript**
-   **Bootstrap 5**
-   **Zustand** (state management)
-   **React Hook Form** (form handling)

------------------------------------------------------------------------

## Project Structure

The project follows a modular structure using **Next.js App Router**,
with a clear separation between **pages, components, services, hooks,
and state management**.

    app/
     ├── api/
     │   └── viacep/
     │       └── [cep]/
     │           └── route.ts
     │           # Server route that proxies requests to ViaCEP
     │
     ├── auth/
     │   └── callback/
     │       └── page.tsx
     │       # Receives JWT token after Google OAuth login and stores it
     │
     ├── login/
     │   └── page.tsx
     │   # Login page that starts the Google OAuth flow
     │
     ├── events/
     │   ├── page.tsx
     │   │   # Events list page
     │   ├── new/
     │   │   └── page.tsx
     │   │       # Create event page
     │   └── [id]/
     │       ├── page.tsx
     │       │   # Event details page
     │       └── edit/
     │           └── page.tsx
     │               # Edit event page
     │
     ├── places/
     │   ├── page.tsx
     │   │   # Places list page
     │   ├── new/
     │   │   └── page.tsx
     │   │       # Create place page
     │   └── [id]/
     │       ├── page.tsx
     │       │   # Place details page
     │       └── edit/
     │           └── page.tsx
     │               # Edit place page
     │
     ├── layout.tsx
     │   # Global layout (header, providers, base layout)
     │
     └── page.tsx
         # Home / entry page

------------------------------------------------------------------------

## Core Folders

    components/
     ├── Header.tsx
     │   # Application header with logo and logout button
     └── ProtectedRoute.tsx
         # Route guard for authenticated pages

    services/
     ├── api.ts
     │   # Centralized fetch wrapper with Authorization header and error handling
     ├── authService.ts
     │   # Authentication-related API calls
     ├── eventsService.ts
     │   # Events API integration
     └── placesService.ts
         # Places API integration

    hooks/
     └── useAuth.ts
         # Authentication helper hook

    store/
     └── authStore.ts
         # Zustand store for authentication state (token, login, logout, etc.)

------------------------------------------------------------------------

## Architectural Overview

-   **app/**\
    Contains all application routes and pages using Next.js App Router.

-   **components/**\
    Reusable UI and layout components, including the header and route
    protection.

-   **services/**\
    Centralized API communication layer:

    -   Attaches JWT token to requests
    -   Handles HTTP errors
    -   Isolates backend integration logic

-   **hooks/**\
    Custom React hooks focused on authentication logic.

-   **store/**\
    Global state management using **Zustand**, mainly for authentication
    state.

------------------------------------------------------------------------

## Environment Variables

Copy the example file and create your own `.env`:

``` bash
cp .env.example .env.local
```

Then configure:

``` env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Important Notes

-   When running **locally**, your **backend and databases must be
    running**
-   When deploying to **Vercel**, your **backend must be public**
-   The `NEXT_PUBLIC_API_BASE_URL` **must point to the public backend
    URL** in production
-   Always remember to copy `.env.example` to `.env.local`

------------------------------------------------------------------------

## Running the Project Locally

Install dependencies:

``` bash
npm install
```

Run the development server:

``` bash
npm run dev
```

Open in your browser:

    http://localhost:3000

------------------------------------------------------------------------

## Authentication Flow (Simplified)

    Frontend (/login)
       ↓
    Backend (/oauth2/authorization/google)
       ↓
    Google OAuth
       ↓
    Backend (/login/oauth2/code/google)
       ↓ (generates JWT)
    Frontend (/auth/callback?token=JWT)
       ↓
    localStorage
       ↓
    Authorization: Bearer JWT (on every API request)

------------------------------------------------------------------------

## ViaCEP Integration

-   The frontend exposes an internal API route:\
    `app/api/viacep/[cep]/route.ts`
-   This route:
    -   Receives the CEP
    -   Calls ViaCEP
    -   Returns the address data to the frontend
-   Forms use this to auto-fill address fields when the user enters a
    CEP

------------------------------------------------------------------------

## Deployment (Vercel)

Vercel is the recommended platform for this project.

### Steps

1.  Push this repository to GitHub
2.  Go to https://vercel.com
3.  Click **New Project**
4.  Import your GitHub repository
5.  Set the environment variable:

```
NEXT_PUBLIC_API_BASE_URL = https://your-public-backend-url
```

6.  Deploy

### Important

-   Your **backend must be publicly accessible**
-   The frontend **will not work** if the backend is only available
    locally
-   Make sure CORS is properly configured in your backend

------------------------------------------------------------------------

## How to Test the Application

1.  Start the backend and databases
2.  Start the frontend
3.  Login with Google
4.  Create, edit, and list Places and Events
5.  Test CEP auto-fill in Place forms
6.  Test form validations
7.  Test API error responses (e.g., invalid data, business rule
    violations)
8. You can use the following valid Brazilian CEPs to test the ViaCEP
integration in the Place forms:

-   **01001000** --- Praça da Sé, São Paulo - SP
-   **20040002** --- Centro, Rio de Janeiro - RJ
-   **30140071** --- Belo Horizonte - MG
-   **70040900** --- Brasília - DF
-   **80010000** --- Curitiba - PR

Just paste one of these CEPs into the CEP field and the address fields
should be auto-filled.

------------------------------------------------------------------------

## Final Notes

-   Always copy `.env.example` to `.env`
-   Local testing requires backend + databases running
-   Production requires a **public backend URL**