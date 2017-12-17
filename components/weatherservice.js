"""
MIT License

Copyright (c) 2017 razum90

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

var request = require('request');
var Helper = require('./helper.js');

var exports = {};

module.exports = WeatherService = function() {
  var vm = this;
  Helper.keys('apikeys', ['openweathermap']).then(function(keys) {
    vm.apikey = keys.openweathermap;
  }).catch(err => {
    console.log(err);
    vm.hasUnmetDepedencies = true;
  });
}

WeatherService.prototype.getWeather = function(city, message) {
  if (city.length > 1) {
    this.getWeatherForCity(city, message);
  } else {
    this.getWeatherForCity('Stockholm', message);
  }
}

WeatherService.prototype.getWeatherForCity = function(city, message) {
  var vm = this;
  request('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=' + vm.apikey + '&units=metric', (error, response, body) => {
    var weather = buildWeather(city, JSON.parse(body));
    message.reply(Helper.wrap(weather));
  });
}

function buildWeather(city, weather) {
  var toReturn = '\nWeather in ' + capitalizeFirstLetter(city);
  toReturn += '\n' + weather.weather[0].main + ', ' + weather.weather[0].description;
  toReturn += '\n' + weather.main.temp + 'C';
  return toReturn;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
