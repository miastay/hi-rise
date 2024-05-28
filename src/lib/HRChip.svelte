<script>

    export let title = "";

</script>

<div class="chip">
    {#if title}
        <h5 class="title">{title}</h5>
    {/if}
    <div class="inner">
        <slot></slot>
    </div>
</div>

<style lang="scss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    .chip {
        display: flex;
        flex-direction: column;
        border: solid 1px;
        border-radius: 4px;
        @apply border-gray-100 dark:border-gray-400;
        padding: 1rem;
        padding-top: 0;
        > .title {
            position: relative;
            top: -0.85rem;
            @apply bg-white dark:bg-gray-900;
            //background: white;
            width: fit-content;
            padding: 0 0.5rem;
            left: -0.5rem;
            @apply text-lg dark:text-gray-100 text-gray-800;
        }
        .inner {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    }
</style>