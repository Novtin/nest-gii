import {
   PrimaryKeyField
} from '@steroidsjs/nest/src/infrastructure/decorators/fields';


export class TestModel {
   @PrimaryKeyField({
      label: 'ID'
   })
   id: number;
}
