import { Component } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  public searchInput: string = '';

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }

  searchChanged(changedSearchValue: any): void {
    this.searchService.searchChanged$.next(changedSearchValue);
  }

}
