import {defineStore} from 'pinia'
import { useCompanyStore } from './company';
import { useUserStore } from './user';
export const useBranchStore = defineStore('branch', () => {
    const companyStore = useCompanyStore();
    const userStore = useUserStore();
    // States 
    const Branches = ref([])
    const BranchID = ref(null)
    // Actions 
    async function GetAllBranches() {
      console.log(userStore.CurrentUser.UserId)
        try {
            const branches = await useAPIFetch("/Branches/all", {
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin" : '*',
              },
              // params: { companyCode: CompanyCode.value },
              params: {companyCode: companyStore.CompanyCode, userId: userStore.CurrentUser.UserId}
            });
            if (branches.Code === 200) {
                Branches.value = branches.Data
            }
          } catch (error) {
            console.log(error);
          }
    }
    function setBranch() {
      const branchId = localStorage.getItem('branchId');
      if (branchId) {
        BranchID.value = branchId
      }
    }
    return {Branches,BranchID,setBranch, GetAllBranches}
})