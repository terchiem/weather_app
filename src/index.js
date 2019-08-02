import countries from './country-codes';
import forecast from './test-forecast';
import { separateDays, createDayObject, fToC } from './forecast-helpers';

import { format } from 'date-fns';

Vue.component('search-form', {
  props: ['countries'],

  template: `
    <div class="search-form">
      <p class="form-error" v-if="errors.length">
        Please correct the following error(s):
        <ul>
          <li v-for="error in errors">{{error}}</li>
        </ul>
      </p>

      <div class="searchbar">
        <input 
          class="city-input"
          type="text" 
          placeholder="City Name" 
          v-model="city"
        >
        <select class="country-select" v-model="country">
          <option value="">Select a country...</option>
          <option v-for="(country, key, i) in countries" :value="key">{{country}}</option>
        </select>
        <button @click.prevent="onSubmit"><i class="fa fa-search"></i></button>
      </div>

      <div class="unit-toggle">
        <input 
          id="fahrenheit"
          type="radio" 
          name="unit" 
          :value="true" 
          v-model="fahrenheit" 
          @change="toggleTemp"
        />
        <label for="fahrenheit">°F</label>

        <input 
          id="celcius"
          type="radio" 
          name="unit" 
          :value="false" 
          v-model="fahrenheit" 
          @change="toggleTemp"
        />
        <label for="celcius">°C</label>
      </div>
    </div>
  `,
  data() {
    return {
      city: null,
      country: '',
      fahrenheit: true,
      errors: []
    }
  },

  methods: {
    onSubmit() {
      this.errors = [];
      if(this.city && this.country) {
        let formData = {
          city: this.city,
          country: this.country
        }
        this.$emit('search-city', formData)
      } else {
        if(!this.city) this.errors.push("City required.");
        if(!this.country) this.errors.push("Country required.");
      }
      
    },

    toggleTemp() {
      this.$emit('toggle-temp', this.fahrenheit);
    }
  }
})

Vue.component('main-card', {
  props: {
    data: Object,
    fahrenheit: Boolean,
    location: String
  },
  template: `
    <div class="main-card">
      <h2 class="main-location">{{location}}</h2>
      <img 
        class="condition-lg" 
        :src="data.icon" 
        :alt="data.condition" 
      />
      <div class="main-info">
        <h3 class="main-day">{{day}}</h3>
        <h5 v-if="data.date">{{date}}</h5>
      </div>
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
      return `${temp} °${unit}`
    },
    low() {
      let temp = Math.round(this.data.low);
      let unit = 'F';
      if(!this.fahrenheit) {
        temp = fToC(temp);
        unit = 'C';
      }
      return `${temp} °${unit}`
    },
    day() {
      return format(
        new Date(this.data.date),
        'dddd'
      )
    },
    date() {
      return format(
        new Date(this.data.date),
        'MMMM D'
      )
    }
  }
})

Vue.component('card', {
  props: {
    data: Object,
    fahrenheit: Boolean
  },
  template: `
  <div class="card">
    <h5>{{date}}</h5>
    <h3>{{day}}</h3>
    <img 
      class="condition-sm"
      :src="data.icon"
      :alt="data.condition"
    />
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
      return `${temp} °${unit}`
    },
    low() {
      let temp = Math.round(this.data.low);
      let unit = 'F';
      if(!this.fahrenheit) {
        temp = fToC(temp);
        unit = 'C';
      }
      return `${temp} °${unit}`
    },
    day() {
      return format(
        new Date(this.data.date),
        'dddd'
      )
    },
    date() {
      return format(
        new Date(this.data.date),
        'MMMM D'
      )
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
    fahrenheit: true,
    error: null
  },

  methods: {
    toggleTemp(state) {
      console.log(`temp changed to: ${state}`);
      this.fahrenheit = state;
    },

    async searchCity(data) {
      const url = this.formatUrl(data);

      const response = await fetch(url);
      if(response.ok) {
        const weatherData = await response.json();
        const parsedData = await this.parseData(weatherData);
        this.insertData(parsedData);
        this.error = null;
      } else {
        this.error = `${data.city}, ${data.country}`;
      }
    },

    formatUrl(data) {
      const appid = '930555d4bed3616ed708a51ed33135e9';
      return encodeURI(`http://api.openweathermap.org/data/2.5/forecast?q=${data.city},${data.country}&units=imperial&APPID=${appid}`)
    },

    parseData(data) {
      const days = separateDays(data);
      const forecastData = days.map(createDayObject);
      return {
        data: forecastData,
        location: `${data.city.name}, ${data.city.country}`
      }
    },

    insertData(forecast) {
      const forecastData = [...forecast.data];
      this.mainData = forecastData.shift();
      this.forecastData = forecastData;
      this.location = forecast.location;
    },

    loadForecast() {
      const forecastData = this.parseData(forecast);
      this.insertData(forecastData);
    }
  }
})

app.loadForecast();