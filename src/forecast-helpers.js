export function separateDays(data) {
  const dayList = [];
  for(let i = 0; i < data.list.length; i+=8) {
    dayList.push(data.list.slice(i, i+8));
  }
  return dayList;
}

export function createDayObject(dayData) {
  const temps = dayData.map(section => parseFloat(section.main.temp));
  return {
    date: dayData[4].dt_txt,
    high: Math.max(...temps),
    low: Math.min(...temps),
    condition: dayData[4].weather[0].main
  }
}

export function fToC(temp) {
  return Math.round((temp - 32)*(5/9));
}