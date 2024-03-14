<script setup>
import { ref } from "vue";
import ItemSide from "~/components/Items/ItemSide.vue";
import ChangeBranchIcon from "~/components/Icons/ChangeBranch.vue";
import TaxIcon from "~/components/Icons/Tax.vue";
import PrintIcon from "~/components/Icons/Print.vue";
import LanguageIcon from "~/components/Icons/Language.vue";

import Button from "~/components/Buttons/Button.vue";
// Dynamic Components
import ChooseBranch from "~/components/user/ChooseBranch.vue";
import Tax from "~/components/Settings/Tax.vue";
import NetworkPrinter from "~/components/Settings/NetworkPrinter.vue";
import Language from "~/components/Settings/Language.vue";
const buttonState = ref(true);
const component = shallowRef({
  "choose-branch": ChooseBranch,
  'tax': Tax,
  'network-printer': NetworkPrinter,
  'language': Language,
});
</script>
<template>
  <section class="container" id="settings_section">
    <div class="text">
      <h1>الإعدادات</h1>
      <p>نص يمكن يستبدل بنص يدل يوضح تفاصيل بسيطة عن الخدمات اساس نقطة بيع</p>
    </div>
    <!-- Content Settings  -->
    <div class="settings">
      <!-- Static Side  -->
      <div class="static">
        <ItemSide
          :text="'تغير الفرع'"
          :prappendIcon="ChangeBranchIcon"
          :link="'/settings/choose-branch'"
        />
        <!-- <ItemSide
          :text="'الضريبة'"
          :prappendIcon="TaxIcon"
          :link="'/settings/tax'"
        /> -->
        <ItemSide
          :text="'طابعة الشبكة'"
          :prappendIcon="PrintIcon"
          :link="'/settings/network-printer'"
        />
        <ItemSide
          :text="'لغة الموقع'"
          :prappendIcon="LanguageIcon"
          :link="'/settings/language'"
        />
      </div>
      <!-- Line  -->
      <hr />
      <!-- Dynamic Side  -->
      <div class="dynamic">
        <component :is="component[$route.params.name]" :isSettings="true" />
        <!-- <div class="row flex-end actions" >
          <Button
            :text="'حفظ التغييرات'"
            :color="'primary'"
            :disabled="buttonState"
          />
          <Button :text="'إلغاء'" :color="'gray'" />
        </div> -->
      </div>
    </div>
  </section>
</template>
