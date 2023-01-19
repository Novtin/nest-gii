export type IBackendDtoEntity = {
    name: string,
    path: string,
}

export type IBackendDetailDtoEntity = {
    name: string,
    path: string,
    module: string,
    type: string,
}

export type IBackendModule = {
    name: string,
    schemas?: Array<IBackendDtoEntity>,
    dtos?: Array<IBackendDtoEntity>,
    models?: Array<IBackendDtoEntity>,
    enums?: Array<IBackendDtoEntity>
}

export type IBackendRepositoryInfo = {
    modules: Array<IBackendModule>,
    allEntities: Array<IBackendDetailDtoEntity>,
}
