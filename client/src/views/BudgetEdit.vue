<template>
  <div id="budgetEdit" class="content-wrapper">
    <h6 class="title">Edit budget - <em>{{selectedBudget.name}}</em></h6>
  
    <section class="name-edit">
      <TextInput v-model="name" label="Name" type="text" id="sourceName" />
      <Button label="Save" :isDisabled="!canSaveName" @click.native="saveName"/>
    </section>
    
    <section class="edit-section">
      <p class="edit-section-title light-primary">Collaborators</p>
      <div class="collaborators">
        <p class="collaborator" v-for="person in budgetCollaborators" :key="'collaborator' + person.id">
          <span class="circle">{{person.firstName[0]}}{{person.lastName[0]}}</span>
          <span class="username">{{person.username}}</span>
        </p>
      </div>
      <Button label="Edit collaborators" :isFlat="true" @click.native="goToEditCollaborators"/>
    </section>

    <section class="edit-section">
      <p class="edit-section-title light-primary">Sources</p>
      <div class="sources" v-if="ownSources.length > 0">
        <p class="source-title light-primary">Your sources</p>
        <p class="source-name" v-for="source in ownSources" :key="'source' + source.id">{{source.name}}</p>
      </div>

      <div class="sources" v-if="otherSources.length > 0">
        <p class="source-title light-primary">Other sources</p>
        <p class="source-name" v-for="source in otherSources" :key="'source' + source.id">{{source.name}}</p>
      </div>
      <Button label="Edit source permissions" :isFlat="true"/>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TextInput from '@/components/TextInput'
import Button from '@/components/Button'

export default {
  name: 'BudgetEdit',
  components: {
    TextInput,
    Button
  },
  data() {
    return {
      name: ''
    }
  },
  computed: {
    ...mapGetters(['user', 'selectedBudget', 'budgetCollaborators', 'budgetSources']),
    canSaveName: function() {
      return this.name.length > 1 && this.name !== this.selectedBudget.name
    },
    ownSources: function() {
      if (!this.budgetSources) return [];
      return this.budgetSources.filter(source => source.owner.id === this.user.id)
    },
    otherSources: function() {
      if (!this.budgetSources) return [];
      return this.budgetSources.filter(source => source.owner.id !== this.user.id)
    }
  },
  created() {
  },
  methods: {
    saveName() {
      alert('update name');
    },
    goToEditCollaborators() {
      this.$router.push({path: `edit/collaborators`});
    }
  }
}
</script>

<style lang="scss">
  #budgetEdit {
    .title {
      margin-bottom: 32px;
    }

    button {
      margin: 16px 0;

      &.btn-flat {
        color: #2979ff;
      }
    }
  }
  
  section {
    margin: 2rem 0;

    &.name-edit {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-top: 0;

      .input-field {
        margin-bottom: 0;
        width: 100%;
      }

      button {
        width: min-content;
      }
    }
  }

  .edit-section {
    .edit-section-title {
      font-size: 0.9rem;
      margin-bottom: 8px;
    }

    .source-title {
      font-size: 0.9rem;
      margin: 8px 0 0 16px;
    }

    .source-name {
      margin-left: 32px;
      margin-top: 4px;
    }

    .collaborator {
      display: flex;
      align-items: center;
      margin: 8px 0;

      .username {
        display: inline-block;
        margin-left: 8px;
      }
    }
  }
</style>