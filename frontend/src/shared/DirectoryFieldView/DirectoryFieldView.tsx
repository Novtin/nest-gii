import * as React from 'react';
import useBem from '@steroidsjs/core/hooks/useBem';
import './DirectoryFieldView.scss';
import {Button} from '@steroidsjs/core/ui/form';

interface IDirectoryFieldViewProps {
    className?: string,
}

function DirectoryFieldView(props: IDirectoryFieldViewProps) {
    const bem = useBem('DirectoryFieldView');

    return (
        <Button
            onClick={async () => {
                // @ts-ignore
                const dirHandle = await window.showDirectoryPicker({
                    mode: 'read',
                });
                for await (const entry of dirHandle.values()) {
                    console.log( await dirHandle.resolve(entry));
                }
            }}
        />
    );
}

export default DirectoryFieldView;
