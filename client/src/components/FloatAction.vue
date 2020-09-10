<template>
    <div class="fixed-action-btn">
        <a class="btn-floating btn-large primary-bg" :class="ctaClassObject">
            <Icon name="add"/>
        </a>
        <ul>
            <li>
                <span v-if="budgets.length === 0 && sources.length > 0" class="tooltip">Click here to add a budget</span>
                <Button :isFloating="true" :isLink="true" label="Budget" :isDisabled="sources.length === 0" @click="openModal('addBudget')"/>
            </li>
            <li>
                <span v-if="sources.length === 0" class="tooltip">Click here to add a source</span>
                <Button :isFloating="true" :isLink="true" label="Source" @click="openModal('addSource')"/>
            </li>
            <li>
                <Button :isDisabled="budgets.length === 0 || sources.length === 0" :isFloating="true" :isLink="true" label="Transaction"/>
            </li>
        </ul>
    </div>
</template>

<script>
import Icon from '@/components/Icon'
import Button from '@/components/Button'
import M from 'materialize-css';
import { mapGetters } from 'vuex'

export default {
    name: 'FloatAction',
    components: {
        Icon,
        Button
    },
    computed: {
        ...mapGetters(['budgets', 'sources']),
        ctaClassObject: function() {
            return {
                "pulse": this.budgets.length === 0 || this.sources.length === 0
            }
        }
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
        bottom: 40px;
        right: 35px;

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

            .tooltip {
                position: absolute;
                width: max-content;
                right: 80%;
                font-size: 0.8rem;
                padding: 3% 10%;
                margin-top: 12px;
                color: white;
                background: #37474F;
                border-radius: 4px;
                opacity: 0;
                transition: 0s;
                transform: scale(0.5);

                &.transaction {
                    right: 106%;
                }
            }
        }

        &.active {
            .tooltip {
                transition: 0.5s;
                opacity: 1;
                transform: scale(1);
                transition-delay: 0.5s;
            }
        }
    }
</style>