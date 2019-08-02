import countries from './country-codes';
import forecast from './test-forecast';
import { separateDays, createDayObject, fToC } from './forecast-helpers';

Vue.component('search-form', {
  props: ['countries'],

  template: `
    <div class="search-form">
      <input type="text" placeholder="City Name" v-model="city">
      <select v-model="country">
        <option value="">Select a country...</option>
        <option v-for="(country, key, i) in countries" :value="key">{{country}}</option>
      </select>
      <button @click.prevent="onSubmit">Search</button>

      <label>
        F
        <input 
          type="radio" 
          name="unit" 
          :value="true" 
          v-model="fahrenheit" 
          @change="toggleTemp">
      </label>
      <label>
        C
        <input 
          type="radio" 
          name="unit" 
          :value="false" 
          v-model="fahrenheit" 
          @change="toggleTemp">
      </label>
    </div>
  `,
  data() {
    return {
      city: null,
      country: '',
      fahrenheit: true
    }
  },

  methods: {
    onSubmit() {
      // validate data
      let formData = {
        city: this.city,
        country: this.country
      }
      this.$emit('search-city', formData)
    },
    toggleTemp() {
      this.$emit('toggle-temp', this.fahrenheit);
    }
  }
})

Vue.component('main-card', {
  props: ['data', 'fahrenheit', 'location'],
  template: `
    <div class="main-card">
      <h2>{{location}}</h2>
      <p>Tomorrow</p>
      <h3>{{data.date}}</h3>
      <p>{{data.condition}}</p>
      <div class="temp-range">
        <p class="high">{{high}} </p>
        <p class="low">{{low}}</p>
      </div>
    </div>
  `,
  computed: {
    high() {
      let temp = Math.round(this.data.high);
      let unit = 'F';
      if(!this.fahrenheit) {
        temp = fToC(temp);
        unit = 'C';
      }
      return `${temp} ${unit}`
    },
    low() {
      let temp = Math.round(this.data.low);
      let unit = 'F';
      if(!this.fahrenheit) {
        temp = fToC(temp);
        unit = 'C';
      }
      return `${temp} ${unit}`
    }
  }
})


Vue.component('card', {
  props: ['data', 'fahrenheit'],
  template: `
  <div class="card">
    <h3>{{data.date}}</h3>
    <p>{{data.condition}}</p>
    <div class="temp-range">
      <p class="high">{{high}} </p>
      <p class="low">{{low}}</p>
    </div>
  </div>
  `,
  computed: {
    high() {
      let temp = Math.round(this.data.high);
      let unit = 'F';
      if(!this.fahrenheit) {
        temp = fToC(temp);
        unit = 'C';
      }
      return `${temp} ${unit}`
    },
    low() {
      let temp = Math.round(this.data.low);
      let unit = 'F';
      if(!this.fahrenheit) {
        temp = fToC(temp);
        unit = 'C';
      }
      return `${temp} ${unit}`
    }
  }
})

var app = new Vue({
  el: '#app',

  data: {
    countryCodes: countries,
    mainData: null,
    forecastData: null,
    location: null,
    fahrenheit: true
  },

  methods: {
    toggleTemp(state) {
      console.log(`temp changed to: ${state}`);
      this.fahrenheit = state;
    },

    searchCity(data) {
      this.location = `${data.city}, ${data.country}`;
      const url = this.formatUrl(data);
      // fetch data from url
      // parse jsondata
      // set data with forecast data
      console.log(url);
    },

    formatUrl(data) {
      const appid = '930555d4bed3616ed708a51ed33135e9';
      return encodeURI(`http://api.openweathermap.org/data/2.5/forecast?q=${data.city},${data.country}&units=imperial&APPID=${appid}`)
    },

    fetchData(url) {
      //get json from fetch

    },

    parseData(data) {
      const days = separateDays(data);
      const forecastData = days.map(createDayObject);
      return forecastData;
    },

    insertData(data) {
      const forecastData = [...data];
      this.mainData = forecastData.shift();
      this.forecastData = forecastData;
    },

    loadForecast() {
      const forecastData = this.parseData(forecast);
      this.insertData(forecastData);
    }
  }
})

app.loadForecast();