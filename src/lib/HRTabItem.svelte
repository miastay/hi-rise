<script>
    import { Tabs, TabItem } from 'flowbite-svelte';
    export let title = "Title";
</script>

<TabItem title={title} activeClasses={'p-4 text-primary-600 bg-gray-100 dark:bg-gray-800 dark:text-primary-500'}>
    <p class="text-sm text-gray-500 dark:text-gray-400">
        <b>Users:</b>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
</TabItem>