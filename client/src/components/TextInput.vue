<template>
    <div class="input-field col s12">
        <input
            :id="id" 
            :type="type" 
            :value="value"
            v-on:input="$emit('input', $event.target.value)"
        >
        <label :for="id">{{label}}</label>
    </div>
</template>

<script>
import M from "materialize-css";

export default {
    name: 'TextInput',
    props: {
        id: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            validator: function (value) {
                return ['text', 'password'].indexOf(value) !== -1
            }
        },
        value: {
            type: String,
            required: true
        }
    },
    updated: function() {
        M.updateTextFields();
    }
}
</script>

<style>

</style>