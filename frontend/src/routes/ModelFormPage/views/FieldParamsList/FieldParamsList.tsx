import * as React from 'react';
import useBem from '@steroidsjs/core/hooks/useBem';
import './FieldParamsList.scss';
import {FieldSet} from '@steroidsjs/core/ui/form';
import {useForm, useSelector} from '@steroidsjs/core/hooks';
import {getFormValues} from '@steroidsjs/core/reducers/form';
import {get as _get} from 'dot-prop-immutable';
import {ENTITY_FORM_ID} from '../../ModelFormPage';
import {TypeComponentsEnum} from '../../../../enums/TypeCompenentsEnum';
import {IBackendRepository} from '../../../../types/IBackendRepository';
import ComponentLabelWrapper from '../ComponentLabelWrapper';
import FieldSetView from '../../../../shared/FieldSetView';

interface IFieldOptionsFieldListProps {
    attribute?: string,
    fields?: any,
    fieldKey: string,
    project: IBackendRepository,
    label: string,
}

function FieldParamsList(props: IFieldOptionsFieldListProps) {
    const bem = useBem('FieldParamsList');
    const form = useForm();
    const fieldType = useSelector(state => _get(
        getFormValues(state, form.formId),
        props.attribute?.split('.').slice(0, -1).join('.')
    )?.type);

    const params = props.fields
        ?.find(field => field.name === fieldType)
        ?.[props.fieldKey];

    if (!params?.length) {
        return null;
    }

    return (
        <>
            <div className={bem.element('label')}>
                {props.label}
            </div>
            <FieldSet
                fields={params?.map((param: any) => ({
                        attribute: `${props.attribute}.${param.name}`,
                        label: param.label,
                        required: param.isRequired,
                        placeholder: param.label,
                        autoComplete: true,
                        size: 'sm',
                        items: TypeComponentsEnum.getItemsForDropdownComponent(param.type, props.project),
                        component: (props) => (
                            <ComponentLabelWrapper {...props} className={bem.element('fieldOption')}>
                                {TypeComponentsEnum.getComponent(param.type)}
                            </ComponentLabelWrapper>
                        ),
                    }))}
                view={FieldSetView}
                className={bem.block()}
            />
        </>
    );
}

export default FieldParamsList;
