import * as React from 'react';
import useBem from '@steroidsjs/core/hooks/useBem';
import {useDispatch, useFetch, useSelector} from '@steroidsjs/core/hooks';
import {Link} from '@steroidsjs/core/ui/nav';
import {ROUTE_MODEL_FORM, ROUTE_MODEL_UPDATE_FORM} from '../index';
import {Button} from '@steroidsjs/core/ui/form';
import {goToRoute} from '@steroidsjs/core/actions/router';
import {useMemo} from 'react';
import {getRouteParam} from '@steroidsjs/core/reducers/router';
import './BackendRepositoryPage.scss';
import {IProject} from '../../types/IProject';
import {RepositoryTypeEnum} from '../../enums/RepositoryTypeEnum';

interface IIndexPageProps {
    className?: string,
}

function BackendRepositoryPage(props: IIndexPageProps) {
    const bem = useBem('BackendRepositoryPage');
    const dispatch = useDispatch();
    const projectName = useSelector(state => getRouteParam(state, 'projectName'));
    const repositoryUid = useSelector(state => getRouteParam(state, 'repositoryUid'));
    const projects: IProject[] = useSelector(state => state.auth?.data?.projects);
    const repository = projects
        .find(project => project.name === projectName)
        ?.repositories
        .find(repository => repository.uid === repositoryUid);

    const fetchConfig = useMemo(() => repositoryUid && ({
        url: `/api/v1/project/${projectName}/repository/${repositoryUid}`,
        method: 'get',
    }), [repositoryUid]);

    const {data, isLoading}= useFetch(fetchConfig);

    if (!data) {
        return null;
    }

    return (
        <div className={bem(bem.block(), props.className)}>
            <h2 className={bem.element('header')}>
                {projectName}
            </h2>
            <h4 className={bem.element('subheader')}>
                {`${repository?.name} (${RepositoryTypeEnum.getLabel(repository.type)})`}
            </h4>
            <Button
                onClick={() => dispatch(goToRoute(ROUTE_MODEL_FORM, {projectName, repositoryUid}))}
                label={__('Создать')}
                style={{marginBottom: 20}}
            />
            {data?.modules?.map(module => (
                <div>
                    <h4>
                        {module.name}
                    </h4>
                    {
                        ['dtos', 'models', 'schemas', 'enums'].map(key => module[key]?.length > 0 && (
                            <div className={bem.element('entityBlock')}>
                                <h6>
                                    {key}
                                </h6>
                                <div className={bem.element('entityItems')}>
                                    {module[key]?.map(entity => (
                                        <Link
                                            toRoute={ROUTE_MODEL_UPDATE_FORM}
                                            toRouteParams={{modelName: entity.name, projectName, repositoryUid}}
                                            label={entity.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    }
                </div>
            ))}
        </div>
    );
}

export default BackendRepositoryPage;
