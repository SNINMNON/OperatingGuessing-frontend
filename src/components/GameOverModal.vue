<template>
    <NModal v-model:show="localShow">
        <NCard title="正确答案是：" size="huge" role="dialog">
            <NFlex vertical align="center">
                <NH1 style="margin-bottom: 0;">{{ props.answer.name }}</NH1>
                <NGradientText :type="localType">{{ props.message }}</NGradientText>
                <img :src="props.answer.image" class="image" />
                <NDataTable :columns="columns" :data="formatAnswer()" class="guess-table" />
            </NFlex>
        </NCard>
    </NModal>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { NModal, NCard, NDataTable, NH1, NText, NFlex, NGradientText } from 'naive-ui';

const props = defineProps({
    showModal: Boolean,
    message: String,
    answer: Object,
    type: String,
});
const emit = defineEmits(['close']);

const localShow = computed({
    get: () => props.showModal,
    set: () => emit('close')
});

const localType = computed(() => {
    return props.type ? props.type : 'info';
})

const tableFields = [
    { key: 'role', title: '职业' },
    { key: 'rarity', title: '星级' },
    { key: 'gender', title: '性别' },
    { key: 'faction', title: '阵营' },
    { key: 'position', title: '站位' },
    { key: 'race', title: '种族' },
    { key: 'release', title: '实装时间' }
]

const columns = computed(() => {
    return tableFields.map(
        field => ({
            title: field.title,
            key: field.key,
            align: 'center',
        })
    )
})

function formatAnswer() {
    if (!props.answer || !props.answer.name) return [];
    
    const formatAns = { ...props.answer }
    delete formatAns.image
    delete formatAns.name
    formatAns.release = formatAns.release.slice(2, 10)
    return [formatAns]
}

onMounted(() => { // avoid browser warnings caused by this tag
    document.querySelectorAll('[aria-hidden="true"]').forEach(el => el.removeAttribute('aria-hidden'));
})
</script>

<style scoped>

.guess-table {
    width: 600px;
    font-size: 14px !important;
}

.n-card {
    width: 700px
}

.image {
    width: 200px;
    height: 200px;
}

@media screen and (max-width: 768px) {
    .guess-table {
        font-size: 12px !important;
        max-width: 85vw;
    }

    .guess-table :deep(.n-data-table-th),
    .guess-table :deep(.n-data-table-td) {
        padding: 5px 3px !important;
        white-space: nowrap;
    }

    .n-card {
        width: 90vw;
    }

    .image {
        width: 180px;
        height: 180px;
    }
}
</style>
