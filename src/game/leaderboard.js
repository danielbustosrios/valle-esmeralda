const text=value=>String(value||'').trim().toLocaleLowerCase('es');

export function completedLevelsFromPercent(percent,totalLevels=63){
  const safeTotal=Math.max(0,Number(totalLevels)||0),safePercent=Math.min(100,Math.max(0,Number(percent)||0));
  return Math.min(safeTotal,Math.ceil(safePercent*safeTotal/100));
}

export function sortLeaderboard(rows=[]){
  return [...rows].sort((a,b)=>Number(b.completion_percent||0)-Number(a.completion_percent||0)||text(a.first_name).localeCompare(text(b.first_name),'es')||text(a.last_initial).localeCompare(text(b.last_initial),'es')||text(a.course).localeCompare(text(b.course),'es'));
}

export function isCurrentStudent(row,user){
  return text(row.first_name)===text(user?.firstName)&&text(row.last_initial).replace('.','')===text(user?.lastName).slice(0,1)&&text(row.course)===text(user?.course);
}

export function currentStudentRank(rows,user){
  const index=rows.findIndex(row=>isCurrentStudent(row,user));
  if(index<0)return null;
  const progress=Number(rows[index].completion_percent||0);
  return 1+rows.filter(row=>Number(row.completion_percent||0)>progress).length;
}

export function displayedRank(rows,index){
  if(index<0||index>=rows.length)return null;
  const progress=Number(rows[index].completion_percent||0);
  return 1+rows.filter(row=>Number(row.completion_percent||0)>progress).length;
}

