import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterTreatmentsBasedToothNumber'
})
export class FilterTreatmentsBasedToothNumberPipe implements PipeTransform {

    transform(items: any[], toothNumber: number): any[] {
        if (!items || !toothNumber) {
            return items;
        }
        return items.filter(item => item.pObject.some((a: any) => a.tN == toothNumber || (a.tooths && a.tooths.some((s: any) => s == toothNumber))));
    }
}
