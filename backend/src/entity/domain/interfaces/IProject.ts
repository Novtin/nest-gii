import {IRepository} from './IRepository';

export interface IProject {
    name: string,
    repositories: Array<IRepository>
}
