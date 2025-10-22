import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

async function addTestContactMessage() {
  try {
    const docRef = await addDoc(collection(db, 'contactMessages'), {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message to verify that contact messages are working properly.',
      createdAt: Timestamp.now(),
      status: 'unread'
    });
    
    console.log('Test contact message added with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding test contact message:', error);
  }
}

// Run the function
addTestContactMessage();