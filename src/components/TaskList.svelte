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
</script>

<div class="container-fluid">
  <h3>{title}</h3>
  <ul class="list-group">
    {#each tasks as task, i}
      <li class="list-group-item">
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
      </li>
    {/each}
  </ul>
</div>
