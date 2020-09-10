<template>
    <div class="fixed-action-btn">
        <a class="btn-floating btn-large primary-bg">
            <Icon name="add"/>
        </a>
        <ul>
            <li><Button :isFloating="true" :isLink="true" label="Budget" @click="openModal('addBudget')"/></li>
            <li><Button :isFloating="true" :isLink="true" label="Source" @click="openModal('addSource')"/></li>
            <li><Button :isFloating="true" :isLink="true" label="Transaction"/></li>
        </ul>
    </div>
</template>

<script>
import Icon from '@/components/Icon'
import Button from '@/components/Button'
import M from 'materialize-css';

export default {
    name: 'FloatAction',
    components: {
        Icon,
        Button
    },
    mounted() {
        const elems = document.querySelectorAll('.fixed-action-btn');
        M.FloatingActionButton.init(elems, {hoverEnabled: false});
    },
    methods: {
        openModal: function(modalName) {
            this.$store.commit('openModal', {name: modalName});
        }
    }
}
</script>

<style lang="scss" scoped>
    .btn-floating:hover {
        background-color: #2979ff;
    }

    .fixed-action-btn {
        position: absolute;
        bottom: 25px;
        right: 25px;

        &::before {
            content: ''
        }

        ul {
            left: unset;
            right: -6px;
            text-align: right;

            .btn-floating {
                width: max-content;
                padding: 0 16px;
                border-radius: 2px;
            }
        }
    }
</style>