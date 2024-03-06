<script setup>
import Button from "~/components/Buttons/Button.vue";
import TextInput from "../Inputs/TextInput.vue";
import { ref, onMounted, watch } from "vue";
import { useNetworkStore } from "~/store/network";
const networkStore = useNetworkStore();
const {config} = storeToRefs(networkStore)
defineComponent({
  inheritAttrs: false,
});

const isDisable = ref(true);
onMounted(async () => {
  const address  = JSON.parse(localStorage.getItem('configPrinter'))
  const ip = JSON.parse(localStorage.getItem('ip'))
  if (address) {
    config.value = address
  }
  else {
    // await networkStore.GetIpAddress();
    // ip_address.value = networkStore.IP;
  }

  watch(config.value, () => {
    isDisable.value = false;
  });
});
function saveChanges() {
  localStorage.setItem("configPrinter",JSON.stringify(config.value));
  isDisable.value = true
}
</script>
<template>
  <div>
    <div class="network-cotainer">
      <div class="printer-type">
        <p>شبكة الطابعة A4</p>
        <div class="input-group">
          <TextInput
            :lable="'عنوان الـ IP'"
            :placeholder="'0:0:0:0'"
            v-model:input="config.a4Ip"
          />
          <TextInput
            :lable="'عنوان الـ Port'"
            :placeholder="'0:0:0:0'"
            v-model:input="config.a4Port"
          />
        </div>
      </div>
      <div class="printer-type">
        <p>شبكة الكاشير</p>
        <div class="input-group">
          <TextInput
            :lable="'عنوان الـ IP'"
            :placeholder="'0:0:0:0'"
            v-model:input="config.casherIp"
          />
          <TextInput
            :lable="'عنوان الـ Port'"
            :placeholder="'0:0:0:0'"
            v-model:input="config.casherPort"
          />
        </div>
      </div>
    </div>
    <div class="row flex-end actions">
      <Button
        :type="'submit'"
        :text="'حفظ التغييرات'"
        :color="'primary'"
        :disabled="isDisable"
      @click="saveChanges"/>
    </div>
  </div>
</template>
