import { defineStore } from "pinia";
export const useCompanyStore = defineStore("company", () => {
  const {handelError} = useHandleError()
  // States
  const CompanyCode = ref(null);

  // Actions
  async function CheckCode(code) {
    console.log(code)
    try {
      const response = await useAPIFetch("/Company/CheckCode", {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
        },
        params: { code: code },
      });
      if(response.Code === 200) {
        if (response.Data.active) {
          CompanyCode.value = code;
          localStorage.setItem('code',code)
        }
        else {
          console.log(data.Data.message)
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  function setCompanyCode() {
    const code = localStorage.getItem('code');
    if (code) {
      CompanyCode.value = code
    }
    else {
      console.log("لايوجد كود")
    }
  }
  return { CheckCode, setCompanyCode, CompanyCode };
});
