<template>
  <div :id="id" class="input-field">
    <select
        v-on:change="$emit('input', $event.target.value)">
            <!-- :selected might need to be updated -->
            <option v-if="placeholder" value="" disabled selected>{{placeholder}}</option>
            <option v-for="o in options" :key="o.id" :value="o[valueKey]" :selected="value === o[valueKey]">{{o[displayKey]}}</option>
    </select>
    <label v-if="label">{{label}}</label>
  </div>
</template>

<script>
import M from "materialize-css";

export default {
    name: 'Select',
    props: {
        id: String,
        label: String,
        placeholder: String,
        value: {
            type: [String, Number],
            required: true
        },
        options: {
            type: Array,
            default: function() {
                return []
            }
        },
        displayKey: {
            type: String,
            required: true
        },
        valueKey: {
            type: String,
            required: true
        }
        // implement col-size: s3, s4, s6, s12
    },
    methods: {
        updateMaterialize: function() {
            let elems = document.querySelectorAll('select');
            M.FormSelect.init(elems);
        }
    },
    mounted: function() {
        this.updateMaterialize()
    },
    updated: function() {
        this.updateMaterialize()
    }
}
</script>

<style lang="scss">
.select-wrapper input.select-dropdown:focus {
    border-bottom: 1px solid #2979ff;
}

.dropdown-content li:not(.disabled) > a, .dropdown-content li:not(.disabled) > span {
    color: #2979ff !important;
}
</style>