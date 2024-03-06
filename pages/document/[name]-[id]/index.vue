<script setup>
import InvoiceSales from "../../../components/Documents/InvoiceSales.vue";
import CasherInvoiceSales  from "~/components/Documents/Casher/InvoiceSales.vue";
import { useRoute } from "vue-router";
import {ref, onMounted} from 'vue';
const route = useRoute();
useHead({
  title: "طباعة فاتورة",
})
definePageMeta({
  layout: "printing",

});
const components = shallowRef({
  InvoiceSales: InvoiceSales,
  CasherInvoiceSales: CasherInvoiceSales
});
const invoice_id = ref(0);
const previewBeforePrint = ref(false);
onMounted(() => {
  if (route.params.id) {
  previewBeforePrint.value = true;
  invoice_id.value = route.params.id
}
})


// const component = computed(() => {
//   return route.params.name
// })
</script>
<template>
  <div>
    <ClientOnly> 
      <div id="Print_Container">
        <InvoiceSales :invoiceID="invoice_id" v-model:previewPrint="previewBeforePrint" />
      </div>
    </ClientOnly>
  </div>
   
</template>
<style lang="scss" scoped>
#Print_Container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
}
</style>
