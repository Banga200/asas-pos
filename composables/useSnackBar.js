import { ref } from "vue";
const snack = ref({
    message: "",
    color: "",
  });
export const useSnackBar = () => {
  

  function successhandle(message) {
    snack.value.message = message;
    snack.value.color = 'green';

    resetSnack()
  }

  function errorhandle(message) {
    snack.value.message = message;
    snack.value.color = 'red'

    resetSnack()
    
  }

  function resetSnack() {
    setTimeout(() => {
        snack.value.message  = ''
        snack.value.color  = ''
    },3000)
  }

  return {
    snack,
    successhandle,
    errorhandle,
  }
};
