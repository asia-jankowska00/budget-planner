<template>
  <section id="transactions">
    <p class="section-title">Latest transactions</p>

    <table id="grid" v-if="transactions.length > 0">
      <tr>
        <th>Name</th>
        <th>Date</th>
        <th>Price</th>
      </tr>
      <tr 
        v-for="transaction in transactions" 
        :key="transaction.id"
        :class="{'is-income': !transaction.isExpense}"
      >
        <td>{{transaction.name}}</td>
        <td>{{transaction.date.substring(0, 10)}}</td>
        <td class="amount-cell">{{transaction.amount}} {{currency.symbol}}</td>
      </tr>
    </table>

    <p class="no-records" v-else>No transactions.</p>
  </section>
</template>

<script>
export default {
  name: 'TransactionsGrid',
  props: {
    transactions: {
      type: Array,
      required: true
    },
    currency: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
#transactions {
  margin: 32px 0;
  table#grid {
    font-size: 0.8rem;

    tr {
      td, th {
        &:first-child {
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
        }
      }

      &.is-income {
        td {
          &.amount-cell {
            color: #080;
          }
        }
      }

      td {
        color: #546E7A;

        &.amount-cell {
          color: #cb4848;
        }
      }

      th {
        font-weight: 500;
      }
    }
  }

  .no-records {
    font-weight: 600;
  }
}
</style>