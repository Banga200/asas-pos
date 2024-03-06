

<script setup>
const props = defineProps(['text','prappendIcon', 'appendIcon', 'appendInnerIcon', "color", 'link'])

</script>
<template>
    <NuxtLink :to="props.link" class="item" :class="[props.color]">
        <!-- Right Side  -->
        <div class="right">
            <component :is="props.prappendIcon"/>
            <span>{{ props.text }}</span>
        </div>
        <!-- left side  -->
        <div class="left">
            <component :is="props.appendInnerIcon"/>
            <component :is="props.appendIcon"/>
        </div>
    </NuxtLink>
</template>