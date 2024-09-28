import { Skill } from "./skill.model";

export class Person {
    constructor(public fullName: string, public age: number, public skills: Skill[]) { }
}
