<script>
  import Tasks from "../components/TaskList.svelte";
  import {tasks, activeTasks} from "../stores/tasks.js";
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc.js";
  dayjs.extend(utc);
  import {onMount} from "svelte";
  let time = dayjs();

  const title = "タスクアラート";
  $: {
    let nTasks = [];
    let naTasks = [];
    [...$tasks, ...$activeTasks].forEach((x) => {
      if (x.active === true) {
        if (dayjs(x.time).diff(time) <= 0) {
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
</script>

<svelte:head>
  <title>{title}</title>
  <link href="/bootstrap.min.css" rel="stylesheet" />
</svelte:head>

<div class="container-fluid">
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
