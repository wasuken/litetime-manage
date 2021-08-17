<script>
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc.js";
  import {userInput, tasks} from "../stores/tasks.js";
  dayjs.extend(utc);

  let keys = [];
  let checks = [];
  let tks = [];
  checks = new Array($tasks.length);
  checks.forEach((x, i) => (checks[i] = false));

  tasks.subscribe((ts) => {
    keys = Object.values(ts || {})
      .reduce(
        (acm, t) => [...acm, ...t.keyword.replace(/\s+/g, " ").split(" ")],
        [],
      )
      .filter((v, i, a) => a.indexOf(v) === i && v.trim().length > 0);
    if (keys.length > checks.length) {
      checks = new Array(keys.length);
      checks.forEach((x, i) => (checks[i] = false));
      tks = [];
    }
  });
  $: {
    checks;
    tks = hasCheckKeysTasks();
  }
  function hasCheckKeysTasks() {
    const enKeys = checks
      .map((x, i) => [keys[i], x])
      .filter((x) => {
        const [k, v] = x;
        return v;
      })
      .map((x) => x[0]);
    return Object.values($tasks).filter((t) =>
      keyExistsSearch(t.keyword.split(" "), enKeys),
    );
  }
  function allKeysExistsSearch(a, keys) {
    let existsKeys = new Set();
    a.forEach((x) => {
      if (ks.includes(x)) {
        existsKeys.add(x);
      }
    });
    return existsKeys.size === keys.length;
  }
  function keyExistsSearch(a, ks) {
    let existsKeys = new Set();
    a.forEach((x) => {
      if (ks.includes(x)) {
        existsKeys.add(x);
      }
    });
    return existsKeys.size > 0;
  }
  function activeHasCheckKeys() {
    tks
      .filter((t) => keyExistsSearch(t.keyword.split(" "), keys))
      .forEach((t) => t.change_active(!t.active));
    checks = checks.map((x) => false);
  }
  function removeHasCheckKeys() {
    tks
      .filter((t) => keyExistsSearch(t.keyword.split(" "), keys))
      .forEach((t) => t.remove());
    checks = checks.map((x) => false);
  }
</script>

<div>
  <button
    class="btn btn-primary m-3"
    data-bs-toggle="collapse"
    data-bs-target="#collapseKeywords"
    aria-expanded="false"
    aria-controls="collapseKeywords"
  >
    キーワード操作
  </button>
  <div
    class="collapse container-fluid shadow p-3 mb-5 bg-body rounded"
    id="collapseKeywords"
  >
    {#if keys.length > 0}
      {#each keys as w, i}
        <div class="form-check form-check-inline">
          <input
            id={`check-${i}`}
            class="form-check-input"
            type="checkbox"
            value=""
            bind:checked={checks[i]}
          />
          <label class="form-check-label" for={`check-${i}`}>
            {w}
          </label>
        </div>
      {/each}
    {/if}
    <hr />
    <ul class="list-group">
      {#each tks as t}
        <li class="list-group-item">
          {t.title}
        </li>
      {/each}
    </ul>
    <hr />
    <button class="btn btn-primary" on:click={() => activeHasCheckKeys(true)}>
      Activate
    </button>
    <button class="btn btn-secondary" on:click={() => activeHasCheckKeys(true)}>
      Passivate
    </button>
    <button class="btn btn-danger" on:click={() => removeHasCheckKeys(true)}>
      Remove
    </button>
  </div>
</div>
