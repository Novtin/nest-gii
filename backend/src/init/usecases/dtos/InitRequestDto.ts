import {BaseLanguageEnum} from '../../../base/domain/LanguageEnum';

export class InitRequestDto {
    timestamp: number;

    language: BaseLanguageEnum;
}
