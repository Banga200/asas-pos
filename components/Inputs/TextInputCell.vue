<script setup>
import { computed, watch } from "vue";
import AddIcon from '~/components/Icons/Add.vue';
import CloseIcon from "../Icons/Close.vue";
const input = defineModel('input');
const emit = defineEmits(['getValue', 'getQuantity'])
const props = defineProps([
  "lable",
  "placeholder",
  "disable",
  "readOnly",
  "color",
  'fullWidth',
  'value',
  'centered',
  'background',
  'index'
]);
const showClose = ref(false);
if (props.value) {
  input.value = props.value
}

function setInput(value) {
  input.value = value
  emit('getValue', value, props.index)
}

</script>
<template>
  <div class="input textBox" :class="{'full-width': props.fullWidth}">
    <label v-if="props.lable ">{{ props.lable }}</label>
    <div class="input_flex" :class="[props.color, props.background]">
      <input
        type="input"
        class="flex-grow-1"
        v-model="input"
        :placeholder="props.placeholder"
        :readonly="props.readOnly"
        :disabled="props.disable"
        @input="setInput($event.target.value)"/>
    </div>
  </div>
</template>
<style scoped lang="scss">
.input input {
    text-align: center;
}
</style>
