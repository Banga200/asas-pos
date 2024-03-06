<script setup>
import { onMounted, watch } from "vue";
import { useSalesStore } from "~/store/sales";
import html2canvas from "html2canvas";
import { useCompanyStore } from "../../../store/company";
import { useBranchStore } from "../../../store/branch";
import VueQrious from "vue-qrious";
import html2pdf from "html2pdf.js";
const { locale } = useI18n();
const companyCode = useCompanyStore();
const branchStore = useBranchStore();
const salesStore = useSalesStore();
const pagePaper = ref(null);
const props = defineProps(["invoiceID"]);
const print = defineModel("print");
const printContent = ref(null);
if (props.invoiceID !== "" || props.invoiceID !== undefined) {
  // salesStore.GetInvoiceById(props.invoiceID)
}
useHead(({
  title: "فاتورة مبيعات"
}))
watch(
  () => print.value,
  (value) => {
    if (value) {
      printDom();
    }
  }
);
const content = ref(null);
async function printDom() {
  print.value = true;
  const data = useAPIFetch("/Sales/Print", {
    params: {
      companyCode: companyCode.CompanyCode,
      GUID: props.invoiceID, //'200D1855-A7DF-46C3-BA91-0EB2D08609EC',
      branchId: branchStore.BranchID,
    },
  })
    .then(async (res) => {
      content.value = res.Data;
      setTimeout(() => {
        generateCanva();
      }, 100);
      print.value = false;
    })
    .catch((error) => {
      print.value = false;
    });
}
async function generateCanva() {
  // await html2canvas(document.getElementById("page"), {
  //   backgroundColor: null,
  // }).then(function (canvas) {
  //   document.getElementById("imageCanva").appendChild(canvas);
  // });
  // var canvas = document.querySelector("#imageCanva canvas");
  // var dataURL = canvas.toDataURL("image/png", 1.0);
  // // downloadImage(dataURL, 'my-canvas.jpeg');
  // const blob = dataURLtoBlob(dataURL); // convert DataUrl to File

  window.print();

  // formData.append("file", worker);
  // formData.append("QR", content.value.SalesHeader.QR);
  // await $fetch("/api/print", {
  //   method: "POST",
  //   body: formData,
  // })
  //   .then((res) => {
  //     console.log(res);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // document.getElementById("imageCanva").removeChild(canvas);
  content.value = null;
  print.value = false;
  clearCalculate()
}
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], { type: mime });
}

const totalInvoice = ref(0);
const discount = ref(0);
const totalNoVat = ref(0);
const Vat = ref(0);
const totalAmount = ref(0);
// المبلغ المطلوب
const NetAmount = ref(0);
const totalQuantity = ref(0);
// Total details Caculate
const totals = computed(() => {
  if (content.value) {
    content.value.SalesDetails.forEach((item) => {
      totalInvoice.value += item.Total;
      discount.value += item.Dis;
      Vat.value += item.VatValue;
      totalQuantity.value += item.Qty;
    });
    totalNoVat.value = totalInvoice.value - discount.value;
    totalAmount.value = totalNoVat.value + Vat.value;
    NetAmount.value = totalAmount.value;
    return {
      total: parseFloat(totalInvoice.value.toFixed(2)),
      discount: parseFloat(discount.value.toFixed(2)),
      totalNoVat: parseFloat(totalNoVat.value.toFixed(2)),
      vat: parseFloat(Vat.value.toFixed(2)),
      totalAmount: parseFloat(totalAmount.value.toFixed(2)),
      netAmount: parseFloat(NetAmount.value.toFixed(2)),
      totalQuantity: parseFloat(totalQuantity.value.toFixed(2)),
    };
  }
});
function clearCalculate() {
  totalInvoice.value = 0;
  discount.value = 0;
  totalNoVat.value = 0;
  Vat.value = 0;
  totalAmount.value = 0;
  // المبلغ المطلوب
  NetAmount.value = 0;
  totalQuantity.value = 0;
}
</script>
<template>
  <div id="page" ref="printContent">
    <div id="imageCanva"></div>
    <div v-if="content" ref="pagePaper">
      <div class="section">
        <img src="/images/asas_logo_for_print.png" width="100%" />
      </div>
      <div class="section">
        <p class="title h3">
          {{
            locale === "ar"
              ? content.OrgnaizationInfoAr.Name
              : content.OrgnaizationInfoEn.Name
          }}
        </p>
        <div class="row justify-space-between">
          <span>هاتف: {{ content.OrgnaizationInfoAr.Mobile }}</span>
          <span>فاكس: {{ content.OrgnaizationInfoAr.Fax }}</span>
        </div>
        <div class="row justify-space-between">
          <span>الرقم الضريبي:</span>
          <span>{{ content.OrgnaizationInfoAr.VatID }}</span>
          <span>:VAT ID</span>
        </div>
        <p>شكرا لزيارتكم</p>
        <p class="h3">
          فاتورة ضريبة {{ content.OrgnaizationInfoAr.VatID ? "مبسطة" : "" }}
        </p>
        <p class="h3">Simplified Tax Invoice</p>
        <hr />
        <div class="text-right">
          <div class="row">
            <span>الفرع Branch:</span>&nbsp;
            <span>{{
              locale === "ar"
                ? content.OrgnaizationInfoAr.Branch
                : content.OrgnaizationInfoEn.Branch
            }}</span>
          </div>
          <div class="row">
            <span>رقم الفاتورة Inv No:</span>&nbsp;<span>{{
              content.SalesHeader.No
            }}</span>
          </div>
          <div class="row">
            <span>التاريخ و الوقت Date/Time:</span>&nbsp;<span
              >{{ content.SalesHeader.Time }} -
              {{ content.SalesHeader.Date }}</span
            >
          </div>
          <div class="row">
            <span>البائع Salesman:</span>&nbsp;<span>{{
              content.SalesHeader.Salesman
            }}</span>
          </div>
        </div>
      </div>
      <hr />

      <table class="section">
        <thead>
          <tr>
            <th>
              الوصف <br />
              Description
            </th>
            <th>
              الكمية <br />
              Qty
            </th>
            <th>
              السعر <br />
              Price
            </th>
            <th>
              المجموع <br />
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sale, i) in content.SalesDetails" :key="i">
            <td>
              {{
                locale === "ar" ? sale.ItemNameA : sale.ItemNameE.toLowerCase()
              }}
            </td>
            <td>{{ sale.Qty }}</td>
            <td>{{ sale.UPrice.toFixed(2) }}</td>
            <td>{{ sale.Total.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="total_details row section">
        <div class="right">
          <span>قيمة الفاتورة Total:</span>
          <span>الحسم Discount:</span>
          <span>الاجمالي قبل الضريبة Total No VAT:</span>
          <span>ضريبة القيمة المضافة (VAT 5%):</span>
          <span>الاجمالي Total Amount:</span>
          <span>حسم إضافي Add Dis.:</span>
          <span>المبلغ المطلوب Net Amount: </span>
        </div>
        <div class="left">
          <!-- Total  -->
          <strong>{{ totals.total }}</strong>
          <!-- Discount  -->
          <strong>{{ totals.discount }}</strong>
          <!-- Total No VAT -->
          <strong>{{ totals.totalNoVat }}</strong>
          <!-- VAT 5% -->
          <strong>{{ totals.vat }}</strong>
          <!-- Total Amount  -->
          <strong>{{ totals.totalAmount }}</strong>
          <!-- Add Dis  -->
          <strong>0.0</strong>
          <!-- Net Amount  -->
          <strong>{{ totals.netAmount }}</strong>
        </div>
      </div>
      <hr />
      <p>المبلغ المدفوع Paid:</p>
      <p>المتبقي Recharge:</p>
      <div class="section">
        <div class="row justify-space-between">
          <div class="row">
            <span> الاصناف Items:</span>&nbsp;<span>{{
              content.SalesDetails.length
            }}</span>
          </div>
          <div class="row">
            <span>الكميات Qty:</span>&nbsp;
            <span>{{ totals.totalQuantity }}</span>
          </div>
        </div>
        <p>
          {{ content.SalesHeader.Country }} - {{ content.SalesHeader.City }}
        </p>
        <p>
          {{
            locale === "ar"
              ? content.OrgnaizationInfoAr.Name
              : content.OrgnaizationInfoEn.Name
          }}
        </p>
      </div>
      <div class="QRCode">
        <VueQrious :value="content.SalesHeader.QR" :size="150"/>
      </div>
      <div class="space"></div>
    </div>
  </div>
</template>
<style scoped lang="scss">
#page {
  background: white;
  width: 305px;
  padding: 1rem;
  margin-bottom: 0.5cm;
  position: absolute;
  right: -200%;
  bottom: 0;
  text-align: center;
  img {
    z-index: 999;
  }
}
* {
  color: #000;
  line-height: 19px;
  font-family: "Times New Roman", Times, serif;
}
.text-right {
  text-align: right;
}
.total_details {
  margin-block: 0.3rem;
  text-align: center;
  justify-content: center;
  span {
    display: block;
    text-align: left;
  }
  .left {
    margin-right: 5px;
  }
  strong {
    display: block;
    text-align: right;
  }
}
.title {
  margin-bottom: 1rem;
}
.h3 {
  font-weight: 800;
  font-size: 16px;
}
hr {
  margin: 4px;
}
p,
span,
strong {
  font-size: 12px;
  font-weight: 600;
  margin: 6px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  thead tr {
    position: relative;
  }
  th,
  td {
    font-size: 14px;
    font-weight: 600;
    padding: 8px 4px;

    &:first-child {
      width: 60%;
    }
  }
  th {
    border-bottom: 1px solid #000;
    line-height: 30px;
  }
  td {
    border-bottom: 1px dashed #000;
    text-align: right;
    padding: 16px 8px;
    &:first-child {
      line-height: 24px;
    }
    &:last-child {
      text-align: center;
    }
  }
}
.QRCode {
  margin-top: 1rem;
}
.space {
  height: .5rem;
  width: 100%;
}
@media print {
  body {
    visibility: hidden; /* Hide all elements by default */
  }
  #page,
  #page * {
    visibility: visible;
    /* Show elements inside the print section */
  }
  #page {
    position: absolute;
    left: 0;
    top: 0;
    right: 0% !important;
    z-index: 9999;
    width: 75mm;
  }
  #invoiceSales {
    z-index: 1 !important;

    table {
        display: block !important;
    }
    }   
}
</style>
