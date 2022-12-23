import * as React from 'react';
import useBem from '@steroidsjs/core/hooks/useBem';
import {IFieldListViewProps} from '@steroidsjs/core/ui/form/FieldList/FieldList';
import {Button} from '@steroidsjs/core/ui/form';
import './FieldListView.scss';

function FieldListView(props: IFieldListViewProps) {
    const bem = useBem('FieldListView');

    return (
        <div
            className={bem(bem.block(), props.className)}
            style={props.style}
            ref={props.forwardedRef}
        >
            <div className={bem.element('body')}>
                {props.children}
            </div>
            <div className={bem.element('footer')}>
                {props.showAdd && !props.disabled && (
                    <Button
                        formId={false}
                        layout={false}
                        color='secondary'
                        className={bem.element('button-add')}
                        onClick={e => {
                            e.preventDefault();
                            props.onAdd();
                        }}
                    >
                        {__('Добавить поле')}
                    </Button>
                )}
                </div>
        </div>
    );
}

export default FieldListView;
