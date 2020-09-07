<template>
  <div class="register">
    <h5><em>Create account</em></h5>

    <form @submit.prevent="submit" class="row" autocomplete="off">
      <TextInput id="username" label="Username" type="text" v-model="username"/>
      <TextInput id="password" label="Password" type="password" v-model="password"/>
      <Select 
        label="Prefered currency" 
        placeholder="Select currency"
        :options="currencies" 
        v-model="selectedCurrency"
      />

      <div class="actions">
        <Button label="Register" size="large" type="submit"/>
        <router-link to="/login" class="link">Already have an account?</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import TextInput from '@/components/TextInput'
import Button from '@/components/Button'
import Select from '@/components/Select'

export default {
  name: 'Register',
  components: {
    TextInput,
    Button,
    Select
  },
  data() {
    return {
      username: '',
      password: '',
      selectedCurrency: '',
      currencies: [
        {
          "id": 1,
          "value": 'DKK',
          "text": 'Danish Krone'
        },
        {
          "id": 2,
          "value": 'EUR',
          "text": 'Euro'
        },
        {
          "id": 3,
          "value": 'USD',
          "text": 'United States Dollar'
        }
      ]
    }
  },
  methods: {
    submit: function(){
      alert('submitted');
    }
  }
}
</script>

<style lang="scss" scoped>
h5 {
  text-align: center;
  margin-top: 10vh;
  color: #2979ff;
}

form {
  margin-top: 5%;

  .actions {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;

    .btn {
      width: max-content;
    }

    .link {
      margin-top: 10vh;
    }
  }
}
</style>