import {
    ifElseDoNothing,
    pipe,
    provideDayStateProvider,
    createNextWeekDay,
} from './utilities';
import {
    generator0,
    IIntake,
    IWeekDays,
} from '../interfaces';

// this function checks time of intakes and passed dates, it makes sense to use this function for a first day
const subtractTheFirstDay = (date: Date) => (intakes: IIntake[]) => (stock: number): number => {
    const timeInMinutesNow = date.getHours() * 60 + date.getMinutes();
    const pillsForTheFirstDay = intakes.reduce<number>((pillsSum, {pills, time}) => {
        const [hours, minutes] = time.split(':').map(timePart => parseInt(timePart))
        const timeInMinutes = hours * 60 + minutes;

        return timeInMinutesNow <= timeInMinutes
            ? pillsSum + pills
            : pillsSum;
    }, 0);

    return stock - pillsForTheFirstDay;
};

// this function does most of the work, it starts to iterate weekDays from a given index and
// subtracts daily sum of pills
const calculateDays = (createProvider: generator0<boolean>) => (intakes: IIntake[]) => (stock: number) => {
    const pillDaysStates = createProvider();
    const pillsPerDay = intakes.reduce((pillsSum, {pills}) => pillsSum + pills, 0);
    let pillsInStock = stock;
    let daysOnPills = 0;

    while (pillsInStock > 0) {
        daysOnPills = stock > 0 ? daysOnPills + 1 : daysOnPills;

        if (pillDaysStates.next().value) {
            pillsInStock -= pillsPerDay;
        }
    }

    return daysOnPills;
}

// no much to say abot this function, it receives date and a amount of days and returns new Date object
const getDate = (date: Date) => (days: number) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
};

export function calculateFp(intakes: IIntake[], stock: number, weekDays: IWeekDays): string | Date {
    const date = new Date();
    const carriedGetDate = getDate(date);
    const dayOfTheWeekNumber = date.getDay();
    const dayStateProvider = provideDayStateProvider(dayOfTheWeekNumber, weekDays);
    const currentDay = createNextWeekDay(dayOfTheWeekNumber - 1)();

    const carriedMinusFirstDayCalculation = subtractTheFirstDay(date)(intakes);
    const carriedDaysCalculation = calculateDays(dayStateProvider)(intakes);

    const isSubtractingFirstDay = weekDays[currentDay];
    // this is for the 'weekly' frequency, if today were a monday and {monday: false},
    // function wouldn't subtract pills for the first day
    const subtractOrNot = ifElseDoNothing(carriedMinusFirstDayCalculation)(isSubtractingFirstDay)

    const calculateDate = pipe(
        subtractOrNot,
        carriedDaysCalculation,
        carriedGetDate
    );

    const intakeEndDate = calculateDate(stock)
    //  remove quotes so function returns a Date object
    return `${intakeEndDate}`;
}
