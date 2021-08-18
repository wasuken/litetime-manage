import {userInput, tasks} from './stores/tasks.js';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);

function randomstr(length) {
  let s = "";
  length = length || 32;
  for (let i = 0; i < length; i++) {
    const random = Math.random() * 16 | 0;
    s += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }

  return s;
}
export function genUKey(){
  return randomstr(30);
}

export function removeF(ind) {
  return () => {
	tasks.update((ts) => {
	  let tts = {...ts};
	  console.log(tts);
	  delete tts[ind];
	  return tts;
	})
  }
}
export function activeF(ind) {
  return (bl) => {
	tasks.update((ts) => {
	  let tts = {...ts};
	  if(dayjs(ts[ind].timer).diff(dayjs()) <= 0){
		tts[ind].timer = dayjs().add('5', 'm');
	  }
	  tts[ind].active = bl;
	  return tts;
	})
  };
}
export function editF(ind) {
  return () => {
	tasks.update((ts) => {
	  console.log(ts);
	  let t = {
		...ts[ind],
		checkListText: ts[ind].checkList.map((c) => c.text).join(' ')
	  }
	  delete t['checkList'];
	  userInput.set({...t});
	  let tts = {...ts};
	  delete tts[ind];
	  return tts;
	})
  }
}
export function duplicateF(ind){
  return () => {
	tasks.update((ts) => {
	  const k = genUKey();
	  let tts = {...ts};
	  tts[k] = {
		...ts[ind],
		remove: removeF(k),
        edit: editF(k),
        change_active: activeF(k),
        duplicate: duplicateF(k),
		changeCheck: changeCheckF(k),
	  };
	  return tts;
	})
  }
}

export function changeCheckF(ind){
  return (i, b) => {
	tasks.update((ts) => {
	  let tts = {...ts};
	  tts[ind].checkList[i].checked = b;
	  return tts;
	})
  }
}
