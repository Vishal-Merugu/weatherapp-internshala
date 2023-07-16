const InputCities = document.querySelector('input')
const WeatherDisplay = document.querySelector('#weather')

document.querySelector('form').onsubmit = async (e) => {
    e.preventDefault()
    WeatherDisplay.innerHTML = ""
    const cities = InputCities.value.split(",");
    const response = await axios.post('http://localhost:3000/getWeather', {
        cities : cities
    })
    const weather = response.data.weather
    console.log(cities);
    cities.forEach(city => {
        const temp  = weather[city]
        WeatherDisplay.innerHTML += `<h3>${city} : ${temp}<h3>`
    })

    return false
}