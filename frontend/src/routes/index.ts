import {IRouteItem} from '@steroidsjs/core/ui/nav/Router/Router';
import ModelFormPage from './ModelFormPage';
import ModelUpdateFormPage from './ModelUpdateFormPage';
import IndexPage from './IndexPage';

export const ROUTE_ROOT = 'root';
export const ROUTE_MODEL_FORM = 'model_form';
export const ROUTE_MODEL_UPDATE_FORM = 'model_update_form';

const roles = [null];

export default {
    id: ROUTE_ROOT,
    exact: true,
    path: '/',
    component: IndexPage,
    roles,
    items: [
        {
            id: ROUTE_MODEL_FORM,
            exact: true,
            path: '/model',
            component: ModelFormPage,
            roles,
        },
        {
            id: ROUTE_MODEL_UPDATE_FORM,
            exact: true,
            path: '/model/:modelName',
            component: ModelUpdateFormPage,
            roles,
        }
    ]
} as IRouteItem;
