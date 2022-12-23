import {BooleanField, RelationField, StringField} from '@steroidsjs/nest/src/infrastructure/decorators/fields';
import {CreateEntityFieldParamsDto} from './CreateEntityFieldParamsDto';
import {CreateEntityFieldAdditionalParamsDto} from './CreateEntityFieldAdditionalParamsDto';

export class CreateEntityFieldDto {
    @StringField()
    type: string;

    @StringField()
    name: string;

    @RelationField({
        type: 'ManyToOne',
        relationClass: () => CreateEntityFieldParamsDto,
    })
    params: CreateEntityFieldParamsDto;

    @RelationField({
        type: 'ManyToOne',
        relationClass: () => CreateEntityFieldAdditionalParamsDto,
    })
    additionalParams: CreateEntityFieldAdditionalParamsDto;

    @BooleanField()
    addToSaveDto: boolean;

    @BooleanField()
    addToSearchDto: boolean;

    @BooleanField()
    addToSearchSchema: boolean;

    @BooleanField()
    addToDetailSchema: boolean;
}
