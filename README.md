
# Weather Forecast

## About

This is a weather forecast app. It makes use of the OpenWeatherAPI to get both the current and future information of city the user inputs.

The userinput will reject any input that is not a valid city in the database. After a valid city name is inputted, the current day AND time's information is displayed in the main block and the following 5 day's forecast will also be projected below it. Every city searched will be saved into an array in local storage as a form of history. Then a button is generated as a search history. Clicking on the button will make a new search of the same city name incase you come back and want to search information about the city again. When searching the same city, a new button will not be generated if the button already exists. There is also a button to clear your search history and remove the buttons.

Webpage URL: 
## Features

- Api Calls to grab weather information
- Bulma Framework to create page
- Event listeners and usage of local storage to keep static info
## Demo

Generation of forecast, searching from history, resetting history:

## License

[MIT](https://choosealicense.com/licenses/mit/)

