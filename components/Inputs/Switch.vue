<script setup>
import {ref} from 'vue'
const props = defineProps(['lable', 'fText', 'lText','value' ]);
const type = defineModel('type');
const emit = defineEmits(['setTypeValue'])
const value = ref(true);

function toggle() {
    value.value = !value.value 
    if (value.value) {
        emit('setTypeValue', 1)
    }
    else {
        emit('setTypeValue', 0)
    }
}
</script>
<template>
    <div class="input textBox">
        <label>{{ props.lable }}</label>
        <div class="switch">
            <span :class="{'active': value}" @click="value ? false : toggle()" >{{props.fText}}</span>
            <span :class="{'active': !value}" @click="!value ? false : toggle()" >{{props.lText}}</span>
        </div>
    </div>
</template>
<style scoped>
</style>