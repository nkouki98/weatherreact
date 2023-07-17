import { useEffect, useState } from 'react'
import { WiHumidity } from 'react-icons/wi';
import axios from 'axios';
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




  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  async function getUnsplashPhoto() {
    try {
      const apiKey = import.meta.env.VITE_UNSPLASH;
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?client_id=${apiKey}&query=${city}&per_page=1`
      );
      const photo = response.data.results[0]; // Get the first photo from the results

    if (photo) {
      const preloadImage = new Image();
      preloadImage.onload = () => {
        setImageUrl(preloadImage.src); // Set the image URL once it's fully loaded
        setImageReady(true); // Set imageReady to true when the image is loaded

      console.log("HERE");
    };

      preloadImage.onerror = () => {
      setImageUrl('/clear3.jpg'); // Set the fallback image in case the Unsplash image fails to load
      setImageReady(true); // Set imageReady to true even if the image fails to load (optional)

      console.log("Error loading image");
    };

      preloadImage.src = photo.urls.full; // Start preloading the image
    } else {
      setImageUrl(''); // Reset imageUrl if no photo is found
      setLoading(false);
    }
      } catch (error) {
      console.error(error);
      }
  };




const getCoordinatesFromCity = async (city) => {
const params = {
access_key: import.meta.env.VITE_POSITIONSTACK,
query: city,
};
try {
const response = await axios.get('http://api.positionstack.com/v1/forward', { params });
const { data } = response;
if (data.data && data.data.length > 0) {
const { latitude, longitude } = data.data[0];
setLongitude(longitude);
setLatitude(latitude)
console.log('Latitude:', latitude);
console.log('Longitude:', longitude);
} else {
console.log('Location not found.');
}
} catch (error) {
console.error('Error fetching location data:', error);
}

}
const getWeather = async event => {
if(event.key === "Enter") {
try{
fetch(`${api.base}weather?q=${city}&units=metric&appid=${api.key}`)
.then(res => res.json())
.then(result => {
setCity('');

setTimeout(() => {
setWeather(result); // Update weather state after 1500 milliseconds (1.5 seconds)
}, 500);
});
} catch (error) {
console.error(error);
}

}
}
const handleKeyDown = async (event) => {
if (event.key === 'Enter') {
try {
await getWeather(event);
await getCoordinatesFromCity(city);
await getUnsplashPhoto();
} catch (error) {
console.error(error);
}
}
};





return (

<>


<div className="relative min-h-screen shadow-2xl rounded-3xl">
{/* Full-screen background */}

<div className="absolute inset-2 bg-cover bg-center bg-no-repeat bg-blend-overlay bg-black/50 shadow-xl rounded-lg" 
style={{
position:'fixed',
transition: "background-image 1.2s ease-in",
backgroundImage:
typeof weather.main !== "undefined" && imageReady
? `url(${imageUrl})`
: "url(/clear3.jpg)",

}}>



<div className="flex flex-col items-center justify-start min-h-screen">
<div className="flex items-center justify-center mt-10">
<input
className="text-white bg-black/10 rounded-lg h-4 p-5 min-w-min text-lg shadow-lg font-sans font-normal font-white tracking-tight focus:outline-none"
type="search"
name="search"
placeholder="Search Weather here . . . ."
onChange={handleCityChange}
value={city}
onKeyDown={handleKeyDown}
/>

</div>
{(typeof weather.main === "undefined") && (  
<div className='text-base font-thin font-mono -tracking-tight text-white mt-10 p-10'>
<h1>Type in your city to get weather and more!</h1>


</div>




)}
{(typeof weather.main !== "undefined") && (  
<>
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
<div className="bg-zinc-900 md:p-5 md:text-base sm:text-sm p-5 shadow-3xl rounded-xl mb-5 mt-5 text-white font-mono text-ellipsis border border-zinc-50/20 hover:scale-105">
<div className="text-3xl md:text-lg sm:text-base text-white font-mono font-thin tracking-wider my-1">{weather.name},{weather.sys.country}</div>

<div className=" text-yellow-400">{weather.weather[0].description}, feels like {weather.main.feels_like}°C</div>

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
{/* Bullet scroll to next page */}
<div className="flex items-center justify-center fixed bottom-0 w-full py-4 mb-5">
<a href="#next-page" className="text-white animate-bounce">
<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
</svg>
</a>
</div>
</>



)}

</div>


</div>

</div>
{(typeof weather.main !== "undefined") && (  
<div className="relative min-h-screen bg-white">

<div id="next-page" className="flex flex-col justify-start min-h-screen">
<div className='items-start text-start text-7xl font-sans font-thin ml-10 py-5 my-10'>
{weather.name}, see trending &nbsp;
<div>


</div>


</div>







<div className='sm:flex md:my-5 gap-5 mx-10 my-10'>
<FetchTravelApi latitude={latitude} longitude={longitude} />






</div>

</div>
</div>
)}
</>




)
}

export default App
