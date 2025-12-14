import { ShapeType, Project } from ".";

const IndexedDBStores: {name: string, options?: IDBObjectStoreParameters}[] = [
    { name: "shape", options: { keyPath: "uuid" } },
    { name: "project", options: { keyPath: "uuid" } },
]

export class Data {
    project: Project;
    shapes: Record<string, ShapeType> = {};

    constructor(projectName?: string) {
        const projectNameFinal = projectName || 'Untitled Project - ' + new Date().toISOString();
        this.project = new Project(projectNameFinal,);
    }
}
