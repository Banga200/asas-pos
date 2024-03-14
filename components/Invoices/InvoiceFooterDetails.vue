<script setup>
import Note from '../Icons/Invoice/Note.vue';
import Bitcoin from '../Icons/Invoice/Bitcoin.vue';
import Ticket from '../Icons/Invoice/Ticket.vue';
import TextInput from '../Inputs/TextInput.vue';
const input = defineModel('input');
const totalTax = defineModel('totalTax');
const totalBefoeTax = defineModel('totalBefoeTax');
</script>
<template>
    <div class="row justify-space-between flex-wrap">
        <div>
            <div class="row title">
                <Note/>
                <h4>ملاحظة</h4>
            </div>
            <div class="sheet">
                <p class="note_text">
                    هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، 
                </p>
            </div>
        </div>
        <div>
            <div class="row title">
                <Bitcoin/>
                <h4>المدفوعات</h4>
            </div>
            <div class="sheet">
                <div class="row">
                    <TextInput :lable="'كاش'"/>
                    <TextInput :lable="'شبكة'"/>
                </div>
                <div class="row">
                    <TextInput :lable="'فيزا'"/>
                    <TextInput :lable="'ماستر'"/>
                </div>
            </div>
        </div>
        <div>
            <div class="row title">
                <Ticket/>
                <h4>الإجماليات</h4>
            </div>
            <div class="sheet">
                <div class="row">
                    <TextInput :readOnly="true" :value="totalTax" :lable="'ضريبة القيمة المضافة'"/>
                    <TextInput :readOnly="true" :value="totalBefoeTax" :lable="'إجمالي قبل الضريبة'"/>
                </div>
                <div class="row">
                    <TextInput :readOnly="true" :lable="'قيمة الفاتورة'" v-model:input="input" :clear="false" :fullWidth="true" :background="'background'" />
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.justify-space-between {
    padding: 1rem 0;
    gap: 24px;
}
.sheet {
    padding: 10px;
    .input  {
        margin-top: .5rem;
    }
}
.sheet .row {
    gap: 6px;
}
p {
    font-size: 14px;
}
.title {
    margin: 1rem 0;
    h4 {
        font-weight: 600;
        margin-right: 10px;
    }
}
</style>