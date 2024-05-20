<script>
    import HrCard from '../lib/HRCard.svelte';
    import { Tabs, TabItem, NumberInput, Label, Select, Toggle, Radio, Card, Badge, Checkbox, Button, Range } from 'flowbite-svelte';
    import { plotWidth, plotHeight, colors, doOptimization, optimizationChunkSize, optimizationType, optimizationStats, inputColumns, posColumn, sigColumn, chrColumn, rsColumn, scaffolds, selectedScaffolds, scaffoldGap, optimizationChunkFactor } from '../store';
    import ColorPicker from './ColorPicker.svelte';
    import HrQuestion from '../lib/HRQuestion.svelte';
    import { Canvg } from 'canvg';

    const palettes = {
        "hi-rise": {
            points: "#1e14ff",
            significant: "#1e14ff",
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

    function downloadAsSVG() {
        let svgData = document.querySelector("svg#plot").outerHTML;
        let svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
        let svgUrl = URL.createObjectURL(svgBlob);
        let downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = "hi-rise.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    function downloadAs(type) {

        var svg = document.querySelector('svg#plot');
        var img = document.querySelector('img#blankimg');

        let blankCanvas = document.createElement("canvas")
        blankCanvas.id = "blankcanvas"
        blankCanvas.width = $plotWidth * upscale;
        blankCanvas.height = $plotHeight * upscale;
        document.body.appendChild(blankCanvas)
        var canvas = document.querySelector('canvas#blankcanvas');

        // get svg data
        var xml = new XMLSerializer().serializeToString(svg);

        // make it base64
        var svg64 = btoa(xml);
        var b64Start = 'data:image/svg+xml;base64,';

        // prepend a "header"
        var image64 = b64Start + svg64;

       // let svgUrl = URL.createObjectURL(svgBlob);

        // set it as the source of the img element
        let downloadLink = document.createElement("a");
        if(type === "svg") {
            downloadLink.href = image64;
            downloadLink.download = "hi-rise.svg";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }

        if(type == "png") {
            let pngData = '';
            img.onload = function() {
                // draw the image onto the canvas
                canvas.getContext('2d').drawImage(img, 0, 0, $plotWidth * upscale, $plotHeight * upscale);
                pngData = document.querySelector("canvas#blankcanvas").toDataURL("image/png") 
                downloadLink.href = pngData;
                downloadLink.download = "hi-rise.png";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
            img.src = image64;
        }

    }

    $: ($selectedScaffolds) => $optimizationChunkSize = 75 * $selectedScaffolds.length;

    let selScaffolds = [];
    $: resetSelectedScaffolds($scaffolds)
    $: updateSelectedScaffolds(selScaffolds)

    function updateSelectedScaffolds(sel) {
        $selectedScaffolds = [...sel];
        console.log($selectedScaffolds)
    }
    function resetSelectedScaffolds(scaf) {
        selScaffolds = [...scaf];
    }

    let upscale = 1;
    let upscales = [
        {value: 1, name: "1x"},
        {value: 2, name: "2x"},
        {value: 3, name: "3x"},
        {value: 4, name: "4x"}
    ]

    let includeBackground = false;

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
                    <Button on:click={() => downloadAs("svg")}>Download SVG</Button>
                    <Button on:click={() => downloadAs("png")}>Download PNG</Button>
                    <div class="row">
                        <Label class="space-y-2 mb-4">
                            <span>Upscale</span>
                            <Select dense outlined items={upscales} bind:value={upscale}></Select>
                        </Label>
                        <Label class="space-y-2 mb-4">
                            <Toggle bind:checked={includeBackground}>Include background</Toggle>
                        </Label>
                    </div>
                </div>
                <div class="col">
                    <h5 class="mb-0 text-xl font-semibold tracking-tight text-primary-800 dark:text-white">Setup</h5>
                    <div class="cols">
                        <div class="col gap-sm pointers">
                            <Label class="space-y-2 mb-4">
                                <span class="text-md">Position column</span>
                                <Select dense outlined items={$inputColumns} bind:value={$posColumn}></Select>
                            </Label>
                            <Label class="space-y-2 mb-4">
                                <span class="text-md">Significance column</span>
                                <Select dense outlined items={$inputColumns} bind:value={$sigColumn}></Select>
                            </Label>
                            <Label class="space-y-2 mb-4">
                                <span class="text-md">Chromosome/scaffold column</span>
                                <Select dense outlined items={$inputColumns} bind:value={$chrColumn}></Select>
                            </Label>
                            <Label class="space-y-2 mb-4">
                                <span class="text-md">SNP name column</span>
                                <Select dense outlined items={$inputColumns} bind:value={$rsColumn}></Select>
                            </Label>
                        </div>
                        <div class="col">
                            <Label class="space-y-2 mb-4">
                                <span class="text-md">Gap between chromosomes</span>
                                <Range min="0" max="100000000" bind:value={$scaffoldGap}/>
                                <div class="row"><NumberInput dense bind:value={$scaffoldGap} />bp</div>
                            </Label>
                            <Label class="space-y-2 mb-4">
                                <span class="text-md">Rendered chromosomes/scaffolds</span>
                                <div class="wrap">
                                    {#each [...$scaffolds] as s, i}
                                        <div><Checkbox bind:group={selScaffolds} value={s}>{s}</Checkbox></div>
                                    {/each}
                                </div>
                            </Label>
                        </div>
                    </div>
                </div>
            </div>
        </TabItem>
        <TabItem title="Style">
            <div class="cols">
                <div class="col">
                    <Label class="space-y-2 mb-4">
                        <span class="text-md">Color Palette</span>
                        <Select dense outlined items={paletteItems} bind:value={selectedPalette}>Palette</Select>
                    </Label>
                    <ColorPicker name="All Points" bind:color={$colors.points}/>
                    <div class="row">
                        <ColorPicker name="Significant Points" bind:color={$colors.significant}/> <span>x</span>
                    </div>
                    <ColorPicker name="Significance Line" bind:color={$colors.significanceLine}/>
                </div>
            </div>
        </TabItem>
        <TabItem title="Optimization">
            <div class="cols">
                <div class="col">
                    <div class="row">
                        <Toggle bind:checked={$doOptimization}>Perform optimization <HrQuestion><span>Reduce the number of points plotted below a perceptible significance level.</span></HrQuestion></Toggle>
                        <Radio name="optimizationType" bind:group={$optimizationType} disabled={!$doOptimization} value="line" class={!$doOptimization ? 'opacity-50' : ''}>Line fill</Radio>
                        <Radio name="optimizationType" bind:group={$optimizationType} disabled={!$doOptimization} value="drop" class={!$doOptimization ? 'opacity-50' : ''}>Drop points</Radio>
                    </div>
                    <Label class="space-y-2 flex items-center">
                        <span class="text-md mr-4 !my-0" style="white-space:nowrap">Chunk resolution (bp) </span>
                        <div class="row">
                            <Range min="1" max="10000" bind:value={$optimizationChunkSize}/>
                            <NumberInput bind:value={$optimizationChunkSize} />
                        </div>
                        <HrQuestion><span>Splits the data into chunks to fill with lines. Looks best with less than 100bp per chromosome.</span></HrQuestion>
                    </Label>
                    <Label class="space-y-2 flex items-center">
                        <span class="text-md mr-4 !my-0" style="white-space:nowrap">Statistic cutoff </span>
                        <div class="row">
                            <Range min="1.0" max="10.0" bind:value={$optimizationChunkFactor}/>
                            <NumberInput bind:value={$optimizationChunkFactor} />
                        </div>
                        <HrQuestion><span>Estimates the quantile up to which lines are drawn per chunk. Larger approaches the maximum, smaller approaches the mean.</span></HrQuestion>
                    </Label>
                </div>
                <div class="col">
                    {#if $optimizationStats.originalTotal !== 0}
                        <span>Objects plotted: {$optimizationStats.numReduced}/{$optimizationStats.originalTotal} <Badge color="green">-{100 - (Math.round($optimizationStats.numReduced * 10000 / ($optimizationStats.originalTotal * 1.0)) / 100.0)}%</Badge></span>
                        <span>Processing time: <Badge color={$optimizationStats.originalTotal / $optimizationStats.processTime > 1000 ? "yellow" : "green"}>{$optimizationStats.processTime}ms</Badge></span>
                        <span>Rendering time: <Badge color={$optimizationStats.numReduced / 400 < $optimizationStats.renderTime ? "yellow" : "green"}>{$optimizationStats.renderTime}ms</Badge></span>
                    {/if}
                </div>
            </div>
        </TabItem>
        <TabItem title="Significance">
            <div class="col">
                <ColorPicker name="All Points" bind:color={$colors.points}/>
                <ColorPicker name="Significant Points" bind:color={$colors.significant}/>
                <ColorPicker name="Significance Line" bind:color={$colors.significanceLine}/>
            </div>
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
            &.right {
                flex-direction: row-reverse;
            }
    }
    .gap-sm {
        gap: 0.25rem;
    }
    .row {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
    }
    .wrap {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        height: 50%;
        > * {
            width: 50%;
        }
    }
    
    .pointers {
        > * :hover {
            cursor: pointer;
        }
    }
    :global(div[role="tabpanel"]) {
        @apply bg-transparent dark:bg-gray-900 mt-0 px-0 py-2;
        border-radius: 0;
    }

    :global(#blankcanvas) {
        display: none;
    }

</style>
