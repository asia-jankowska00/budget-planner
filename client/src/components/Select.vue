<template>
  <div class="input-field col s12">
    <select
        v-on:change="$emit('input', $event.target.value)">
            <!-- :selected might need to be updated -->
            <option value="" disabled selected>{{placeholder}}</option>
            <option v-for="o in options" :key="o.id" :value="o.value" :selected="value === o.value">{{o.text}}</option>
    </select>
    <label>{{label}}</label>
  </div>
</template>

<script>
import M from "materialize-css";

export default {
    name: 'Select',
    props: {
        label: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        options: {
            type: Array,
            default: function() {
                return []
            }
        }
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

<style>

</style>