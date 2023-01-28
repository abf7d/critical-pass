import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to return true if the number is NaN
 */
@Pipe({
    name: 'isNaN',
})
export class IsNaNPipe implements PipeTransform {
    transform(item: number): boolean {
        return isNaN(item);
    }
}

/**
 * Pipe to return true if the number is NOT NaN
 */
@Pipe({
    name: 'isNotNaN',
})
export class IsNotNaNPipe implements PipeTransform {
    transform(item: number | Date): boolean {
        if (item instanceof Date) {
            return false;
        }
        return !isNaN(item);
    }
}

/**
 * Pipe to return true if the number is NOT NaN
 */
@Pipe({
    name: 'isDate',
})
export class IsDatePipe implements PipeTransform {
    transform(item: number | Date): boolean {
        if (item instanceof Date) {
            return true;
        }
        return false;
    }
}
