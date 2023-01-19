import {IBackendRepositoryInfo} from '../interfaces/IBackendRepositoryInfo';
import * as fs from 'fs';
import * as path from 'path';
import {forwardRef, Inject} from '@nestjs/common'
import { v5 as uuidv5 } from 'uuid';
import {ProjectService} from './ProjectService';
import {CreateRepositoryDto} from '../../domain/dtos/CreateRepositoryDto';
import {IRepository} from '../../domain/interfaces/IRepository';
import {RepositoryTypeEnum} from '../../domain/enums/RepositoryTypeEnum';

const REPOSITORIES_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

export class RepositoryService {
    constructor(
        @Inject(forwardRef(() => ProjectService))
        private projectService: ProjectService,
    ) {
    }

    public create(projectName: string, dto: CreateRepositoryDto) {
        const repository = {
            ...dto,
            uid: uuidv5(dto.path, REPOSITORIES_NAMESPACE),
        };
        this.projectService.addRepository(projectName, repository);
        return repository;
    }

    public getInfoByUid(uid: string) {
        const repository = this.get(uid);
        return this.getBackendInfo(repository);
    }

    public get(uid: string): IRepository | null {
        let projects = this.projectService.getProjectsList();
        for (const project of projects) {
            const repository = project.repositories.find(repository => repository.uid === uid);
            if (repository) {
                return repository;
            }
        }
        return null;
    }

    public async getInfo(repository: IRepository) {
        if (repository.type === RepositoryTypeEnum.BACKEND) {
            return this.getBackendInfo(repository);
        }
        return null;
    }

    private async getBackendInfo(repository: IRepository): Promise<IBackendRepositoryInfo> {
        const repositoryRootPath = repository.path || process.cwd();
        const objects = fs.readdirSync(path.resolve(repositoryRootPath, 'src'));
        const result: IBackendRepositoryInfo = {
            modules: [],
            allEntities: [],
        };
        for (const object of objects) {
            if (!object.includes('.')) {
                result.modules.push({
                    name: object,
                });
            }
        }

        const entitiesToScan = [
            {name: 'models', level: 'domain'},
            {name: 'enums', level: 'domain'},
            {name: 'dtos', level: 'domain'},
            {name: 'schemas', level: 'infrastructure'},
        ];
        for (const module of result.modules) {
            for (const entity of entitiesToScan) {
                try {
                    const entityDirectory = path.resolve(repositoryRootPath, 'src', module.name, entity.level, entity.name);
                    const entityFiles = fs.readdirSync(entityDirectory);
                    module[entity.name] = entityFiles
                        .filter(file => file.endsWith('.ts'))
                        .map(file => ({
                            name: file.replace('.ts', ''),
                            path: path.resolve(entityDirectory, file),
                            module: module.name,
                            type: entity.name.slice(0, -1),
                        }));
                    result.allEntities.push(...module[entity.name]);
                } catch (e) {}
            }
        }
        return result;
    }
}
