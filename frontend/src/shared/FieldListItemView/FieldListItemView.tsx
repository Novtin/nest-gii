import * as React from 'react';
import useBem from '@steroidsjs/core/hooks/useBem';
import './FieldListItemView.scss';
import {IFieldListItemViewProps} from '@steroidsjs/core/ui/form/FieldList/FieldList';
import {Field} from '@steroidsjs/core/ui/form';

function FieldListItemView(props: IFieldListItemViewProps) {
    const bem = useBem('FieldListItemView');

    return (
        <div className={bem.block()}>
            <div className={bem.element('body')}>
                {props.items.map((field, index) => (
                    <div className={bem.element('cell')} key={index}>
                        <div>{field.label}</div>
                        <Field
                            {...field}
                            prefix={props.prefix}
                        />
                    </div>
                ))}
            </div>
            {props.showRemove && (
                <button
                    type='button'
                    className={bem.element('remove')}
                    onClick={e => {
                        e.preventDefault();
                        props.onRemove(props.rowIndex);
                    }}
                >
                    &times;
                </button>
            )}
        </div>
    );
}

export default FieldListItemView;
