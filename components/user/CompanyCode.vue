<script setup>
import TextInput from "../Inputs/TextInput.vue";
import Button from '../Buttons/Button.vue'
import {useCompanyStore} from '~/store/company';
import {ref, watch} from 'vue';
import { useRouter } from "vue-router";

const router = useRouter()
const companyStore = useCompanyStore()
const {CheckCode, CompanyCode} = storeToRefs(companyStore)
const form = ref(null)
const companyCode = ref('');
const color = ref('')

watch(companyCode, (value) => {
  if(companyCode.value.length > 0){color.value = ''}
})
async function submitCode() {
  if (companyCode.value !== '' ) {
    // Send request check code 
   await companyStore.CheckCode(companyCode.value)
   if(CompanyCode.value) {
    router.push('/user-check/Login')
   }
  }
  else {
    color.value = 'error'
  }
}
</script>
<template>
  <form ref="form" class="flex-column-space" @submit.prevent="submitCode">
    <p>قم بإدخال كود الشركة للتحقق من بياناتك في الشركة</p>
    <!-- Field  -->
    <TextInput :color="color" :label="'كود الشركة'" :FullWidth="true" v-model:input.trim="companyCode"/>
    <!-- Confrm Buton -->
    <Button :color="'primary'" :type="'submit'"  :text="'تأكيد'" :FullWidth="true"></button>
    <div class="text-center">
      <small>الرجوع الى <NuxtLink class="link" to="/user-check/Login">تسجيل الدخول</NuxtLink></small>
    </div>
  </form>
</template>
