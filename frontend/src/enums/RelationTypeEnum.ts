import Enum from '@steroidsjs/core/base/Enum';

export class RelationTypeEnum extends Enum{
    static ONE_TO_ONE = 'OneToOne';

    static ONE_TO_MANY = 'OneToMany';

    static MANY_TO_ONE = 'ManyToOne';

    static MANY_TO_MANY = 'ManyToMany';

    static getLabels() {
        return {
            [this.ONE_TO_ONE]: 'One-to-One',
            [this.ONE_TO_MANY]: 'One-to-Many',
            [this.MANY_TO_ONE]: 'Many-to-One',
            [this.MANY_TO_MANY]: 'Many-to-Many',
        }
    }
}
