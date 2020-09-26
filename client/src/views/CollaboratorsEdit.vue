<template>
  <div id="collaboratorsEdit" class="content-wrapper">
    <h6 class="title">Edit <em>{{selectedBudget.name}}'s</em> collaborators</h6>

    
    <section class="edit-section">
      <p class="edit-section-title light-primary">Collaborators</p>
      <div class="collaborators">
        <p class="collaborator" v-for="person in budgetCollaborators" :key="'collaborator' + person.id">
          <span class="circle">{{person.firstName[0]}}{{person.lastName[0]}}</span>
          <span class="username">{{person.username}}</span>
        </p>
      </div>

      <Autocomplete id="users" label="Add collaborator" v-model="searchedUsername" :data="searchedCollaborators"/>
      <Button label="Add" :isDisabled="!canAdd" @click.native="addCollaborator"/>
    </section>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Autocomplete from '@/components/Autocomplete';
import Button from '@/components/Button';
import _ from 'lodash';
import M from 'materialize-css';

export default {
  name: 'BudgetEdit',
  components: {
    Autocomplete,
    Button
  },
  data() {
    return {
      searchedUsername: '',
    }
  },
  watch: {
    searchedUsername: function(value) {
      if (value.length > 0) {
        this.debouncedGetUsers(value)
      } else {
        this.debouncedClearUsers()
      }
    }
  },
  computed: {
    ...mapGetters(['user', 'selectedBudget', 'budgetCollaborators', 'searchedCollaborators']),
    canAdd: function() {
      return this.searchedCollaborators.filter(user => user.username === this.searchedUsername).length === 1;
    }
  },
  created() {
    this.debouncedGetUsers = _.debounce(function(query) {
      this.searchUsers(query)
    }, 500);
    this.debouncedClearUsers = _.debounce(function() {
      this.$store.commit('updateSearchedCollaborators', [])
    }, 500)
  },
  methods: {
    searchUsers(query) {
      this.$store.dispatch("searchCollaborators", query)
        .catch((err) => {
          M.toast({ html: err.response.data.message ? err.response.data.message : "Something went wrong" });
        });
    },
    addCollaborator() {
      this.$store.dispatch("addCollaborator", {
        budgetId: this.selectedBudget.id,
        collaborator: {
          collaboratorId: this.searchedCollaborators[0].id
        }
      })
      .then(() => this.searchedUsername = '')
      .catch((err) => {
        M.toast({ html: err.response.data.message ? err.response.data.message : "Something went wrong" });
      });
    }
  }
}
</script>

<style lang="scss">
.autocomplete-wrapper {
  margin-top: 64px;
  margin-bottom: 8px;
}

#collaboratorsEdit {
  .btn {
    margin: 0;
  }
}
</style>