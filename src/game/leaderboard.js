const text=value=>String(value||'').trim().toLocaleLowerCase('es');

export function sortLeaderboard(rows=[]){
  return [...rows].sort((a,b)=>Number(b.completion_percent||0)-Number(a.completion_percent||0)||Number(a.total_errors||0)-Number(b.total_errors||0)||Number(a.play_seconds||0)-Number(b.play_seconds||0)||text(a.first_name).localeCompare(text(b.first_name),'es')||text(a.last_initial).localeCompare(text(b.last_initial),'es')||text(a.course).localeCompare(text(b.course),'es'));
}

export function isCurrentStudent(row,user){
  return text(row.first_name)===text(user?.firstName)&&text(row.last_initial).replace('.','')===text(user?.lastName).slice(0,1)&&text(row.course)===text(user?.course);
}

export function currentStudentRank(rows,user){
  const index=rows.findIndex(row=>isCurrentStudent(row,user));
  return index<0?null:index+1;
}

