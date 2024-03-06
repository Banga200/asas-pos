import { defineStore } from "pinia";
import { useCompanyStore } from "./company";
import { useBranchStore } from "./branch";
import {ref, computed} from 'vue';
export const useItemsStore = defineStore("items", () => {
  const companyStore = useCompanyStore();
  const branchStore = useBranchStore();
  const { handelError } = useHandleError();
  // states
  const Items = ref([]);
  const Units = ref([]);
  const ItemsSearch = ref([]);
  const NextPage = ref(true);

  const getNextPage = computed(() => {return NextPage.value})
  // Actions
  async function GetAllItems(page, search) {
    try {
      const items = await useAPIFetch("/items/GetItems", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        params: {
          companyCode: companyStore.CompanyCode,
          branchID: branchStore.BranchID,
          pageNumber: page,
          PageSize: 20,
          searchFor: search ? search : "",
        },
      });
      if (items) {
        if (items.Code === 200) {
          for (let index = 0; index < items.Data.Data.length; index++) {
            const isExist = Items.value.find((element) => {
              return element.ItemID === items.Data.Data[index].ItemID;
            });
            if (!isExist) {
              const element = items.Data.Data[index];
              NextPage.value = true
              Items.value.push(element);
              
            }
            
          }
          if(items.Data.Data.length === 0) {
            NextPage.value = false
          }
        } else {
          handelError(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function GetUnitsByItem(itemId) {
    try {
      const { data: units, error } = await useAPIFetch("/items/units", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        params: {
          companyCode: companyStore.CompanyCode,
          id: itemId,
        },
      });
      if (error.value) {
        handelError(error);
        return;
      }
      if (!units.value) {
        GetUnitsByItem();
      } else {
        if (units.value.Code === 200) {
          Units.value = units.value.Data;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  return {
    Items,
    Units,
    NextPage,
    ItemsSearch,
    getNextPage,
    GetAllItems,
    GetUnitsByItem,
  };
});
