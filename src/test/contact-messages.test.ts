import { db } from '../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

async function testContactMessages() {
  console.log('Testing contact messages functionality...');
  
  try {
    // Test reading from contactMessages collection
    const messagesCollection = collection(db, 'contactMessages');
    const snapshot = await getDocs(messagesCollection);
    console.log(`Successfully read ${snapshot.size} documents from contactMessages collection`);
    
    // Log the first few messages for inspection
    snapshot.docs.slice(0, 3).forEach(doc => {
      console.log('Message:', doc.id, doc.data());
    });
    
    // Test writing a sample message
    const sampleMessage = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message',
      createdAt: new Date(),
      status: 'unread'
    };
    
    const docRef = await addDoc(collection(db, 'contactMessages'), sampleMessage);
    console.log('Successfully added test message with ID:', docRef.id);
    
    console.log('Contact messages test passed!');
  } catch (error) {
    console.error('Contact messages test failed:', error);
  }
}

// Run the test
testContactMessages();