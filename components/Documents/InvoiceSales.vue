<script setup>
import { ref, watch, onMounted, nextTick, onUpdated } from "vue";
import html2pdf from "html2pdf.js";
import { useCompanyStore } from "../../store/company";
import { useBranchStore } from "../../store/branch";
import { useConverter } from "../../composables/useConverter";
import VueQrious from "vue-qrious";
import Button from "../Buttons/Button.vue";
import html2canvas from "html2canvas";
const router = useRouter();
const { locale } = useI18n();
const companyCode = useCompanyStore();
const branchStore = useBranchStore();
const props = defineProps(["invoiceID", "previewPrint"]);
const print = defineModel("print");
const previewPrint = defineModel("previewPrint");
const download = defineModel("download");
const { dataURLtoBlob } = useConverter();
const pagePaper = ref(null);
const delay = ref(1000);
watch(
  () => print.value,
  (value) => {
    if (value) {
      printDom();
    }
  }
);
watch(
  () => download.value,
  (value) => {
    console.log(value);
    if (value) {
      printDom();
    }
  }
);

onMounted(() => {
  if (props.invoiceID) {
    if (props.previewPrint) {
      printDom();
    }
  }
});
onUpdated(() => {
  nextTick(() => {
    calculatePages();
  });
});
const content = ref(null);
// Get Invoice Content API
async function printDom() {
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
        if (previewPrint.value) {
        } else if (print.value || download.value) {
          generatePdf();
        }
        print.value = false;
        previewPrint.value = false;
      }, 500);
    })
    .catch((error) => {
      print.value = false;
      previewPrint.value = false;
      download.value = false;
    });
}

const genertateHtml2pdf = async (HTMLElement) => {
  var element = pagePaper.value;
  var opt = {
    filename: `invoice`,
    image: { type: "png", quality: 0.98 },
    html2canvas: { scale: 4 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    pagebreak: { mode : 'tr' },
  };
  await html2pdf().set(opt).from(element).save();
  // await html2canvas(document.getElementById("invoiceSale-page"), {
  //     backgroundColor: null,
  //     scale: 5,
  //     removeContainer: true
  //   }).then(function (canvas) {
  //     document.getElementById("imageCanvaSales").appendChild(canvas);
  //     var a = document.createElement('a');
  //     a.href = canvas.toDataURL("image/png");
  //     a.download = 'myfile.png';
  //     a.click();
  //   });

  // var canvas = document.querySelector("#imageCanvaSales canvas");
  // var dataURL = canvas.toDataURL("image/png", 1.0);

  // const blob = dataURLtoBlob(dataURL);
  content.value = null;
  clearTotalsCalculate()
};

async function generatePdf() {
  // if user click download
  if (download.value) {
    genertateHtml2pdf();
    download.value = false;
    return;
  }
  // await html2canvas(document.getElementById("invoiceSale-page"), {
  //     backgroundColor: null,
  //   }).then(function (canvas) {
  //     document.getElementById("imageCanvaSales").appendChild(canvas);
  //   });

  // var canvas = document.querySelector("#imageCanvaSales canvas");
  // var dataURL = canvas.toDataURL("image/png", 1.0);
    window.print()
  // const blob = dataURLtoBlob(dataURL);
  // var element = pagePaper.value;
  // var opt = {
  //   filename: `invoice`,
  //   image: { type: "jpeg", quality: 0.98 },
  //   html2canvas: { scale: 4 },
  //   jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  // };
  // let worker = await html2pdf()
  //   .set(opt)
  //   .from(element)
  //   .toPdf()
  //   .output("blob")
  //   .then(async (blob) => {
  //     return blob;
  //   });
  // // convert DataUrl to File
  // const formData = new FormData();
  // formData.append("file", worker);
  // // ارسال ملف PDF الى السيرفر
  // await $fetch("/api/invoiceSales", {
  //   method: "POST",
  //   body: formData,
  // })
  //   .then((res) => {
  //     console.log(res);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // document.getElementById("imageCanvaSales").removeChild(canvas);
  content.value = null;
  print.value = false;
  clearTotalsCalculate()
}
function printInvoice() {
  window.print();
}
// Download Image
function downloadImage(data, filename = "casher-invoice.jpeg") {
  var a = document.createElement("a");
  a.href = data;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
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
function clearTotalsCalculate() {
 totalInvoice.value = 0;
 discount.value = 0;
 totalNoVat.value = 0;
 Vat.value = 0;
 totalAmount.value = 0;
 NetAmount.value = 0;
 totalQuantity.value = 0;
}
const totalPages = ref(1);
function calculatePages() {
  const bodyHeight = document.body.scrollHeight;
  const pageHeight = 11.69 * 96;
  const estimatedPages = Math.ceil(bodyHeight / pageHeight);
  totalPages.value = estimatedPages;
}

</script>
<template>
  <div class="fixed-print container" v-if="$route.params.id">
    <Button :text="'طباعة'" :color="'primary'" @click="printInvoice" />
  </div>
  <div
    id="invoiceSale-page"
    :style="{
      position: $route.params.name ? 'relative' : 'absolute',
      right: $route.params.name ? '0px' : '-200%',
    }"
  >
    <div id="imageCanvaSales"></div>
    <div v-if="content" ref="pagePaper" class="content-container" id="prevData">
      <table class="main-table" >
        <thead id="header">
          <tr>
            <td>
              <header class="header">
                <div class="arabic_side">
                  <h4>{{ content.OrgnaizationInfoAr.Name }}</h4>
                  <div>
                    <strong>الفرع</strong>:
                    <span>{{ content.OrgnaizationInfoAr.Branch }}</span>
                  </div>
                  <div>
                    <strong>الرقم الضريبي</strong>:
                    <span>{{ content.OrgnaizationInfoAr.VatID }}</span>
                  </div>
                  <div>
                    <strong>| رقم المبنى</strong>:
                    <span>{{ content.OrgnaizationInfoAr.BldgNo }}</span>
                    <strong>| الشارع</strong>:
                    <span>{{ content.OrgnaizationInfoAr.Street }}</span>
                    <strong>| الحي</strong>:
                    <span>{{ content.OrgnaizationInfoAr.Dis }}</span>
                    <strong>| المدينة</strong>:
                    <span>{{ content.OrgnaizationInfoAr.City }}</span>
                    <strong>| ص.ب</strong>:
                    <span> {{ content.OrgnaizationInfoAr.POBOX }} | </span>
                  </div>
                  <div>
                    <strong>الرمز: {{ content.OrgnaizationInfoAr.Zip }}</strong>
                    <strong> هاتف: {{ content.OrgnaizationInfoAr.Tel }}</strong>
                    <strong>
                      | فاكس: {{ content.OrgnaizationInfoAr.Fax }}</strong
                    >
                    <strong>
                      | جوال: {{ content.OrgnaizationInfoAr.Mobile }}</strong
                    >
                  </div>
                </div>
                <div class="logo">
                  <img src="/images/logo_new 2.png" />
                </div>
                <div class="english_side">
                  <h4>{{ content.OrgnaizationInfoEn.Name }}</h4>
                  <div>
                    <strong>Branch</strong>:
                    <span>{{ content.OrgnaizationInfoEn.Branch }}</span>
                  </div>
                  <div>
                    <strong>Vat ID</strong>:
                    <span>{{ content.OrgnaizationInfoEn.VatID }}</span>
                  </div>
                  <div>
                    <strong> | Bldg No </strong>:
                    <span>{{ content.OrgnaizationInfoEn.BldgNo }}</span>
                    <strong> | St</strong>:
                    <span>{{ content.OrgnaizationInfoEn.Street }}</span>
                    <strong> | Dist</strong>:
                    <span>{{ content.OrgnaizationInfoEn.Dis }}</span>
                    <strong> | City</strong>:
                    <span>{{ content.OrgnaizationInfoEn.City }}</span>
                    <strong> | P.O.Box</strong>:
                    <span>{{ content.OrgnaizationInfoEn.POBOX }} | </span>
                  </div>
                  <div>
                    <strong>Zip: {{ content.OrgnaizationInfoEn.Zip }}</strong>
                    <strong>
                      Tel: : {{ content.OrgnaizationInfoEn.Tel }}</strong
                    >
                    <strong>| Fax: {{ content.OrgnaizationInfoEn.Fax }}</strong>
                    <strong
                      >| Mobile: {{ content.OrgnaizationInfoEn.Mobile }}</strong
                    >
                  </div>
                </div>
              </header>
              <div class="header-space"></div>
            </td>
          </tr>
          
        </thead>
        <tbody id="content-body">
          <tr>
            <td>
              <main>
                <div class="Invoice_info" >
                  <div class="tax">
                    <h3>فاتورة ضريبية</h3>
                    <hr />
                    <div class="row">
                      <!-- right -->
                      <div>
                        <span>النوع Type: </span>
                        <span>الرقم No: </span>
                        <span>التاريخ Date:</span>
                        <span>الوقت Time:</span>
                        <span>تاريخ الاستحقاق Due:</span>
                        <span> البائع Admin:</span>
                      </div>
                      <!-- left  -->
                      <!-- Dynamic Content  -->
                      <div>
                        <span>{{
                          content.SalesHeader.Payment || "&nbsp;"
                        }}</span>
                        <span>{{ content.SalesHeader.No || "&nbsp;" }}</span>
                        <span>{{ content.SalesHeader.Date || "&nbsp;" }}</span>
                        <span>{{ content.SalesHeader.Time || "&nbsp;" }}</span>
                        <span>{{ content.SalesHeader.Due || "&nbsp;" }}</span>
                        <span>{{
                          content.SalesHeader.Salesman || "&nbsp;"
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="agent_info">
                    <!-- right -->
                    <div>
                      <span>العميل Cust:</span>
                      <span>رقم ضريبي VAT ID:</span>
                      <span>معرف اخر Other No:</span>
                      <span>رقم المبنى Bld No:</span>
                      <span>الشارع Street:</span>
                      <span> الحي District:</span>
                      <span> المدينة City:</span>
                      <span> البلد Country:</span>
                      <span> الرمز ZIP:</span>
                    </div>
                    <!-- left  -->
                    <!-- Dynamic Content  -->
                    <div>
                      <span>{{ content.SalesHeader.Cust || "&nbsp;" }}</span>
                      <span>{{ content.SalesHeader.VatID || "&nbsp;" }}</span>
                      <span>{{ content.SalesHeader.OtherNo || "&nbsp;" }}</span>
                      <span>{{ content.SalesHeader.BldgNo || "&nbsp;" }}</span>
                      <span>{{ content.SalesHeader.Street || "&nbsp;" }}</span>
                      <span>{{ content.SalesHeader.Dis || "&nbsp;" }}</span>
                      <span>{{ content.SalesHeader.City || "&nbsp;" }}</span>
                      <span>{{ content.SalesHeader.Country || "&nbsp;" }}</span>
                      <div class="row justify-space-between" style="gap: 18px">
                        <span>{{ content.SalesHeader.ZIP || "&nbsp;" }}</span>
                        &nbsp;
                        <div class="row">
                          <span> الرقم الإضافي Additional:</span>
                          <span>{{
                            content.SalesHeader.AdditionalNo || "&nbsp;"
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Table of Items  -->
                <table class="content-table">
                  <thead>
                    <tr>
                      <th rowspan="2">رقم الصنف <br />Item No</th>
                      <th rowspan="2">مستودع <br />Ware</th>
                      <th rowspan="2" class="description">
                        الوصف <br />Description
                      </th>
                      <th rowspan="2">الوحدة <br />Unit</th>
                      <th rowspan="2">الكمية <br />Qty</th>
                      <th rowspan="2">السعر <br /> Price</th>
                      <th rowspan="2">الحسم <br />Dis</th>
                      <th rowspan="2">المجموع <br />Total</th>
                      <th colspan="2">الضريبة VAT</th>
                      <th rowspan="2">الاجمالي <br />Amount</th>
                    </tr>
                    <tr>
                      <th>%</th>
                      <th>قيمة Value</th>
                    </tr>
                  </thead>
                  <tbody class="itemsBody" ref="itemsBody">
                    <TransitionGroup name="fade" appear>
                      <tr
                      v-for="(item, i) in content.SalesDetails"
                      :key="i"
                    >
                      <td>{{ item.ItemNo }}</td>
                      <td>{{ item.Store }}</td>
                      <td>{{ item.ItemNameA }}</td>
                      <td>{{ item.Unit }}</td>
                      <td>{{ item.Qty }}</td>
                      <td>{{ item.UPrice }}</td>
                      <td>{{ item.Dis }}</td>
                      <td>{{ item.Total }}</td>
                      <td>{{ item.VatPercentage }}</td>
                      <td>{{ item.VatValue.toFixed(2) }}</td>
                      <td>{{ item.Amount.toFixed(2) }}</td>
                    </tr>
                    </TransitionGroup>
                   
                  </tbody>
                  <!-- <tbody class="itemsBody" >
                    <tr
                      v-for="(item, i) in content.SalesDetails.slice(16)"
                      :key="i"
                    >
                      <td>{{ item.ItemNo }}</td>
                      <td>{{ item.Store }}</td>
                      <td>{{ item.ItemNameA }}</td>
                      <td>{{ item.Unit }}</td>
                      <td>{{ item.Qty }}</td>
                      <td>{{ item.UPrice }}</td>
                      <td>{{ item.Dis }}</td>
                      <td>{{ item.Total }}</td>
                      <td>{{ item.VatPercentage }}</td>
                      <td>{{ item.VatValue }}</td>
                      <td>{{ item.Amount }}</td>
                    </tr>
                  </tbody> -->
                </table>
              </main>
            </td>
          </tr>
        </tbody>
        
        <tfoot id="footer">
          <tr>
            <td>
              <footer>
                <div class="details">
                  <div class="price_details row">
                    <div class="right">
                      <span>المجموع Total:</span>
                      <span>الحسم Discount:</span>
                      <span>الاجمالي قبل الضريبة Before VAT:</span>
                      <span>ضريبة القيمة المضافة (VAT 5%):</span>
                      <span>حسم اضافي Extra Dis:</span>
                      <span>الاجمالي Net Amount:</span>
                    </div>
                    <div class="left">
                      <span>{{ totals.total }}</span>
                      <span>{{ totals.discount }}</span>
                      <span>{{ totals.totalNoVat }}</span>
                      <span>{{ totals.vat }}</span>
                      <span>0.0</span>
                      <span>{{ totals.netAmount }}</span>
                    </div>
                  </div>
                  <div class="item_details row">
                    <div>
                      <p>الاصناف Items</p>
                      <span>{{ content.SalesDetails.length }}</span>
                    </div>
                    <div>
                      <p>الكميات Qtys</p>
                      <span>{{ totals.totalQuantity }}</span>
                    </div>
                  </div>
                  <div class="QRCode">
                    <VueQrious :value="content.SalesHeader.QR" />
                  </div>
                </div>
                <div class="row align-items-center justify-space-between">
                  <div>
                    <p>ملاحظات Notes: ----</p>
                    <p>
                      المستلم Receiver:
                      ----------------------------------------------------------------------------------------------------
                    </p>
                  </div>
                  {{ calculatePages() }}
                  <div class="row">
                    <div class="page-number" ></div>
                    <div class="total-pages">&nbsp; {{ totalPages }}</div>
                  </div>
                </div>
              </footer>
              <div class="footer-space"></div>
            </td>
          </tr>
        </tfoot>
      </table>
     
    </div>
  </div>
</template>

<style lang="scss" scoped>
#invoiceSale-page {
  background: white;
  width: 21cm;
  display: block;
  padding: 0.2rem 1rem;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  position: absolute;
  right: 0%;
  left: 0;
}
.html2pdf__page-break{
    page-break-after: always;
  }
  @page {
  margin: 2cm;
  @top-left {
    content: element(header);
  }
  @bottom-left {
    content: element(footer);
  }
}
.content-container {
  background: white;
  padding: 0.2rem 1rem;
  position: relative;
  counter-reset: page;
  * {
    color: #000;
    line-height: 19px;
    font-family: "Times New Roman", Times, serif;
  }
}

.footer-space {
  height: 0px;
}
.header-space {
  height: 0px;
}

table {
  thead tr {
    position: relative;
  }
}
header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  margin-top: 0.8rem;
  background: #fff;
}

main {
  // padding-bottom: 178px;
  position: relative;

  .Invoice_info {
    display: flex;
    gap: 8px;
    font-size: 16px;
    .tax {
      border: 1.5px solid #000;
      padding: 0.5rem;
      border-radius: 16px;
      text-align: left;
      width: 35%;

      h3 {
        text-align: center;
      }
      div:nth-child(2) {
        margin-right: 12px;
        span {
          text-align: right;
        }
      }
      span {
        display: block;
        line-height: 22px;
      }
      hr {
        margin-top: 0.5rem;
        margin-bottom: 0.3rem;
        border: 1px solid #000;
      }
    }
    .agent_info {
      border: 1px solid #000;
      padding: 0.5rem;
      width: 65%;
      border-radius: 16px;
      display: flex;
      text-align: left;

      & > div:nth-child(2) {
        margin-right: 12px;
        text-align: right;
      }
      span {
        display: block;
      }
      .row {
        width: 100%;
        justify-content: end;
      }
    }
  }
  table {
    border-collapse: collapse;
    text-align: center;
    margin-top: 0.5rem;
    width: 100%;
    font-size: 14px;

    td,
    th {
      border: 1px solid #000;
      padding: 2px;
      font-weight: 500;
    }
    .description {
      width: 180px;
    }
    // th[colspan="2"] {
    //   div {
    //     display: inline-block;
    //   }
    //
    // }
  }
}

footer {
  bottom: -10px;
  right: 0;
  left: 0;
  margin-top: 8px;
  margin-bottom: 3rem;
  text-align: right;
  .details {
    border: 1px solid black;
    border-radius: 16px;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;

    .price_details {
      text-align: left;

      .left {
        margin-right: 0.8rem;
      }
    }

    .item_details {
      text-align: center;
      width: 240px;
      justify-content: space-between;
    }
  }
  span {
    display: block;
  }
}
h4,
h3 {
  font-weight: 800;
}
.page-number {
  counter-increment: page;
}

.page-number {
  &::after {
    content: "الصفحة " counter(page) " / " ;
  }
}

.logo {
  width: 100px;
  img {
    width: 100%;
    height: 100%;
  }
}
.english_side {
  direction: ltr;
  text-align: left;
}
.arabic_side {
  direction: rtl;
  text-align: right;
}

@media print {
  body {
    visibility: hidden; /* Hide all elements by default */
  }
  #invoiceSale-page,
  #invoiceSale-page * {
    visibility: visible;
    /* Show elements inside the print section */
  }
  #invoiceSale-page {
    position: absolute;
    left: 0;
    top: 0;
    right: 0% !important;
    z-index: 9999;
  }
  .fixed-print {
    display: none;
  }
  .footer-space {
  height: 200px;
  margin-top: 1rem;
}
.header-space{
  height: 90px;
  margin-bottom: 1.5rem;
}
  header {
    position: fixed;
    top: 0;
    padding-left:5.2rem ;
    margin-bottom: 0px;
  }

  footer {
    width: 100%;
    padding-inline: 2rem;
    margin-bottom: 1.5rem;
    position: fixed;
    bottom: 0;
  }
  .main-table {
    border: hidden;

    #content-body {
      border: hidden;
    }
}
}

</style>
