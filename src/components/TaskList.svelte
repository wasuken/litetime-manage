<script>
  import successkid from "images/successkid.jpg";
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc.js";
  import { onMount } from "svelte";
  import { userInput, tasks } from "../stores/tasks.js";
  dayjs.extend(utc);
  export let title = "タスクアラート";

  let nowDt = dayjs();

  onMount(() => {
    const interval = setInterval(() => {
      nowDt = dayjs();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  userInput.set({
    title: "",
    timer: "",
    timer_display: {
      min: 0,
      sec: 0,
      hour: 0,
    },
    keyword: "",
    checkListText: "",
  });
 export let tks = [];
 console.log(tks);
</script>

<div class="container-fluid shadow p-3 mb-5 bg-body rounded">
  <h3>{title}</h3>
  <ul class="list-group">
    {#each tks as task, i}
      <li class="list-cursor list-group-item m-2 {task.active ? 'active-task' : 'passive-task'}">
        <h4 class="d-flex justify-content-between">
		  {task.title}
		  <button class="btn btn-outline-primary" on:click={() => task.omit = !task.omit}>
			{task.omit ? "open" : "omit"}
		  </button>
        </h4>
        {#if !task.omit}
          {#if task.active}
            {dayjs(task.timer).diff(nowDt, "s")} 秒
            <hr />
            <span class="badge {task.active ? 'bg-primary' : 'bg-secondary'}">
              {dayjs(task.timer).format("YYYY-MM-DD HH:mm:ss")}
            </span>
          {/if}
          <span class="badge {task.active ? 'bg-primary' : 'bg-secondary'}">
            {task.timer_display.hour}時
            {task.timer_display.min}分
            {task.timer_display.sec}秒
          </span>
          <div class="input-group mb-3 fs-5">
            {#if task.keyword.length > 0}
              {#each task.keyword.split(" ") as w}
                <div class="m-1 badge bg-info text-dark">{w}</div>
              {/each}
            {/if}
          </div>
          <hr />
		  {#if task.checkList.length > 0}
			{#each task.checkList as chk, i}
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id={"chkbox-" + i}
                checked={chk.checked}
                on:change={(e) => task.changeCheck(i, e.target.checked)}
              />
              <label class="form-check-label" for={"chkbox-" + i}
              >{chk.text}</label
						 >
            </div>
			{/each}
			<hr />
		  {/if}
          <button
            class="btn {!task.active ? 'btn-primary' : 'btn-secondary'}"
            on:click={() => task.change_active(!task.active)}
            >{!task.active ? "activete" : "passivate"}</button
          >
          <button class="btn btn-danger" on:click={() => task.remove()}
            >remove</button
          >
          <button class="btn btn-success" on:click={() => task.edit()}
            >edit</button
          >
          <button class="btn btn-info" on:click={() => task.duplicate()}
            >duplicate</button
          >
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
  .passive-task {
    border-left: medium solid gray;
  }
  .active-task {
    border-left: medium solid red;
  }
  .detail-close {
    display: none !important;
  }
  .list-cursor{
    cursor: pointer;
  }
</style>
