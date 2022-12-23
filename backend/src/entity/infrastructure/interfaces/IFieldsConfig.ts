export type IFieldsConfig = Array<{
    name: string,
    params: Array<{
        label: string,
        name: string,
        type: string,
        isRequired: boolean
    }>,
    additionalParams?: Array<{
        label: string,
        name: string,
        type: string,
        isRequired: boolean
    }>
}>
