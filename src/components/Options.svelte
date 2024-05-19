<script>
    import HrCard from '../lib/HRCard.svelte';
    import { Tabs, TabItem, NumberInput, Label, Select } from 'flowbite-svelte';
    import { plotWidth, plotHeight, colors } from '../store';
    import ColorPicker from './ColorPicker.svelte';

    const palettes = {
        "hi-rise": {
            points: "#1e14ff",
            significant: "#22e2ef",
            significanceLine: "#ff2233"
        },
        "black and white": {
            points: "#000000",
            significant: "#101010",
            significanceLine: "#ff2233"
        }
    }
    const paletteItems = [
        {value: "hi-rise", name: "Default"},
        {value: "black and white", name: "Grayscale"},
    ]
    let selectedPalette = "hi-rise"
    $: updatePalette(selectedPalette)

    function updatePalette(pal) {
        console.log(pal)
        colors.set({...palettes[pal]})
    }


</script>

<HrCard addClass="!pt-4">
    <Tabs tabStyle="underline" divider={false}>
        <TabItem open title="Rendering">
            <div class="cols">
                <div class="col">
                    <h5 class="mb-0 text-xl font-semibold tracking-tight text-primary-800 dark:text-white">Figure</h5>
                    <div class="row">
                        <Label class="space-y-2 mb-4">
                            <span>Width</span>
                            <NumberInput bind:value={$plotWidth} />
                        </Label>
                        <Label class="space-y-2 mb-4">
                            <span>Height</span>
                            <NumberInput bind:value={$plotHeight} />
                        </Label>
                    </div>
                </div>
                <div class="col">
                    y
                </div>
            </div>
        </TabItem>
        <TabItem title="Colors">
            <div class="col">
                <Select dense outlined items={paletteItems} bind:value={selectedPalette}>Palette</Select>
                <ColorPicker name="All Points" bind:color={$colors.points}/>
                <ColorPicker name="Significant Points" bind:color={$colors.significant}/>
                <ColorPicker name="Significance Line" bind:color={$colors.significanceLine}/>
            </div>
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
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    .cols {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    .col {
            display: flex;
            flex-direction: column;
            gap: 1rem;
    }
    .row {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }
    :global(div[role="tabpanel"]) {
        @apply bg-transparent dark:bg-gray-900 mt-0 px-0 py-2;
        border-radius: 0;
    }

</style>
