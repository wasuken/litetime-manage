<script>
  import { userInput, tasks } from "../stores/tasks.js";
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc.js";
  dayjs.extend(utc);
  import { onMount } from "svelte";
  import {
    genUKey,
    removeF,
    activeF,
    editF,
    duplicateF,
    changeCheckF,
  } from "../const.js";

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
  function add() {
    if (!isDateTimeLocal) {
      let ui = {
        ...$userInput,
        timer: dayjs()
          .add($userInput.timer_display.min, "m")
          .add($userInput.timer_display.sec, "s")
          .add($userInput.timer_display.hour, "h"),
      };
      userInput.set(ui);
    }
    tasks.update((ts) => {
      const k = genUKey();
      let tts = { ...ts };
      let chks = [];
      if ($userInput.checkListText.trim() > 0) {
        chks = $userInput.checkListText.split(" ").map((x) => {
          return {
            text: x,
            checked: false,
          };
        });
      }
      tts[k] = {
        ...$userInput,
        remove: removeF(k),
        edit: editF(k),
        change_active: activeF(k),
        duplicate: duplicateF(k),
        changeCheck: changeCheckF(k),
        checkList: chks,
      };
      if (!$userInput.active) {
        tts[k].passived_timer = dayjs();
      }
      delete tts[k]["checkListText"];
      return tts;
    });
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
  }
  function handleInputKeyword(e) {
    if (e.data === " ") {
      const kws = $userInput.keyword
        .split(" ")
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(" ");
      userInput.set({
        ...$userInput,
        keyword: kws,
      });
    }
  }
  function handleInputCheckListText(e) {
    if (e.data === " ") {
      const chks = $userInput.checkListText
        .split(" ")
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(" ");
      userInput.set({
        ...$userInput,
        checkListText: chks,
      });
    }
  }
</script>

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
          bind:value={$userInput.timer_display.hour}
        />
        <span class="input-group-text" id="input-min"> 分 </span>
        <input
          id="input-min"
          class="form-control"
          type="number"
          min="0"
          max="59"
          bind:value={$userInput.timer_display.min}
        />
        <span class="input-group-text" id="input-sec"> 秒 </span>
        <input
          id="input-sec"
          class="form-control"
          type="number"
          min="0"
          max="59"
          bind:value={$userInput.timer_display.sec}
        />
      {/if}
    </div>
  </div>
  <div class="col-md-12 col-xs-12">
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
          {isDateTimeLocal ? "時間指定" : "分秒指定"}
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
  <div class="col-md-6 col-xs-12">
    <div class="input-group mb-3">
      <span class="input-group-text" id="input-keyword"> キーワード </span>
      <input
        id="input-keyword"
        class="form-control"
        type="text"
        bind:value={$userInput.keyword}
        on:input={handleInputKeyword}
      />
    </div>
  </div>
  <div class="col-md-6 col-xs-12">
    <div class="input-group mb-3 fs-5">
      {#if $userInput.keyword.length > 0}
        {#each $userInput.keyword.split(" ") as w}
          <div class="m-1 badge bg-info text-dark">{w}</div>
        {/each}
      {/if}
    </div>
  </div>
  <div class="col-md-6 col-xs-12">
    <div class="input-group mb-3">
      <span class="input-group-text" id="input-check-list-text">
        チェックリスト
      </span>
      <input
        id="input-check-list-text"
        class="form-control"
        type="text"
        bind:value={$userInput.checkListText}
        on:input={handleInputCheckListText}
      />
    </div>
  </div>
  <div class="col-md-6 col-xs-12">
    <div class="input-group mb-3 fs-5">
      {#if $userInput.checkListText.length > 0}
        {#each $userInput.checkListText.split(" ") as chk}
          <div class="m-1 badge bg-info text-dark">{chk}</div>
        {/each}
      {/if}
    </div>
  </div>
  <div class="col-12">
    <div class="input-group mb-3">
      <button class="btn btn-primary" on:click={() => add()}>追加</button>
    </div>
  </div>
</div>
