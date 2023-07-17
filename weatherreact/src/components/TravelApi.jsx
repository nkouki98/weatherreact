import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FetchTravelApi = ({ latitude, longitude }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (latitude && longitude) {
      fetchData();
    }
  }, [latitude, longitude]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng', {
        params: {
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          limit: '30',
          currency: 'USD',
          distance: '2',
          open_now: 'false',
          lunit: 'km',
          lang: 'en_US',
        },
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_TRAVELADVISOR,
          'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
        },
      });

      setData(response.data.data || []);
      setIsLoading(false);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const itemsWithPhotos = data.filter((item) => item.photo && item.num_reviews > 5);

  const handleReviewsButtonClick = (link) => {
    window.open(link, '_blank'); // Open the link in a new tab
  };
  return (
<>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {isLoading ? (
        <p>Loading...</p>
      ) : itemsWithPhotos.length > 0 ? (
        // Render your data here
        itemsWithPhotos.map((item) => (
          <div key={item.location_id} className="bg-zinc-700 rounded-lg shadow-3xl font-sans hover:scale-105">
            {/* Card content */}
            <img src={item.photo.images.medium.url} alt={item.name} className=" mb-2 w-full max-h-min object-fill rounded-t-lg" />
            <h2 className="text-base font-sans font-semibold mb-1 mx-2 text-zinc-50">{item.name}</h2>
            <div className="text-white p-1 mx-3 font-sans">{item.address}</div>
            <button type="button"  onClick={() => handleReviewsButtonClick(item.web_url)} className=" text-yellow-400 p-2 text-sm font-sans border border-yellow-200 hover:scale-105 mb-5 my-2 shadow-md rounded-md">{item.num_reviews} reviews</button>
            {/* Add other properties here */}
          </div>
        ))
      ) : (
        <p className='text-center font-mono text-lg'>No data found for the location!</p>
      )}
    </div>
    </>
  );
};




export default FetchTravelApi;
