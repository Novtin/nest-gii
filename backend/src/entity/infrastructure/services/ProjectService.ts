import * as fs from 'fs';
import {IProject} from '../../domain/interfaces/IProject';
import {EntityService} from './EntityService';
import {forwardRef, Inject} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {IRepository} from '../../domain/interfaces/IRepository';

export class ProjectService {
    constructor(
        @Inject(forwardRef(() => EntityService))
        private entityService: EntityService,

        @Inject(ConfigService)
        private readonly configService: ConfigService,
    ) {}

    public getProjectsList(): Array<IProject> {
        try {
            const fileContent = fs.readFileSync(this.configService.get('projectsFilePath')).toString();
            return JSON.parse(fileContent);
        } catch (e) {
            return null;
        }
    }

    public create(name: string) {
        let projects = this.getProjectsList();
        const newProject = {name, repositories: []};
        if (projects) {
            if (!projects.find(project => project.name === name)) {
                projects.push(newProject);
            }
        } else {
            projects = [newProject];
        }
        fs.writeFileSync(this.configService.get('projectsFilePath'), JSON.stringify(projects));
    }

    public addRepository(name: string, repository: IRepository): IProject {
        let projects = this.getProjectsList();
        if (!projects) {
            throw new Error('Файл с проектами отсутствует');
        }

        const project = projects.find(project => project.name === name);
        if (project.repositories.find(projectRepository => projectRepository.path === repository.path)) {
            throw new Error('Репозиторий уже добавлен');
        }

        project.repositories.push(repository);
        fs.writeFileSync(this.configService.get('projectsFilePath'), JSON.stringify(projects));
        return project;
    }

    public remove(name: string) {
        let projects = this.getProjectsList();
        if (projects) {
            projects = projects.filter(project => project.name === name);
            fs.writeFileSync(this.configService.get('projectsFilePath'), JSON.stringify(projects));
        }
    }
}
