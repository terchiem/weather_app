import countries from './country-codes';
import forecast from './test-forecast';

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
      console.log(this.unit);
    }
  }
})

Vue.component('main-card', {
  template: `
    <div class="main-card">
      <h2>Location</h2>
      <p>Average Temp</p>

      <p>Tomorrow</p>
      <h3>Day of the week</h3>
      <p>Condition</p>
      <div class="temp-range">
        <p class="high">High </p>
        <p class="low">Low</p>
      </div>
    </div>
  `
})


Vue.component('card', {
  template: `
  <div class="card">
    <h3>Day of the week</h3>
    <p>Condition</p>
    <p>Average Temp</p>
    <div class="temp-range">
      <p class="high">High </p>
      <p class="low">Low</p>
    </div>
  </div>
  `
})

var app = new Vue({
  el: '#app',

  data: {
    countryCodes: countries,
    
  },

  methods: {
    searchCity(data) {
      console.log(data);
    },
    fetchData(url) {
      //get json from fetch
    },
    parseData(data) {
    }
  }

})
