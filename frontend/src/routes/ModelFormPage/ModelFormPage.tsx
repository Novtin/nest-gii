import * as React from 'react';
import {useBem, useFetch, useSelector} from '@steroidsjs/core/hooks';
import {
    Button,
    CheckboxListField,
    DropDownField,
    FieldList,
    Form,
    InputField
} from '@steroidsjs/core/ui/form';
import {useCallback, useMemo} from 'react';
import FieldParamsList from './views/FieldParamsList';
import {IBackendRepository} from '../../types/IBackendRepository';
import FieldListView from '../../shared/FieldListView';
import FieldListItemView from '../../shared/FieldListItemView';
import './ModelFormPage.scss';
import {getRouteParam} from '@steroidsjs/core/reducers/router';

export const ENTITY_FORM_ID = 'CreteEntityForm';

export default function ModelFormPage() {
    const bem = useBem('ModelFormPage');
    const projectName = useSelector(state => getRouteParam(state, 'projectName'));
    const repositoryUid = useSelector(state => getRouteParam(state, 'repositoryUid'));
    const fields = useSelector(state => state.auth?.data?.fields);

    const fetchConfig = useMemo(() => repositoryUid && ({
        url: `/api/v1/project/${projectName}/repository/${repositoryUid}`,
        method: 'get',
    }), [repositoryUid]);

    const {data: project, isLoading}= useFetch(fetchConfig);

    const modulesEnum = useMemo(() => (project?.modules || [])?.map(module => ({
        label: module.name,
        id: module.name,
    })), [project]);

    const fieldsEnum = useMemo(() => (fields || [])?.map(field => ({
        label: field.name,
        id: field.name,
    })), [project]);

    const exportDtoEnum = ['addToSaveDto', 'addToSearchDto', 'addToDetailSchema', 'addToSearchSchema'].map(item => ({
        label: item.replace('addTo', ''),
        id: item,
    }));

    const onBeforeSubmit = useCallback((values) => {
        values.fields.forEach(field => {
            for (const dtoField of field.addToDto) {
                field[dtoField] = true;
            }
        });
        return true;
    }, []);

    return (
        <div className={bem.block()}>
            <Form
                formId={ENTITY_FORM_ID}
                action={`/api/v1/project/${projectName}/repository/${repositoryUid}/entity`}
                initialValues={{
                    fields: [
                        {
                            type: 'PrimaryKeyField',
                            name: 'id',
                            addToDto: ['addToSaveDto', 'addToDetailSchema', 'addToSearchSchema'],
                            params: {
                                label: 'ID'
                            }
                        },
                        {},
                    ],
                }}
                onBeforeSubmit={onBeforeSubmit}
                useRedux
            >
                <div className='col-lg-3 col-md-4 col-sm-6'>
                    <DropDownField
                        label={__('Модуль')}
                        attribute='moduleName'
                        items={modulesEnum}
                        required
                    />
                    <InputField
                        label={__('Название модели')}
                        attribute='entityName'
                        required
                    />
                </div>
                <FieldList
                    attribute='fields'
                    label={__('Поля')}
                    view={FieldListView}
                    itemView={FieldListItemView}
                    items={[
                        {
                            attribute: 'name',
                            label: __('Название'),
                            component: InputField,
                            required: true,
                            size: 'sm',
                        },
                        {
                            attribute: 'type',
                            label: __('Тип'),
                            items: fieldsEnum,
                            autoComplete: true,
                            required: true,
                            component: DropDownField,
                            size: 'sm',
                        },
                        {
                            attribute: 'addToDto',
                            label: __('Добавить в:'),
                            items: exportDtoEnum,
                            component: CheckboxListField,
                            size: 'sm',
                        },
                        {
                            component: ({prefix}) => (
                                <FieldParamsList
                                    attribute={`${prefix}.params`}
                                    fields={fields}
                                    project={project}
                                    fieldKey='params'
                                    label={__('Параметры')}
                                />
                            ),
                        },
                        {
                            component: ({prefix}) => (
                                <FieldParamsList
                                    attribute={`${prefix}.additionalParams`}
                                    fields={fields}
                                    project={project}
                                    fieldKey='additionalParams'
                                    label={__('Дополнительно')}
                                />
                            ),
                        },
                    ]}
                />
                <Button
                    type='submit'
                    label={__('Создать')}
                />
            </Form>
        </div>
    );
}
