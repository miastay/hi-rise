<script>
    import * as d3 from 'd3';
    import { assoc_data, plotWidth, plotHeight, darkMode } from '../store';
    import { WidgetPlaceholder, Spinner } from 'flowbite-svelte';
    
    export let data = [];
    export let marginTop = 40;
    export let marginRight = 40;
    export let marginBottom = 40;
    export let marginLeft = 40;

    export let drawQuantilesDynamically = true;
    export let chrGap = 50000000;

    export let significanceType = "Bonferroni";
    export let significanceLevel = 0.5;

    export let pointColor = "#f0f0ff";

    let loading = false;

    $: $assoc_data && processData($assoc_data)

    async function processData(data) {
        console.log(loading)
        loading = true;
        await redrawData(data);
        loading = false;
        console.log(loading)
    }

    function yAxisTransform(yi) {
        return Math.log10(yi) * -1;
    }

    async function redrawData(points) {

        if(points?.length == 0) return;

        let ySignificance = 4;
        if(significanceType === "Bonferroni") {
            ySignificance = Math.log10(significanceLevel / points.length) * -1;
        }

        let process_time = Date.now();

        const width = $plotWidth;
        const height = $plotHeight;

        // trim data

        let trimmed = []
        let lines = []
        let scaffold_ranges = [];
        let threshold = 0.1;
        let chunkWidth = 1000;
        let numChunks = Math.ceil(points.length / chunkWidth);

        let dynamicQuantiles = drawQuantilesDynamically;
        let defaultQuantile = 2.0;

        let currentChr = -1;
        let lastChrStart = 0;
        let maxps = 0;

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
                let chr = p.chr
                let yval = yAxisTransform(Number.parseFloat(p.p_lrt));
                let ps = Number.parseInt(p.ps)
                let signif = yval > ySignificance;
                if(signif) {
                    totalSignificant++;
                    significantSet.push({x: ps, y: yval, sig: signif});
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
                        scaffold_ranges[scaffold_ranges.length - 1].end = Number.parseInt(points[i-1].ps);
                        scaffold_ranges[scaffold_ranges.length - 1].end_index = trimmed.length - 1;
                    }
                    lastChrStart = ps;
                    // push new chromosome entry
                    scaffold_ranges.push({"name": chr, "start": lastChrStart, "start_index": trimmed.length, "end": -1, "end_index": -1});
                    maxps += lastChrStart;
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
                drawThreshold = (quant + max) / 3.0
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
        scaffold_ranges[scaffold_ranges.length - 1].end = Number.parseInt(points[points.length-1].ps);
        scaffold_ranges[scaffold_ranges.length - 1].end_index = points.length-1;

        console.log(scaffold_ranges);
        const data = trimmed;
        console.log(`Process time: ${Date.now() - process_time}ms`)
        console.log(`Num significant: ${totalSignificant}`)

        let render_time = Date.now();

        const x = d3.scaleLinear()
            .domain([0, 3100000000 + chrGap * 10]).nice()
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
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");


        // Create the axes.
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", width)
                .attr("y", marginBottom - 4)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text("ps"));

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


        // plot by scaffold

        for(let s in scaffold_ranges) {
            let sc = scaffold_ranges[s]
            let xoffset = 0;
            for(let b = 0; b < s; b++) {
                xoffset += scaffold_ranges[b].end;
            }
            console.log(xoffset)
            let points = data.slice(sc.start_index, sc.end_index)
            //let linesub = lines.slice(Math.floor(sc.start_index / chunkWidth), Math.floor(sc.end_index / chunkWidth))
            svg.append("g")
                .attr("fill", pointColor)
                .selectAll("circle")
                .data(points)
                .join("circle")
                .attr("cx", d => x(d.x + xoffset + (chrGap * s)))
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
        //         .attr("stroke-opacity", 1)
        //         .attr("stroke-width", 6)
        //         .selectAll("line")
        //         .data(lines)
        //         .join("line")
        //         .attr("stroke", d => Number.parseInt(d.chr) % 2 == 0 ? "red" : "blue")
        //         .attr("y1", y(0))
        //         .attr("y2", d => y(d.y))
        //         .attr("x1", d => x(d.x + scaffold_ranges[Number.parseInt(d.chr) - 2]?.end ?? 0))
        //         .attr("x2", d => x(d.x + scaffold_ranges[Number.parseInt(d.chr) - 2]?.end ?? 0))
        //         .attr("stroke-linecap", "round");

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

        console.log(`Rendering time: ${Date.now() - render_time}ms`)

    }

  </script>

<div id="container" class="text-black dark:text-white bg-gray-50 dark:bg-gray-900" style={`min-width: ${$plotWidth}px; min-height:${$plotHeight}px`}>
    {#if !loading}Plot area{/if}
    {#if loading}<Spinner size={12}/>{/if}
</div>

<style lang="scss">
    #container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
</style>