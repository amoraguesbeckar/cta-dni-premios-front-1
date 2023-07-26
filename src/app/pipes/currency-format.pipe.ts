import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'currencyFormat'
})
@Injectable()
export class CurrencyFormatPipe implements PipeTransform {
    transform(value: number): string {

        if (isNaN(value) || value === null) {
            return '';
        }

        const parts = value.toFixed(2).split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        const decimalPart = parts[1];

        return `$${integerPart},${decimalPart}`;
    }
}