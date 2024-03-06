<script setup>
import { useCompanyStore } from '~/store/company';
import { useUserStore } from './store/user';
import { useBranchStore } from './store/branch';
import { useNetworkStore } from './store/network';
import { onMounted } from 'vue';
const {locale} = useI18n();
const networkStore = useNetworkStore();
const companyStore = useCompanyStore();
const userStore = useUserStore();
const branchStore = useBranchStore();

if(process.client) {
  companyStore.setCompanyCode();
  userStore.setUser();
  branchStore.setBranch();

  const lang = localStorage.getItem('lang');
  if (lang) {
    locale.value = lang
  }
  await networkStore.GetIpAddress();
  if (networkStore.success) {
    localStorage.setItem('ip', JSON.stringify(networkStore.IP))
  }
}
const {snack} = useSnackBar();

</script>
<template>
  <NuxtLayout>
    <div id="snackbar" :class="[snack.color,{'show': snack.message,}]" v-if="snack">{{ snack.message }}</div>
    <NuxtLoadingIndicator></NuxtLoadingIndicator>
    <NuxtPage/>
  </NuxtLayout>
</template>
