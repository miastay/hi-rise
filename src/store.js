import { writable } from 'svelte/store';

export const assoc_data = writable("");

export const plotWidth = writable(1200);
export const plotHeight = writable(600);

export const darkMode = writable(true);