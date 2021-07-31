<script>
  import successkid from "images/successkid.jpg";
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc.js";
  import {userInput} from "../stores/tasks.js";
  dayjs.extend(utc);
  export let title = "タスクアラート";

  userInput.set({
    title: "",
    timer: "",
	timer_display: {
	  min: 0,
	  sec: 0,
	  hour: 0,
	},
	keyword: "",
  });

  export let tasks = [];
  function remove(ind) {
    let nTasks = [...tasks];
    nTasks.splice(ind, 1);
    tasks = nTasks;
  }
  function active(ind, bl) {
    let nTasks = [...tasks];
    let tgt = nTasks[ind];
    if (dayjs(nTasks[ind].timer).diff(dayjs()) <= 0) {
      tgt.timer = dayjs().add("5", "m");
    }
    nTasks.splice(ind, 1, {
      ...tgt,
      active: bl,
    });
    tasks = nTasks;
  }
  function edit(ind) {
    const rTask = tasks[ind];
    remove(ind);
    userInput.set({...rTask});
  }
  function duplicate(ind){
	const rTask = tasks[ind];
	let nTasks = [...tasks];
	nTasks.push(rTask);
    tasks = nTasks;
    userInput.set({...rTask});
  }
</script>

<div class="container-fluid shadow p-3 mb-5 bg-body rounded">
  <h3>{title}</h3>
  <ul class="list-group">
    {#each tasks as task, i}
      <li class="list-group-item m-2">
		{#if task.active}
		  {dayjs(task.timer).diff(dayjs(), 's')} 秒
		<hr />
	  {/if}
		<span class="badge {task.active ? 'bg-primary' : 'bg-secondary'}">
		  {dayjs(task.timer).format("YYYY-MM-DD HH:mm:ss")}
		</span>
        <p>
		  {task.title}
		</p>
		<hr/>
        <button
          class="btn {task.active ? 'btn-primary' : 'btn-secondary'}"
          on:click={() => active(i, !task.active)}
          >{!task.active ? "アクティブ" : "パッシブ"}</button
        >
        <button class="btn btn-secondary" on:click={() => remove(i)}
          >remove</button
        >
        <button class="btn btn-secondary" on:click={() => edit(i)}>edit</button>
		<button class="btn btn-secondary" on:click={() => duplicate(i)}>duplicate</button>
      </li>
    {/each}
  </ul>
</div>
