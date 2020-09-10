<template>
    <label :for="id" class="custom-checkbox">
        <input type="checkbox" class="filled-in" :id="id" :value="inputValue" @change="onChange" />
        <span>{{ label }}</span>
    </label>
</template>

<script>
export default {
    name: 'Checkbox',
    props: {
        label: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        inputValue: String,
        value: [Array, Boolean]
    },
    watch: {
        value: function (newValue) {
            if (Array.isArray(newValue)) {
                this.$el.firstElementChild.checked = newValue.includes(this.inputValue) ? true : false;
            } else if (typeof newValue === "boolean") {
                this.$el.firstElementChild.checked = newValue;
            }
        }
    },
    methods: {
        onChange(e) {
            let currentValue;

            if (Array.isArray(this.value)) {
                currentValue = [...this.value];

                if (e.target.checked) {
                    currentValue.push(e.target.value) 
                } else {
                    currentValue = currentValue.filter(item => item !== e.target.value)
                } 
            } else {
                currentValue = e.target.checked
            }
            

            this.$emit('input', currentValue);
        }
    }
}
</script>

<style lang="scss">
    label.custom-checkbox {
        display: flex;
        align-items: center;
        color: #455a65;
        margin: 16px 0;
    }

    [type="checkbox"].filled-in:checked + span:not(.lever)::after {
        border: 2px solid #2979ff;
        background-color: #2979ff;
    }

    
</style>