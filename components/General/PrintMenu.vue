<script setup>
import PrintIcon from "../Icons/Print.vue";
import ArrowDownIcon from "../Icons/ArrowDown.vue";
import { ref,onMounted, onUnmounted } from "vue";
const props = defineProps(['invoiceID'])
const emit = defineEmits(['printCasher', "printInvoiceSales", "download"])
const showDropMenu = ref(false);

onMounted(() => {
  window.addEventListener("click", () => {
    showDropMenu.value = false;
  }, true);
});
onUnmounted(() => {
  window.removeEventListener("click", this);
});

function casherPrint() {
  showDropMenu.value = false;
  emit('printCasher');
}
function invoiceSalesPrint() {
  showDropMenu.value = false;
  emit('printInvoiceSales')
}
function download() {
  emit('download')
}
</script>
<template>
  <div
    class="row align-items-center justify-center print-menu"
    >
    <div class="icon" >
      <PrintIcon />
    </div>
    <div class="icon dropArrow" @click.stop="showDropMenu = true">
      <ArrowDownIcon />
      <ul class="droplist menu" v-show="showDropMenu">
      <li @click="invoiceSalesPrint">طباعة مباشرة</li>
      <li><NuxtLink :to="`/document/invoice-${props.invoiceID}`" target="_blank">معاينة قبل الطباعة</NuxtLink></li>
      <li @click="download">تحميل</li>
      <li @click="casherPrint">طباعة كاشير</li>
    </ul>
    </div>
   
  </div>
</template>

