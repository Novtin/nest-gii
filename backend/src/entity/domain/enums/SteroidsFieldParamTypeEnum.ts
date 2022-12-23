import BaseEnum from '@steroidsjs/nest/src/domain/base/BaseEnum';

export class SteroidsFieldParamTypeEnum extends BaseEnum{
    static STRING = 'string';

    static BOOLEAN = 'boolean';

    static NUMBER = 'number';

    static ENUM = 'enum';

    static ANY_ENTITY = 'any_entity';

    static MODEL = 'model';

    static DTO = 'dto';

    static SCHEMA = 'schema';

    static RELATION_TYPE = 'relation_type';
}
