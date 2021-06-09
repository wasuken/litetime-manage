import { writable, derived } from 'svelte/store';

export const tasks = writable([]);
export const activeTasks = writable([]);

export const userInput = writable({});
