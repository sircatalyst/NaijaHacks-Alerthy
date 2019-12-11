<template>
  <div>
    <p class="col s12 center-align helper-text" v-if="message">{{ message }}</p>
    <form @submit.prevent="loginUser" class="col s12">
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
      <button class="waves-effect waves-light btn blue lighten-2" :disabled="$v.$invalid || processing">Login</button>
    </form>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { required, minLength } from 'vuelidate/lib/validators';

export default {
  name: 'Login',
  data() {
    return {
      processing: false,
      message: null,
      form: {
        email: '',
        password: '',
      }
    };
  },
  methods: {
    ...mapActions([
      'login',
    ]),
    async loginUser() {
      const { email, password } = this.form;
      if (!this.$v.$invalid) {
        try {
          this.processing = true;
          this.message = null;
          await this.login({ email, password })
          this.$router.push('/dashboard');
        } catch (error) {
          const { message } = error.response.data;
          this.message = message;
        } finally {
          this.processing = false;
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

<style scoped>
.helper-text {
  color: #F44336;
}
</style>
