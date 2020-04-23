import { IIntake, IWeekDays } from '../interfaces';
import { WEEK_DAYS } from './constants';

export function calculateFT(intakes: IIntake[], stock: number, weekDays: IWeekDays): string {
    const today = new Date();
    const timeInMinutesNow = today.getHours() * 60 + today.getMinutes();
    const pillsForTheFirstDay = intakes.reduce((pillsSum, {pills, time}) => {
        const [hours, minutes] = time.split(':').map(timePart => parseInt(timePart))
        const timeInMinutes = hours * 60 + minutes;

        return timeInMinutesNow <= timeInMinutes
            ? pillsSum + pills
            : pillsSum;
    }, 0);
    const pillsPerDay = intakes.reduce((pillsSum, {pills}) => pillsSum + pills, 0);

    let pillsInStock = stock;
    let daysOnPills = 0;
    let dayOfTheWeekIndex = today.getDay() - 1;
    let dayOfTheWeek = WEEK_DAYS[dayOfTheWeekIndex];

    daysOnPills = pillsInStock > 0 ? 1 : 0

    if (weekDays[dayOfTheWeek]) {
        pillsInStock -= pillsForTheFirstDay;
    }

    dayOfTheWeekIndex = dayOfTheWeekIndex === 6 ? 0 : dayOfTheWeekIndex + 1;

    while (pillsInStock > 0) {
        dayOfTheWeek = WEEK_DAYS[dayOfTheWeekIndex];
        dayOfTheWeekIndex = dayOfTheWeekIndex === 6 ? 0 : dayOfTheWeekIndex + 1;
        daysOnPills = stock > 0 ? daysOnPills + 1 : daysOnPills;

        if (weekDays[dayOfTheWeek]) {
            pillsInStock -= pillsPerDay;
        }
    }

    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysOnPills - 1, 12);
    return `${date}`;
}