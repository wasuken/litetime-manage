import { userInput, tasks } from "./stores/tasks.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);

function randomstr(length) {
  let s = "";
  length = length || 32;
  for (let i = 0; i < length; i++) {
    const random = (Math.random() * 16) | 0;
    s += (i == 12 ? 4 : i == 16 ? (random & 3) | 8 : random).toString(16);
  }

  return s;
}
export function genUKey() {
  return randomstr(30);
}

export function removeF(ind) {
  return () => {
    tasks.update((ts) => {
      let tts = { ...ts };
      console.log(tts);
      delete tts[ind];
      return tts;
    });
  };
}
export function activeF(ind) {
  return (bl) => {
    tasks.update((ts) => {
      let tts = { ...ts };
      if (dayjs(ts[ind].timer).diff(dayjs()) <= 0) {
        tts[ind].timer = dayjs().add("5", "m");
      }
      const df = tts[ind].timer.diff(dayjs(), "s");
      const h = parseInt(df / 60 / 60);
      const m = parseInt((df - h * 60 * 60) / 60);
      const s = parseInt(df - (h * 60 * 60 + m * 60));
      tts[ind].timer_display = {
        hour: h,
        min: m,
        sec: s,
      };

      if (bl) {
        const sec_df = dayjs().diff(tts[ind].passived_timer, "s");
        const b_timer = tts[ind].timer.add(sec_df, "s");
        tts[ind].timer = b_timer;
      } else {
        tts[ind].passived_timer = dayjs();
      }
      tts[ind].active = bl;
      return tts;
    });
  };
}
export function editF(ind) {
  return () => {
    // 編集時、追加画面を開く。
    // こんな感じの処理が多くなってきたら
    // Hookみたいな感じで分ける。
    const colps = document.querySelector('#collapseInput');
    colps.classList.add("show");
    tasks.update((ts) => {
      let t = {
        ...ts[ind],
        checkListText: ts[ind].checkList.map((c) => c.text).join(" "),
      };
      delete t["checkList"];
      userInput.set({ ...t });
      let tts = { ...ts };
      delete tts[ind];
      return tts;
    });
  };
}
export function duplicateF(ind) {
  return () => {
    tasks.update((ts) => {
      const k = genUKey();
      let tts = { ...ts };
      tts[k] = {
        ...ts[ind],
        remove: removeF(k),
        edit: editF(k),
        change_active: activeF(k),
        duplicate: duplicateF(k),
        changeCheck: changeCheckF(k),
      };
      return tts;
    });
  };
}

export function changeCheckF(ind) {
  return (i, b) => {
    tasks.update((ts) => {
      let tts = { ...ts };
      tts[ind].checkList[i].checked = b;
      return tts;
    });
  };
}
