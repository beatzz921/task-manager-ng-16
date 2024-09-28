import { Component, Input, OnInit } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/animations/animations';
import { ProjectTask } from 'src/app/models/projectTask.model';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css'],
  animations: [fadeInOutAnimation]
})
export class TaskTableComponent implements OnInit {
  public columns: string[] = [
    'Name',
    'Expiration Date',
    'Status',
    'Task Full Info.'
  ];
  public emptyMessage = "There are no results";
  public hovered: ProjectTask[] = [];
  public searchValue: string = '';

  @Input() clicked: ProjectTask[] = [];
  @Input() displayedItems: ProjectTask[] = [];

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.searchService.searchChanged$
      .subscribe((value) => {
        this.searchValue = value;
      })
  }
  
  onBlur(): void {
    this.hovered = [];
  }

  onClick(item: ProjectTask): void {
    if (!this.clicked.includes(item)) {
      this.clicked.push(item);
    } else {
      let index = this.clicked.indexOf(item);
      this.clicked.splice(index, 1);
    }
  }

  onHover(item: ProjectTask): void {
    this.hovered.push(item);
  }
}
