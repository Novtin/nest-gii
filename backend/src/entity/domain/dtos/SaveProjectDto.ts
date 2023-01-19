import {RelationField, StringField} from '@steroidsjs/nest/src/infrastructure/decorators/fields';
import {CreateRepositoryDto} from './CreateRepositoryDto';

export class SaveProjectDto {
    @StringField()
    name: string;

    @RelationField({
        type: 'ManyToMany',
        isOwningSide: true,
        relationClass: () => CreateRepositoryDto,
    })
    repositories: CreateRepositoryDto[];
}
