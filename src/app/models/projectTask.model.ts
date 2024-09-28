import { Person } from "./person.model";

export class ProjectTask {
    public name: string;
    public expirationDate: Date;
    public persons: Person[];
    public completed: string;
    public id?: number;

    constructor(name: string, expirationDate: Date, persons: Person[], completed: string);
    constructor(name: string, expirationDate: Date, persons: Person[], completed: string, id: number);

    constructor(name: string, expirationDate: Date, persons: Person[], completed: string, id?: number) {
        this.name = name;
        this.expirationDate = expirationDate;
        this.persons = persons;
        this.completed = completed;

        if (id !== undefined) {
            this.id = id;
        }
    }
}