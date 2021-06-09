<script>
  import successkid from "images/successkid.jpg";
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc.js";
  dayjs.extend(utc);
  export let title = "タスクアラート";
  export let defaultActive = true;

  let inputTitle = "";
  let inputTimer = "";

  export let tasks = [];
  function remove(ind) {
    let nTasks = [...tasks];
    nTasks.splice(ind, 1);
    tasks = nTasks;
  }
  function add() {
    let nTasks = [...tasks];
    nTasks.push({
      time: inputTimer,
      title: inputTitle,
      active: defaultActive,
    });
    tasks = nTasks;
  }
  function update(ind, time, title) {
    let nTasks = [...tasks];
    nTasks.splice(ind, 1, {
      time: inputTimer,
      title: inputTitle,
    });
    tasks = nTasks;
  }
  function active(ind, bl) {
    let nTasks = [...tasks];
    nTasks.splice(ind, 1, {
      ...nTasks[ind],
      active: bl,
    });
    tasks = nTasks;
  }
</script>

<div class="container-fluid">
  <h3>{title}</h3>
  <div class="row">
    <div class="col-md-6 col-xs-12">
      <div class="input-group mb-3">
        <span class="input-group-text" id="input-title"> 題名 </span>
        <input
          id="input-title"
          class="form-control"
          type="text"
          bind:value={inputTitle}
        />
      </div>
    </div>
    <div class="col-md-6 col-xs-12">
      <div class="input-group mb-3">
        <span class="input-group-text" id="input-timer"> 時間 </span>
        <input
          id="input-timer"
          class="form-control"
          type="datetime-local"
          bind:value={inputTimer}
        />
      </div>
    </div>
    <div class="col-12">
      <div class="input-group mb-3">
        <button class="btn btn-primary" on:click={() => add()}>追加</button>
      </div>
    </div>
  </div>
  <ul class="list-group">
    {#each tasks as task, i}
      <li class="list-group-item">
        {task.time.toLocaleString()} :
        {task.title}:
        {task.active ? "アクティブ" : "パッシブ"}
        <button on:click={() => active(i, !task.active)}
          >{!task.active ? "アクティブ" : "パッシブ"}</button
        >
        <button on:click={() => remove(i)}>remove</button>
      </li>
    {/each}
  </ul>
</div>
