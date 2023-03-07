import moment from 'moment';

const getToday = () => {
    const today = moment().format('DD/MM/YYYY');
    const date = moment(today, 'DD/MM/YYYY');
    const formattedStartDate = date.format('Do MMMM YYYY');
    return {
        today: today,
        formattedStartDate: formattedStartDate
    }
}

const getWeekOfTheYear = () => {
    const now = moment();
    const weekNumber = now.week();
    const startOfWeek = now.clone().startOf('week');
    const endOfWeek = now.clone().endOf('week');
    const formattedStartDate = startOfWeek.format('DD/MM/YYYY');
    const formattedEndDate = endOfWeek.format('DD/MM/YYYY');

    return {
        currentWeekNum: weekNumber,
        fromDate: formattedStartDate,
        toDate: formattedEndDate
    }
}

const getMonthOfTheYear = () => {
    const now = moment();
    const monthName = now.format('MMMM');
    const startOfMonth = now.clone().startOf('month');
    const endOfMonth = now.clone().endOf('month');
    const formattedStartDate = startOfMonth.format('DD/MM/YYYY');
    const formattedEndDate = endOfMonth.format('DD/MM/YYYY');

    return {
        monthName: monthName,
        fromDate: formattedStartDate,
        toDate: formattedEndDate
    }
}

const getCurrentFullYear = () => {
    const now = moment();
    const year = now.format('YYYY');
    const startOfYear = now.clone().startOf('year');
    const endOfYear = now.clone().endOf('year');
    const formattedStartDate = startOfYear.format('DD/MM/YYYY');
    const formattedEndDate = endOfYear.format('DD/MM/YYYY');

    return {
        year: year,
        fromDate: formattedStartDate,
        toDate: formattedEndDate
    }
}

export { getToday, getWeekOfTheYear, getMonthOfTheYear, getCurrentFullYear };