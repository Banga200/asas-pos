<script setup>
import RadioInput from "../Inputs/RadioInput.vue";
import Button from "../Buttons/Button.vue";
import { useBranchStore } from "~/store/branch";
import { useUserStore } from "~/store/user";
import { ref } from "vue";
const props = defineProps(["isSettings"]);
const router = useRouter();
const userStore = useUserStore();
const { getSuccess } = storeToRefs(userStore);
const branchStore = useBranchStore();
branchStore.GetAllBranches();
const { Branches } = storeToRefs(branchStore);
const inputValue = ref("");
const buttonState = ref(true);
async function submitBranch() {
  await userStore.CanContinue({
    userId: userStore.CurrentUser.UserId,
    branchId: inputValue.value,
  });
  if (getSuccess) {
    router.push("/");
  }
}
if (process.client) {
  const branchId = localStorage.getItem("branchId");
  if (branchId) {
    inputValue.value = branchId;
  }
}
</script>
<template>
  <form
    class="flex-column-space"
    :class="{ 'flex-start': props.isSettings }"
    @submit.prevent="submitBranch"
  >
    <p>اختر الفرع</p>
    <div class="choose" v-if="Branches">
      <div v-for="(branche, i) in Branches" :key="i">
        <RadioInput
          :label="branche.AName"
          :name="'branches'"
          :id="branche.ID"
          v-model:input="inputValue"
        />
        <hr v-if="Branches.length" />
      </div>
    </div>
    <Button :color="'primary'" :text="'متابعة'" v-if="!props.isSettings" />
    <div class="row flex-end actions" v-if="props.isSettings">
      <Button
        :type="'submit'"
        :text="'حفظ التغييرات'"
        :color="'primary'"
        :disabled="buttonState"
      />
    </div>
  </form>
</template>
