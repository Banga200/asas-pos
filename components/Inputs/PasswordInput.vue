
<script setup>
import  OpenEye from '../Icons/OpenEye.vue';
const input = defineModel('input')
const props = defineProps([
  "lable",
  "placeholder",
  "disable",
  "readOnly",
  "color",
  'FullWidth',
  'leftIcon'
]);
function setPassoword(value) {
  input.value = value
}
</script>
<template>
  <div class="input textBox">
    <label>{{ props.lable }}</label>
    <div class="input_flex" :class="[props.color]">
      <input
        type="password"
        :placeholder="props.placeholder"
        :readonly="props.readOnly"
        :class="{'full-width': props.FullWidth}"
      @input="setPassoword($event.target.value)"/>
      <div class="icon">
        <OpenEye/>
      </div>
    </div>
  </div>
</template>
