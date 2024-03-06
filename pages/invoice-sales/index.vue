<script setup>
import SearchIcon from "~/components/Icons/Search.vue";
import TextInput from "../../components/Inputs/TextInput.vue";
import Button from "../../components/Buttons/Button.vue";
import AddIcon from "~/components/Icons/Add.vue";
import InvoiceSalesTable from "../../components/Tables/InvoiceSalesTable.vue";
import { useSalesStore } from "~/store/sales";
import { watch,ref ,computed } from "vue";
import CasherInvoiceSales from "../../components/Documents/Casher/InvoiceSales.vue";
import InvoiceSalesPrint from "../../components/Documents/InvoiceSales.vue";
const localePath = useLocalePath()
const salesStore = useSalesStore();
const search = ref("");
const printing = ref(false);
const printingInvoiceSales = ref(false);
const download = ref(false)
const invoiceId = ref('')
if (process.client) {
    salesStore.GetAllSales();
}
const dialog = ref(false);
const { Sales } = storeToRefs(salesStore);
const filterInvoices = computed(() => {
  if (Sales.value) {
    if (search.value !== '') {
        return Sales.value.filter((item) => {
      return item.InvoiceNo.toLowerCase().includes(search.value.toLowerCase()) || item.CustomerName.toLowerCase().includes(search.value.toLowerCase())
    });
    }
    return Sales.value
  }
});

function printCasher(id) {
  printing.value = true;
  invoiceId.value = id
}
function printInvoiceSale(id) {
  printingInvoiceSales.value = true;
  invoiceId.value = id
}
function setDownload(id) {
  download.value = true;
  invoiceId.value = id;
  // dialog.value = true;
}
</script>
<template>
  <section id="invoiceSales" class="container">
    <div class="flex-between flex-wrap">
      <h2>فاتورة المبيعات</h2>
      <TextInput
        :placeholder="'رقم الفاتورة, اسم العميل'"
        :appendIcon="SearchIcon"
        v-model:input="search"
      />
      <Button :color="'primary'" :text="'جديد'" :preAppendIcon="AddIcon" @click="$router.push(localePath('/invoice-sales/new-invoice'))"/>
    </div>

    <!-- Invoices Sales Table  -->
    <div class="table_container">
        <InvoiceSalesTable :invoices="filterInvoices" @printCasher="printCasher" @printInvoiceSales="printInvoiceSale" @download="setDownload"/>
    </div>
  </section>
  <ClientOnly>
    <CasherInvoiceSales :invoiceID="invoiceId" v-model:print="printing" />
    <!--This Paper For download and direct print  -->
    <InvoiceSalesPrint :invoiceID="invoiceId" v-model:print="printingInvoiceSales" v-model:download="download"/>
    <!-- Preview Content  -->
  </ClientOnly>
</template>
<style scoped lang="scss">
#invoiceSales {
  h2 {
    margin: 1rem 0;
  }
}
.container {
  margin-top: 2rem;
}
</style>
