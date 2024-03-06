<script setup>
import SalesIcon from "~/components/Icons/HomeIcons/Sales.vue"
import Re_SalesIcon from "~/components/Icons/HomeIcons/Re_Sales.vue";
import ReceiptIcon from "~/components/Icons/HomeIcons/Receipt.vue";
import Customer_BalanceIcon from "~/components/Icons/HomeIcons/Customer_Balance.vue";
import ReporIcon from "~/components/Icons/HomeIcons/Report.vue";
import HomeCard from "~/components/General/HomeCard.vue";
import { useBranchStore } from "~/store/branch";
const branchStore = useBranchStore();
if (process.client) {
    branchStore.setBranch()
}
const cards = shallowRef([
    { title: 'فاتورة المبيعات', icon: SalesIcon, description: 'نص يمكن يستبدل بنص يدل يوضح تفاصيل بسيطة عن الخدمة', link: '/invoice-sales'},
    { title: 'مرتجع المبيعات', icon: Re_SalesIcon, description: 'نص يمكن يستبدل بنص يدل يوضح تفاصيل بسيطة عن الخدمة', link: '/'},
    { title: 'سند قبض', icon: ReceiptIcon, description: 'نص يمكن يستبدل بنص يدل يوضح تفاصيل بسيطة عن الخدمة', link: '/'},
    { title: 'أرصدة العملاء', icon: Customer_BalanceIcon, description: 'نص يمكن يستبدل بنص يدل يوضح تفاصيل بسيطة عن الخدمة', link: '/'},
    { title: 'تقارير المبيعات', icon: ReporIcon, description: 'نص يمكن يستبدل بنص يدل يوضح تفاصيل بسيطة عن الخدمة', link: '/'},
])

</script>
<template>
    <!-- Home Section  -->
    <section id="home">
        <h1>خدمات نقطة البيع</h1>
        <p>نص يمكن يستبدل بنص يدل يوضح تفاصيل بسيطة عن الخدمات اساس نقطة بيع</p>
        
        <div class="row flex-wrap">
            <HomeCard v-for="(card, i) in cards" :key="i" :card="card"/>
        </div>
    </section>
</template>