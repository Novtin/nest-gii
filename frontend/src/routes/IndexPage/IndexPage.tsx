import * as React from 'react';
import useBem from '@steroidsjs/core/hooks/useBem';
import './IndexPage.scss';
import {IProject} from '../../types/IProject';
import {useDispatch, useSelector} from '@steroidsjs/core/hooks';
import {Link} from '@steroidsjs/core/ui/nav';
import {ROUTE_MODEL_FORM, ROUTE_MODEL_UPDATE_FORM} from '../index';
import {Button} from '@steroidsjs/core/ui/form';
import {goToRoute} from '@steroidsjs/core/actions/router';

interface IIndexPageProps {
    className?: string,
}

function IndexPage(props: IIndexPageProps) {
    const bem = useBem('IndexPage');
    const dispatch = useDispatch();
    const project: IProject = useSelector(state => state.auth?.data?.project);

    if (!project) {
        return null;
    }

    return (
        <div className={bem(bem.block(), props.className)}>
            <Button
                onClick={() => dispatch(goToRoute(ROUTE_MODEL_FORM))}
                label={__('Создать')}
                style={{marginBottom: 20}}
            />
            {project?.modules?.map(module => (
                <div>
                    <h4>
                        {module.name}
                    </h4>
                    {
                        ['dtos', 'models', 'schemas', 'enums'].map(key => module[key]?.length && (
                            <div className={bem.element('entityBlock')}>
                                <h6>
                                    {key}
                                </h6>
                                <div className={bem.element('entityItems')}>
                                    {module[key]?.map(entity => (
                                        <Link
                                            toRoute={ROUTE_MODEL_UPDATE_FORM}
                                            toRouteParams={{modelName: entity.name}}
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

export default IndexPage;
