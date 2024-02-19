import express from 'express';
import https from 'https';
import rp from 'request-promise';
import moment from 'moment';
import cors from 'cors';

const app = express();

app.use(cors());

function fromCToF(temp){
    return (((temp*9)/5)+32);
}

//Endpoint to get the current weather
app.get('/api/currentWeather',(req, res) =>{
    var useF = false;

    if(req.query.station == undefined){
        res.status(404).send("Cannot find station");
    }
    
    //Update temp to use farenheit
    if(req.query.useF != undefined && req.query.useF=='true'){
        useF = true;
    }

    return rp({
        uri: 'https://api.weather.gov/stations/'+req.query.station+'/observations/latest',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'MyTestWeatherApp/v1.0 (neilbhadsavle@gmail.com)'
        }
    })
    .then(function(result){
        var jsonResults =JSON.parse(result);
        res.send({
           temperature: useF? fromCToF(jsonResults.properties.temperature.value):jsonResults.properties.temperature.value,
           description: jsonResults.properties.textDescription,
           success: true,
           error: ""
        });
    })
    .catch(function(err){
        throw err;
    });
});

//Endpoint to get the weather for the past seven days
app.get('/api/pastWeather',(req,res) => {

    var useF = false;

    if(req.query.station == undefined){
        res.status(404).send("Cannot find station");
    }
    
    //Update temp to use farenheit
    if(req.query.useF != undefined && req.query.useF=='true'){
        useF = true;
    }

    var startDate = moment().subtract(7,'d').toISOString();
    var endDate = moment().toISOString();
    var resultArray = [];

    return rp({
        uri: 'https://api.weather.gov/stations/'+req.query.station+'/observations?start='+startDate+'&end='+endDate,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'MyTestWeatherApp/v1.0 (neilbhadsavle@gmail.com)'
        }
    })
    .then(function(result){
        var jsonResults =JSON.parse(result);

        jsonResults.features.forEach((element) =>{
            resultArray.push({obsDateTime: new Date(element.id.substr(element.id.length - 25)).toLocaleString(), temperature: useF? fromCToF(element.properties.temperature.value):element.properties.temperature.value, description: element.properties.textDescription});
        });

        res.send({
           observations: resultArray,
           success: true,
           error: ""
        });
    })
    .catch(function(err){
        throw err;
    });
});

app.listen(8000, () =>{
    console.log('The Weather backend is on port 8000');
});