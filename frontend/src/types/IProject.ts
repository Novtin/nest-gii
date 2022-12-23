export interface IProjectEntity {
    name: string,
    path: string,
}

export interface IProject {
    modules: Array<{
        name: string,
        models: Array<IProjectEntity>,
        dtos: Array<IProjectEntity>,
        enums: Array<IProjectEntity>,
        schemas: Array<IProjectEntity>,
    }>
}
