import { v4 } from "uuid";

export class Project {
    name: string;
    createdAt: Date;
    updatedAt: Date;
    uuid: string;
    elements: string[] = []; // TODO: list of shape UUIDs

    constructor(name: string) {
        this.name = name;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.uuid = v4();
    }

    rename(newName: string) {
        this.name = newName;
        this.updatedAt = new Date();
    }

    updateTimestamp() {
        this.updatedAt = new Date();
    }
}
