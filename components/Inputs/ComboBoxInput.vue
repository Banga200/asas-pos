<script setup>
import { computed, watch, onMounted, onUnmounted } from "vue";
import AddIcon from "~/components/Icons/Add.vue";
import ArrowDown from "../Icons/ArrowDown.vue";
import CloseIcon from "../Icons/Close.vue";
import Mark from "../Icons/Mark.vue";
const input = defineModel("input");
const emit = defineEmits(["sendSelectedItem"]);
const page = ref(1);
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
]);
const showClose = ref(false);
const showDropMenu = ref(false);
if (props.value) {
  input.value = props.value;
}
const activeItem = ref(null);
const droplist = ref(null);
const Items = computed(() => {
  if (props.items) {
    return props.items.filter((item) => {
      return item.Name.toLowerCase().includes(input.value.toLowerCase());
    });
  }
});
onMounted(() => {
  window.addEventListener("click", () => {
    showDropMenu.value = false;
  });
});
onUnmounted(() => {
  window.removeEventListener("click", this);
});
watch(input, (value) => {
  if (value) {
    showClose.value = true;
  } else {
    showClose.value = false;
  }
});
function setInput(value) {
  input.value = value;
}
function clearInput() {
  input.value = "";
  showClose.value = false;
}
function hideCloseIcon() {
  showClose.value = false;
}
function setMenuValue(value, id, indexItem) {
  input.value = value;
  showDropMenu.value = false;
  activeItem.value = indexItem;
  emit("sendSelectedItem", id);
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
        :readonly="props.readOnly"
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
      :class="{ 'no-lable': !props.lable }"
      v-show="showDropMenu"
    >
      <li v-if="!Items">لا توجد بيانات</li>
      <li
        v-else
        v-for="(customer, i) in Items"
        :key="i"
        @click.stop="setMenuValue(customer.Name, customer.ID, i)"
        :class="{ activeItem: i === activeItem }"
        class="list-item"
      >
        <span>{{ customer.Name }}</span>
        <span class="icon" v-if="i === activeItem"><Mark /></span>
      </li>
    </ul>
  </div>
</template>
<style scoped lang="scss">
.textBox {
  position: relative;
}

.menu {
  display: block;
  left: 0;
  top: 57px;

  &.no-lable {
    top: 35px;
  }
}
</style>
