<script setup>
import { computed, watch, onMounted, onUnmounted, ref } from "vue";
import AddIcon from "~/components/Icons/Add.vue";
import ArrowDown from "../Icons/ArrowDown.vue";
import CloseIcon from "../Icons/Close.vue";
import Mark from "../Icons/Mark.vue";
import { useItemsStore } from "~/store/items";
import { useCompanyStore } from "~/store/company";
const { locale } = useI18n();
const companyStore = useCompanyStore();
const itemsStore = useItemsStore();
const { Items, ItemsSearch, Units, NextPage } = storeToRefs(itemsStore);
const input = defineModel("input");
const selectedID = defineModel("selectedID");
const selectedItemID = defineModel("selectedItemID");
const ulMenu = ref(null);
const emit = defineEmits([
  "increseField",
  "selectedUnit",
  "setItemName",
  "setVatValue",
]);

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
  "units",
  "itemID",
  "index",
]);
const page = ref(1);
const selectedUnits = ref(null);
const showDropMenu = ref(false);
const comboboxList = ref("");
if (props.value) {
  input.value = props.value;
}

watch(
  () => props.itemID,
  async (value) => {
    if (props.itemID) {
      try {
        const units = await useAPIFetch("/items/units", {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          params: {
            companyCode: companyStore.CompanyCode,
            id: value,
          },
        });
        if (units.Code === 200) {
          selectedUnits.value = units.Data;
          input.value = selectedUnits.value[0].Name;
          selectedID.value = selectedUnits.value[0].ID;
          // ارسال تفاصيل الوحدة الى parent
          emit("selectedUnit", selectedUnits.value[0], props.index);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
);
const activeItem = ref(null);
let observer = null;
onMounted(() => {
  window.addEventListener("click", () => {
    showDropMenu.value = false;
  });
  observer = new IntersectionObserver(
    (entity) => {
      if (entity[0].isIntersecting) {
        itemsStore.GetAllItems((page.value += 1));
      }
    },
    {
      threshold: 0.2,
    }
  );
  const triggers = document.querySelectorAll(".trigger");
  triggers.forEach((element) => {
    observer.observe(element);
  });
});
onUnmounted(() => {
  window.removeEventListener("click", this);
});
function setInput(value) {
  input.value = value;
}
const filterItems = computed(() => {
  if (Items.value.length > 0) {
    return Items.value.filter((item) => {
      return item.ItemNameA.includes(input.value);
    });
  }
  return [];
});
const nextPage = ref(true)
// filter list menu
watch(
  () => input.value,
  (value) => {
    if (props.items) {
      setTimeout(async () => {
        if (value) {
          page.value = 1;
          await itemsStore.GetAllItems((page.value += 1), input.value);
          nextPage.value = NextPage.value
        } else {
          ItemsSearch.value = [];
        }
      }, 200);
    }
  }
);
// function filterList(value) {
//   page.value = 1
//   console.log(value)
//   itemsStore.GetAllItems(page.value += 1, value);
// }
async function setItemValue(value, id, indexItem) {
  input.value = value;
  selectedItemID.value = id;
  showDropMenu.value = false;
  emit("increseField", props.index);

  activeItem.value = indexItem;
  // await itemsStore.GetUnitsByItem(id);
}
function setMenuUnitValue(value, id) {
  input.value = value;
  selectedID.value = id;
  showDropMenu.value = false;
  emit(
    "selectedUnit",
    selectedUnits.value.find((item) => {
      return item.ID === id;
    }),
    props.index
  );
}
function handleKeyDown(event) {
  if (event.key === "Escape") {
    showDropMenu.value = false;
  } else if (showDropMenu.value) {
    // Handle navigation within the menu
    switch (event.key) {
      case "ArrowUp":
        activeItem.value = (activeItem.value || props.items.length) - 1;
        stickScroll(activeItem.value)
        break;
      case "ArrowDown":
        activeItem.value = (activeItem.value + 1) % props.items.length;
        stickScroll(activeItem.value)
        break;
      case "Enter":
        if (activeItem.value !== null) {
          console.log(activeItem.value);
          setItemValue(
            props.items[activeItem.value].ItemNameA,
            props.items[activeItem.value].ItemID,
            activeItem.value
          );
        }
        break;
    }
  }
}
function stickScroll(index) {
  const itemElement = ulMenu.value.querySelectorAll("li")[index];
  const itemTop = itemElement.offsetTop;
  const itemHeight = itemElement.offsetHeight;
  const menuHeight = ulMenu.value.clientHeight;
  itemElement.focus();
  const scrollTop = Math.max(0, itemTop - (menuHeight - itemHeight) / 2);
  ulMenu.value.scrollTop = scrollTop
}
function openMenu() {
  showDropMenu.value = true;
}
</script>
<template>
  <div class="input textBox">
    <div class="input_flex" :class="[props.color]" @click.stop="openMenu">
      <input
        type="input"
        class="flex-grow-1"
        :placeholder="props.placeholder"
        v-model="input"
        :readonly="props.readOnly"
        :class="{ 'full-width': props.FullWidth }"
        @input="setInput($event.target.value)"
        @blur="hideCloseIcon"
      />
      <div class="icon" @click.stop="showDropMenu = showDropMenu === false ? true: false">
        <ArrowDown />
      </div>
    </div>
    <ul
      class="droplist menu cell comboboxList"
      ref="ulMenu"
      v-show="showDropMenu"
      v-if="props.items"
      @keydown.stop="handleKeyDown"
    >
      <li v-if="props.items.length === 0">لا توجد اصناف</li>
      <li
        v-else
        @click.stop="
          setItemValue(
            locale === 'ar' ? item.ItemNameA : item.ItemNameE,
            item.ItemID,
            i
          )
        "
        v-for="(item, i) in filterItems"
        :key="i"
        class="list-item"
        :class="{ activeItem: i === activeItem }"
        tabindex="0"
      >
        <span>{{ locale === "ar" ? item.ItemNameA : item.ItemNameE }}</span>
        <span class="icon" v-if="i === activeItem"><Mark /></span>
      </li>
      <!-- loading  -->
      <li class="trigger loadingItem" v-if="nextPage">
        <span class="loader"></span>
        <span>{{ $t("loading.items") }}...</span>
      </li>
    </ul>
    <ul class="droplist menu cell" v-show="showDropMenu" v-else>
      <li v-if="!selectedUnits">لا توجد وحدات</li>
      <li
        @click.stop="setMenuUnitValue(item.Name, item.ID)"
        v-for="(item, i) in selectedUnits"
        :key="i"
      >
        {{ item.Name }}
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

  &.cell {
    top: 35px;
  }
}
</style>
