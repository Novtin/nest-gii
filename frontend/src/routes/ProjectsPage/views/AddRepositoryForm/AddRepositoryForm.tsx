import * as React from 'react';
import useBem from '@steroidsjs/core/hooks/useBem';
import './AddRepositoryForm.scss';
import {Button, DropDownField, Field, FileField, Form, InputField} from '@steroidsjs/core/ui/form';
import {IProject} from '../../../../types/IProject';
import {useSelector} from '@steroidsjs/core/hooks';
import {RepositoryTypeEnum} from '../../../../enums/RepositoryTypeEnum';
import DirectoryFieldView from '../../../../shared/DirectoryFieldView';
import {getFormValues} from '@steroidsjs/core/reducers/form';

interface IAddRepositoryFormProps {
    className?: string,
    onComplete: () => void,
}

const ADD_REPOSITORY_FORM_ID = 'AddRepositoryForm';

function AddRepositoryForm(props: IAddRepositoryFormProps) {
    const bem = useBem('AddRepositoryForm');
    const projectName = useSelector(state => getFormValues(state, ADD_REPOSITORY_FORM_ID)?.projectName);
    const projects: IProject[] = useSelector(state => state.auth?.data?.projects);
    const projectsEnum = projects?.map(project => ({
        id: project.name,
        label: project.name,
    }));

    return (
        <Form
            formId={ADD_REPOSITORY_FORM_ID}
            className={bem(bem.block(), props.className)}
            action={`/api/v1/project/${projectName}/repository`}
            onComplete={props.onComplete}
            useRedux
        >
            <DropDownField
                attribute='projectName'
                items={projectsEnum}
                label={__('Проект')}
            />
            <InputField
                attribute='name'
                label={__('Название')}
            />
            <DropDownField
                attribute='type'
                items={RepositoryTypeEnum}
                label={__('Тип репозитория')}
            />
            <InputField
                attribute='path'
                label={__('Путь к репозиторию')}
            />
            <Button
                type='submit'
                label={__('Добавить репозиторий')}
            />
        </Form>
    );
}

export default AddRepositoryForm;
