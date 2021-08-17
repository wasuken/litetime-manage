<script>
  import TaskList from "../components/TaskList.svelte";
  import Keywords from "../components/Keywords.svelte";
  import TaskAdd from "../components/TaskAdd.svelte";
  import {userInput, tasks, saveTasks} from "../stores/tasks.js";
  import {
    genUKey,
    removeF,
    activeF,
    editF,
    duplicateF,
    changeCheckF,
  } from "../const.js";

  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc.js";
  dayjs.extend(utc);
  import {onMount} from "svelte";

  let minSec = {
    min: 0,
    sec: 0,
    hour: 0,
  };
  let isDateTimeLocal = false;

  let time = dayjs();
  userInput.set({
    title: "",
    timer: dayjs(),
    timer_display: {
      min: 0,
      sec: 0,
      hour: 0,
    },
    active: false,
    keyword: "",
    checkListText: "",
  });
  let activeTasks = [];
  let passiveTasks = [];

  function handleSaveTasks() {
    localStorage.setItem("tasks", JSON.stringify($tasks));
  }

  onMount(() => {
    let storedTasks = {};
    try {
      let ts = localStorage.getItem("tasks");
      if (!ts) {
        ts = "{}";
      }
      storedTasks = JSON.parse(ts);
      Object.keys(storedTasks).forEach((k) => {
        storedTasks[k] = {
          ...storedTasks[k],
          remove: removeF(k),
          edit: editF(k),
          change_active: activeF(k),
          duplicate: duplicateF(k),
          changeCheck: changeCheckF(k),
        };
      });
    } catch (e) {
      console.log(e);
      storedTasks = {};
    }
    tasks.set(storedTasks);
  });

  const title = "タスクアラート";
  $: {
    let tks = {...$tasks};
    if ($tasks) {
      Object.keys($tasks).forEach((k, i) => {
        const t = $tasks[k];
        if (t.active === true) {
          if (dayjs(t.timer).diff(time) <= 0) {
            t.change_active(false);
            document.querySelector("#sound-file").play();
            alert(`[${t.title}] :経過`);
          }
        }
      });
    }
  }
  tasks.subscribe((ts) => {
    activeTasks = [];
    passiveTasks = [];
    if (ts) {
      Object.values(ts).forEach((t) => {
        if (t.active) {
          activeTasks.push(t);
        } else {
          passiveTasks.push(t);
        }
      });
    }
  });
  onMount(() => {
    const interval = setInterval(() => {
      time = dayjs();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });
  function handleInputKeyword(e) {
    if (e.data === " ") {
      const kws = $userInput.keyword.split(" ");
      const ukw = kws.filter((v, i, a) => a.indexOf(v) === i).join(" ");
      userInput.set({
        ...$userInput,
        keyword: ukw,
      });
    }
  }
</script>

<div class="container-fluid">
  <audio id="sound-file" preload="auto">
    <source src="/Onmtp-Ding04-1.mp3" type="audio/mp3" />
    <track
      kind="captions"
      label="English captions"
      src=""
      srclang="en"
      default
    />
  </audio>
  <div class="container-fluid">
    <div>
      <button class="btn btn-primary m-3" on:click={() => handleSaveTasks()}>
        SaveTasks
      </button>
    </div>
    <TaskAdd />
    <Keywords />
  </div>
  <div class="row">
    <div class="col-md-6 col-xs-12">
      <TaskList tks={activeTasks} title="アクティブタスクリスト" />
    </div>
    <div class="col-md-6 col-xs-12">
      <TaskList tks={passiveTasks} title="パッシブタスクリスト" />
    </div>
  </div>
</div>

<svelte:head>
  <title>{title}</title>
  <link href="/bootstrap.min.css" rel="stylesheet" defer />
  <script src="/bootstrap.bundle.min.js" defer></script>
</svelte:head>
