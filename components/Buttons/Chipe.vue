<script setup>
const props = defineProps(['text', 'color'])
</script>
<template>
    <div>
        <span :class="[props.color, 'chipe']">{{ props.text }}</span>
    </div>
</template>