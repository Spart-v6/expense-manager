const formatWeekly = dateStr => {
    var date = new Date(dateStr);

    var day = date.getUTCDate().toString().padStart(2, '0');
    var month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); 
    var year = date.getUTCFullYear();

    var newDateStr = day + '/' + month + '/' + year;
    return newDateStr;
}

const formatMonthly = dateStr => {
    var date = new Date(dateStr);
    console.log('asdasdsad')
  
    var day = date.getDate().toString().padStart(2, '0');
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    var year = date.getFullYear();
    
    var newDateStr = day + '/' + month + '/' + year;
    
    return newDateStr;
}

const getToday = () => {
    var dateStr = new Date().toLocaleDateString("en", {year:"numeric", day:"2-digit", month:"2-digit"});
    var dateParts = dateStr.split('/');
  
    var [month, day, year] = dateParts;
    
    var newDateStr = day.padStart(2, '0') + '/' + month.padStart(2, '0') + '/' + year;
    
    return newDateStr;
}

const getWeekOfTheYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDayOfYear = new Date(year, 0, 1);
    const daysSinceFirstDayOfYear = Math.floor((today - firstDayOfYear) / (1000 * 60 * 60 * 24));
    const currentWeekNum = Math.floor(daysSinceFirstDayOfYear / 7) + 1;
    
    // To and from Dates of current week
    var curr = new Date;
    var first = curr.getDate() - curr.getDay(); 
    var last = first + 6; 
    
    const fromDate = new Date(curr.setDate(first)).toUTCString();
    const toDate = new Date(curr.setDate(last)).toUTCString();

    return result = {
        currentWeekNum: currentWeekNum,
        fromDate: formatWeekly(fromDate),
        toDate: formatWeekly(toDate)
    }
}

const getMonthOfTheYear = () => {
    const today = new Date();

    const monthName = today.toLocaleString('default', { month: 'long' });

    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const formattedStartDate = startDate.toLocaleString('default', { month: 'short' }) + '. ' + startDate.getDate() + ', ' + startDate.getFullYear();

    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const formattedEndDate = endDate.toLocaleString('default', { month: 'short' }) + '. ' + endDate.getDate() + ', ' + endDate.getFullYear();

    return result = {
        monthName: monthName,
        fromDate: formatMonthly(formattedStartDate),
        toDate: formatMonthly(formattedEndDate)
    }
}

const getCurrentFullYear = () => {
    const today = new Date();

    const year = today.getFullYear();

    const startDate = new Date(year, 0, 1);
    const formattedStartDate = startDate.toLocaleString('default', { month: 'short' }) + '. ' + startDate.getDate() + ', ' + startDate.getFullYear();

    const endDate = new Date(year, 11, 31);
    const formattedEndDate = endDate.toLocaleString('default', { month: 'short' }) + '. ' + endDate.getDate() + ', ' + endDate.getFullYear();

    return result = {
        year: year,
        fromDate: formattedStartDate,
        toDate: formattedEndDate
    }
}

const formattedStartDate = () => {
    const today = new Date();

    const dayOfMonth = today.getDate();

    const monthName = today.toLocaleString('default', { month: 'long' });

    const year = today.getFullYear();

    let suffix = '';
    if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
        suffix = 'st';
    } else if (dayOfMonth === 2 || dayOfMonth === 22) {
        suffix = 'nd';
    } else if (dayOfMonth === 3 || dayOfMonth === 23) {
        suffix = 'rd';
    } else {
        suffix = 'th';
    }

    return dayOfMonth + suffix + ' ' + monthName + ' ' + year;
}


export { getToday, getWeekOfTheYear, getMonthOfTheYear, getCurrentFullYear, formattedStartDate };