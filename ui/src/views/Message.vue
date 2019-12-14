<template>
  <div>
    <p class="col s12 center-align helper-text" v-if="respond">{{ respond }}</p>
    <form @submit.prevent="message" class="col s12">
      <!-- Message && Subject -->
      <div class="row">
        <div class="input-field col s12 m6">
          <input type="text" id="message" v-model.trim="$v.form.message.$model">
          <label for="message">Message</label>
          <span class="helper-text" v-if="$v.form.message.$error">
            <span class="error" v-if="!$v.form.message.required">Field is required</span>
            <span class="error" v-if="!$v.form.message.minLength">Message must have at least {{$v.form.message.$params.minLength.min}} letters.</span>
          </span>
        </div>
        <div class="input-field col s12 m6">
          <input type="text" id="subject" v-model.trim="$v.form.subject.$model">
          <label for="subject">SUbject</label>
          <span class="helper-text" v-if="$v.form.subject.$error">
            <span class="error" v-if="!$v.form.subject.required">Field is required</span>
            <span class="error" v-if="!$v.form.subject.minLength">Subject must have at least {{$v.form.subject.$params.minLength.min}} letters.</span>
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

export default {
  name: 'Message',
  mounted() {
    const nodes = document.querySelectorAll('select');
    this.$M.FormSelect.init(nodes);
  },
  data() {
    return {
      processing: false,
      respond: null,
      form: {
        message: '',
        subject: ''
      }
    };
  },
  methods: {
    ...mapActions([
      'messageCreate',
    ]),
    async message() {
      const { message, subject } = this.form;
      if (!this.$v.$invalid) {
        try {
          this.processing = true;
          this.respond = null;
          await this.messageCreate({ message, subject });
          this.form = {};
        } catch (error) {
          const { respond } = error.response.data;
          this.respond = respond;
        } finally {
          this.processing = false;
        }
      }
    }
  },
  validations: {
    form: {
      message: {
        required,
        minLength: minLength(3)
      },
      subject: {
        required,
        minLength: minLength(3)
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
