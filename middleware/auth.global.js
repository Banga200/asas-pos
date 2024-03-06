import { useCompanyStore } from "~/store/company"
export default defineNuxtRouteMiddleware ((to,from) => {
    const companyStore = useCompanyStore();
    const {CompanyCode} = storeToRefs(companyStore)
 // skip middleware on server
 if (process.server) return
 // skip middleware on client side entirely
 if (process.client) {
   const branch = localStorage.getItem('branchId');
   
   if(to.path.includes('user-check')){
      if (!branch) {
       return;  
      }
      else{
         return navigateTo('/')
      }
   }
   else {
      if (branch) {
         return;
      }
      else {
         if(to.path.includes('user-check')){return;}
         return navigateTo('/user-check/Login')
      }
   }
   
    // if (CompanyCode.value) {
    //     return;
    // }
    
    // else {
    //     return navigateTo('/user-check/Company_Code')
    // }
   //  return;
 } 
})