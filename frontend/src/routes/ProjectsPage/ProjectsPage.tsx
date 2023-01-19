import * as React from 'react';
import useBem from '@steroidsjs/core/hooks/useBem';
import './ProjectsPage.scss';
import {useDispatch, useSelector} from '@steroidsjs/core/hooks';
import {IProject} from '../../types/IProject';
import {IRepository} from '../../types/IRepository';
import {Link} from '@steroidsjs/core/ui/nav';
import {useCallback} from 'react';
import {goToRoute} from '@steroidsjs/core/actions/router';
import {ROUTE_BACKEND_REPOSITORY, ROUTE_FRONTEND_REPOSITORY} from '../index';
import CreateProjectForm from './views/CreateProjectForm';
import AddRepositoryForm from './views/AddRepositoryForm';
import {RepositoryTypeEnum} from '../../enums/RepositoryTypeEnum';
import {reInit} from '@steroidsjs/core/actions/auth';

interface IProjectsPageProps {
    className?: string,
}

function ProjectsPage(props: IProjectsPageProps) {
    const bem = useBem('ProjectsPage');
    const dispatch = useDispatch();
    const projects: IProject[] = useSelector(state => state.auth?.data?.projects);

    const onRepositoryClick = useCallback((repository: IRepository, project: IProject) => {
        dispatch(goToRoute(
            repository.type === RepositoryTypeEnum.BACKEND
                ? ROUTE_BACKEND_REPOSITORY
                : ROUTE_FRONTEND_REPOSITORY, {
            repositoryUid: repository.uid,
            projectName: project.name,
        }));
    }, []);

    const renderRepository = (repository: IRepository, project: IProject) => (
        <Link
            key={repository.uid}
            label={`${repository.name} (${RepositoryTypeEnum.getLabel(repository.type)})`}
            onClick={() => onRepositoryClick(repository, project)}
        />
    );

    const renderProject = (project: IProject) => (
        <div
            key={project.name}
            className={bem.element('project')}
        >
            <h4 className={bem.element('project-header')}>
                {project.name}
            </h4>
            <div className={bem.element('repositories')}>
                {project.repositories.map((repository) => renderRepository(repository, project))}
            </div>
        </div>
    );

    const onComplete = useCallback(() => {
        dispatch(reInit());
    }, [dispatch]);

    return (
        <div className={bem(bem.block(), props.className)}>
            <h1 className={bem.element('header')}>
                Проекты
            </h1>
            <CreateProjectForm onComplete={onComplete} />
            <AddRepositoryForm onComplete={onComplete} />
            <div className={bem.element('projects')}>
                {projects?.map(renderProject)}
            </div>
        </div>
    );
}

export default ProjectsPage;
