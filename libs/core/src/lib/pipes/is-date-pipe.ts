import { Pipe, PipeTransform } from '@angular/core';

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
