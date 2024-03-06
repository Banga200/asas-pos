<script setup>
import Select from "../Inputs/Select.vue";
import PasswordInput from '../Inputs/PasswordInput.vue'
import Button from '../Buttons/Button.vue'
import OpenEyeIcon from '../Icons/OpenEye.vue';
import { useRouter } from "vue-router";
import { useUserStore } from "~/store/user";
import {ref, watch} from 'vue';

const router = useRouter();
const { validate , isValid, errors} = useUserValidation()
const userStore = useUserStore();
userStore.GetAllUsers()
const {CurrentUser, Users} = storeToRefs(userStore)
const user = ref({
  username: '',
  password: ''
})
watch(user.value,async(value) => {
  if(user.value.username !== '') {errors.value.username = ''}
  if(user.value.password !== '') {errors.value.password = ''}
  await validate(user.value);
})

async function submitLogin() {
  if(isValid.value) {
    await userStore.Login(user.value);
    if (CurrentUser.value) {
      console.log(CurrentUser.value)
      router.push('/user-check/Choose_Branch')
    }
  }
  else {

  }

}
</script>
<template>
    <form class="flex-column-space" @submit.prevent="submitLogin">
    <p>تسجيل الدخول...</p>
    <!-- Field  -->
    <div class="input-group">
        <Select :items="Users"  :displayText="'UserName'" :lable="'اسم المستخدم'" :color="errors.username ? 'error': ''" :FullWidth="true" v-model:input.trim="user.username"/>
        <PasswordInput :lable="'كلمة السر'" :color="errors.password ? 'error' : ''" :FullWidth="true" :leftIcon="OpenEyeIcon" v-model:input.trim="user.password"/>
    </div>
    <Button :type="'submit'" :color="'primary'" :text="'تسجيل الدخول'" :FullWidth="true"></button>
    <div class="text-center">
      <small> قم بإدخال<NuxtLink to="/user-check/Company_Code" class="link"> رقم الشركة</NuxtLink></small>
    </div>
  </form>
</template>