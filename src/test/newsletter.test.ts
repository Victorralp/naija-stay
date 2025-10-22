import { newsletterService } from '../services/newsletterService';

// Test the newsletter service
async function testNewsletterService() {
  console.log('Testing newsletter service...');
  
  try {
    // Test with a valid email
    const result = await newsletterService.subscribe('test@example.com');
    console.log('Subscription result:', result);
    
    // Test with an invalid email
    const invalidResult = await newsletterService.subscribe('invalid-email');
    console.log('Invalid email result:', invalidResult);
    
    // Test duplicate subscription
    const duplicateResult = await newsletterService.subscribe('test@example.com');
    console.log('Duplicate subscription result:', duplicateResult);
    
  } catch (error) {
    console.error('Error testing newsletter service:', error);
  }
}

// Run the test
testNewsletterService();