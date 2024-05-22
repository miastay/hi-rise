<script>
    import { Label, Fileupload, Alert, Button, SpeedDial } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';
    import { assoc_data, chrColumn, inputColumns, live_data, scaffolds, selectedScaffolds } from '../store.js';
    import HrCard from '../lib/HRCard.svelte';
    import HrDropzone from '../lib/HRDropzone.svelte';
    import * as d3 from 'd3';
  
    let associationFile = [];
    let associationFileWarning = null;
    let associationFileError = null;

    $: associationFile && updateAssociationFile(associationFile)
    async function updateAssociationFile(file) {
        associationFileWarning = null;
        associationFileError = null;
        if(!file || file?.length == 0) return;
        // if(file?.length == 0) {
        //     associationFileError = "Association file is required."
        //     return;
        // }
        if(file?.length > 1) {
            associationFileWarning = "Multiple files provided. The first matching file will be used."
        }
        let f = file[0];
        console.log(`${f.size} bytes`)
        const reader = new FileReader()
        reader.onload = handleFileLoad;
        reader.readAsText(f)
    }
    
    async function handleFileLoad(event) {
        console.log(event)
        let txt = event.target.result;
        if(txt) {
            $assoc_data = d3.tsvParse(txt)
            $inputColumns = [];
            // get columns
            Object.keys($assoc_data[0]).forEach((x) => $inputColumns.push({value: x, name: x}))
            updateScaffoldList("chr")
            console.log($inputColumns)
        }
    }

    $: updateScaffoldList($chrColumn)
    function updateScaffoldList(col) {
        console.log("updating scaffolds...")
        // get all scaffold names
        $scaffolds = [];
        for(let d of $assoc_data) {
            if($scaffolds.includes(d[col])) continue;
            $scaffolds.push(d[col])
            if($scaffolds.length > 30) {
                console.error("Too many chrs!")
                return;
            }
        }
        $selectedScaffolds = $scaffolds;
        console.log($scaffolds)
    }

    let referenceFile = [];
    let referenceFileWarning = null;
    let referenceFileError = null;

    $: referenceFile && updateReferenceFile(referenceFile)
    function updateReferenceFile(file) {
        referenceFileWarning = null;
        referenceFileError = null;
        if(file?.length > 1) {
            referenceFileWarning = "Multiple files provided. The first matching file will be used."
        }
    }

</script>
  
<HrCard header={"Upload GWAS results"}>
    <span>{"Upload results of an association test. Rows should indicate associations for each position, with a column listing SNP names (rs*) and a column listing Z-scores or P-values. Additional columns such as chromosome/scaffold and position in bp will be used if an annotation file is not provided."}</span>
    <HrDropzone bind:value={associationFile} accepts=".assoc, .txt, .csv, .tsv" id="assocfile"/>
    {#if associationFileError}<Alert color="red">{associationFileError}</Alert>{/if}
    {#if associationFileWarning}<Alert color="yellow" class="dark:bg-yellow-900">{associationFileWarning}</Alert>{/if}
    <!-- <Fileupload {...associationUploadProps} on:change={(e) => console.log(e)} bind:value={associationFile}/> -->
    <Label class="pb-2">File listing GWAS results. See <a href="/" class="dark:text-white">an example input</a>.</Label>

    <h5 class="mb-0 text-2xl font-bold tracking-tight text-primary-800 dark:text-white">{"Upload annotation file (optional)"}</h5>
    <span>Upload the annotation file used to generate your data. This should contain information about SNPs, chromosomes/scaffolds, and genes. This is only necessary if your association file does not contain position information, or if you would like to annotate significant genes.</span>
    <HrDropzone bind:value={referenceFile} accepts=".gtf, .gff, .gff3"/>
    {#if referenceFileError}<Alert color="red">{referenceFileError}</Alert>{/if}
    {#if referenceFileWarning}<Alert color="yellow" class="dark:bg-yellow-900">{referenceFileWarning}</Alert>{/if}
    <Label class="pb-2">Download a commonly used annotation file from <a href="https://www.gencodegenes.org/human/release_38.html" class="dark:text-white">Gencode</a>.</Label>

    <div class="go">
        <Button size='lg' on:click={() => window.dispatchEvent(new CustomEvent("plot"))}>Generate plot <ArrowRightOutline class="w-5 h-5 ms-2"/></Button>
    </div>
      
</HrCard>

<style lang='scss'>

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    .go {
        display: flex;
        flex-direction: row-reverse;
    }

    :global(input[type="range"]::-moz-range-progress) {
        border-radius: 1rem;
        background: rgb(30 20 255 / var(--tw-text-opacity)) !important;
        height: 8px;
    }
    :global(input[type="range"]::-moz-range-thumb) {
        @apply bg-primary-500;
    }

    :global(input[type="range"]) {
        //overflow: hidden;
    }

</style>
