const path = require('path')
const axios = require('axios')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.post('/getWeather', async (req, res, next) => {
    try{
        const cities = req.body.cities
        const response = {weather : {}}
        const promises = []
        cities.forEach(city => {
            const promise = getTemperature(city);
            promises.push(promise)
        });
        // console.log(response);
        await Promise.all(promises)
          .then((results) => {
            results.forEach(result => {
                response.weather[result.city] = result.tempInC
            })
        }).then(() => {
            res.json(response)
        })
    }
    catch(err){
        console.log(err);
    }
})



app.use(async (req,res) => {
    let url = req.url
    res.header('Content-Security-Policy', "img-src 'self'");
    if(url == "/"){
        url = "index.html"
    }
    res.sendFile(path.join(__dirname, `public/${url}`))
})



async function getTemperature(city){

    try{
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&limit=2&appid=9a3a00d9ebfe695ba9fd60a5d9a56a30`
        let tempInC;
        const apiResponse = await axios.get(url)
        const statusCode = apiResponse.data.cod
        if(statusCode == 200){
            const temp = apiResponse.data.main.temp
            tempInC = Math.round(temp - 273.15) + " ℃"
            return {city, tempInC}
        }else{
            tempInC = "City Not Found"
            return {city, tempInC}
        }
    }
    catch(err){
        tempInC = "City Not Found"
        return {city, tempInC}
        // console.log(err);
    }   
}



app.listen(3000, ()=> {
    console.log("SERVER RUNNING ON PORT 3000");
})