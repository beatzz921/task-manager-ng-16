import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ProjectTask } from 'src/app/models/projectTask.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {

  private unsuscribe$ = new Subject<void>();
  public clicked: ProjectTask[] = [];
  public ids: number[] = [];
  public items: ProjectTask[] = [];
  public loading = true;

  constructor(
    private taskService: TaskService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.onGetItems();
    this.onFormCancel();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
  }

  onGetItems(): void {
    this.taskService.tasks$
      .pipe(
        takeUntil(this.unsuscribe$),
        tap((response: any) => {
          this.items = response;
        })
      ).subscribe();

    this.loading = false;
    this.clicked = [];
  }

  onNew(): void {
    this.route.navigate(['new'], { relativeTo: this.activatedRoute });
  }

  onEdit(): void {
    this.route.navigate(['./', this.clicked[0].id, 'edit'], { relativeTo: this.activatedRoute });
  }

  onDelete(): void {
    this.pushIds();
    this.loading = true;
    this.taskService.delete(this.ids)
      .pipe(
        switchMap(() => this.taskService.tasks$),
        tap((response: any) => {
          this.items = response;
        })
      )
      .subscribe(() => {
        this.loading = false;
        this.clicked = [];
      });
  }


  onFormCancel(): void {
    this.taskService.cancelForm$
      .pipe(
        takeUntil(this.unsuscribe$),
        tap(() => {
          this.clicked = [];
        })
      ).subscribe();
  }

  pushIds(): void {
    this.clicked.forEach(item => {
      this.ids.push(item.id as number);
    });
  }
}
