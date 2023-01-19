export interface IBackendEntity {
    name: string,
    path: string,
}

export interface IBackendRepository {
    modules: Array<{
        name: string,
        models: Array<IBackendEntity>,
        dtos: Array<IBackendEntity>,
        enums: Array<IBackendEntity>,
        schemas: Array<IBackendEntity>,
    }>
}
