# Firebase Security Rules Configuration

This document provides instructions for configuring Firebase Security Rules for the naija-stay-book project.

## Development Rules (For Development Only)

For development purposes, you can use these permissive rules that allow read/write access:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users in development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Production Rules (Recommended for Production)

For production deployment, use these more secure rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Publicly readable collections
    match /hotels/{hotel} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
        (request.auth.token.admin == true || request.auth.token.role == 'admin');
    }
    
    match /rooms/{room} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
        (request.auth.token.admin == true || request.auth.token.role == 'admin');
    }
    
    match /testimonials/{testimonial} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
        (request.auth.token.admin == true || request.auth.token.role == 'admin');
    }
    
    // Authenticated users can read services
    match /services/{service} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
        (request.auth.token.admin == true || request.auth.token.role == 'admin');
    }
    
    // Users can read/write their own bookings
    match /bookings/{booking} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.token.admin == true || 
         request.auth.token.role == 'admin');
    }
    
    // Users can read/write their own profiles
    match /users/{user} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == user;
    }
    
    // Newsletter subscriptions
    match /newsletter/{subscriber} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && 
        (request.auth.token.admin == true || request.auth.token.role == 'admin');
    }
    
    // Contact messages
    match /messages/{message} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && 
        (request.auth.token.admin == true || request.auth.token.role == 'admin');
    }
  }
}

// Storage rules
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.token.admin == true || request.auth.token.role == 'admin');
    }
    
    // User profile pictures
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## How to Apply These Rules

1. Go to the Firebase Console
2. Select your project
3. Navigate to Firestore Database → Rules tab
4. Replace the existing rules with the ones above
5. Click "Publish" to apply the rules

## Notes

- The development rules should only be used during development
- The production rules provide a good balance of security and functionality
- Admin users should have a custom claim set with `admin: true` or `role: 'admin'`
- Regular users can read most data but can only modify their own data