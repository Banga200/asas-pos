

<script setup>
import Switch from "../Inputs/Switch.vue";
import TextInput from "../Inputs/TextInput.vue";
import ComboBoxInput from '../Inputs/ComboBoxInput.vue';
import CalendarIcon from "../Icons/Calendar.vue";
import Button from '../Buttons/Button.vue';
import { useCustomerStore } from "~/store/customers";
const customerStore = useCustomerStore();
customerStore.GetAllCustomers();
const invoice = defineModel('invoice');
const emit = defineEmits(['setItem'])
const {Customers} = storeToRefs(customerStore);
const invoiceFields = ref({
    priceType: '',
    date: '',
    time: '',
    customer: ''
})
function getItem(id) {
  const customer = Customers.value.find(item => {
    return item.ID === id
  })
  emit('setItem', customer)
}
function getType(value) {
  invoice.value.Type = value
}
</script>
<template>
  <div class="sheet row align-items-end justify-space-between flex-wrap">
    <div class="row flex-wrap">
      <Switch :lable="'نوع الفاتورة'" :fText="'نقدي'" :lText="'اجل'" @setTypeValue="getType"/>
    <!-- <TextInput :lable="'رقم الفاتورة'" :value="'223232'" />
    <ComboBoxInput :lable="'نوع السعر'" v-model:input="invoiceFields.priceType"/>
    <TextInput :lable="'التاريخ'" :appendIcon="CalendarIcon" v-model:input="invoiceFields.date"/>
    <TextInput :lable="'الوقت'" v-model:input="invoiceFields.time"/> -->
    <ClientOnly>
      <ComboBoxInput :lable="'العميل'" v-model:input="invoiceFields.customer" :items="Customers" @sendSelectedItem="getItem" class="input-customer"/>
    </ClientOnly>
    </div>
    <Button :text="'عناوين العميل'" :color="'primary'" class="button"/>

  </div>
</template>
<style scoped lang="scss">
.sheet {
    flex-wrap: wrap;
  gap: 1rem;
  .row {
    gap: 16px;
  }
}
.button {
  margin-bottom: 3px;
  widows: 200px;
}

</style>
