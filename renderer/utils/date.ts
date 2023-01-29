/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
export const getMonthName = (date: Date) => {
  const month = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const getMonth = date.getMonth();

  return month[getMonth];
};

export const getMonthName2 = (month: number) => {
  const monthData = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  return monthData[month];
};

export const getMonthNameShort = (date: Date) => {
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Ags',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  const getMonth = date.getMonth();

  return month[getMonth];
};

export const getMonthNameShort2 = (month: number) => {
  const monthData = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Ags',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  return monthData[month];
};

export const dateIndonesiaFormat = (date: Date) => {
  const bulan = getMonthName(date);
  const tanggal = date.getDate();
  const tahun = date.getFullYear();

  return `${tanggal} ${bulan} ${tahun}`;
};

export const dateIndonesiaFormat2 = (date: Date) => {
  const bulan = getMonthNameShort(date);
  const tanggal = date.getDate();
  const tahun = date.getFullYear();

  return `${tanggal} ${bulan} ${tahun}`;
};

export const dateIndonesiaFormatPengajuan = (date: Date) => {
  const bulan = getMonthName(date);
  const tanggal = date.getDate();

  return `${tanggal} ${bulan}`;
};

export const formatDate = (date: any) => {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) {
    month = `0${month}`;
  }
  if (day.length < 2) {
    day = `0${day}`;
  }

  return [year, month, day].join('-');
};

export const formatRangeDate = (startDate: any, endDate: any) => {
  let dayStart = `${startDate.getDate()}`;
  let monthStart = `${startDate.getMonth() + 1}`;

  let dayEnd = `${endDate.getDate()}`;
  let monthEnd = `${endDate.getMonth() + 1}`;

  if (monthStart.length < 2) {
    monthStart = `0${monthStart}`;
  }
  if (dayStart.length < 2) {
    dayStart = `0${dayStart}`;
  }

  if (monthEnd.length < 2) {
    monthEnd = `0${monthEnd}`;
  }
  if (dayEnd.length < 2) {
    dayEnd = `0${dayEnd}`;
  }

  return `${dayStart} ${getMonthNameShort(
    startDate
  )} - ${dayEnd}  ${getMonthNameShort(endDate)} ${startDate.getFullYear()}`;
};

export const generateRangeYear = (startYear?: number) => {
  const currentYear = new Date().getFullYear() + 1;
  const years = [];

  startYear = startYear || 1990;

  while (startYear <= currentYear) {
    years.push(startYear + 1);
  }

  return years;
};

export const getPeriodeDate = () => {
  const month = new Date();
  const nextMonth = new Date();

  if (month.getDate() < 21) {
    month.setMonth(month.getMonth() - 1);
  } else {
    nextMonth.setMonth(nextMonth.getMonth() + 1);
  }

  return `21 ${getMonthNameShort(month)} - 20 ${getMonthNameShort(
    nextMonth
  )} ${month.getFullYear()}`;
};

export function timeNow() {
  const d = new Date();
  const h = (d.getHours() < 10 ? '0' : '') + d.getHours();
  const m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();

  return `${h}:${m}`;
}

export function getTime(time: string) {
  const dateNow = formatDate(new Date());

  const [year, month, day] = dateNow.split('-');
  const [hours, minutes, seconds] = time.split(':');

  const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);

  return date;

  // var d = new Date(`${dateNow} ${time}`),
  //   h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
  //   m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(),
  //   s = (d.getMilliseconds() < 10 ? '0' : '') + d.getMilliseconds();

  // return h + ':' + m + ':' + s;
}

export function parseGetTime(tanggal: Date) {
  const d = tanggal;
  const h = (d.getHours() < 10 ? '0' : '') + d.getHours();
  const m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  const s = (d.getMilliseconds() < 10 ? '0' : '') + d.getMilliseconds();

  return `${h}:${m}:${s}`;
}
