<template>
  <div id="register">
    <h5><em>Create account</em></h5>

    <form @submit.prevent="submit" class="row" autocomplete="off">
      <TextInput
        id="firstName"
        label="First name"
        type="text"
        v-model="firstName"
      />
      <TextInput
        id="lastName"
        label="Last name"
        type="text"
        v-model="lastName"
      />
      <Select
        label="Prefered currency"
        placeholder="Select currency"
        :options="currencies"
        v-model="selectedCurrency"
        displayKey="name"
        valueKey="id"
      />

      <TextInput
        id="username"
        label="Username"
        type="text"
        v-model="username"
      />
      <TextInput
        id="password"
        label="Password"
        type="password"
        v-model="password"
      />

      <div class="actions">
        <Button
          label="Register"
          size="large"
          type="submit"
          :isDisabled="!canSubmit"
        />
        <router-link to="/login" class="link"
          >Already have an account?</router-link
        >
      </div>
    </form>
  </div>
</template>

<script>
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import Select from "@/components/Select";
import M from "materialize-css";
import { mapGetters } from "vuex";

export default {
  name: "Register",
  components: {
    TextInput,
    Button,
    Select,
  },
  data() {
    return {
      error: false,
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      selectedCurrency: "",
    };
  },
  computed: {
    ...mapGetters(["currencies"]),
    canSubmit: function() {
      return (
        this.username.length > 1 &&
        this.password.length > 1 &&
        this.firstName.length > 1 &&
        this.lastName.length > 1 &&
        this.selectedCurrency !== 0 &&
        this.selectedCurrency !== ""
      );
    },
  },
  methods: {
    submit() {
      if (this.canSubmit) {
        this.$store
          .dispatch("register", {
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.username,
            password: this.password,
            currency: parseInt(this.selectedCurrency),
          })
          .then(() => {
            this.$router.push({ path: "dashboard/sources" });
          })
          .catch((err) => {
            M.toast({
              html: err.response.data.message
                ? err.response.data.message
                : "Something went wrong",
            });
          });
      }
    },
  },
  created() {
    this.$store.dispatch("getCurrencies").catch((err) => {
      M.toast({
        html: err.response.data.message
          ? err.response.data.message
          : "Something went wrong",
      });
    });
  },
};
</script>

<style lang="scss" scoped>
#register {
  padding: 5%;
}

h5 {
  text-align: center;
  margin: 5vh 0 7.5vh 0;
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
