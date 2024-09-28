import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { ProjectTask } from '../models/projectTask.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private readonly tasksSubject = new BehaviorSubject<ProjectTask[]>([]);
    public tasks$ = this.tasksSubject.asObservable();
    public cancelForm$ = new Subject<void>();

    get(id: number): Observable<ProjectTask | undefined> {
        const currentTasks = this.tasksSubject.getValue();
        return of(currentTasks.find(task => id === task.id));
    }

    create(newTask: ProjectTask): Observable<boolean> {
        const currentTasks = this.tasksSubject.getValue();
        this.tasksSubject.next([...currentTasks, newTask]);
        return of(true);
    }

    update(id: number, updatedtask: ProjectTask): Observable<boolean> {
        return this.updateProjectTaskById(id, updatedtask);
    }

    delete(ids: number[]): Observable<ProjectTask[]> {
        this.deleteProjectTaskById(ids);
        return this.tasksSubject.asObservable();
    }

    private updateProjectTaskById(id: number, updatedFields: ProjectTask): Observable<boolean> {
        const currentTasks = this.tasksSubject.getValue();
        const task = currentTasks.find(task => task.id === id);

        if (task) {
            Object.assign(task, updatedFields);
            return of(true);
        }
        return of(false);
    }

    private deleteProjectTaskById(ids: number[]): void {
        const currentTasks = this.tasksSubject.getValue();
        const filteredTasks = currentTasks.filter(task => !ids.includes(task.id!));
        this.tasksSubject.next(filteredTasks);
    }
}