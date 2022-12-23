import * as React from 'react';
import './FieldSetView.scss';
import {IFieldSetViewProps} from '@steroidsjs/core/ui/form/FieldSet/FieldSet';

function FieldSetView(props: IFieldSetViewProps) {
    return (
        <div className={props.className}>
            {props.children}
        </div>
    );
}

export default FieldSetView;
