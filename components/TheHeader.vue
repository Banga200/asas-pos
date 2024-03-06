<script setup>
import Logout from "./Icons/Logout.vue";
import SettingIcon from './Icons/Setting.vue'
import { useUserStore } from "~/store/user";
import { useCompanyStore } from "~/store/company";
import { useRouter } from "vue-router";
import Modal from "./General/Modal.vue";
const localePath = useLocalePath();
const router = useRouter();
const companyStore = useCompanyStore();
const userStore = useUserStore();
const modal = ref(false)
async function logout() {
  if (process.client) {
    await userStore.LogOut(companyStore.CompanyCode);
    const branch = localStorage.getItem("branchId");
    if (!branch) {
      router.push("/user-check/Login");
      modal.value = false
    }
  }
}
</script>
<template>
  <Modal @clickEvent="logout" v-model:modal="modal" :headTitle="'تأكيد تسجيل الخروج'" :headContent="'هل تريد بالفعل تسجيل الخروج ؟'" :description="''" :actionColor="'red'" :actionText="'نعم'"/>
  <header>
    <div class="container row flex-wrap justify-space-between align-items-center">
      <nav>
        <NuxtLink :to="localePath('/invoice-sales')">{{
          $t("header.invoice-sales")
        }}</NuxtLink>
        <NuxtLink :to="localePath('/')">مرتجع المبيعات</NuxtLink>
        <NuxtLink>سند قبض</NuxtLink>
        <NuxtLink>أرصدة العملاء</NuxtLink>
        <NuxtLink>تقارير المبيعات</NuxtLink>
      </nav>
      <ClientOnly>
        <div class="user__side">
          <NuxtLink :to="localePath('/settings/choose-branch')"><SettingIcon/></NuxtLink>
          <div class="icon" v-if="userStore.CurrentUser">
            <Logout @click="modal = true" />
          </div>
        </div>
      </ClientOnly>
    </div>
  </header>
</template>
<style scoped>
.user__side {
  display: flex;
  gap: 1rem;
}
</style>
