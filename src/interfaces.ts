export type generator0<T> = () => Generator<T>;

export interface IIntake {
    time: string;
    pills: number;
}

export type frequencies = 'daily' | 'eachOtherDay' | 'weekly';
export type weekDaysSignature = (dayIndex: number) =>
    (daysGenerator: (index: number) => () => string) =>
        (valueGen: () => () => boolean) => IWeekDays;

export interface IWeekDays {
    [key: string]: boolean;

    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
}
