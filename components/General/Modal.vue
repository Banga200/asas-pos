<script setup>
import {ref} from 'vue'
import Close from "../Icons/Close.vue";
import Button from "../Buttons/Button.vue";
const  props = defineProps(['headTitle', 'headContent', 'description', 'actionColor', 'actionText']);
const modal = defineModel('modal')
const emit = defineEmits(['clickEvent'])
function handleClick() {
    emit('clickEvent');
}

</script>
<template>
    <div class="overlay" v-if="modal" @click="modal = false">
        <div class="modal" @click.stop="">
            <div class="modal_header">
                <h5>{{ props.headTitle }}</h5>
                <div class="close" @click="modal = false"><Close/></div>
            </div>
            <div class="modal_content">
                <div class="content">
                    <h4>{{ props.headContent }}</h4>
                    <p>{{props.description}}</p>
                </div>
                <div class="actions">
                    <Button :text="'إلغاء'" :color="'gray'" @click="modal = false" :variant="'outline'" class="cancleButton"/>
                    <Button :text="props.actionText" :color="props.actionColor" @click="handleClick"/>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.close {
    cursor: pointer;
}
.cancleButton {
    width: 88px;
}
</style>