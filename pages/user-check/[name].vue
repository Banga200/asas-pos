<script setup>
import {computed, ref,shallowRef} from 'vue';
import Choose_Branch from '~/components/user/ChooseBranch.vue'
import Login from '~/components/user/Login.vue'
import Company_Code  from "../../components/user/CompanyCode.vue";
import {useCompanyStore} from '~/store/company';


const companyStore = useCompanyStore();
// All These Key are Depending on Same Route params .name 
// If we change route to /user-check/Login will change :is Component to Login component, and so on 
const components = shallowRef({
    Choose_Branch: Choose_Branch,
    Login: Login,
    Company_Code:Company_Code
})

</script>
<template>
  <div class="row-middle-center">
    <div class="row login-container">
        <div class="right-side">
            <img src="/images/logo_new 2.png" alt="شعار شركة أساس الحاسب"/>
            <div class="text">
                <p>أهلا بكم في ...</p>
                <h1>نقطة بيع أساس الحاسب</h1>
            </div>
        </div>
        <!-- Fields  -->
        <div class="left-side">
            <ClientOnly>
                <component :is="components[$route.params.name]"/>
            </ClientOnly>
        </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.row-middle-center {
    background-color: $background-neutral-200;
}
</style>