<script>
  import TaskList from "../components/TaskList.svelte";
  import Keywords from "../components/Keywords.svelte";
  import TaskAdd from "../components/TaskAdd.svelte";
  import {userInput, tasks} from "../stores/tasks.js";

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
  tasks.subscribe((ts) => {
	function removeF(ind) {
      return () => {
		let nTasks = [...$tasks];
		nTasks.splice(ind, 1);
		tasks.set(nTasks);
	  }
	}
	function activeF(ind) {
      return (bl) => {
		let nTasks = [...$tasks];
		if (dayjs(nTasks[ind].timer).diff(dayjs()) <= 0) {
		  nTasks[ind].timer = dayjs().add("5", "m");
		}
		nTasks[ind].active = bl;
		tasks.set(nTasks);
	  };
	}
	function editF(ind) {
      return () => {
		const rTask = $tasks[ind];
		removeF(ind)();
		userInput.set({...rTask});
	  }
	}
	function duplicateF(ind){
	  return () => {
		let nTasks = [...$tasks];
		nTasks.push({...$tasks[ind]});
		tasks.set(nTasks);
	  }
	}
	activeTasks = [];
	passiveTasks = [];
	ts.forEach((t, i) => {
	  let tt = {
		...t,
		remove: removeF(i),
		edit: editF(i),
		change_active: activeF(i),
		duplicate: duplicateF(i),
	  }
	  if(tt.active){
		activeTasks.push(tt);
	  }else{
		passiveTasks.push(tt);
	  }
	});
  });

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
  onMount(() => {
    const interval = setInterval(() => {
      time = dayjs();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });
  function add() {
	if(!isDateTimeLocal){
	  userInput.set({
		...$userInput,
		timer: dayjs()
		  .add($userInput.timer_display.min, 'm')
		  .add($userInput.timer_display.sec, 's')
		  .add($userInput.timer_display.hour, 'h'),
	  });
	}
	let nTasks = [...$tasks];
    nTasks.push({...$userInput});
    tasks.set(nTasks);
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
  }
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
