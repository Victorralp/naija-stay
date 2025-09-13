# Firebase Setup Guide for Development

## Resolving "Missing or insufficient permissions" Error

When you see this error during seeding or data operations, it means your Firestore security rules are preventing write operations. Here's how to fix it:

## 1. Temporary Development Rules (For Development Only)

For development purposes, you can use these permissive rules that allow read/write access:

1. Go to the Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Navigate to Firestore Database → Rules tab
4. Replace the existing rules with these development rules:

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

5. Click "Publish" to apply the rules

## 2. Why This Happens

The error occurs because:
- Firebase security rules are set to restrict access by default
- Your application is trying to write data to Firestore
- The current rules don't allow these write operations

## 3. Seeding Data After Updating Rules

After updating the security rules:
1. Go to your application at http://localhost:8081/seed-data
2. Click "Seed Database" to populate with sample data
3. Navigate to /hotels or /rooms to see the populated data

## 4. Production Rules (For Production Deployment)

When you're ready to deploy to production, update your rules to these more secure ones:

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

## 5. Important Notes

- The development rules should only be used during development
- Never deploy permissive rules to production
- The production rules provide a good balance of security and functionality
- Admin users should have a custom claim set with `admin: true` or `role: 'admin'`
- Regular users can read most data but can only modify their own data