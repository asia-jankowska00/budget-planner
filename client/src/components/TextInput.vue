<template>
    <div class="input-field">
        <input v-if="type && type !== 'number'" :id="id" :type="type" :value="value" v-on:input="$emit('input', $event.target.value)">
        <input v-else-if="type && type === 'number'" :id="id" :type="type" :value="value" :min="min" :max="max" :step="step" v-on:input="$emit('input', $event.target.value)">
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
                return ['text', 'password', 'number'].indexOf(value) !== -1
            }
        },
        min: String,
        max: String,
        step: String,
        value: {
            type: String,
            required: true
        }
    },
    mounted() {
        M.updateTextFields();
    },
    updated() {
        M.updateTextFields();
    }
}
</script>

<style lang="scss">
    input:not([type]):focus:not([readonly]), input[type="text"]:not(.browser-default):focus:not([readonly]), input[type="password"]:not(.browser-default):focus:not([readonly]), input[type="email"]:not(.browser-default):focus:not([readonly]), input[type="url"]:not(.browser-default):focus:not([readonly]), input[type="time"]:not(.browser-default):focus:not([readonly]), input[type="date"]:not(.browser-default):focus:not([readonly]), input[type="datetime"]:not(.browser-default):focus:not([readonly]), input[type="datetime-local"]:not(.browser-default):focus:not([readonly]), input[type="tel"]:not(.browser-default):focus:not([readonly]), input[type="number"]:not(.browser-default):focus:not([readonly]), input[type="search"]:not(.browser-default):focus:not([readonly]), textarea.materialize-textarea:focus:not([readonly]) {
        border-bottom: 1px solid #2979ff;
        box-shadow: 0 1px 0 0 #2979ff;
    }
    input:not([type]):focus:not([readonly]) + label, input[type="text"]:not(.browser-default):focus:not([readonly]) + label, input[type="password"]:not(.browser-default):focus:not([readonly]) + label, input[type="email"]:not(.browser-default):focus:not([readonly]) + label, input[type="url"]:not(.browser-default):focus:not([readonly]) + label, input[type="time"]:not(.browser-default):focus:not([readonly]) + label, input[type="date"]:not(.browser-default):focus:not([readonly]) + label, input[type="datetime"]:not(.browser-default):focus:not([readonly]) + label, input[type="datetime-local"]:not(.browser-default):focus:not([readonly]) + label, input[type="tel"]:not(.browser-default):focus:not([readonly]) + label, input[type="number"]:not(.browser-default):focus:not([readonly]) + label, input[type="search"]:not(.browser-default):focus:not([readonly]) + label, textarea.materialize-textarea:focus:not([readonly]) + label {
        color: #2979ff;
    }
</style>