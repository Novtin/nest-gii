import * as React from 'react';
import useBem from '@steroidsjs/core/hooks/useBem';
import {useDispatch, useSelector} from '@steroidsjs/core/hooks';
import {getRouteParam} from '@steroidsjs/core/reducers/router';
import './FrontendRepositoryPage.scss';
import {IProject} from '../../types/IProject';
import {RepositoryTypeEnum} from '../../enums/RepositoryTypeEnum';
import ReduxStoreForm from './views/ReduxStoreForm';

interface IFrontendRepositoryPageProps {
    className?: string,
}

function FrontendRepositoryPage(props: IFrontendRepositoryPageProps) {
    const bem = useBem('FrontendRepositoryPage');

    const projectName = useSelector(state => getRouteParam(state, 'projectName'));
    const repositoryUid = useSelector(state => getRouteParam(state, 'repositoryUid'));
    const projects: IProject[] = useSelector(state => state.auth?.data?.projects);
    const repository = projects
        .find(project => project.name === projectName)
        ?.repositories
        .find(repository => repository.uid === repositoryUid);

    return (
        <div className={bem(bem.block(), props.className)}>
            <h2 className={bem.element('header')}>
                {projectName}
            </h2>
            <h4 className={bem.element('subheader')}>
                {`${repository?.name} (${RepositoryTypeEnum.getLabel(repository.type)})`}
            </h4>
            <ReduxStoreForm />
        </div>
    );
}

export default FrontendRepositoryPage;
