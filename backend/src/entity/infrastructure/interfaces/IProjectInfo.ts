export type IProjectDtoEntity = {
    name: string,
    path: string,
}

export type IProjectDetailDtoEntity = {
    name: string,
    path: string,
    module: string,
    type: string,
}

export type IProjectModule = {
    name: string,
    schemas?: Array<IProjectDtoEntity>,
    dtos?: Array<IProjectDtoEntity>,
    models?: Array<IProjectDtoEntity>,
    enums?: Array<IProjectDtoEntity>
}

export type IProjectInfo = {
    modules: Array<IProjectModule>,
    allEntities: Array<IProjectDetailDtoEntity>,
}
