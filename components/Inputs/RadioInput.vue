<script setup>
const props = defineProps(['label', 'id', 'name'])
const input = defineModel('input');
function setInput(value){
    input.value = value;
}
</script>
<template>
    <div class="row radio_holder">
        <input type="radio" :name="props.name" :value="props.id" @input="setInput(props.id)" :id="`radio-${props.id}`" class="primary" v-model="input"/>
        <label :for="`radio-${props.id}`">{{ props.label }}</label>
    </div>
</template>