<script>
  import Tasks from "../components/TaskList.svelte";
  import {userInput, tasks, activeTasks} from "../stores/tasks.js";
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc.js";
  dayjs.extend(utc);
  import {onMount} from "svelte";
  let time = dayjs();
  userInput.set({
    title: "",
    timer: dayjs(),
    active: false,
  });

  const title = "タスクアラート";
  $: {
    let nTasks = [];
    let naTasks = [];
    [...$tasks, ...$activeTasks].forEach((x) => {
      if (x.active === true) {
        console.log(dayjs(x.timer).diff(time));
        if (dayjs(x.timer).diff(time) <= 0) {
          nTasks.push({...x, active: false});
          alert(`[${x.title}] :経過`);
        } else {
          naTasks.push(x);
        }
      } else {
        nTasks.push(x);
      }
    });
    tasks.set(nTasks);
    activeTasks.set(naTasks);
  }
  onMount(() => {
    const interval = setInterval(() => {
      time = dayjs();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });
  function add() {
    if ($userInput.active) {
      let nTasks = [...$activeTasks];
      nTasks.push({...$userInput});
      activeTasks.set(nTasks);
    } else {
      let nTasks = [...$tasks];
      nTasks.push({...$userInput});
      tasks.set(nTasks);
    }
    userInput.set({
      title: "",
      timer: dayjs(),
      active: false,
    });
  }
</script>

<svelte:head>
  <title>{title}</title>
  <link href="/bootstrap.min.css" rel="stylesheet" />
</svelte:head>

<div class="container-fluid">
  <div class="row">
    <div class="col-md-6 col-xs-12">
      <div class="input-group mb-3">
        <span class="input-group-text" id="input-title"> 題名 </span>
        <input
          id="input-title"
          class="form-control"
          type="text"
          bind:value={$userInput.title}
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
          bind:value={$userInput.timer}
        />
      </div>
    </div>
    <div class="col-md-6 col-xs-12">
      <div class="input-group mb-3">
        <span class="form-check-label" id="input-active">
          {$userInput.active ? "アクティブ" : "パッシブ"}
        </span>
        <input
          id="input-active"
          class="form-check-input"
          type="checkbox"
          bind:checked={$userInput.active}
        />
      </div>
    </div>
    <div class="col-12">
      <div class="input-group mb-3">
        <button class="btn btn-primary" on:click={() => add()}>追加</button>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 col-xs-12">
      <Tasks
        bind:tasks={$activeTasks}
        title="アクティブタスクリスト"
        defaultActive={true}
      />
    </div>
    <div class="col-md-6 col-xs-12">
      <Tasks
        bind:tasks={$tasks}
        title="パッシブタスクリスト"
        defaultActive={false}
      />
    </div>
  </div>
</div>
