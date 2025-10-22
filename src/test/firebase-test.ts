import { db } from '../lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

async function testFirebaseConnection() {
  console.log('Testing Firebase connection...');
  
  try {
    // Test reading from Firestore
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    console.log(`Successfully read ${snapshot.size} documents from test collection`);
    
    // Test writing to Firestore
    const docRef = await addDoc(collection(db, 'test'), {
      test: 'test',
      timestamp: new Date()
    });
    console.log('Successfully wrote document with ID:', docRef.id);
    
    console.log('Firebase connection test passed!');
  } catch (error) {
    console.error('Firebase connection test failed:', error);
  }
}

// Run the test
testFirebaseConnection();