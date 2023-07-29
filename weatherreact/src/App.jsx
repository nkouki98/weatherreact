import { useEffect, useState } from 'react'
import { WiHumidity } from 'react-icons/wi';
import FetchTravelApi from './components/TravelApi';
import * as BootStrap from "react-icons/bs";
import './App.css';



const api = {
  key: import.meta.env.VITE_OPENWEATHER,
  base: "https://api.openweathermap.org/data/2.5/"
}


function App() {

  const [imageReady, setImageReady] = useState(false); // State variable to track image preload
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState({});
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
 
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const getUnsplashPhoto = async (cityparam) => {
    try {
      const apiKey = import.meta.env.VITE_UNSPLASH;
      const response = await fetch(
        `https://api.unsplash.com/search/photos?client_id=${apiKey}&query=${cityparam}&per_page=1`
      );
      const data = await response.json();
      const photo = data.results[0]; // Get the first photo from the results
      // console.log(photo);
      if (photo) {
        const preloadImage = new Image();
        preloadImage.onload = () => {
          setImageUrl(preloadImage.src); // Set the image URL once it's fully loaded
          setImageReady(true); // Set imageReady to true when the image is loaded

        };

        preloadImage.onerror = () => {
          setImageUrl('/clear3.jpg'); // Set the fallback image in case the Unsplash image fails to load
          setImageReady(true); // Set imageReady to true even if the image fails to load (optional)
          
          console.log("Error loading image");
          
        };

        preloadImage.src = photo.urls.full; // Start preloading the image
      } else {
        setImageUrl(''); // Reset imageUrl if no photo is found
      
      }
    } catch (error) {
      console.error(error);
    }
  };




  const getCoordinatesFromCity = async (cityparam) => {
    const apiKey = import.meta.env.VITE_OPENCAGE;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cityparam)}&key=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setLongitude(lng);
        setLatitude(lat);
        // console.log('Latitude:', lat);
        // console.log('Longitude:', lng);
      } else {
        console.log('Location not found.');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };
  
  const getWeather = async event => {
    if(event.key === "Enter") {
      try{
        fetch(`${api.base}weather?q=${city}&units=metric&appid=${api.key}`)
        .then(res => res.json())
        .then(result => {
        setCity('');
        setTimeout(() => {
          setWeather(result); 
        }, 700);
        });
        } catch (error) {
        setError(error);

        console.error(error);
        }

    }
  }
 
  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      setIsLoading(true);
      try {
        await getUnsplashPhoto(city);
        await getWeather(event);
        await getCoordinatesFromCity(city);
       
    } catch (error) {
        console.error(error);
      }
      setIsLoading(false); 
    }

  };

 
  const getWeatherOnClick = async (param) => {

      try{
        fetch(`${api.base}weather?q=${param}&units=metric&appid=${api.key}`)
        .then(res => res.json())
        .then(result => {
        setCity('');
        setTimeout(() => {
        setWeather(result); 
        }, 700);
        });
        } catch (error) {
        console.error(error);
        }

    
  }
  const handleImageClick = async (cityName) => {
      setIsLoading(true);
      try {
        await getUnsplashPhoto(cityName);
        await getWeatherOnClick(cityName)
        await getCoordinatesFromCity(cityName);
      
      } catch (error) {
        console.error(error);
      }
    setIsLoading(false); 
  };

  const handlenav = () => {
      setWeather({});
      setImageUrl('');
  }


return (

<>

        {/* Full-screen background */}

      {typeof weather.main !== "undefined"   && imageReady  ?(
        
        <>
        <div className="relative min-h-screen shadow-2xl rounded-xl overflow-y-auto">
          <div className="absolute inset-2 bg-cover bg-center bg-no-repeat bg-blend-overlay bg-black/50 shadow-xl rounded-lg"     
                  style={{
                  position:'fixed',
                  transition: "background-image 1.2s ease-in",
                  backgroundImage:`url(${imageUrl})`
              }}>
                <a href='#main-page' onClick={handlenav}><BootStrap.BsArrowLeftSquareFill className='text-white text-2xl mx-3 my-3'></BootStrap.BsArrowLeftSquareFill></a>
            <div className="flex flex-col items-center justify-start min-h-screen">
              <div className="flex items-center justify-center mt-5 relative">
              <input
                  className="text-white bg-transparent h-4 p-3 min-w-min text-lg font-sans font-normal font-white tracking-tight focus:outline-none"
                  type="search"
                  name="search"
                  placeholder="Enter your city . . . ."
                  onChange={handleCityChange}
                  value={city}
                  onKeyDown={handleKeyDown}
                />
            
              </div>
              {isLoading &&
                <div role="status">
                  <svg aria-hidden="true" className="mt-1 inline w-4 h-4 mr-2 text-white animate-spin fill-blue-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                <span className="sr-only">Loading...</span>
                </div>}
            <div className="text-center">
              <div className="flex justify-center text-white p-1 text-9xl mt-10 ">
              {(weather.weather[0].main === "Haze") && (
              ( <BootStrap.BsCloudHaze2 />)
              )}
              {(weather.weather[0].main === "Thunderstorm") && (
              ( <BootStrap.BsCloudRainHeavy/>)
              )}
              { ((weather.weather[0].main === "Rain") || (weather.weather[0].main === "Drizzle")) && (
              ( <BootStrap.BsCloudRainFill />)
              )}

              {(weather.weather[0].main === "Clouds") && (
              ( <BootStrap.BsCloudsFill />)
              )}
              {(weather.weather[0].main === "Clear") && (
              ( <BootStrap.BsSun />)
              )}
              {(weather.weather[0].main === "Mist") && (
              ( <BootStrap.BsCloudHaze2 />)
              )}

              {(weather.weather[0].main === "Fog") && (
              ( <BootStrap.BsFillCloudFog2Fill />)
              )}
              {(weather.weather[0].main === "Dust") && (
              ( <BootStrap.BsCloudHaze2 />)
              )}
              {(weather.weather[0].main === "Smoke") && (
              ( <BootStrap.BsCloudHaze2Fill />)
              )}
            </div>



            <div className='md:flex relative text-7xl text-white font-poppins font-light mt-3 mb-1'>

            {Math.round(weather.main.temp)}<span className="text-lg">°C</span>


            </div> 



            </div>
          <div className="text-center xl:w-1/4 md:w-2/3 text-ellipsis">  
            <div className="bg-black/60 md:p-5 p-2 shadow-3xl mb-5 mt-5 text-white font-mono text-ellipsis  ">
              <div className="lg:text-xl md:text-base sm:text-sm text-white font-mono font-thin tracking-wider my-1">{weather.name},{weather.sys.country}</div>

                <div className=" text-yellow-400">{weather.weather[0].description.charAt(0).toUpperCase() +
                    weather.weather[0].description.slice(1)}, feels like {weather.main.feels_like}°C</div>

                  <div className="justify-center text-base relative my-2 font-mono text-white font-thin py-2 mt-1 md:flex">
                    {weather.main.humidity < 80 && (
                    <p>
                    <BootStrap.BsWind className="text-white inline-block sm:mr-1 text-2xl shadow-2xl" />&nbsp; 
                    {weather.wind.speed} km/h &nbsp;
                    <WiHumidity className="text-white inline-block sm:mr-1 shadow-2xl text-2xl" />
                    {weather.main.humidity} %
                    </p>
                    )}

                    {weather.main.humidity >= 80 && (
                    <p>
                    <BootStrap.BsWind className="text-white inline-block sm:mr-1 text-2xl shadow-2xl" />&nbsp; 
                    {weather.wind.speed} km/h &nbsp;
                    <WiHumidity className="text-cyan-200 inline-block sm:mr-1 shadow-2xl text-2xl animate-bounce" />
                    {weather.main.humidity} %
                    </p>
                    )}
                  </div>
              </div>
          </div>
          <div className="flex items-center justify-center fixed bottom-0 w-full py-4 mb-5">
            <a href="#city-details" className="text-white animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </a>
          </div>
    
        </div>

          </div>
      </div>
      {/* Main Background for second page */}
      <div className="relative min-h-screen bg-white">
        <div id="city-details" className="flex flex-col justify-start min-h-screen">
            <div className='items-start text-start text-7xl font-sans font-thin ml-10 py-5 my-10'>
              {weather.name}, see trending &nbsp; 
            </div>
            <div className='sm:flex md:my-5 gap-5 mx-10 my-10'>
              <FetchTravelApi latitude={latitude} longitude={longitude} />
            </div>
          </div>
        </div>
       
</>
        ) : (
        <div id='main-page' className='h-screen bg-cover bg-center bg-no-repeat bg-black overflow-y-auto'>
           <input
                className="text-white mt-10 mx-3 inline-block bg-transparent h-4 p-5 min-w-min text-lg font-sans font-normal font-white tracking-tight focus:outline-none"
                autoFocus
                type="search"
                name="search"
                placeholder="Enter your city . . . ."
                onChange={handleCityChange}
                value={city}
                onKeyDown={handleKeyDown}
          />      
             {isLoading &&
                <div role="status">
                  <svg aria-hidden="true" className="mt-5 inline w-4 h-4 mr-2 text-black animate-spin fill-blue-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                <span className="sr-only">Loading...</span>
                </div>}                
                
                <div class="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-3 my-16">
                  <div className='bg-black relative drop-shadow-lg'>
                
                      <figure onClick={() => handleImageClick('Toronto')} className='transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0'>
                        <img className= 'h-80 w-full object-cover brightness-50 shadow-md rounded-sm ' src='https://images.unsplash.com/photo-1501130847258-0d557e9c93d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1307&q=80'/>
                        <figcaption className='absolute top-1/2 left-1/2 text-white font-normal tracking-tighter text-lg font-sans '>TORONTO</figcaption>
                      </figure>
                  
                  </div>
                  <div className='bg-black relative drop-shadow-lg '>
                  
                    <figure onClick={() => handleImageClick('New York')} className='transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0'>
                        <img className= 'h-80 w-full object-cover brightness-50' src='https://images.unsplash.com/photo-1587161584760-f51779fb276a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'/>
                        <figcaption className='absolute top-1/2 left-1/2 text-white font-normal tracking-tighter text-lg font-sans '>NEW YORK</figcaption>
                      </figure>
                  
                  </div>
                  <div className='bg-black relative drop-shadow-lg'>
                  
                    <figure onClick={() => handleImageClick('Tokyo')} className='transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0'>
                        <img className= 'h-80 w-full object-cover brightness-50' src='https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'/>
                        <figcaption className='absolute top-1/2 left-1/2 text-white font-normal tracking-tighter text-lg font-sans '>TOKYO</figcaption>
                      </figure>
                
                  </div>
                  <div className='bg-black relative drop-shadow-lg'>
                
                    <figure onClick={() => handleImageClick('London')} className='transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0'>
                        <img className= 'h-80 w-full brightness-75  object-cover' src='https://images.unsplash.com/photo-1534800891164-a1d96b5114e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=759&q=80'/>
                        <figcaption className='absolute top-1/2 left-1/2 text-white font-normal tracking-tighter text-lg font-sans '>LONDON</figcaption>
                      </figure>
                    
                  </div>
                </div>
                  
                
        </div>
      )}
    </>
  );
};

export default App
