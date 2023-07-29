import React, { useState, useEffect } from 'react';


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
        limit: '25',
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
      // console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };
  

  const itemsWithPhotos = data.filter((item) => item.photo && item.num_reviews > 20);

  const handleReviewsButtonClick = (link) => {
    window.open(link, '_blank'); // Open the link in a new tab
  };
  return (
<>

<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {isLoading ? (
    
<div role="status">
    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>

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
              {item.num_reviews} reviews<svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
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
</div>


    </>
  );
};




export default FetchTravelApi;
