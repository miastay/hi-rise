import { writable } from 'svelte/store';

export const assoc_data = writable("");
export const live_data = writable("");

export const plotWidth = writable(1200);
export const plotHeight = writable(600);

export const darkMode = writable(true);

export const colors = createColors()

function createColors() {
    const { subscribe, set, update } = writable({
        "points": "#ff0000",
        "significant": "#00ff00",
        "significanceLine": "#ff2233"
    });
    return {
        subscribe,
        set,
        update
    }
}

export const doOptimization = writable(true);
export const optimizationType = writable("line");
export const optimizationChunkSize = writable(1000);
export const optimizationChunkFactor = writable(3);

export const optimizationStats = writable({
    "numReduced": 0,
    "originalTotal": 0,
    "processTime": 0,
    "renderTime": 0
})

export const inputColumns = writable(["ps", "p_lrt", "chr"])
export const posColumn = writable("ps")
export const sigColumn = writable("p_lrt")
export const chrColumn = writable("chr")
export const rsColumn = writable("rs")

export const scaffolds = writable([]);
export const selectedScaffolds = writable([]);

export const scaffoldGap = writable(50000000);


export const showCanvas = writable(false);