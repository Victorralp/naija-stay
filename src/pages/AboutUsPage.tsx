import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About Naija Hotels</h1>
        <p className="text-gray-600 mb-6">
          Naija Hotels is a premier online booking platform dedicated to providing a seamless and enjoyable experience for travelers seeking accommodations across Nigeria. Our mission is to connect you with the best hotels, guest houses, and apartments in every corner of the country, from the bustling cities to serene and hidden gems.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-6">
          Our mission is to make travel within Nigeria more accessible and enjoyable. We aim to provide a comprehensive platform that not only simplifies the booking process but also offers valuable insights into the best places to stay and visit. We are committed to supporting local businesses and promoting the rich cultural heritage of Nigeria.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
        <ul className="list-disc list-inside text-gray-600 mb-6">
          <li className="mb-2">
            <span className="font-semibold">Wide Selection:</span> We offer a wide range of accommodations to suit every budget and preference.
          </li>
          <li className="mb-2">
            <span className="font-semibold">Best Prices:</span> We negotiate the best rates to ensure you get the most value for your money.
          </li>
          <li className="mb-2">
            <span className="font-semibold">Secure Booking:</span> Our platform uses the latest technology to ensure your personal information and payments are secure.
          </li>
          <li className="mb-2">
            <span className="font-semibold">24/7 Customer Support:</span> Our dedicated customer support team is always available to assist you with any queries or concerns.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUsPage;