import { writable, derived } from 'svelte/store';
import { onMount } from 'svelte';

export const tasks = writable([]);
export const userInput = writable({});

export const saveTasks = (tasks) => {
  const j = JSON.stringify(tasks);
  localStorage.setItem('tasks', j);
}
