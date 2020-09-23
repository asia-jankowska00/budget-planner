<template>
  <div id="sourceEdit" class="content-wrapper">
    <h6 class="title">Edit source - <em>{{selectedSource.name}}</em></h6>

    <form @submit.prevent="submit" class="row" autocomplete="off" v-if="!isUpdatingSource">
      <TextInput v-model="name" label="Name" type="text" id="sourceName" />
      <TextInput v-model="description" label="Description" type="text" id="sourceDescription" />
      <TextInput v-model="amount" label="Initial amount" type="number" id="sourceAmount" min="0" step="0.01" />
      <!-- <Select v-model="currencyId" :options="currencies" label="Currency" placeholder="Select currency"  valueKey="id" displayKey="name" id="sourceCurrency"/> -->
    
      <div class="actions">
        <Button label="Save" type="submit" :isDisabled="!canSubmit"/>
      </div>
    </form>

    <Loader v-else text="Updating source" :isSmall="true"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TextInput from '@/components/TextInput'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import M from "materialize-css";
// import Select from '@/components/Select'

export default {
  name: 'SourceEdit',
  components: {
    TextInput,
    Button,
    Loader
    // Select
  },
  computed: {
    ...mapGetters(['user', 'selectedSource', 'currencies', 'isUpdatingSource']),
    canSubmit: function() {
      const amount = parseFloat(this.amount);

      return this.name.length > 2 && amount >= 0 && 
      (this.name !== this.selectedSource.name || this.description !== this.selectedSource.description || amount !== this.selectedSource.amount)
    }
  },
  data() {
    return {
      name: '',
      amount: '',
      description: '',
      // currencyId: ''
    }
  },
  created() {
    this.name = this.selectedSource.name;
    this.description = this.selectedSource.description;
    this.amount = this.selectedSource.amount.toString();
    // this.currencyId = this.selectedSource.currency.id.toString();
  },
  methods: {
    submit() {
      if(this.canSubmit) {
        this.$store
        .dispatch("updateSource", { 
          sourceId: this.selectedSource.id, 
          sourceData: {
            name: this.name,
            description: this.description,
            amount: this.amount
          } 
        })
        .then(() => { this.$router.push({path: '/dashboard/sources'}) })
        .catch((err) => {
            M.toast({
            html: err.response.data.message
                ? err.response.data.message
                : "Something went wrong",
            });
        });
      }
    }
  }
}
</script>

<style>

.title {
  text-align: left;
  margin-bottom: 64px;
}

.actions {
  text-align: center;
}

</style>