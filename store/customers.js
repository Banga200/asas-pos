import { defineStore } from "pinia";
import { useCompanyStore } from './company';
import { useBranchStore } from "~/store/branch";
export const useCustomerStore = defineStore('customer', () => {
    const companyStore = useCompanyStore();
    const branchStore = useBranchStore();
    const {handelError} = useHandleError()
    // states 
    const Customers = ref([]);

    // Actions 

    async function GetAllCustomers() {
        try {
            const customers = await useAPIFetch("/Customers/All", {
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin" : '*',
              },
              // params: { companyCode: CompanyCode.value },
              params: {companyCode: companyStore.CompanyCode, branchId: branchStore.BranchID}
            }).then(res => {
              if (res.Code === 200) {
                Customers.value = res.Data
            }
            }).catch(error => {
              handelError(error)
              console.log(error);
            });
            
          }
           catch (error) {
            handelError(error)
            console.log(error);
          }
    }

    return {
        Customers,
        GetAllCustomers
    }
})