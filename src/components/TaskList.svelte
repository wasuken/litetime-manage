<script>
  import successkid from "images/successkid.jpg";
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc.js";
  import {userInput, tasks} from "../stores/tasks.js";
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
  export let tks = [];
</script>

<div class="container-fluid shadow p-3 mb-5 bg-body rounded">
  <h3>{title}</h3>
  <ul class="list-group">
    {#each tks as task, i}
      <li class="list-group-item m-2">
		{#if task.active}
		  {dayjs(task.timer).diff(dayjs(), 's')} 秒<hr />
		{/if}
		<span class="badge {task.active ? 'bg-primary' : 'bg-secondary'}">
		  {dayjs(task.timer).format("YYYY-MM-DD HH:mm:ss")}
		</span>
		<span class="badge {task.active ? 'bg-primary' : 'bg-secondary'}">
		  {task.timer_display.hour}時
		  {task.timer_display.min}分
		  {task.timer_display.sec}秒
		</span>
        <p>
		  {task.title}
		</p>
		<hr/>
		<div class="input-group mb-3 fs-5">
		  {#if task.keyword.length > 0}
			{#each task.keyword.split(' ') as w}
			  <div class="m-1 badge bg-info text-dark">{w}</div>
			{/each}
		  {/if}
		</div>
		<hr/>
        <button
          class="btn {!task.active ? 'btn-primary' : 'btn-secondary'}"
          on:click={() => task.change_active((!task.active))}
          >{!task.active ? "activete" : "passivate"}</button
													   >
        <button class="btn btn-danger" on:click={() => task.remove()}
          >remove</button
				   >
        <button class="btn btn-success" on:click={() => task.edit()}>edit</button>
		<button class="btn btn-info" on:click={() => task.duplicate()}>duplicate</button>
      </li>
    {/each}
  </ul>
</div>
