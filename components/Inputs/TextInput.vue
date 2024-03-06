<script setup>
import { computed, watch } from "vue";
import AddIcon from '~/components/Icons/Add.vue';
import CloseIcon from "../Icons/Close.vue";
const input = defineModel('input');
const props = defineProps([
  "lable",
  "placeholder",
  "disable",
  "readOnly",
  "color",
  'fullWidth',
  'appendIcon',
  'value',
  'centered',
  'background',
  'clear'
]);
const showClose = ref(false);
if (props.value) {
  input.value = props.value
}
watch(input, (value) => {
  if (value) {
    showClose.value = true;
  }
  else {
    showClose.value = false
  }
})
function setInput(value) {
  input.value = value
}
function clearInput() {
  input.value = '',
  showClose.value = false
}
function hideCloseIcon() {
  showClose.value = false
}
function handleClose(value) {
  if(value) {
    input.value.length > 1 ? showClose.value = true: showClose.value = false
  }
}
</script>
<template>
  <div class="input textBox" :class="{'full-width': props.fullWidth}">
    <label v-if="props.lable ">{{ props.lable }}</label>
    <div class="input_flex" :class="[props.color, props.background]">
      <input
        type="input"
        class="flex-grow-1"
        :placeholder="props.placeholder"
        v-model="input"
        :readonly="props.readOnly"
        
        @input="setInput($event.target.value)"
        @blur="hideCloseIcon"
        @focus="handleClose($event.target.value)"/>
        <div class="icon"  @click="clearInput" v-if="props.clear">
          <CloseIcon   class="closeIcon" v-show="showClose"/>
        </div>
        <div class="icon" v-if="props.appendIcon">
          <component :is="props.appendIcon"/>
        </div>
    </div>
  </div>
</template>
