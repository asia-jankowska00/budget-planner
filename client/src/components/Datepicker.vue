<template>
  
  <div class="input-field">
    <input type="text" class="datepicker" :value="value">
    <label :for="id">{{label}}</label>
  </div>
</template>

<script>
import M from 'materialize-css';

export default {
  name: 'Datepicker',
  props: {
    value: Date,
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  mounted() {
    const self = this;
    const elem = document.querySelectorAll('.datepicker');
    const container = document.getElementById('addTransactionPopup')
    M.Datepicker.init(elem, {
      defaultDate: new Date(),
      container,
      onSelect: (date) => self.$emit('input', date)
    });
  }
}
</script>

<style lang="scss">
.datepicker-modal {
  max-width: 400px;
  min-width: 300px;
  max-height: none;
}

.modal {
  width: 80%; 
  top: 20% !important;
}

.datepicker-date-display {
  flex: 0 1 0px;
  background-color: #2979ff;
}

.datepicker-table td.is-selected {
  background-color: #2979ff;
}

.datepicker-cancel, .datepicker-clear, .datepicker-today, .datepicker-done,
.datepicker-table td.is-today {
  color: #2979ff;
}

.datepicker-controls, .datepicker-table, .datepicker-footer {
  width: 320px;
}

.datepicker-container.modal-content {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.datepicker-date-display {
  .year-text {
    font-size: 1rem;
  }

  .date-text{
    font-size: 2rem;
  }
}

</style>