import { writable } from 'svelte/store';

export const assoc_data = writable("");

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