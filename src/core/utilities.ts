import { WEEK_DAYS } from './constants';
import { generator0, IWeekDays } from '../interfaces';

const weekDays = WEEK_DAYS;
const toggleValues = [true, false];

export function createNextWeekDay(startIndex: number): () => string {
    return createNext<string>(startIndex, weekDays);
}

export function createNextToggle(): () => boolean {
    return createNext<boolean>(0, toggleValues);
}

export function createNextTrue(): () => true {
    return () => true;
}

function createNext<T>(startIndex: number, arrayToIterate: T[]): () => T {
    let currentIndex = startIndex - 1;

    return () => {
        currentIndex = currentIndex === arrayToIterate.length ? 0 : currentIndex + 1;
        return arrayToIterate[currentIndex];
    }
}

function* pillsDayGen(startIndex: number, weekDaysObj: IWeekDays): Generator<boolean> {
    const booleans = weekDays.map((weekDay, index) => weekDaysObj[weekDay]);
    let index = startIndex;

    while (true) {
        yield booleans[index];
        index = index + 1 > 6 ? 0 : index + 1;
    }
}

/*
    That's quite confusing, but this function returns a function that returns a generator
    I done this so I can create few generators with the same arguments. Example:
        const daysObj = {monday: true, tuesday: false, wednesday: false...}
        const provider = provideDayStateProvider(0, daysObj);
        const nextDay1 = provider();
        const nextDay2 = provider();
        console.log(nextDay1.next().value, nextDay2.next().value)
    it prints out [true, true]. I am passing this provide to a function and calling it there,
    so then amount of arguments will be reduced by 1
 */
export const provideDayStateProvider = (startIndex: number, weekDaysObj: IWeekDays): generator0<boolean> => {
    return () => pillsDayGen(startIndex, weekDaysObj);
}

// just a pipe function, nothing unusual, tho I couldn't made a proper signature for it, so all typechecks are gone
const _pipe = (a, b) => (arg) => b(a(arg));
export const pipe = (...ops) => ops.reduce(_pipe);

// this function receives two functions and a condition, depending on the condition it returns
// either positive(true) or backup(false) function
export const ifElse = (positiveOption, backupOption) => (condition: boolean) => condition ? positiveOption : backupOption;
export const ifElseDoNothing = positiveOption => ifElse(positiveOption, value => value);

// this a function for debugging inside a pipe, similar to tap in RxJs
export const tap = sideEffect => pipeValue => {
    sideEffect(pipeValue);
    return pipeValue
}

