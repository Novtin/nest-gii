import {IRouteItem} from '@steroidsjs/core/ui/nav/Router/Router';
import ModelFormPage from './ModelFormPage';
import ModelUpdateFormPage from './ModelUpdateFormPage';
import BackendRepositoryPage from './BackendRepositoryPage';
import ProjectsPage from './ProjectsPage';
import FrontendRepositoryPage from './FrontendRepositoryPage';

export const ROUTE_PROJECTS = 'root';
export const ROUTE_BACKEND_REPOSITORY = 'backend_repository';
export const ROUTE_FRONTEND_REPOSITORY = 'frontend_repository';
export const ROUTE_MODEL_FORM = 'model_form';
export const ROUTE_MODEL_UPDATE_FORM = 'model_update_form';

const roles = [null];

export default {
    id: ROUTE_PROJECTS,
    exact: true,
    path: '/',
    component: ProjectsPage,
    roles,
    items: [
        {
            id: ROUTE_BACKEND_REPOSITORY,
            exact: true,
            path: '/project/:projectName/repository/backend/:repositoryUid',
            component: BackendRepositoryPage,
            roles,
            items: [
                {
                    id: ROUTE_MODEL_FORM,
                    exact: true,
                    path: '/project/:projectName/repository/:repositoryUid/model',
                    component: ModelFormPage,
                    roles,
                },
                {
                    id: ROUTE_MODEL_UPDATE_FORM,
                    exact: true,
                    path: '/project/:projectName/repository/:repositoryUid/model/:modelName',
                    component: ModelUpdateFormPage,
                    roles,
                }
            ]
        },
        {
            id: ROUTE_FRONTEND_REPOSITORY,
            exact: true,
            path: '/project/:projectName/repository/frontend/:repositoryUid',
            component: FrontendRepositoryPage,
            roles,
            items: []
        },
    ]
} as IRouteItem;
