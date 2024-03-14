<script setup>
import PrintIcon from "../Icons/Print.vue";
import RepeatIcon from "../Icons/Repeat.vue";
import Chipe from "../../components/Buttons/Chipe.vue";
import PrintMenu from "../General/PrintMenu.vue";
import {useRouter} from 'vue-router';
import {ref} from 'vue';
const router = useRouter();
const emit = defineEmits(['printCasher','printInvoiceSales', 'download'])
const props = defineProps(["invoices"]);

function printCasher(id) {
  emit('printCasher',id)
}
function printInvoiceSales(id) {
  emit("printInvoiceSales", id)
}
function getDownload(id) {
  emit("download", id);
}
</script>
<template >
  <div id="table">
    <table >
    <thead>
      <tr>
        <th>رقم الفاتورة</th>
        <th>اسم العميل</th>
        <th>نوع الفاتورة</th>
        <!-- <th>عدد الاصناف</th> -->
        <th>تاريخ الإنشاء</th>
        <th>قيمة الفاتورة</th>
        <th>العمليات</th>
      </tr>
    </thead>
    <tbody v-if="props.invoices">
      <tr v-for="(row, i) in props.invoices" :key="i">
        <td>{{ row.InvoiceNo }}</td>
        <td>{{ row.CustomerName }}</td>
        <td><Chipe :text="row.Payment === 1 ? 'نقد': 'اجل'" :color="row.Payment === 1 ? 'success': 'error'" /></td>
        <!-- عدد الاصناف 
        <td>45</td> -->
        <td>{{ row.fDate }}</td>
        <td class="bold">{{ row.Total.toFixed(2) }}</td>
        <td class="row operations">
          <span class="table-icon top" data-tooltip="تكرار الفاتورة" @click="$router.push(`/invoice-sales/new-invoice/${row.fGUID}`)"><RepeatIcon /></span>
          <div>
            <PrintMenu @printCasher="printCasher(row.fGUID)" @printInvoiceSales="printInvoiceSales(row.fGUID)" @download="getDownload(row.fGUID)" :invoiceID="row.fGUID"/>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>
<style lang="scss" scoped>
.bold{
  font-weight: bold;
}
</style>
