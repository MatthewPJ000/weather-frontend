import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLayerGroup, faTools, faGear, faClose } from '@fortawesome/free-solid-svg-icons';

const Window = ({ title,icon, children, onClose,initialSize={width:800,height:600}, initialPosition = { x: 50, y: 50 } }) => {
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState(initialSize);
    const windowRef = useRef(null);

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleDrag = (e, ui) => {
        setPosition({ x: ui.x, y: ui.y });
    };

    const handleResize = (e) => {
        const rect = windowRef.current.getBoundingClientRect();
        setSize({ width: rect.width, height: rect.height });
    };

    return (
        <Draggable
            position={position}
            onDrag={handleDrag}
            bounds={{ top: 0, right: '100%', bottom: '100%', left: 0 }}
            handle=".window__header"
        >
            <div
                ref={windowRef}

                style={{
                    width: size.width,
                    height: size.height,
                    overflow: 'auto',
                    resize: 'both',
                    position: 'absolute',
                    zIndex: 1,
                    overflowY: "clip",
                    borderRadius: '10px'
                }}
                onResize={handleResize}
            >
                <div className="window__header">
                    <div className="window__title"><FontAwesomeIcon icon={icon}/> {title}</div>
                    <div className="window__controls">
                        <FontAwesomeIcon icon={faClose} style={{width : '30px', height : '30px', cursor:'pointer'}} className="window__control" onClick={handleClose} />
                    </div>
                </div>
                <div className="window__content">{children}</div>
                <div className="window__end"></div>
            </div>
        </Draggable>
    );
};

export default Window;