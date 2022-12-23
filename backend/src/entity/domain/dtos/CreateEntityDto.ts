import {RelationField, StringField} from '@steroidsjs/nest/src/infrastructure/decorators/fields';
import {CreateEntityFieldDto} from './CreateEntityFieldDto';

export class CreateEntityDto {
    @StringField({
        nullable: false,
    })
    entityName: string;

    @StringField({
        nullable: false,
    })
    moduleName: string;

    @RelationField({
        type: 'ManyToMany',
        isOwningSide: true,
        relationClass: () => CreateEntityFieldDto,
    })
    fields: CreateEntityFieldDto[];
}
