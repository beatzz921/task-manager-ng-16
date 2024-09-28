import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TaskComponent } from "./task.component";
import { TaskFormComponent } from "./task-form/task-form.component";

const routes: Routes = [

    {
        path: 'task', component: TaskComponent,
        children: [
            { path: 'new', component: TaskFormComponent },
            { path: ':id/edit', component: TaskFormComponent }
        ],
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaskRoutingModule { }