import { IWeekDays, frequencies, weekDaysSignature } from '../interfaces';
import { createNextToggle, createNextTrue, createNextWeekDay } from './utilities';

// it just works
const weekDays: weekDaysSignature = dayIndex => daysGenerator => valueGen => {
    const nextWeekDay = daysGenerator(dayIndex);
    const nextValue = valueGen();

    return Array.from({length: 7}, () => ({[nextWeekDay()]: nextValue()}))
        .reduce<IWeekDays>((daysObject, day) => ({...daysObject, ...day}), {} as IWeekDays)
}

export const getWeekDays = (frequencies: frequencies): IWeekDays => {
    const dayOfTheWeekIndex = new Date().getDay() - 1;
    const daysGeneratorCurried = weekDays(dayOfTheWeekIndex)(createNextWeekDay);
    const daily = daysGeneratorCurried(createNextTrue);
    const eachOtherDay = daysGeneratorCurried(createNextToggle);

    switch (frequencies) {
        case 'daily':
            return daily;
        case 'eachOtherDay':
            return eachOtherDay;
    }
}

export const createDays = (valuesForDays: Array<0 | 1>): IWeekDays => {
    const nextWeekDay = createNextWeekDay(0);
    return valuesForDays.map(value => ({[nextWeekDay()]: Boolean(value)}))
        .reduce<IWeekDays>((daysObject, day) => ({...daysObject, ...day}), {} as IWeekDays)
}
