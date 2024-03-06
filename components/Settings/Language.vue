<script setup>
import { ref, watch } from "vue";
import RadioInput from "~/components/Inputs/RadioInput";
const { locale } = useI18n();
let langLocal = '';
const lang = ref("");
if (process.client) {
    langLocal = localStorage.getItem("lang");
  
  if (langLocal) {
      lang.value = langLocal;
  }
}
watch(lang, (newValue) => {
  localStorage.setItem("lang", lang.value);
  locale.value = newValue;
});
</script>
<template>
  <div>
    <RadioInput
      :label="'العربية'"
      :name="'lang'"
      :id="'ar'"
      v-model:input="lang"
    />
    <hr />
    <RadioInput
      :label="'English'"
      :name="'lang'"
      :id="'en'"
      v-model:input="lang"
    />
    <hr />
  </div>
</template>
