<script>
  import Tasks from "../components/TaskList.svelte";
  import {userInput, tasks, activeTasks} from "../stores/tasks.js";
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
		  document.querySelector('#sound-file').play();
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
	if(!isDateTimeLocal){
	  userInput.set({
		...$userInput,
		timer: dayjs()
		  .add(minSec.min, 'm')
		  .add(minSec.sec, 's')
		  .add(minSec.hour, 'h'),
	  });
	}
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
  <audio id="sound-file" preload="auto">
	<source src="/Onmtp-Ding04-1.mp3" type="audio/mp3">
  </audio>
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

		{#if isDateTimeLocal}
		  <span class="input-group-text" id="input-timer"> 時間 </span>
		  <input
			id="input-timer"
			class="form-control"
			type="datetime-local"
			bind:value={$userInput.timer}
			/>
		  {:else}
		  <span class="input-group-text" id="input-hour"> 時間 </span>
		  <input
			id="input-hour"
			class="form-control"
			type="number"
			min="0"
			max="24"
			bind:value={minSec.hour}
			/>
		  <span class="input-group-text" id="input-min"> 分 </span>
		  <input
			id="input-min"
			class="form-control"
			type="number"
			min="0"
			max="59"
			bind:value={minSec.min}
			/>
		  <span class="input-group-text" id="input-sec"> 秒 </span>
		  <input
			id="input-sec"
			class="form-control"
			type="number"
			min="0"
			max="59"
			bind:value={minSec.sec}
			/>
		  {/if}
      </div>
    </div>
    <div class="col-md-6 col-xs-12">
      <div class="input-group mb-3">
        <div class="p-2">
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
		<div class="p-2">
		  <span class="form-check-label" id="input-min-sec">
			{isDateTimeLocal ? '時間指定' : '分秒指定'}
          </span>
          <input
			id="input-min-sec"
			class="form-check-input"
			type="checkbox"
			bind:checked={isDateTimeLocal}
			/>
		</div>
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
