<template>
  <div>
    <p class="col s12 center-align helper-text" v-if="message">{{ message }}</p>
    <form @submit.prevent="recipient" class="col s12">
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
      <!-- EMAIL, PHONE  -->
      <div class="row">
        <div class="input-field col s12 m6">
          <input type="email" id="recipient_email" v-model.trim="$v.form.recipient_email.$model">
          <label for="recipient_email">Email</label>
          <span class="helper-text" v-if="$v.form.recipient_email.$error">
            <span class="error" v-if="!$v.form.recipient_email.required">Field is required</span>
          </span>
        </div>
        <div class="input-field col s6 m3">
          <input type="text" id="recipient_phone" v-model.trim="$v.form.recipient_phone.$model">
          <label for="recipient_phone">Phone</label>
          <span class="helper-text" v-if="$v.form.recipient_phone.$error">
            <span class="error" v-if="!$v.form.recipient_phone.required">Field is required</span>
            <span class="error" v-if="!$v.form.recipient_phone.phoneRegex">Invalid phone number</span>
          </span>
        </div>
      </div>
      <button class="waves-effect waves-light btn blue lighten-2" :disabled="$v.$invalid || processing">Submit</button>
    </form>
    
    
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { required, minLength } from 'vuelidate/lib/validators';

  const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,7}$/m;
  const phoneRegex = (value) => {
    if (typeof value === 'undefined' || value === null || value === '') {
      return true;
    }
    return regex.test(value);
  }

export default {
  name: 'Recipient',
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
        recipient_email: '',
        recipient_phone: '',
      }
    };
  },
  methods: {
    ...mapActions([
      'recipientCreate',
    ]),
    async recipient() {
      const { first_name, last_name, recipient_email, recipient_phone } = this.form;
      if (!this.$v.$invalid) {
        try {
          this.processing = true;
          this.message = null;
          await this.recipientCreate({ first_name, last_name, recipient_email, recipient_phone });
          this.form = {};
          // this.$router.push('/dashboard');
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
      recipient_email: {
        required,
      },
      recipient_phone: {
        required,
        phoneRegex,
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
