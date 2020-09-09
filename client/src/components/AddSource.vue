<template>
    <div id="addSourcePopup">
        <form @submit.prevent="submit" class="row" autocomplete="off">
            <h5>Add source</h5>
            <TextInput v-model="name" label="Name" type="text" id="sourceName"/>
            <TextInput v-model="amount" label="Initial amount" type="number" id="sourceAmount" min="0" step="0.01"/>
            <Select v-model="currency" :options="currencies" label="Currency" placeholder="Select currency" valueKey="code" displayKey="text"/>
            <div class="actions">
                <Button label="Close" :isFlat="true" @click="closeModal"/>
                <Button label="Save" type="submit"/>
            </div>
        </form>
    </div>
</template>

<script>
import TextInput from '@/components/TextInput';
import Select from '@/components/Select';
import Button from '@/components/Button';
import { mapGetters } from 'vuex';

export default {
    name: 'AddSource',
    data() {
        return {
            name: '',
            amount: '',
            currency: ''
        }
    },
    components: {
        TextInput,
        Select,
        Button
    },
    computed: {
        ...mapGetters(['currencies']),
    },
    methods: {
        submit: function() {
            alert('source submitted');
        },
        closeModal: function() {
            this.$store.commit('closeModal');
        }
    }
}
</script>

<style lang="scss" scoped>
    #addSourcePopup {
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
    }
</style>