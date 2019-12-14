<template>
  <div>
    <p class="col s12 center-align helper-text" v-if="message">{{ message }}</p>
    <form @submit.prevent="trigger" class="col s12">
      <!-- LOCATION-->
      <div class="row">
        <div class="input-field col s12 m6">
          <input type="text" id="location" v-model.trim="$v.form.location.$model">
          <label for="location">Location</label>
          <span class="helper-text" v-if="$v.form.location.$error">
            <span class="error" v-if="!$v.form.location.required">Field is required</span>
            <!-- <span class="error" v-if="!$v.form.location.minLength">First name must have at least {{$v.form.location.$params.minLength.min}} letters.</span> -->
          </span>
        </div>
      </div>
      <button class="waves-effect waves-light btn blue lighten-2" :disabled="$v.$invalid || processing">Submit</button>
    </form>
    <button @click="stopAlert">Stop</button>
    <h1> Smile! Sending sending </h1>
  </div>
</template>
<script async defer 
  src="https://maps.googleapis.com/maps/api/js?key={GOOGLEKEY}&libraries=places">
</script>
<script>
import { mapActions, mapGetters } from 'vuex';
import {  } from 'vuelidate/lib/validators';

export default {
  name: 'Trigger',
  mounted() {
    const nodes = document.querySelectorAll('select');
    this.$M.FormSelect.init(nodes);
  },
  data() {
    return {
      processing: false,
      message: null,
      getLocation: '',
      storage: null,
      resu: null,
      form: {
        location: ''
      }
    };
  },
  created() {
    const options = {
      timeout: 20000,
      maximumAge: 0
      };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.long = position.coords.longitude;
        this.lat = position.coords.latitude;
        const mapPosition= new google.maps.LatLng(this.lat, this.long);

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { latLng: mapPosition },
          (results, status) => {
            this.getLocation = results[0].formatted_address;
            this.form.location = results[0].formatted_address;
            this.mapStatus = status;
            this.storage = localStorage.getItem('trigger')
          }
        );
      }, (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }, options);
      
    }
    else {
      "Geolocation is not supported by this browser.";
    }
    setInterval(() => this.trigger(), 50000);  //5minutes
  },
  computed: {
    ...mapGetters([
        'alert'
    ])
	},
  methods: {
    ...mapActions([
      'triggerCreate',
      'logout',
    ]),
    async trigger() {
      let location = JSON.stringify(this.getLocation);
      if (!this.$v.$invalid) {
        try {
          this.processing = true;
          this.message = null;
          await this.triggerCreate({ location });
        } catch (error) {
          const { message } = error.response.data;
          this.message = message;
        } finally {
          this.processing = false;
        }
      }
    },
    async stopAlert(){
      window.location.reload();
      await this.logout();
      this.$router.push('/login');
      window.location.reload();
    },
  },
  validations: {
    form: {
       location: {
      
      }
    }
  }
}
</script>

<style scoped>
.helper-text {
  color: #F44336;
}
</style>
