import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskTableComponent } from './task-list/task-table/task-table.component';
import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task.component';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { SearchComponent } from '../search/search.component';

@NgModule({
  declarations: [
    TaskComponent,
    TaskListComponent,
    TaskFormComponent,
    TaskTableComponent,
    SearchComponent,
    SearchPipe
    
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})

export class TaskModule { }
