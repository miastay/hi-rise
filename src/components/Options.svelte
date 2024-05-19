<script>
    import HrCard from '../lib/HRCard.svelte';
    import { Tabs, TabItem } from 'flowbite-svelte';
</script>

<HrCard>
    <Tabs tabStyle="underline">
        <TabItem open title="Rendering">
        <p class="text-sm text-gray-500 dark:text-gray-400">
            x
        </p>
        </TabItem>
        <TabItem title="Colors">
        <p class="text-sm text-gray-500 dark:text-gray-400">
            <b>Dashboard:</b>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        </TabItem>
        <TabItem title="Optimization">
        <p class="text-sm text-gray-500 dark:text-gray-400">
            <b>Settings:</b>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        </TabItem>
        <TabItem title="Significance">
        <p class="text-sm text-gray-500 dark:text-gray-400">
            <b>Users:</b>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        </TabItem>
    </Tabs>
</HrCard>

<style lang='scss'>

</style>
