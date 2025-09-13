import { hotelService } from '@/services/hotelService';

// Sample hotel data for Nigerian cities
const sampleHotels = [
  {
    name: "Eko Hotels & Suites",
    description: "Luxury hotel located in the heart of Victoria Island, Lagos with stunning ocean views and world-class amenities.",
    location: "Victoria Island",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    rating: 4.5,
    priceRange: "₦25,000 - ₦80,000",
    amenities: ["Free WiFi", "Swimming Pool", "Restaurant", "Gym", "Spa", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    available: true
  },
  {
    name: "Transcorp Hilton Abuja",
    description: "Premium hotel located in the diplomatic district of Abuja, offering luxurious accommodations and exceptional service.",
    location: "Diplomatic Zone",
    city: "Abuja",
    state: "Abuja",
    country: "Nigeria",
    rating: 4.7,
    priceRange: "₦30,000 - ₦90,000",
    amenities: ["Free WiFi", "Swimming Pool", "Restaurant", "Gym", "Conference Hall", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    available: true
  },
  {
    name: "Protea Hotel by Marriott",
    description: "Modern hotel in the bustling commercial area of Port Harcourt with comfortable rooms and excellent facilities.",
    location: "Eleme",
    city: "Port Harcourt",
    state: "Rivers",
    country: "Nigeria",
    rating: 4.2,
    priceRange: "₦20,000 - ₦60,000",
    amenities: ["Free WiFi", "Restaurant", "Gym", "Parking", "24/7 Front Desk"],
    images: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    available: true
  }
];

// Sample room data
const sampleRooms = [
  // Rooms for Eko Hotels & Suites
  {
    hotelId: "", // Will be populated after hotel creation
    name: "Deluxe Ocean View Suite",
    description: "Spacious suite with breathtaking ocean views, king-sized bed, and premium amenities.",
    type: "Deluxe Suite",
    capacity: 4,
    pricePerNight: 80000,
    amenities: ["Free WiFi", "Ocean View", "King Bed", "Balcony", "Mini Bar", "TV", "Air Conditioning"],
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    available: true
  },
  {
    hotelId: "", // Will be populated after hotel creation
    name: "Executive Room",
    description: "Comfortable executive room with city views, work desk, and modern amenities.",
    type: "Executive",
    capacity: 2,
    pricePerNight: 45000,
    amenities: ["Free WiFi", "City View", "Work Desk", "TV", "Air Conditioning", "Tea/Coffee Maker"],
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    available: true
  },
  // Rooms for Transcorp Hilton Abuja
  {
    hotelId: "", // Will be populated after hotel creation
    name: "Presidential Suite",
    description: "Luxurious presidential suite with separate living area, dining room, and panoramic city views.",
    type: "Presidential Suite",
    capacity: 6,
    pricePerNight: 90000,
    amenities: ["Free WiFi", "City View", "King Bed", "Living Area", "Dining Room", "Kitchenette", "Balcony", "Mini Bar", "TV", "Air Conditioning"],
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    available: true
  },
  {
    hotelId: "", // Will be populated after hotel creation
    name: "Deluxe Room",
    description: "Elegant deluxe room with modern amenities and comfortable furnishings.",
    type: "Deluxe",
    capacity: 2,
    pricePerNight: 55000,
    amenities: ["Free WiFi", "City View", "Queen Bed", "Work Desk", "TV", "Air Conditioning", "Tea/Coffee Maker"],
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    available: true
  },
  // Rooms for Protea Hotel
  {
    hotelId: "", // Will be populated after hotel creation
    name: "Standard Room",
    description: "Comfortable standard room with essential amenities and city views.",
    type: "Standard",
    capacity: 2,
    pricePerNight: 25000,
    amenities: ["Free WiFi", "City View", "Queen Bed", "TV", "Air Conditioning"],
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    available: true
  },
  {
    hotelId: "", // Will be populated after hotel creation
    name: "Family Room",
    description: "Spacious family room with extra beds, perfect for families traveling together.",
    type: "Family",
    capacity: 4,
    pricePerNight: 40000,
    amenities: ["Free WiFi", "City View", "Queen Bed", "Two Single Beds", "TV", "Air Conditioning", "Work Desk"],
    images: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    available: true
  }
];

export const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");
    
    // Create hotels and store their IDs
    const hotelIds: string[] = [];
    for (const hotelData of sampleHotels) {
      const hotelId = await hotelService.addHotel(hotelData);
      hotelIds.push(hotelId);
      console.log(`Created hotel: ${hotelData.name} with ID: ${hotelId}`);
    }
    
    // Assign hotel IDs to rooms and create them
    // First hotel (Eko Hotels & Suites) gets first 2 rooms
    sampleRooms[0].hotelId = hotelIds[0];
    sampleRooms[1].hotelId = hotelIds[0];
    
    // Second hotel (Transcorp Hilton Abuja) gets next 2 rooms
    sampleRooms[2].hotelId = hotelIds[1];
    sampleRooms[3].hotelId = hotelIds[1];
    
    // Third hotel (Protea Hotel) gets last 2 rooms
    sampleRooms[4].hotelId = hotelIds[2];
    sampleRooms[5].hotelId = hotelIds[2];
    
    // Create rooms
    for (const roomData of sampleRooms) {
      const roomId = await hotelService.addRoom(roomData);
      console.log(`Created room: ${roomData.name} with ID: ${roomId} for hotel: ${roomData.hotelId}`);
    }
    
    console.log("Database seeding completed successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
};