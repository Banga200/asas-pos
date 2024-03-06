<script setup>
import ArrowDown from "../Icons/ArrowDown.vue";
import Mark from "../Icons/Mark.vue";
const input = defineModel("input");
const activeItem = ref(null);
const props = defineProps([
  "lable",
  "placeholder",
  "disable",
  "readOnly",
  "color",
  "FullWidth",
  "appendIcon",
  "value",
  "items",
  'displayText'
]);
const showDropMenu = ref(false);
onMounted(() => {
  window.addEventListener("click", () => {
    showDropMenu.value = false;
  });
});
onUnmounted(() => {
  window.removeEventListener("click", this);
});
function setMenuValue(value, id, indexItem) {
  input.value = value;
  showDropMenu.value = false;
  activeItem.value = indexItem;
}
</script>
<template>
    <div class="input textBox">
    <label v-if="props.lable">{{ props.lable }}</label>
    <div
      class="input_flex"
      :class="[props.color]"
      @click.stop="showDropMenu = !showDropMenu"
    >
      <input
        type="input"
        class="flex-grow-1"
        :placeholder="props.placeholder"
        v-model="input"
        :readonly="true"
        :class="{ 'full-width': props.FullWidth }"
        @input="setInput($event.target.value)"
        @blur="hideCloseIcon"
        @focus="input.length > 1 ? (showClose = true) : (showClose = false)"
      />
      <div class="icon">
        <ArrowDown />
      </div>
    </div>
    <ul
      class="droplist menu"
      v-show="showDropMenu"
    >
      <li v-if="!props.items">لا توجد بيانات</li>
      
      <li
        v-else
        v-for="(item, i) in props.items"
        :key="i"
        @click.stop="setMenuValue(item[props.displayText],item.ID, i)"
        :class="{ 'activeItem': i === activeItem }"
        class="list-item"
      >
        <span>{{ item[props.displayText] }}</span>
        <span class="icon" v-if="i === activeItem"><Mark /></span>
      </li>
    </ul>
  </div>
</template>
<style scoped>
.textBox {
  position: relative;
}
.menu {
  display: block;
  left: 0;
  top: 57px;
}
</style>