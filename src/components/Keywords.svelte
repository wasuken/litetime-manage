<script>
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc.js";
  import {userInput, tasks} from "../stores/tasks.js";
  dayjs.extend(utc);

  let keys = [];

  tasks.subscribe((ts) => {
	keys = ts
	  .reduce((acm, t) => [...acm, ...t.keyword.replace(/\s+/g, ' ').split(' ')], [])
	  .filter((v, i, a) => a.indexOf(v) === i && v.trim().length > 0);
  });
</script>

<div>
  <button class="btn btn-primary m-3"
		  data-bs-toggle="collapse"
		  data-bs-target="#collapseKeywords"
		  aria-expanded="false"
		  aria-controls="collapseKeywords">
	キーワード操作
  </button>
  <div class="collapse container-fluid shadow p-3 mb-5 bg-body rounded" id="collapseKeywords">
	{#if keys.length > 0}
	  {#each keys as w, i}
		<div class="form-check form-check-inline">
		  <input id={`check-${i}`} class="form-check-input" type="checkbox" value="" />
		  <label class="form-check-label" for={`check-${i}`}>
			{w}
		  </label>
		</div>
	  {/each}
	{/if}
	<hr/>
	<button class="btn btn-primary">
	  Activate
	</button>
	<button class="btn btn-secondary">
	  Passivate
	</button>
	<button class="btn btn-danger">
	  Remove
	</button>
  </div>

</div>
