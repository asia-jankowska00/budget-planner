<template>
    <!-- hardcoded for now -->
    <div class="col s12">
        <ul class="tabs light-primary-bg ">
            <li class="tab col s6 primary"><router-link to="/dashboard/sources">Sources</router-link></li>
            <li class="tab col s6 primary"><router-link to="/dashboard/budgets">Budgets</router-link></li>
        </ul>
    </div>
</template>

<script>
import M from "materialize-css";

export default {
    name: 'Tabs',

    mounted: function() {
        M.Tabs.init(document.querySelector('ul.tabs'));
    }
}
</script>

<style lang="scss">
    .tabs {
        top: 60px;

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
        }

        .indicator {
            background-color: #2979ff;
        }
    }
</style>