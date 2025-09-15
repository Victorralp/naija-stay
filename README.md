# NaijaStay - Nigerian Hotel Booking Platform

NaijaStay is a modern, responsive hotel booking website for Nigerian hotels and resorts, built with React, Vite, and Firebase. The platform emphasizes local culture, seamless user experience, and reliable payments.

## Features

- **Authentication**: Email/password login/signup with Firebase Auth
- **Hotel Listings**: Browse hotels with filtering by location, price, and ratings
- **Booking System**: Complete booking flow with Paystack/Flutterwave integration
- **Admin Dashboard**: Comprehensive admin tools for managing hotels, rooms, bookings, and users
- **Media Management**: Cloudinary integration for image and video hosting with automatic optimization
- **Responsive Design**: Mobile-first design with TailwindCSS

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: TailwindCSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Payments**: Paystack/Flutterwave (NGN)
- **Media**: Cloudinary for image and video optimization
- **Deployment**: Firebase Hosting

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Firebase account
- Cloudinary account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd naija-stay-book
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with your credentials:
   ```
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

   # Cloudinary Configuration
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
   VITE_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Cloudinary Integration

NaijaStay uses Cloudinary for media management, providing automatic optimization and responsive delivery of images and videos.

### Benefits

- Automatic image and video optimization
- Responsive delivery based on device requirements
- Format conversion to modern formats (WebP, AVIF)
- CDN delivery for fast global access
- On-the-fly transformations

### Setup

1. Sign up for a Cloudinary account at [https://cloudinary.com](https://cloudinary.com)
2. Obtain your Cloud Name, API Key, and API Secret
3. Add these credentials to your `.env` file

For detailed information about the Cloudinary integration, see [CLOUDINARY_INTEGRATION.md](src/docs/CLOUDINARY_INTEGRATION.md).

## Admin Features

The admin dashboard includes comprehensive tools for managing the platform:

- Hotel and room management
- Booking and payment handling
- User management with role-based access
- Analytics and reporting
- Newsletter and contact message management
- Media management for images and videos

For detailed information about admin features, see [ADMIN_FEATURES.md](ADMIN_FEATURES.md).

## Project Structure

```
naija-stay-book/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # Business logic and API services
│   ├── lib/            # Utility functions and configurations
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   └── docs/           # Documentation files
├── public/             # Static assets
├── .env                # Environment variables
└── package.json        # Project dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Firebase Setup

For Firebase configuration instructions, see [FIREBASE_SETUP.md](src/docs/FIREBASE_SETUP.md).

## Security

For Firebase security rules, see [FIREBASE_SECURITY_RULES.md](FIREBASE_SECURITY_RULES.md).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.

## Contact

For support or inquiries, please open an issue on the repository.