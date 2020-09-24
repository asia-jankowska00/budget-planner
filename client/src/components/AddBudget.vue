<template>
    <div id="addBudgetPopup">
        <form @submit.prevent="submit" class="row" autocomplete="off">
            <h5>Add budget</h5>

            <TextInput v-model="name" label="Name" type="text" id="sourceName"/>
            
            <p class="checkbox-group-title">Sources</p>
            <Checkbox 
                v-for="(s, index) in sources" 
                :key="index"
                :label="s.name" 
                :id="s.name"
                :input-value="s.id.toString()"
                v-model="selectedSources"
            />

            <div class="actions">
                <Button label="Close" :isFlat="true" @click="closeModal"/>
                <Button label="Save" type="submit" :isDisabled="!canSubmit"/>
            </div>
        </form>
    </div>
</template>

<script>
import TextInput from '@/components/TextInput';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import { mapGetters } from 'vuex';
import M from "materialize-css";

export default {
    name: 'AddBudget',
    data() {
        return {
            name: '',
            selectedSources: []
        }
    },
    components: {
        TextInput,
        Button,
        Checkbox
    },
    computed: {
        ...mapGetters(['sources']),
        canSubmit: function () {
            return this.name.length > 2 && this.selectedSources.length > 0
        }
    },
    methods: {
        submit: function() {
            if (this.canSubmit) {
                this.$store
                .dispatch("addBudget", { name: this.name, sources: this.selectedSources })
                .then(() => { this.closeModal(); })
                .catch((err) => {
                    M.toast({
                    html: err.response.data.message
                        ? err.response.data.message
                        : "Something went wrong",
                    });
                });
            } 
        },
        closeModal: function() {
            this.$store.commit('closeModal');
        }
    }
}
</script>

<style lang="scss" scoped>
    #addBudgetPopup {
        padding: 7.5%;
        position: absolute;
        width: 90%;
        left: 5%;
        top: 15%;
        background: #FAFAFA;
        box-shadow: 0px 24px 38px rgba(0, 0, 0, 0.14);
        z-index: 1600;

        h5 {
            text-align: center;
            margin-bottom: 64px;
        }

        .actions {
            text-align: right;
            margin-top: 64px;

            > *:last-child {
                margin-right: 0;
            }
        }

        .checkbox-group-title {
            color: #90A4AE;
        }
    }
</style>