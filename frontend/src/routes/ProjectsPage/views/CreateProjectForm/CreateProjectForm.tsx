import * as React from 'react';
import useBem from '@steroidsjs/core/hooks/useBem';
import {Button, Form, InputField} from '@steroidsjs/core/ui/form';
import './CreateProjectForm.scss';

interface ICreateProjectFormProps {
    className?: string,
    onComplete: () => void,
}

function CreateProjectForm(props: ICreateProjectFormProps) {
    const bem = useBem('CreateProjectForm');

    return (
        <Form
            className={bem(bem.block(), props.className)}
            action='/api/v1/project'
            onComplete={props.onComplete}
        >
            <InputField
                attribute='name'
            />
            <Button
                label={__('Создать проект')}
                type='submit'
            />
        </Form>
    );
}

export default CreateProjectForm;
