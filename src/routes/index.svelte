<script>
  import TaskList from "../components/TaskList.svelte";
  import Keywords from "../components/Keywords.svelte";
  import TaskAdd from "../components/TaskAdd.svelte";
  import {userInput, tasks, saveTasks} from "../stores/tasks.js";

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
  });
  let activeTasks = [];
  let passiveTasks = [];

  function handleSaveTasks(){
	localStorage.setItem('tasks', JSON.stringify($tasks));
  }

  onMount(
	() => {
	  let storedTasks = [];
	  try{
		let ts = localStorage.getItem('tasks');
		if(!ts){
		  ts = '[]';
		}
		storedTasks = JSON.parse(localStorage.getItem('tasks'));
	  }catch(e){
		console.log(e);
		storedTasks = [];
	  }
	  tasks.set(storedTasks);
	}
  )

  const title = "タスクアラート";
  $: {
	let tks = [...$tasks];
    $tasks.forEach((x, i) => {
      if (x.active === true) {
        if (dayjs(x.timer).diff(time) <= 0) {
		  tks[i] = {...x, active: false};
		  document.querySelector('#sound-file').play();
          alert(`[${x.title}] :経過`);
        }
      }
    });
    tasks.set(tks);
  }
  tasks.subscribe((ts) => {
	activeTasks = [];
	passiveTasks = [];
	ts.forEach((t, i) => {
	  if(t.active){
		activeTasks.push(t);
	  }else{
		passiveTasks.push(t);
	  }
	});
  });
  onMount(() => {
    const interval = setInterval(() => {
      time = dayjs();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });
  function handleInputKeyword(e){
	if(e.data === " "){
	  const kws = $userInput.keyword.split(' ');
	  const ukw = kws.filter((v, i, a) => a.indexOf(v) === i).join(' ');
	  userInput.set({
		...$userInput,
		keyword: ukw,
      });
	}
  }
</script>

<div class="container-fluid">
  <audio id="sound-file" preload="auto">
	<source src="/Onmtp-Ding04-1.mp3" type="audio/mp3">
	  <track kind="captions" label="English captions" src="" srclang="en" default>
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
      <TaskList
        tks={activeTasks}
        title="アクティブタスクリスト"
		/>
    </div>
    <div class="col-md-6 col-xs-12">
      <TaskList
        tks={passiveTasks}
        title="パッシブタスクリスト"
		/>
    </div>
  </div>
</div>

<svelte:head>
  <title>{title}</title>
  <link href="/bootstrap.min.css" rel="stylesheet" defer />
  <script src="/bootstrap.bundle.min.js" defer></script>
  </svelte:head>
