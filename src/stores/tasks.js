import { writable, derived } from 'svelte/store';

export const tasks = writable({});
export const userInput = writable({});

export const saveTasks = (tasks) => {
  const j = JSON.stringify(tasks);
  localStorage.setItem('tasks', j);
}
