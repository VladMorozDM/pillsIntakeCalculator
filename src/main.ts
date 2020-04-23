import { frequencies, IIntake, IWeekDays } from './interfaces';
import { createDays, getWeekDays } from './core/days';
import { myIntakes } from './core/constants';
import { calculateFp } from './core/fpSolution';
import { calculateFT } from './core/firstTry';

const calculate = calculateFp;

// this function returns a string, because string looks nicer in a console,
// you can change it in a calculateFp function
function calculateIntakeEndDate(intakes: IIntake[], stock: number,
                                frequencies: frequencies, weekDays?: IWeekDays): string | Date {
    const isWeekDaysAllFalse = weekDays && Object.values(weekDays).every(isActive => !isActive);

    if (stock <= 0) {
        throw new Error('[calculateIntakeEndDate]: Stock must be greater than 0');
    }

    if (weekDays && frequencies !== 'weekly') {
        throw new Error('[calculateIntakeEndDate]: You can\'t specify weekDays argument for non "weekly" frequency');
    }

    if (isWeekDaysAllFalse) {
        throw new Error('[calculateIntakeEndDate]: you should specify at least one day as true');
    }

    const generatedWeekDays = weekDays || getWeekDays(frequencies);

    return calculate(intakes, stock, generatedWeekDays);
}

console.log('-------------------------------------------------------');
console.log(calculateIntakeEndDate(myIntakes, 1, 'daily'));
console.log('-------------------------------------------------------');
console.log(calculateIntakeEndDate(myIntakes, 10, 'eachOtherDay'));
console.log('-------------------------------------------------------');
console.log(calculateIntakeEndDate(myIntakes, 6, 'eachOtherDay'));
console.log('-------------------------------------------------------');
console.log(calculateIntakeEndDate(myIntakes, 10, 'daily'));
console.log('-------------------------------------------------------');
console.log(
    calculateIntakeEndDate(myIntakes, 10, 'weekly', createDays([1,0,1,0,0,0,1]))
);
console.log('-------------------------------------------------------');
console.log(
    calculateIntakeEndDate(myIntakes, 10, 'weekly', createDays([1,0,1,0,0,0,1]))
);
console.log('-------------------------------------------------------');
console.log(
    calculateIntakeEndDate(myIntakes, 10, 'weekly', createDays([1,0,0,0,0,0,0]))
);
console.log('-------------------------------------------------------');

console.log(createDays([1,0,1,0,1,0,1]));