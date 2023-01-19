import * as React from 'react';
import useBem from '@steroidsjs/core/hooks/useBem';
import './ReduxStoreForm.scss';
import {Button, Form, InputField} from '@steroidsjs/core/ui/form';
import {useSelector} from '@steroidsjs/core/hooks';
import {getRouteParam} from '@steroidsjs/core/reducers/router';
import {goToRoute} from '@steroidsjs/core/actions/router';
import {ROUTE_MODEL_FORM} from '../../../index';

interface IReduxStoreFormProps {
    className?: string,
}

function ReduxStoreForm(props: IReduxStoreFormProps) {
    const bem = useBem('ReduxStoreForm');
    const projectName = useSelector(state => getRouteParam(state, 'projectName'));
    const repositoryUid = useSelector(state => getRouteParam(state, 'repositoryUid'));

    return (
        <Form
            action={`/api/v1/project/${projectName}/repository/${repositoryUid}/redux`}
            className={bem(bem.block(), props.className)}
        >
            <InputField
                attribute='name'
                label={__('Название')}
            />
            <Button
                type='submit'
                label={__('Создать redux store')}
            />
        </Form>
    );
}

export default ReduxStoreForm;
