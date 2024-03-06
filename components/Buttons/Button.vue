<script setup>
const props = defineProps(['text','color','FullWidth','textColor', 'preAppendIcon', 'appendIcon', 'onlyIcon', 'variant', 'disabled'])
</script>
<template>
    <button :type="props.type" :class="[props.color, {'disabled': props.disabled},{'onlyIcon': props.onlyIcon },{'full-width': props.FullWidth, 'text-color': props.textColor},props.variant,]" :disabled="props.disabled">
        <div class="icon" v-if="props.preAppendIcon">
            <!-- right icon  -->
            <component :is="props.preAppendIcon"/>
        </div>
        <div v-if="props.onlyIcon" class="icon"> <component :is="props.appendIcon"/></div>
        <div v-if="!props.onlyIcon"> {{ props.text  }}</div>
        <div class="icon" v-if="!props.onlyIcon && props.appendIcon ">
            <!-- left Icon  -->
            <component :is="props.appendIcon"/>
        </div>
    </button>
</template>