<script>
    import { Tooltip } from 'flowbite-svelte';
    import { QuestionCircleOutline } from 'flowbite-svelte-icons';
</script>

<div class="question">
    <QuestionCircleOutline class="w-5 h-5 ms-2" color="gray"/>
    <Tooltip><slot /></Tooltip>
</div>

<style lang="scss">
    .question:hover {
        cursor: pointer;
    }
</style>