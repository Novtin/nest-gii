import {forwardRef, Inject} from '@nestjs/common';
import {FrontendStoreCodeGenerator} from '../generators/FrontendStoreCodeGenerator';
import {CreateReduxStoreDto} from '../../domain/dtos/CreateReduxStoreDto';
import {RepositoryService} from './RepositoryService';

export class ReduxStoreService {
    constructor(
        @Inject(forwardRef(() => RepositoryService))
        private repositoryService: RepositoryService,
    ) {}

    public async create(dto: CreateReduxStoreDto, repositoryUid: string) {
        const repository = this.repositoryService.get(repositoryUid);
        // await ValidationHelper.validate(dto);
        (new FrontendStoreCodeGenerator(
            dto,
            repository.path,
        )).generate();
    }
}
