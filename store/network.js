import { defineStore } from "pinia";
import { ref } from "vue";

export const useNetworkStore = defineStore("network", () => {
  const IP = ref(null);
  const success = ref(false);
  const config = ref({
    a4Ip: 0,
    a4Port: 9100,
    casherIp: 0,
    casherPort: 9100
  })
  async function GetIpAddress() {
    // success.value = false
    // try {
    //   const data  = await $fetch("/api/getIP");
    //   if (data) {
    //     IP.value  = data
    //     success.value = true;
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  }
  return {
    IP,
    success,
    config,
    GetIpAddress
  }
});
