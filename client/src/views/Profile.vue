<template>
  <section id="profile" class="content-wrapper">
    <header>
      <h5 class="title">Your profile</h5>
      <Icon name="edit" v-if="!isEditing" @click.native="toggleEdit"/>
    </header>
    

    <p class="section-title">Currency</p>
    <TextField v-if="!isEditing" label="Prefered currency" :value="user.currency.code" />
    <Select
      v-else
      label="Prefered currency"
      placeholder="Select currency"
      :options="currencies"
      v-model="currencyId"
      displayKey="name"
      valueKey="id"
    />

    <p class="section-title">Personal data</p>
    <TextField v-if="!isEditing" label="First name" :value="user.firstName" />
    <TextInput v-else label="First name" v-model="firstName" type="text" id="firstName"/>

    <TextField v-if="!isEditing" label="Last name" :value="user.lastName" />
    <TextInput v-else label="Last name" v-model="lastName" type="text" id="lastName"/>

    <TextField v-if="!isEditing" label="Username" :value="user.username" />
    <TextInput v-else label="Username" v-model="username" type="text" id="username"/>

    <TextField v-if="!isEditing" label="Change password" />
    <TextInput v-else label="Change password" v-model="password" type="password" id="password"/>

    <div class="actions" v-if="isEditing">
      <Button label="cancel" :isFlat="true" @click="cancel"/>
      <Button label="save" @click="update"/>
    </div>
    
  </section>
</template>

<script>
import TextField from '@/components/TextField';
import TextInput from '@/components/TextInput';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { mapGetters } from 'vuex';
import M from 'materialize-css';

export default {
  name: 'Profile',
  components: {
    TextField,
    TextInput,
    Icon,
    Button,
    Select
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['currencies'])
  },
  data() {
    const user = this.$props.user;
    return {
      isEditing: false,
      username: user.username,
      currencyId: user.currency.id,
      firstName: user.firstName,
      lastName: user.lastName,
      password: ''
    }
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    update() {
      this.$store
        .dispatch("updateProfile", {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
          currencyId: parseInt(this.currencyId),
        })
        .then(() => {
          this.toggleEdit();
        })
        .catch((err) => {
          M.toast({
            html: err.response.data.message
              ? err.response.data.message
              : "Something went wrong",
          });
        });
    },
    cancel() {
      this.isEditing = false,
      this.username = this.$props.user.username,
      this.currencyId = this.$props.user.currency.id,
      this.firstName = this.$props.user.firstName,
      this.lastName = this.$props.user.lastName,
      this.password = ''
    }
  }
}
</script>

<style lang="scss">
#profile {
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 32px 0;

    i {
      cursor: pointer;
    }

    .title {
      margin: 0px;
    }
  }

  .actions {
    width: 100%;
    margin: 32px 0 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>