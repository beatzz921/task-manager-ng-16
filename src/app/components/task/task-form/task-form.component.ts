import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { fadeInOutAnimation } from 'src/app/animations/animations';
import { ProjectTask } from "src/app/models/projectTask.model";
import { TaskService } from 'src/app/services/task.service';
import { RandomNumberGenerator } from 'src/app/utils/randomNumberGenerator';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  animations: [fadeInOutAnimation],
  providers: [RandomNumberGenerator]
})
export class TaskFormComponent implements OnInit, OnDestroy {

  public editMode = false;
  public form!: FormGroup;
  public item?: ProjectTask;
  public loading = false;
  public title: string;
  public saving = false;
  public selectedItemId?: number;
  public unsuscribe$ = new Subject<void>();
  private taskId!: number;

  constructor(
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private randomNumberGenerator: RandomNumberGenerator
  ) {
    this.title = 'New Task';
  }

  ngOnInit(): void {
    this.onParams();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
  }

  onParams(): void {
    this.activatedRoute.params
      .pipe(
        tap((params: Params) => {
          this.selectedItemId = params['id'] ? +params['id'] : 0;
          this.editMode = params['id'] !== undefined;
          this.onInitFormData();
        })
      ).subscribe();
  }

  onInitFormData(): void {
    this.form = this.buildForm();

    if (this.editMode) {
      this.loading = true;
      this.title = 'Edit Task';
      this.taskService
        .get(this.selectedItemId as number)
        .pipe(
          takeUntil(this.unsuscribe$),
          tap((response: any) => {
            this.item = response as ProjectTask;
            this.loading = false;
            this.setValueForm();
          })
        ).subscribe();
    }
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      name: new FormControl('', Validators.required),
      expirationDate: new FormControl(null, Validators.required),
      persons: this.formBuilder.array([]),
      completed: new FormControl(null)
    });
  }

  addPerson() {
    const personIndex = this.persons.length;
    const persons = this.formBuilder.group({
      fullName: new FormControl('', [Validators.required, Validators.minLength(5), this.fullNameUniqueValidator(personIndex)]),
      age: new FormControl('', [Validators.required, Validators.min(18)]),
      skills: this.formBuilder.array([])
    });
    this.persons.push(persons);
  }

  removePerson(index: number) {
    this.persons.removeAt(index);
  }

  addSkill(personIndex: number) {
    const skillGroup = this.formBuilder.group({
      skillName: ['', Validators.required]
    });
    this.getSkillsByPerson(personIndex).push(skillGroup);
  }

  removeSkill(personIndex: number, skillIndex: number) {
    this.getSkillsByPerson(personIndex).removeAt(skillIndex);
  }

  get persons(): FormArray {
    return this.form.get('persons') as FormArray;
  }

  getSkillsByPerson(personIndex: number): FormArray {
    return (this.persons.at(personIndex) as FormGroup).get('skills') as FormArray;
  }

  setValueForm(): void {
    let task = this.item as ProjectTask;
    const personsFormArray = this.form.get('persons') as FormArray;
    personsFormArray.clear();
    task.persons.forEach((person: any) => {
      const personFormGroup = this.formBuilder.group({
        fullName: [person.fullName],
        age: [person.age],
        skills: this.formBuilder.array([])
      });
      const skillsFormArray = personFormGroup.get('skills') as FormArray;
      person.skills.forEach((skill: any) => {
        skillsFormArray.push(this.formBuilder.group({
          skillName: [skill]
        }));
      });
      personsFormArray.push(personFormGroup);
    });
    this.form
      .patchValue({
        name: task.name,
        expirationDate: task.expirationDate,
        completed: task.completed
      });
  }

  clear(): void {
    this.form.reset();
    this.saving = false;
  }

  onSubmit() {
    this.saving = true;
    let formValues = this.form.value;
    let name = formValues['name'];
    let expirationDate = formValues['expirationDate'];
    let completed = formValues['completed'] ? 'completed' : 'pending';
    const persons = formValues.persons.map((person: any) => ({
      fullName: person.fullName,
      age: person.age,
      skills: person.skills.map((skill: any) => skill.skillName)
    }));
    let request$;

    if (this.editMode) {
      let updatedTask = new ProjectTask(
        name,
        expirationDate,
        persons,
        completed
      );
      request$ = this.taskService.update(this.selectedItemId!, updatedTask);
    } else {
      this.taskId = this.randomNumberGenerator.generateRandomNumber();
      let newtask = new ProjectTask(
        name,
        expirationDate,
        persons,
        completed,
        this.taskId
      );
      request$ = this.taskService.create(newtask);
    }

    request$
      .pipe(tap(() => {
        this.clear();
        this.navigateToTasks();
      })).subscribe();
  }

  navigateToTasks(): void {
    this.router.navigate(['/task']);
  }

  onCancel(): void {
    this.taskService.cancelForm$.next();
    this.navigateToTasks();
  }

  public fullNameUniqueValidator(personIndex: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fullName = control.value;
      const isDuplicate = this.persons.controls.some((person, index) =>
        index !== personIndex && person.get('fullName')?.value === fullName
      );

      return isDuplicate ? { fullNameNotUnique: true } : null;
    };
  }
}
