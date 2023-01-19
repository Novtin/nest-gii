import Enum from '@steroidsjs/core/base/Enum';
import {CheckboxField, DropDownField, InputField} from '@steroidsjs/core/ui/form';
import {IBackendRepository} from '../types/IBackendRepository';
import {RelationTypeEnum} from './RelationTypeEnum';

export class TypeComponentsEnum extends Enum {
    static STRING = 'string';

    static NUMBER = 'number';

    static BOOLEAN = 'boolean';

    static ENUM = 'enum';

    static MODEL = 'model';

    static DTO = 'dto';

    static SCHEMA = 'schema';

    static ANY_ENTITY = 'any_entity';

    static RELATION_TYPE = 'relation_type';

    static getComponent(fieldId: string) {
        switch (fieldId) {
            case this.STRING:
            case this.NUMBER:
                return InputField;
            case this.BOOLEAN:
                return CheckboxField;
            case this.ENUM:
            case this.MODEL:
            case this.ANY_ENTITY:
            case this.RELATION_TYPE:
            case this.DTO:
            case this.SCHEMA:
                return DropDownField;
        }
    }

    private static reduceEntitiesAndGetEnum(entityType: string, project: IBackendRepository) {
        return project.modules?.reduce((items, module) => {
            const moduleEntities = module[entityType]?.map(enumItem => ({label: enumItem.name, id: enumItem.name}));
            if (moduleEntities?.length) {
                items.push(...moduleEntities);
            }
            return items;
        }, []);
    }

    static getItemsForDropdownComponent(fieldId: string, project: IBackendRepository) {
        switch (fieldId) {
            case this.ENUM:
                return this.reduceEntitiesAndGetEnum('enums', project);
            case this.MODEL:
                return this.reduceEntitiesAndGetEnum('models', project);
            case this.SCHEMA:
                return this.reduceEntitiesAndGetEnum('schemas', project);
            case this.DTO:
                return this.reduceEntitiesAndGetEnum('dtos', project);
            case this.ANY_ENTITY:
                return [
                    ...this.reduceEntitiesAndGetEnum('models', project),
                    ...this.reduceEntitiesAndGetEnum('dtos', project),
                    ...this.reduceEntitiesAndGetEnum('schemas', project),
                ]
            case this.RELATION_TYPE:
                return RelationTypeEnum.getDropdownItems();

            default: return [];
        }
    }
}
