import Enum from '@steroidsjs/core/base/Enum';

export class RepositoryTypeEnum extends Enum {
    static FRONTEND = 'frontend';

    static BACKEND = 'backend';

    static getLabels() {
        return {
            [this.FRONTEND]: 'Frontend',
            [this.BACKEND]: 'Backend',
        }
    }
}
