import BaseEnum from '@steroidsjs/nest/src/domain/base/BaseEnum';

export class RepositoryTypeEnum extends BaseEnum {
    static FRONTEND = 'frontend';

    static BACKEND = 'backend';

    static getLabels() {
        return {
            [this.FRONTEND]: 'Frontend',
            [this.BACKEND]: 'Backend',
        }
    }
}
