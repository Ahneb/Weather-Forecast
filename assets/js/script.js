//api information
let apiKey = '38af30d5e4a24c9ecf188b76880696fb';
let units = 'metric';

//general selectors
let cityInput = document.querySelector('#city_input');
let searchButton = document.querySelector('#search_button');
let cityHistory = document.querySelector('.city_list');

//selector for current weather info
let mainTitle = document.querySelector('#current_title');
let currentTemp = document.querySelector('#temp');
let currentWind = document.querySelector('#wind');
let currentHumidity = document.querySelector('#humidity');
let currentIcon = document.querySelector('#current_icon');

//selector for forecast weather info
let forecastSection = document.querySelector('#forecast_sections');


//Testcase buttons
// let testbutton = document.querySelector('#Tester');
let clearbutton = document.querySelector('#Clear');

//generate list of city buttons if the local storage has a history upon refreshing page or reloadings
let storedCities = [];
if (localStorage.getItem('Cities') != null){
  storedCities = JSON.parse(localStorage.getItem('Cities'));
  for (let i = 0; i < storedCities.length; i++) {
    CreateHistory(storedCities[i]);
  }
} else {
  console.log('empty');
}

//event listeners for the 2 main buttons on the screen
searchButton.addEventListener('click', getWeather);
clearbutton.addEventListener('click', ClearHistory);
// testbutton.addEventListener('click', TestContent);


//extra button to test different functionalities that i wanted to add
// function TestContent() {
//   console.log(this.id);

//   if (storedCities.includes('Fremont')){
//     console.log(true);
//   }


//   for (let value of storedCities) {
//     console.log(value);
    
//   }
// }

//gets user input for the city to search
//calls the api to get all weather information.
//calls other functions to generate the page
async function getWeather() {
  //get user input
  let newCity = cityInput.value;

  //if the user doesnt input anything return and dont run
  if (cityInput.value === ''){
    return;
  }

  //reset the input field to empty
  cityInput.value = '';

  //call the apis
  let weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${apiKey}&units=${units}`;
  let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${newCity}&appid=${apiKey}&units=${units}`;
  
  //api calls for weather and forecast
  const weatherInfo = await fetch(weatherURL);

  //if city does not exist in openweather api then return
  if (!weatherInfo.ok) {
    console.log('was not ok');
    return;
  } else {
    console.log('was ok');
  }

  //if the city exists then continue to make second api call for forecast
  const forecastInfo = await fetch(forecastURL);

  //store returned information into variables
  const weatherData = await weatherInfo.json();
  const forecastData = await forecastInfo.json();

  // console.log(weatherData);
  // console.log(forecastData);

  //if the forecast section has any child nodes (currently displayed forecast information) delete all of them
  if (forecastSection.childNodes.length > 0){
    RemoveForecast();
  }

  //extract needed information from weather and forecast information
  CreateCurrent(weatherData);
  CreateForecast(forecastData);
};


//function that takes in information from the weather api call and places data into html
function CreateCurrent(weatherJSON) {

  //get the current date when the api call is made
  let currentDate1 = new Date(weatherJSON.dt * 1000);

  //set information into html
  mainTitle.textContent = `${weatherJSON.name} (${currentDate1.toLocaleDateString("en-US")})`;
  currentIcon.src = `https://openweathermap.org/img/wn/${weatherJSON.weather[0].icon}@2x.png`;
  currentTemp.textContent = `Temp: ${weatherJSON.main.temp} ${String.fromCharCode(176)}C`;
  currentWind.textContent = `Wind: ${weatherJSON.wind.speed} MPH`;
  currentHumidity.textContent = `Humidity: ${weatherJSON.main.humidity}${String.fromCharCode(37)}`;

  //if the city being searched does not exists in the array of names previously searched, add to the array
  if (!storedCities.includes(`${weatherJSON.name}`)){
    storedCities.push(`${weatherJSON.name}`);
    CreateHistory(`${weatherJSON.name}`);
  }
  
  //add the array of stored cities into local storage to keep a history of searched cities
  localStorage.setItem("Cities", JSON.stringify(storedCities));
}

//pass in forecast weather data to generate the forecasts
function CreateForecast(forecastJSON){
  //api returns information for every 3 hrs from time of call
  //i=8 sets the first call to be 24hrs from time of call
  //i+=8 sets all repetitions to be 1 day apart
  for(let i = 7;i < 40; i+=8){

    //create new parent element for each forecast section
    let newColumn = document.createElement('div');
    newColumn.id = `forecast${i}`;
    newColumn.classList.add('column', 'm-1');

    //forecast section date
    let forecastDate = new Date(forecastJSON.list[i].dt * 1000)
    let newH3 = document.createElement('h3');
    newH3.classList.add('columns', 'm-2');
    newH3.textContent = `${forecastDate.toLocaleDateString("en-US")}`;
    
    //forecast info
    //forecast icons
    let newIcon = document.createElement('img');
    newIcon.classList.add('columns', 'm-2');
    newIcon.id = `forecast${i}_icon`;
    newIcon.src = `https://openweathermap.org/img/wn/${forecastJSON.list[i].weather[0].icon}@2x.png`;

    //forecast temps
    let newTemp = document.createElement('div');
    newTemp.classList.add('columns', 'm-2');
    newTemp.id = `forecast${i}_temp`;
    newTemp.textContent = `Temp: ${forecastJSON.list[i].main.temp} ${String.fromCharCode(176)}C`;

    //forecast winds
    let newWind = document.createElement('div');
    newWind.classList.add('columns', 'm-2');
    newWind.id = `forecast${i}_wind`;
    newWind.textContent = `Wind: ${forecastJSON.list[i].wind.speed} MPH`;

    //forecast humidities
    let newHumid = document.createElement('div');
    newHumid.classList.add('columns', 'm-2');
    newHumid.id = `forecast${i}_humidity`;
    newHumid.textContent = `Humidity: ${forecastJSON.list[i].main.humidity}${String.fromCharCode(37)}`;

    //append each column to the section
    newColumn.appendChild(newH3);
    newColumn.appendChild(newIcon);
    newColumn.appendChild(newTemp);
    newColumn.appendChild(newWind);
    newColumn.appendChild(newHumid);
    forecastSection.appendChild(newColumn);

    // console.log(i);
    // console.log(newColumn);
  }
}

function RemoveForecast() {
  for(let i = 4; i >=0 ; i--){
    // console.log("this is i: " + i);
    forecastSection.removeChild(forecastSection.childNodes[i]);
    // console.log("this is the new nodes: " + forecastSection.childNodes);
  }
}

function CreateHistory(cityName) {
  let button = document.createElement('button');
  button.id = cityName;
  button.classList.add("button", "mb-2", "is-fullwidth", "new_city");
  button.textContent = cityName;

  cityHistory.appendChild(button);
  button.addEventListener('click', HistoryCall);

}

function ClearHistory() {
  localStorage.clear();
  location.reload();
}

function HistoryCall() {
  cityInput.value = this.id;
  console.log(this.id);
  console.log(cityInput.value);
  getWeather();
}