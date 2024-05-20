<script>
    import * as d3 from 'd3';
    import { assoc_data, plotWidth, plotHeight, colors, optimizationStats, optimizationChunkSize, doOptimization, sigColumn, posColumn, rsColumn, chrColumn, live_data, selectedScaffolds, scaffoldGap, optimizationChunkFactor, showCanvas } from '../store';
    import { WidgetPlaceholder, Spinner, Button } from 'flowbite-svelte';
    import { onMount } from 'svelte';
    import { RefreshOutline } from 'flowbite-svelte-icons';
    
    export let data = [];
    export let marginTop = 40;
    export let marginRight = 40;
    export let marginBottom = 40;
    export let marginLeft = 40;

    export let drawQuantilesDynamically = true;

    export let significanceType = "Bonferroni";
    export let significanceLevel = 0.05;
    let ySignificance = -1;

    let loading = false;
    let plotted = false;

    $: $live_data && processData($live_data)

    async function processData(data) {
        console.log(loading)
        loading = true;
        redrawData(data);
    }

    function yAxisTransform(yi) {
        return Math.log10(yi) * -1;
    }

    function resetPlot() {
        d3.selectAll("svg#plot").remove();
        $live_data = $assoc_data;
    }

    onMount(() => {
        window.addEventListener("plot", (e) => {
            resetPlot();
        })
    })

    async function redrawData(points) {

        if(points?.length == 0) return;
        $optimizationStats.originalTotal = points.length;


        if(!$doOptimization) {
            // TODO
        }


        points = points.filter((x) => $selectedScaffolds.includes(x[$chrColumn]))


        ySignificance = 4;
        if(significanceType === "Bonferroni") {
            ySignificance = Math.log10(significanceLevel / points.length) * -1;
        }

        let process_time = Date.now();

        window.dispatchEvent(new CustomEvent("LoadPlot"))

        const width = $plotWidth;
        const height = $plotHeight;

        // trim data

        let trimmed = []
        let lines = []
        let scaffold_ranges = [];
        let chunkWidth = $optimizationChunkSize;
        let numChunks = Math.ceil(points.length / chunkWidth);

        let dynamicQuantiles = drawQuantilesDynamically;
        let defaultQuantile = 2.0;

        let currentChr = -1;
        let lastChrStart = 0;
        let maxps = 0;
        let totalOffset = 0;

        let totalSignificant = 0;
        let significantSet = [];

        for(let c = 0; c < numChunks; c++) {
            let chunkStart = c * chunkWidth;
            let chunkMax = Math.min(chunkStart + chunkWidth, points.length);
            let quant = 0;
            let max = -1;
            let tempValues = []
            let psStart = -1;
            for(let i = chunkStart; i < Math.min(chunkMax, points.length); i++) {
                let p = points[i];
                // get log10 value
                let chr = p[$chrColumn]
                let yval = yAxisTransform(Number.parseFloat(p[$sigColumn]));
                let ps = Number.parseInt(p[$posColumn])
                let signif = yval > ySignificance;
                if(signif) {
                    totalSignificant++;
                    significantSet.push({x: ps, y: yval, sig: signif, chr: chr, rs: p[$rsColumn]});
                }
                if(dynamicQuantiles) {
                    tempValues.push({x: ps, y: yval, sig: signif})
                } else if(yval > defaultQuantile) {
                    trimmed.push({x: ps, y: yval, sig: signif})
                }
                if(psStart == -1) {
                    psStart = ps;
                }
                if(currentChr !== chr) {
                    // set end of last chromosome
                    if(scaffold_ranges.length !== 0) {
                        scaffold_ranges[scaffold_ranges.length - 1].end = points[i-1] ? Number.parseInt(points[i-1][$posColumn]) : 0;
                        scaffold_ranges[scaffold_ranges.length - 1].end_index = trimmed.length - 1;
                    }
                    lastChrStart = ps;
                    totalOffset += points[i-1] ? Number.parseInt(points[i-1][$posColumn]) : 0;
                    maxps += totalOffset;

                    // push new chromosome entry
                    scaffold_ranges.push({"name": chr, "start": lastChrStart, "start_index": trimmed.length, "end": -1, "end_index": -1, "offset": totalOffset, "render": $selectedScaffolds.includes(chr)});
                    currentChr = chr;
                }
                if(dynamicQuantiles) {
                    quant += yval;
                    if(yval > max) max = yval;
                }
            }
            let drawThreshold;
            if(dynamicQuantiles) {
                quant = quant / ((chunkMax - chunkStart) * 1.0);
                drawThreshold = (quant + max) / $optimizationChunkFactor
            } else {
                drawThreshold = defaultQuantile;
            }
            lines.push({x: psStart, y: drawThreshold, chr: currentChr})
            // append values above this threshold
            for(let v of tempValues) {
                if(v.y > drawThreshold) {
                    trimmed.push(v)
                }
            }
        }
        scaffold_ranges[scaffold_ranges.length - 1].end = Number.parseInt(points[points.length-1][$posColumn]);
        scaffold_ranges[scaffold_ranges.length - 1].end_index = points.length-1;

        let scaffold_map = []
        for(let s = 0; s < scaffold_ranges.length; s++) {
            scaffold_map.push(scaffold_ranges[s].name)
        }
        console.log(scaffold_map)

        console.log(scaffold_ranges);
        const data = trimmed;
        $optimizationStats.numReduced = trimmed.length + lines.length;
        $optimizationStats.processTime = Date.now() - process_time;
        console.log(`Process time: ${$optimizationStats.processTime}ms`)
        console.log(`Num significant: ${totalSignificant}`)

        let render_time = Date.now();

        let psstart = scaffold_ranges[0].start;
        let pswidth = 0;
        for(let s = 0; s < scaffold_ranges.length; s++) {
            pswidth += scaffold_ranges[s].end;
        }
        console.log(psstart, pswidth)

        const x = d3.scaleLinear()
            .domain(d3.extent([0, pswidth + ($scaffoldGap * (scaffold_ranges.length - 1))]))
            //.domain(d3.extent(points, d => d.ps)).nice()
            .range([marginLeft, width - marginRight]);


        let maxp = -1
        for(let sig of significantSet) {
            if(sig.y > maxp) maxp = sig.y
        }
        console.log(maxp)

        const y = d3.scaleLinear()
            .domain([0, maxp + 1])
            //.domain(d3.extent(points, d => yAxisTransform(d.p_lrt))).nice()
            .range([height - marginBottom, marginTop]);

        // Create the SVG container.
        const svg = d3.select("#container").append("svg")
            .attr("id", "plot")
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");


        // Create the axes.
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            //.call(d3.axisBottom(x).ticks())
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", width)
                .attr("y", marginBottom - 4)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text("ps"));

        let scaffold_group = svg.append("g").attr("transform", `translate(0,${height - marginBottom})`).attr("font-size", 12)
        for(let s = 0; s < scaffold_ranges.length; s++) {
            let sc = scaffold_ranges[s];
            scaffold_group.append("text").attr("x", x(((sc.end - sc.start)/2) + sc.offset + ($scaffoldGap * s))).attr("y", marginBottom - 12).attr("fill", "currentColor").attr("text-anchor", "middle").text(`${sc.name}`)
        }
            
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("-log(p-value)"));

        // Create the grid.
        svg.append("g")
            .attr("stroke", "currentColor")
            .attr("stroke-opacity", 0.1)
            .call(g => g.append("g")
            .selectAll("line")
            .data(x.ticks())
            .join("line")
                .attr("x1", d => 0.5 + x(d))
                .attr("x2", d => 0.5 + x(d))
                .attr("y1", marginTop)
                .attr("y2", height - marginBottom))
            .call(g => g.append("g")
            .selectAll("line")
            .data(y.ticks())
            .join("line")
                .attr("y1", d => 0.5 + y(d))
                .attr("y2", d => 0.5 + y(d))
                .attr("x1", marginLeft)
                .attr("x2", width - marginRight));


        // plot significance line
        console.log(ySignificance)
        svg.append("g")
        .attr("stroke", $colors.significanceLine)
        .attr("stroke-opacity", 1)
        .attr("stroke-weight", 3)
        .call(g => g.append("line")
        .style("stroke-dasharray", ("2, 2"))
            .attr("y1", y(ySignificance))
            .attr("y2", y(ySignificance))
            .attr("x1", marginLeft)
            .attr("x2", width - marginRight))

        svg.append("text")
            .attr("x", width - marginRight)
            .attr("y", y(ySignificance) + 10)
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("font-weight", "lighter")
            .attr("fill", $colors.significanceLine)
            .attr("text-anchor", "end")
            .text(`p = 10^-${Math.round(ySignificance * 100) / 100}`);



        // plot by scaffold

        for(let s in scaffold_ranges) {
            
            let sc = scaffold_ranges[s]

            let xoffset = 0;
            for(let b = 0; b < s; b++) {
                if($selectedScaffolds.includes(scaffold_ranges[b].name))
                    xoffset += scaffold_ranges[b].end;
            }
            console.log(xoffset)
            let points = data.slice(sc.start_index, sc.end_index)
            //let linesub = lines.slice(Math.floor(sc.start_index / chunkWidth), Math.floor(sc.end_index / chunkWidth))
            svg.append("g")
                .attr("fill", $colors.points)
                .selectAll("circle")
                .data(points)
                .join("circle")
                .attr("cx", d => x(d.x + xoffset + ($scaffoldGap * s)))
                .attr("cy", d => y(d.y))
                .attr("r", 3);

            
            // svg.append("g")
            //     .attr("stroke-opacity", 1)
            //     .attr("stroke-width", 6)
            //     .selectAll("line")
            //     .data(linesub)
            //     .join("line")
            //     .attr("stroke", d => Number.parseInt(sc.name) % 2 == 0 ? "red" : "blue")
            //     .attr("y1", y(0))
            //     .attr("y2", d => y(d.y))
            //     .attr("x1", d => x(d.x + xoffset))
            //     .attr("x2", d => x(d.x + xoffset))
            //     .attr("stroke-linecap", "round");
        }

        // svg.append("g")
        //         .attr("fill", $colors.points)
        //         .selectAll("circle")
        //         .data(points)
        //         .join("circle")
        //         .attr("cx", d => x(d.x + scaffold_ranges[scaffold_map.indexOf(d.chr)].offset + (chrGap * (scaffold_map.indexOf(d.chr)))))
        //         .attr("cy", d => y(d.y))
        //         .attr("r", 3);

        // plot significant point overlays
        svg.append("g")
                .attr("fill-opacity", 0)
                .attr("stroke", $colors.significant)
                .attr("stroke-width", 1)
                .selectAll("circle")
                .data(significantSet)
                .join("circle")
                .attr("cx", d => x(d.x + scaffold_ranges[scaffold_map.indexOf(d.chr)].offset + ($scaffoldGap * (scaffold_map.indexOf(d.chr)))))
                .attr("cy", d => y(d.y))
                .attr("r", 5);

        svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("fill", "currentColor")
            .selectAll("text")
            .data(significantSet)
            .join("text")
            .attr("dy", "0.35em")
            .attr("x", d => x(d.x + scaffold_ranges[scaffold_map.indexOf(d.chr)].offset + ($scaffoldGap * (scaffold_map.indexOf(d.chr)))) + 6)
            .attr("y", d => y(d.y) - 6)
            .text(d => d.rs);

        svg.append("g")
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 6)
            .selectAll("line")
            .data(lines)
            .join("line")
            .attr("stroke", $colors.points)
            .attr("y1", y(0))
            .attr("y2", d => y(d.y))
            .attr("x1", d => x(d.x + scaffold_ranges[scaffold_map.indexOf(d.chr)]?.offset + ($scaffoldGap * (scaffold_map.indexOf(d.chr)))))
            .attr("x2", d => x(d.x + scaffold_ranges[scaffold_map.indexOf(d.chr)]?.offset + ($scaffoldGap * (scaffold_map.indexOf(d.chr)))))
            .attr("stroke-linecap", "round");

        // // Plot the points above the threshold
        // svg.append("g")
        //     .attr("fill", "red")
        //     .selectAll("circle")
        //     .data(data)
        //     .join("circle")
        //     .attr("cx", d => x(d.x))
        //     .attr("cy", d => y(d.y))
        //     .attr("r", 3);

        // Draw lines from base to threshold

        // Add a layer of labels.
        // svg.append("g")
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", 10)
        //     .selectAll("text")
        //     .data(points)
        //     .join("text")
        //     .attr("dy", "0.35em")
        //     .attr("x", d => x(d.mpg) + 7)
        //     .attr("y", d => y(d.hp))
        //     .text(d => d.name);

        $optimizationStats.renderTime = Date.now() - render_time;
        console.log(`Rendering time: ${$optimizationStats.renderTime}ms`)
        plotted = true;
        loading = false;
    }

  </script>

<div id="container" class="text-black dark:text-white bg-white dark:bg-gray-900">
    {#if !loading && !plotted}Plot area{/if}
    {#if loading}<Spinner size={12}/>{/if}
    <img id="blankimg" style={`display: ${$showCanvas ? "block" : "none"}`} alt="plot"/>
</div>
{#if $live_data}
<Button class="absolute right-6 top-26 w-12 h-12" on:click={() => resetPlot()}>
    <RefreshOutline />
</Button>
{/if}

<style lang="scss">
    #container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        min-width: 100%;
        aspect-ratio: 2/1;
    }
</style>