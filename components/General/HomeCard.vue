<script setup>
const props = defineProps(['card'])
</script>
<template>
    <NuxtLink class="HomeCard" :to="props.card.link">
        <div class="icon"><component :is="props.card.icon"/></div>
        <div class="content">
            <h6>{{ props.card.title }}</h6>
            <p>{{ props.card.description }}</p>
        </div>
    </NuxtLink>
</template>