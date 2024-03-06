import { defineStore } from "pinia";
import { useCompanyStore } from "~/store/company";
import { useUserStore } from "~/store/user";
import { useBranchStore } from "~/store/branch";
import { useGlobalFetch } from "~/composables/useGlobalFetch";
export const useSalesStore = defineStore("Sales", () => {
  const companyStore = useCompanyStore();
  const userStore = useUserStore();
  const branchStore = useBranchStore();
  const {handelError} = useHandleError();
  const {successhandle ,errorhandle} = useSnackBar()
  // states
  const Sales = ref(null);
  const PrintInvoice = ref(null);
  const success = ref(false);
  const loading = ref(false);
  // Actions
  async function GetAllSales() {
    loading.value = true
    try {
      const sales = await useAPIFetch("/Sales/all", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        params: 
        { 
          companyCode: companyStore.CompanyCode,
          branchID: branchStore.BranchID,
          userID: userStore.CurrentUser.UserId
        },
      });
      if (sales) {
        Sales.value = sales.Data;
        loading.value = false
      } 
    } catch (error) {
      console.log(error)
      loading.value = false
    }
  }

  async function GetInvoiceById(id) {
    loading.value = true
    try {
      const sales = await useAPIFetch("/Sales/Print", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        params: 
        { 
          companyCode: companyStore.CompanyCode,
          branchID: branchStore.BranchID,
          GUID: id
        },
      });
      if (sales) {
        PrintInvoice.value = sales.Data;
        loading.value = false
      } 
    } catch (error) {
      loading.value = false
      console.log(error)
    }
  }
  
  async function SaveNewSaleInvoice(invoice) {
    loading.value = true
    try {
      const {data:sale} = await useGlobalFetch("/Sales/save", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
        params: 
        { 
          companyCode: companyStore.CompanyCode,
          sessionId: userStore.CurrentUser.SessionId,
        },
        body: JSON.stringify(invoice)
      });
      console.log(sale.value)
      if(sale.value.Code === 200) {
        if (sale.value.Data.ContinueLogin) {
          successhandle("تم حفظ الفاتورة")
          success.value = true
          loading.value = false
        }
        else {
          userStore.LogOut();
          success.value = true
          errorhandle(sale.value.Message);
          loading.value = false
        }
      }
      else{
        if(sale.value.Code === 401) {
          errorhandle(sale.value.Message)
          loading.value = false
        }
      } 
    } 
    catch (error) {
      loading.value = false
      console.log(error.message)
    }
  }

  return {GetAllSales,GetInvoiceById,SaveNewSaleInvoice,success,loading, Sales}
});
