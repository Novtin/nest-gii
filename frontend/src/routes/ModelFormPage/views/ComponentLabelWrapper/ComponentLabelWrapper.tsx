import * as React from 'react';
import useBem from '@steroidsjs/core/hooks/useBem';
import {v4 as uuidv4} from 'uuid';
import './ComponentLabelWrapper.scss';
import {useState} from 'react';

interface IComponentLabelWrapperProps {
    className?: string,
    label: string,
    children: any,
}

export const generateUid = (): string => uuidv4();

function ComponentLabelWrapper(props: IComponentLabelWrapperProps) {
    const bem = useBem('ComponentLabelWrapper');
    const [uid, setUid] = useState(generateUid());

    const label = props.children?.WrappedComponent?.name === 'CheckboxField' ? null : props.label;

    return (
        <div className={bem(bem.block(), props.className)}>
            {
                label && (
                    <label htmlFor={uid} className={bem.element('label')}>
                        {label}
                    </label>
                )
            }
            <div id={uid}>
                <props.children {...props} />
            </div>
        </div>
    );
}

export default ComponentLabelWrapper;
