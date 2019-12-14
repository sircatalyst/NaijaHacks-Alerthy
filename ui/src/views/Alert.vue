<template>
  <div>
    <p class="col s12 center-align helper-text" v-if="respond">{{ respond }}</p>
    <form @submit.prevent="alert" class="col s12">
      <!-- Alert -->
      <div class="row">
        <div class="input-field col s12 m6">
          <input type="number" id="trigger_interval" v-model.trim="$v.form.trigger_interval.$model">
          <label for="trigger_interval">Trigger Interval</label>
          <span class="helper-text" v-if="$v.form.trigger_interval.$error">
            <span class="error" v-if="!$v.form.trigger_interval.required">Field is required</span>
            <!-- <span class="error" v-if="!$v.form.trigger_interval.minLength">Trigger Interval must have at least {{$v.form.trigger_interval.$params.minLength.min}} letters.</span> -->
          </span>
        </div>
      </div>
      <button class="waves-effect waves-light btn blue lighten-2" :disabled="$v.$invalid || processing">Submit</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'Alert',
  mounted() {
    const nodes = document.querySelectorAll('select');
    this.$M.FormSelect.init(nodes);
  },
  data() {
    return {
      processing: false,
      respond: null,
      form: {
        trigger_interval: '',
      }
    };
  },
  methods: {
    ...mapActions([
      'alertCreate',
    ]),
    async alert() {
      const { trigger_interval } = this.form;
      if (!this.$v.$invalid) {
        try {
          this.processing = true;
          this.respond = null;
          await this.alertCreate({ trigger_interval });
          this.trigger_interval = '';
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
      trigger_interval: {
        required
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
