import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'search'
})

export class SearchPipe implements PipeTransform {

    transform(listData: any, search: string, completedProperty: any): any {
        if (search === '') {
            return listData;
        } else {
            let results: any = [];
            for (let data of listData) {
                if (
                    data[completedProperty].toLowerCase().includes(search.toLowerCase())
                ) {
                    results.push(data);
                }
            }
            return results;
        }
    }
}