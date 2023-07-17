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
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        limit: '5',
        distance: '5',
        lunit: 'km',
        lang: 'en_US',
      });
  
      const response = await fetch(`https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?${params}`, {
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_TRAVELADVISOR,
          'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
        },
      });
  
      const data = await response.json();
      setData(data.data || []);
      setIsLoading(false);
      console.log(data);
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

<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {isLoading ? (
    <p>Loading...</p>
  ) : itemsWithPhotos.length > 0 ? (
    // Render your data here
    itemsWithPhotos.map((item) => (
      <div key={item.location_id} className="bg-gray-800 shadow-3xl font-sans rounded-lg hover:scale-105">
        {/* Card content */}
        <div className="relative h-72 w-full overflow-hidden rounded-t-lg">
          <img src={item.photo.images.medium.url} alt={item.name} className="h-full w-full object-cover" />
          <div className="absolute bottom-2 left-2">
            <button
              onClick={() => handleReviewsButtonClick(item.web_url)}
              className="flex items-center p-2 text-sm font-poppins tracking-tight hover:scale-105 text-white bg-slate-500 rounded-md"
            >
              {item.num_reviews} reviews<svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
            </button>
          </div>
        </div>
        <h2 className="text-lg mx-3 font-bold tracking-tight mb-1 p-1 text-zinc-50">{item.name}</h2>
        <div className="text-gray-400 p-2 mx-3 mb-2 font-sans text-base">{item.address}</div>
        {/* Add other properties here */}
      </div>
    ))
  ) : (
    <p className="text-center font-mono text-lg">No data found for the location!</p>
  )}
</div>;


    </>
  );
};




export default FetchTravelApi;
