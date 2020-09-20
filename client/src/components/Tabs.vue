<template>
    <!-- hardcoded for now -->
    <div class="tabs-container row">
        <div class="col s12">
            <ul class="tabs light-primary-bg " v-if="!canGoBack">
                <li class="tab col s6 primary"><router-link to="/dashboard/sources">Sources</router-link></li>
                <li class="tab col s6 primary"><router-link to="/dashboard/budgets">Budgets</router-link></li>
                <li class="indicator" style=""></li>
            </ul>
            <ul class="tabs light-primary-bg" v-else>
                <li class="tab col s12 primary go-back">
                    <a href="" @click.prevent="goBack" class="link">
                        <Icon name="keyboard_backspace" />
                        <span>Back to {{this.lastPage}}</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Icon from '@/components/Icon';
export default {
    name: 'Tabs',
    components: {
        Icon
    },
    props: {
        canGoBack: Boolean
    },
    data() {
        return {
            lastPage: ''
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        }
    },
    watch: {
        $route(to, from) {
            this.lastPage = from.name;
        }
    }
}
</script>

<style lang="scss">
    .tabs-container {
        width: 100%;
        margin-bottom: 0;

        .s12 {
            padding: 0;
        }
    }

    .tabs {
        .tab {
            a,
            a.active {
                color: #2979ff;
                font-weight: 500;

                &:focus { 
                    background-color: #d6e5fd;
                }
            }

            a:not(.active):hover {
                color: black;
            }

            &.go-back {
                text-align: left;
                a {
                    display: flex;
                    align-items: center;
                    padding: 0 5%;
                    text-decoration: none;
                
                    i {
                        margin-right: 8px;
                    }
                }
            }
        }

        .indicator {
            background-color: #2979ff;
            transition: 0.25s ease-out;
        }
    }
</style>