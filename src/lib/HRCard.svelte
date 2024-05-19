<script>
    import { Card } from 'flowbite-svelte'
    export let header;
  </script>
  
<Card class="p-8 dark:bg-gray-900 w-full max-w-full">
    {#if header}
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-primary-800 dark:text-white">{header}</h5>
    {/if}
    <div class="gaps">
        <slot />
    </div>
</Card>

<style lang="scss">
    .gaps {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>