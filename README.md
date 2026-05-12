# Health Savvy — Deployment Guide

## Files
- `index.html` — main app
- `manifest.json` — PWA manifest
- `sw.js` — service worker for offline support

## Deploy to Firebase Hosting

### One-time setup
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

When prompted:
- Public directory: `.` (current folder, or wherever your files are)
- Single-page app: Yes
- Don't overwrite index.html

### Deploy
```bash
firebase deploy --only hosting
```

Your app will be live at: `https://health-savvy-d75d8.web.app`

## Firestore Rules (update after testing)
Go to Firestore > Rules and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /meals/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
    match /workouts/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
    match /expenses/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## Features
- Sign up / Sign in with email + password
- Dashboard: today's calories, protein, spend, workout summary
- Food log: log ingredients from your list or custom items
- Budget tracker: monthly spend vs $250 CAD budget
- Gym log: log exercises with sets, weight, reps
- AI assistant: knows your full profile, goals, today's data
- PWA: add to phone home screen for app-like experience
