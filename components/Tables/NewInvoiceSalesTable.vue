<script setup>
import RemoveIcon from "../Icons/RemoveIcon.vue";
import ComboBoxCell from "../Inputs/ComboBoxCell.vue";
import TextInput from "../Inputs/TextInput.vue";
import TextInputCell from "../Inputs/TextInputCell.vue";
import { ref, computed, watch } from "vue";
import { useItemsStore } from "~/store/items";
import { useSalesStore } from "~/store/sales";
import { useRoute } from "vue-router";
const route = useRoute();
const salesStore = useSalesStore();
const { SalesDetails } = storeToRefs(salesStore);
const itemsStore = useItemsStore();
const { Items, Units } = storeToRefs(itemsStore);
const page = ref(0);
await nextTick();
useAsyncData("item", () => itemsStore.GetAllItems((page.value += 1)));
// جلب العناصر والوحدات
const items = defineModel("items");
const props = defineProps(["itemNames"]);
const emit = defineEmits([
  "increseField",
  "setQuantity",
  "setLineNo",
  "setUnit",
  "setTotal",
  "setVatValue",
  "removeItem",
  "setTax",
  "setDiscount",
]);
const names = ref([
  {
    name: "",
    unitName: "",
  },
]);

function totalCalc(qty, price) {
  return qty * price;
}

function increseItem(index) {
  if (index >= 0) {
    names.value.push({
      name: "",
      unitName: "",
    });
    emit("increseField", index);
  }
}
// احصل على الوحدة اللي تم اختيارها
function getUnit(value, index) {
  emit("setUnit", value, index);
  getVatValue(value, index);
  setTotal(index);
}
function getVatValue(value, index) {
  // const vat = Items.value[index] // اجيب الصنف من Array حق الاصناف عشان اجيب VatValue
  // const total = value.ActualQty * value.SalePrice;
  // if (total !== 0) {
  //     const VatValue = ((vat.VatValue /100) * total).toFixed(2);
  //     emit('setVatValue',VatValue,vat.VatID, index)
  // }
  // else {
  //     emit('setVatValue',0, index)
  // }
}
function setTotal(index) {
  const vat = Items.value[index]; // اجيب الصنف من Array حق الاصناف عشان اجيب VatValue
  const total = items.value[index].Quantity * items.value[index].Price;
  if (total !== 0) {
    if (vat) {
      const VatValue = ((vat.VatValue / 100) * total).toFixed(2);
      emit("setVatValue", VatValue, vat.VatID, index);
      emit("setTotal", total, index);
    }
  }
}
function getTax(value, index) {
  emit("setTax", value, index);
}
function getDiscount(value, index) {
  const vatValue = Items.value[index].VatValue; 
  emit("setDiscount", value, index, vatValue);
}
function removeItemRow(index) {
  if (names.value.length - 1 !== index) {
    names.value.splice(index, 1);
  }
  emit("removeItem", index);
}
function getLineNo(index) {
  emit("setLineNo", index);
}
function getQuantityValue(value, index) {
  emit("setQuantity", value, index);
}
</script>
<template>
  <table class="newInvoiceSales">
    <thead>
      <tr>
        <th>الرقم</th>
        <th>الصنف</th>
        <th>الوحدة</th>
        <th>الكمية</th>
        <th>السعر</th>
        <th>المجموع</th>
        <th>الحسم</th>
        <th>الضريبة</th>
        <th>الاجمالي</th>
        <th>حذف</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in items" :key="i">
        <!-- {{
          setTotal(row.Quantity, row.Price, i)
        }} -->
        {{
          getLineNo(i)
        }}
        <!-- {{$route.params.id ? increseItemWithNames(i) : ''}} -->
        <td>{{ i + 1 }}</td>
        <td class="item-name">
          <ComboBoxCell
          v-model:input="row.name"
            :placeholder="'اسم الصنف'"
            :items="Items"
            :index="i"
            v-model:selectedItemID="row.ItemID"
            @increseField="increseItem"
            @setVatValue="getVatValue"
          />
        </td>
        <td class="unit">
          <ComboBoxCell
          v-model:input="row.unitName"
            :placeholder="'الوحدة'"
            v-model:selectedID="row.UnitID"
            :index="i"
            :itemID="row.ItemID"
            @selectedUnit="getUnit"
          />
        </td>
        <td class="textField">
          <TextInputCell
            v-model:input="row.Quantity"
            @getValue="getQuantityValue"
            :index="i"
          />
        </td>
        <td class="textField"><TextInputCell v-model:input="row.Price" /></td>
        <td class="textField">
          <TextInputCell v-model:input="row.Total" :readOnly="true" />
        </td>
        <td class="textField">
          <TextInputCell
            v-model:input="row.Discount"
            @getValue="getDiscount"
            :index="i"
          />
        </td>
        <td class="textField">
          <TextInputCell
            v-model:input="row.Tax"
            :readOnly="true"
            @getValue="getTax"
            :index="i"
          />
        </td>
        <td class="textField">
          <TextInputCell v-model:input="row.Net" :readOnly="true" />
        </td>
        <td class="textField icon"><RemoveIcon @click="removeItemRow(i)" /></td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
table tr td:first-child {
  width: 50px;
}
.item-name {
  width: 160px;
}
.unit {
  width: 120px;
}
.textField {
  width: 80px;
}
.icon svg {
  color: transparent;
  cursor: pointer;
}
</style>
