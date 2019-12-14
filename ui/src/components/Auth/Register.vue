<template>
  <div>
    <p class="col s12 center-align helper-text" v-if="message">{{ message }}</p>
    <form @submit.prevent="registerUser" class="col s12">
      <!-- FIRST && LAST NAME -->
      <div class="row">
        <div class="input-field col s12 m6">
          <input type="text" id="first-name" v-model.trim="$v.form.first_name.$model">
          <label for="first-name">First Name</label>
          <span class="helper-text" v-if="$v.form.first_name.$error">
            <span class="error" v-if="!$v.form.first_name.required">Field is required</span>
            <span class="error" v-if="!$v.form.first_name.minLength">First name must have at least {{$v.form.first_name.$params.minLength.min}} letters.</span>
          </span>
        </div>
        <div class="input-field col s12 m6">
          <input type="text" id="last-name" v-model.trim="$v.form.last_name.$model">
          <label for="last-name">Last Name</label>
          <span class="helper-text" v-if="$v.form.last_name.$error">
            <span class="error" v-if="!$v.form.last_name.required">Field is required</span>
            <span class="error" v-if="!$v.form.last_name.minLength">Last name must have at least {{$v.form.last_name.$params.minLength.min}} letters.</span>
          </span>
        </div>
      </div>
      <!-- EMAIL, PHONE && GENDER -->
      <div class="row">
        <div class="input-field col s12 m6">
          <input type="email" id="email" v-model.trim="$v.form.email.$model">
          <label for="email">Email</label>
          <span class="helper-text" v-if="$v.form.email.$error">
            <span class="error" v-if="!$v.form.email.required">Field is required</span>
          </span>
        </div>
        <div class="input-field col s6 m3">
          <input type="text" id="phone" v-model.trim="$v.form.phone.$model">
          <label for="phone">Phone</label>
          <span class="helper-text" v-if="$v.form.phone.$error">
            <span class="error" v-if="!$v.form.phone.required">Field is required</span>
            <span class="error" v-if="!$v.form.phone.phoneRegex">Invalid phone number</span>
          </span>
        </div>
        <div class="input-field col s6 m3">
          <select v-model="$v.form.gender.$model" id="gender">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="male">Female</option>
            <option value="male">Others</option>
          </select>
          <label for="gender">Gender</label>
          <span class="helper-text" v-if="$v.form.gender.$error">
            <span class="error" v-if="!$v.form.gender.required">Field is required</span>
          </span>
        </div>
      </div>
      <!-- PASSWORD && CONFIRMATION -->
      <div class="row">
        <div class="input-field col s12 m6">
          <input type="password" id="password" v-model="$v.form.password.$model">
          <label for="password">Password</label>
          <span class="helper-text" v-if="$v.form.password.$error">
            <span class="error" v-if="!$v.form.password.required">Field is required</span>
            <span class="error" v-if="!$v.form.password.minLength">Password must have at least {{$v.form.password.$params.minLength.min}} letters</span>
          </span>
        </div>
        <div class="input-field col s12 m6">
          <input type="password" id="password-confirmation" v-model="$v.form.confirm_password.$model">
          <label for="password-confirmation">Confirm Password</label>
          <span class="helper-text" v-if="$v.form.confirm_password.$error">
            <span class="error" v-if="!$v.form.confirm_password.sameAsPassword">Password does not match</span>
          </span>
        </div>
      </div>
      <button class="waves-effect waves-light btn blue lighten-2" :disabled="$v.$invalid || processing">Submit</button>
    </form>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { required, minLength, sameAs } from 'vuelidate/lib/validators';

  const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,7}$/m;
  const phoneRegex = (value) => {
    if (typeof value === 'undefined' || value === null || value === '') {
      return true;
    }
    return regex.test(value);
  }

export default {
  name: 'Register',
  mounted() {
    const nodes = document.querySelectorAll('select');
    this.$M.FormSelect.init(nodes);
  },
  data() {
    return {
      processing: false,
      message: null,
      form: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        gender: '',
        confirm_password: '',
      }
    };
  },
  methods: {
    ...mapActions([
      'register',
    ]),
    async registerUser() {
      const { first_name, last_name, email, phone, password, confirm_password, gender } = this.form;
      if (!this.$v.$invalid) {
        try {
          this.processing = true;
          this.message = null;
          await this.register({ first_name, last_name, email, phone, password, confirm_password, gender });
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
      first_name: {
        required,
        minLength: minLength(3)
      },
      last_name: {
        required,
        minLength: minLength(3)
      },
      email: {
        required,
      },
      phone: {
        required,
        phoneRegex,
      },
      gender: {
        required,
      },
      password: {
        required,
        minLength: minLength(6)
      },
      confirm_password: {
        sameAsPassword: sameAs('password')
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
