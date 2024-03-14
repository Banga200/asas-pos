<script setup>
import CloseIcon from "~/components/Icons/Close.vue";
import Button from "~/components/Buttons/Button.vue";
import SaveIcon from "~/components/Icons/Save.vue";
import InvoiceHeadDetails from "~/components/Invoices/InvoiceHeadDetails.vue";
import InvoiceFooterDetails from "~/components/Invoices/InvoiceFooterDetails.vue";
import NewInvoiceSalesTable from "~/components/Tables/NewInvoiceSalesTable.vue";
import { useBranchStore } from "~/store/branch";
import { useUserStore } from "~/store/user";
import { useSalesStore } from "~/store/sales";
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const localePath = useLocalePath();
const branchStore = useBranchStore();
const userStore = useUserStore();
const saleStore = useSalesStore();
const { BranchID } = storeToRefs(branchStore);
const { CurrentUser } = storeToRefs(userStore);
const { SalesDetails } = storeToRefs(saleStore);
let userid = 0;
if (process.client) {
  userid = JSON.parse(localStorage.getItem("user"));
}

const { success } = storeToRefs(saleStore);
definePageMeta({
  layout: "no-header",
});
const NewInvoice = ref({
  BranchId: parseInt(BranchID.value),
  Type: 0,
  UserID: userid.UserId,
  Total: 0,
  TotalDiscount: 0,
  TotalTax: 0,
  Net: 0,
  CashAmount: 0,
  NetworkAmount: 0,
  MasterAmount: 0,
  VisaAmount: 0,
  CustomerID: 0,
  CustomerName: "",
  CustomerMobile: "",
  CustomerVatOther: 0,
  CustomerVatOtherNo: "",
  CustomerTaxID: "",
  CustomerBuildingNo: "",
  CustomerPhone: "",
  CustomerFax: "",
  CustomerStreet: "",
  CustomerDistrict: "",
  CustomerPBox: "",
  CustomerZip: "",
  CustomerZip2: "",
  CountryID: 0,
  CityID: 0,
  State: "",
  Details: [], // Add Items here
});
const items = ref([
  {
    LineNo: 0,
    ItemID: 0,
    UnitID: 0,
    Quantity: 0,
    Price: 0,
    Total: 0,
    Discount: 0,
    Tax: 0,
    Net: 0,
    ActualQuantity: 0,
    VatID: 0,
  },
]);
if (process.client) {
  if (route.params.id) {
    await saleStore.GetSalesDetails(route.params.id);
    if (SalesDetails.value) {
      items.value = [];
      SalesDetails.value.forEach((item, i) => {
        items.value.push({
          name: item.ItemNameA,
          unitName: item.UnitNameA,
          LineNo: 0,
          ItemID: item.CategoryID,
          UnitID: item.UnitID,
          Quantity: item.Quantity,
          Price: item.Price,
          Total: 0,
          Discount: item.Discount,
          Tax: item.Tax,
          Net: item.Net,
          ActualQuantity: item.ActualQty,
          VatID: 0,
        });
      });
      increseItem(SalesDetails.value.length);
    }
  }
}
function increseItem(index) {
  if (items.value.length - 1 === index || items.value.length === index) {
    if (route.params.id) {
      items.value.push({
        name: "",
        unitName: "",
        LineNo: 0,
        ItemID: 0,
        UnitID: 0,
        Quantity: 0,
        Price: 0,
        Total: 0,
        Discount: 0,
        Tax: 0,
        Net: 0,
        ActualQuantity: 0,
        VatID: 0,
      });
    } else {
      items.value.push({
        LineNo: 0,
        ItemID: 0,
        UnitID: 0,
        Quantity: 0,
        Price: 0,
        Total: 0,
        Discount: 0,
        Tax: 0,
        Net: 0,
        ActualQuantity: 0,
        VatID: 0,
      });
    }
  }
}
// معلومات العميل
function setCustomerDetails(customer) {
  if (customer) {
    NewInvoice.value.CustomerID = customer.ID;
    NewInvoice.value.CustomerName = customer.Name;
    NewInvoice.value.CustomerMobile = customer.Mobile;
    NewInvoice.value.CustomerVatOther = customer.VatOther;
    NewInvoice.value.CustomerVatOtherNo = customer.VatOtherNo;
    NewInvoice.value.CustomerTaxID = customer.TaxID;
    NewInvoice.value.CustomerBuildingNo = customer.BuildingNo;
    NewInvoice.value.CustomerPhone = customer.Phone;
    NewInvoice.value.CustomerFax = customer.Fax;
    NewInvoice.value.CustomerStreet = customer.Street;
    NewInvoice.value.CustomerDistrict = customer.District;
    NewInvoice.value.CustomerPBox = customer.PBox;
    NewInvoice.value.CustomerZip = customer.Zip;
    NewInvoice.value.CustomerZip2 = customer.Zip2;
    NewInvoice.value.CountryID = customer.CountryID;
    NewInvoice.value.CityID = customer.CityID;
    NewInvoice.value.State = customer.State;
  }
}
function setQuantityItem(value, index) {
  items.value[index].Quantity = parseInt(value);
  items.value[index].ActualQuantity = value * items.value[index].ActualQuantity;
}
// الكمية والسعر الخاصة بالوحدة المختارة
function setUnitItem(unit, index) {
  items.value[index].ActualQuantity = unit.ActualQty;
  items.value[index].Price = unit.SalePrice;
  items.value[index].Quantity =
    items.value[index].Quantity === 0 ? 1 : items.value[index].Quantity;
  calculateNet(index);
}
// مجموع الصنف (السعر * الكمية)
function setTotalItem(total, index) {
  let totalItem = 0;
  items.value[index].Total = total;
  items.value.forEach((item) => {
    totalItem += item.Total;
  });

  calculateNet(index);
  NewInvoice.value.Total = parseFloat(totalItem.toFixed(2));
}
// الضريبة مع VatID
function setVatValueItem(VatValue, vatId, index) {
  items.value[index].Tax = parseFloat(VatValue);
  items.value[index].VatID = vatId;
  // calculateNet(index);
  calcTotalTax();
}
// حساب مجموع الضريبة المضافة
function calcTotalTax() {
  let total = 0;
  items.value.forEach((item) => {
    total += item.Tax;
  });
  NewInvoice.value.TotalTax = parseFloat(total.toFixed(2));
}
// في حالة يتم تغير الضريبة في الصف يتم استدعاء هذه
function setTaxItem(value, index) {
  items.value[index].Tax = value;
  calculateNet(index);
}
// التخفيض (الحسم)
function setDiscountItem(value, index, vatValue) {
  let discount = 0;
  if (value.includes("%")) {
    discount = parseInt(value.split("%")[0]);
    let calcDiscount = (discount / 100) * items.value[index].Total;
    items.value[index].Discount = parseFloat(
      useCalculateDiscount(
        calcDiscount,
        items.value[index].Quantity,
        items.value[index].Total,
        items.value[index].Price
      ).toFixed(2)
    );
  } else {
    items.value[index].Discount = parseFloat(
      useCalculateDiscount(
        value,
        items.value[index].Quantity,
        items.value[index].Total,
        items.value[index].Price
      ).toFixed(2)
    );
  }
  let beforeTax = items.value[index].Total - items.value[index].Discount;
  let tax = beforeTax * (vatValue / 100);
  items.value[index].Tax = parseFloat(tax.toFixed(2));
  items.value[index].Net = parseFloat((beforeTax + tax).toFixed(2));

  // calculateNet(index);
}
// حساب الاجمالي لكل صنف
function calculateNet(index) {
  let total = items.value[index].Total;
  const discount = items.value[index].Discount;
  const tax = parseFloat(items.value[index].Tax);
  // الاجمالي
  const net = total + tax;
  items.value[index].Net = parseFloat((total + tax).toFixed(1));
}
// حساب قيمة الفاتورة كامل جميع الاصناف
const InvoiceNet = computed(() => {
  let total = 0.0;
  items.value.forEach((item) => {
    total += parseFloat(item.Net);
  });
  NewInvoice.value.Net = parseFloat(total.toFixed(2));
  return NewInvoice.value.Net.toFixed(2);
});
// حذف صف معين
function removeItem(index) {
  if (items.value.length !== 1 && items.value[index].Price) {
    items.value.splice(index, 1);
  }
}
function setLineNoItem(index) {
  items.value[index].LineNo = index + 1;
}
// Save Sales Invoice
async function saveInvoice() {
  if (NewInvoice.value.Details.length === 0) {
    if (NewInvoice.value.Type === 0 && NewInvoice.value.CustomerID === 0) {
      alert('نوع الفاتورة اجل الرجاء اختيار عميل')
    } else {
      for (let index = 0; index < items.value.length - 1; index++) {
        const element = items.value[index];
        delete element.name;
        delete element.unitName;
        NewInvoice.value.Details.push(element);
        await saleStore.SaveNewSaleInvoice(NewInvoice.value);
      }
    }

    if (success.value) {
      NewInvoice.value.TotalTax = 0;
      NewInvoice.value.Total = 0;
      NewInvoice.value.Details = [];
      items.value = [];
      increseItem(-1);
      router.push("/invoice-sales");
    }
  } else {
    await saleStore.SaveNewSaleInvoice(NewInvoice.value);
  }
}
</script>
<template>
  <section id="repeat-invoice">
    <div class="container">
      <div class="row justify-space-between align-items-center">
        <h1>فاتورة مبيعات جديدة</h1>

        <div class="row align-items-center buttonAndIcon">
          <Button
            :color="'gray'"
            :onlyIcon="true"
            :appendIcon="CloseIcon"
            @click="$router.push(localePath('/invoice-sales'))"
          ></Button>
          <Button
            :text="'حفظ'"
            :preAppendIcon="SaveIcon"
            :color="'primary'"
            @click="saveInvoice"
          />
        </div>
      </div>
      <!-- Invoice Head -->
      <InvoiceHeadDetails
        v-model:invoice="NewInvoice"
        @setItem="setCustomerDetails"
      />
      <!-- Invoice Table fields  -->
      <div class="table-container">
        <NewInvoiceSalesTable
          :items="items"
          v-model:item="items"
          @increseField="increseItem"
          @setUnit="setUnitItem"
          @setTotal="setTotalItem"
          @setVatValue="setVatValueItem"
          @setDiscount="setDiscountItem"
          @setTax="setTaxItem"
          @setLineNo="setLineNoItem"
          @removeItem="removeItem"
          @setQuantity="setQuantityItem"
        />
      </div>
      <!-- Invoice Footer  -->

      <InvoiceFooterDetails
        :total="InvoiceNet"
        v-model:input="NewInvoice.Net"
        v-model:totalTax="NewInvoice.TotalTax"
        v-model:totalBefoeTax="NewInvoice.Total"
      />
    </div>
  </section>
</template>
<style scoped>
.buttonAndIcon {
  gap: 16px;
}
.sheet {
  margin: 1.2rem 0;
}
.table-container {
  min-height: calc(100vh - 100px - 250px);
}
</style>
