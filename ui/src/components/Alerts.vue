<template>
  <div>Alerts</div>
</template>

<script>
import axios from '@/lib/axios';

export default {
  async mounted() {
    try {
      const response = await axios.get('alerts');
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
}
</script>
