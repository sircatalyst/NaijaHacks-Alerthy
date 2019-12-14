<template>
  <div class="col s12">
    <div class="fixed-action-btn">
      <a class="btn-floating btn-large red modal-trigger" href="#modal1">
        <i class="large material-icons">mode_edit</i>
      </a>
    </div>
    <!-- Modal Structure -->
  <div id="modal1" class="modal">
    <form @submit.prevent="newAlert" class="col s12">
      <div class="modal-content">
        <div class="row">
        <div class="input-field col s12 m6">
          <input type="email" id="email" v-model.trim="$v.form.email.$model">
          <label for="email">Email</label>
          <span class="helper-text" v-if="$v.form.email.$error">
            <span class="error" v-if="!$v.form.email.required">Field is required</span>
          </span>
        </div>
        <div class="input-field col s12 m6">
          <input type="password" id="password" v-model="$v.form.password.$model">
          <label for="password">Password</label>
          <span class="helper-text" v-if="$v.form.password.$error">
            <span class="error" v-if="!$v.form.password.required">Field is required</span>
            <span class="error" v-if="!$v.form.password.minLength">Password must have at least {{$v.form.password.$params.minLength.min}} letters</span>
          </span>
        </div>
      </div>
      </div>
      <div class="modal-footer">
        <button class="waves-effect waves-light btn blue lighten-2" :disabled="$v.$invalid || processing">Login</button>
      </div>
    </form>
  </div>
    <div class="row">
      <div class="col s12 center" v-if="!this.alerts.length">
        <p>No alerts available</p>
      </div>
    </div>
    <div class="card-panel light-blue">
      <span class="white-text">I am a very simple card. I am good at containing small bits of information.
      I am convenient because I require little markup to use effectively. I am similar to what is called a panel in other frameworks.
      </span>
    </div>
  </div>
</template>

<script>
import axios from '@/lib/axios';
import { required, minLength } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      alerts: [],
      processing: false,
      form: {
        email: '',
        password: '',
      }
    }
  },
  async mounted() {
    const nodes = document.querySelectorAll('.modal');
    this.$M.Modal.init(nodes);
  },
  async created() {
    try {
      const { data: { data } } = await axios.get('alerts');
      this.alerts = [...data];
    } catch (error) {
      error.response.data;
    }
  },
  methods: {
    async newAlert() {
      if (!this.$v.$invalid) {
        try {
          const { email, password } = this.form;
          await axios.post('alerts', { email, password })
          
        } catch (error) {
          error.response.data;
        }
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
      },
      password: {
        required,
        minLength: minLength(6)
      },
    }
  }
}
</script>
