'use client';

import React, { useEffect, useState, useId } from 'react';
import QRCode from 'qrcode';

interface TicketQRProps {
    data: string;
    className?: string;
    color?: string;
}

const TicketQR: React.FC<TicketQRProps> = ({ data, className, color = "#007BFF" }) => {
    const [elements, setElements] = useState<React.ReactNode[]>([]);
    const [viewBox, setViewBox] = useState('0 0 100 100');
    
    // NEW: State for rotation
    const [rotation, setRotation] = useState(0); 
    const [centerPoint, setCenterPoint] = useState(50);
    
    const uniqueId = useId();

    useEffect(() => {
        if (!data) return;

        // 1. Randomize Rotation on mount (0, 90, 180, or 270)
        // This makes the "Big 3" appear in random corners.
        const possibleAngles = [0, 90, 180, 270];
        setRotation(possibleAngles[Math.floor(Math.random() * possibleAngles.length)]);

        try {
            // Error Level 'L' for simplest/cleanest look
            const qr = QRCode.create(data, { errorCorrectionLevel: 'L' });
            
            const modules = qr.modules;
            const size = modules.size;
            const DOT_SIZE = 10;
            const MARGIN = 4;
            
            const totalSize = (size + (MARGIN * 2)) * DOT_SIZE;
            
            setViewBox(`0 0 ${totalSize} ${totalSize}`);
            setCenterPoint(totalSize / 2); // Calculate center for rotation

            const newElements: React.ReactNode[] = [];

            // Helper: Is dark?
            const isDark = (r: number, c: number) => {
                if (r < 0 || c < 0 || r >= size || c >= size) return false;
                return modules.data[r * size + c] === 1;
            };

            // Helper: Is Finder Pattern?
            const isFinder = (r: number, c: number) => {
                return (
                    (r < 7 && c < 7) ||             // TL
                    (r < 7 && c >= size - 7) ||     // TR
                    (r >= size - 7 && c < 7)        // BL
                );
            };

            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (isDark(r, c) && !isFinder(r, c)) {
                        const x = (c + MARGIN) * DOT_SIZE;
                        const y = (r + MARGIN) * DOT_SIZE;

                        // Neighbors
                        const right = isDark(r, c + 1) && !isFinder(r, c + 1);
                        const down  = isDark(r + 1, c) && !isFinder(r + 1, c);
                        const up    = isDark(r - 1, c) && !isFinder(r - 1, c);
                        const left  = isDark(r, c - 1) && !isFinder(r, c - 1);

                        const isConnected = up || down || left || right;

                        if (!isConnected) {
                            // SOLO: Rounded Square (Squircle)
                            newElements.push(
                                <rect
                                    key={`s-${r}-${c}`}
                                    x={x} y={y}
                                    width={DOT_SIZE} height={DOT_SIZE}
                                    rx={DOT_SIZE * 0.35} ry={DOT_SIZE * 0.35}
                                    fill={color}
                                />
                            );
                        } else {
                            // GROUP: Circle
                            newElements.push(
                                <circle
                                    key={`c-${r}-${c}`}
                                    cx={x + (DOT_SIZE/2)} cy={y + (DOT_SIZE/2)}
                                    r={DOT_SIZE/2}
                                    fill={color}
                                />
                            );
                            // Connectors
                            if (right) newElements.push(<rect key={`h-${r}-${c}`} x={x + 5} y={y} width={10} height={10} fill={color} />);
                            if (down)  newElements.push(<rect key={`v-${r}-${c}`} x={x} y={y + 5} width={10} height={10} fill={color} />);
                        }
                    }
                }
            }

            // Custom Finders
            const renderFinder = (row: number, col: number, keyPrefix: string) => {
                const x = (col + MARGIN) * DOT_SIZE;
                const y = (row + MARGIN) * DOT_SIZE;
                const size7 = 7 * DOT_SIZE;
                const maskId = `mask-${uniqueId}-${keyPrefix}`;

                return (
                    <g key={keyPrefix}>
                        <defs>
                            <mask id={maskId}>
                                <rect x={x} y={y} width={size7} height={size7} fill="white" rx={20} />
                                <rect x={x + 10} y={y + 10} width={size7 - 20} height={size7 - 20} rx={12} fill="black" />
                            </mask>
                        </defs>
                        <g mask={`url(#${maskId})`}>
                            <rect x={x} y={y} width={size7} height={size7} fill={color} />
                            {/* Two-tone gradients */}
                            <path d={`M${x},${y+size7} L${x},${y} L${x+size7},${y} L${x+size7-10},${y+10} L${x+10},${y+10} L${x+10},${y+size7-10} Z`} fill="white" fillOpacity={0.2} />
                            <path d={`M${x},${y+size7} L${x+10},${y+size7-10} L${x+size7-10},${y+size7-10} L${x+size7-10},${y+10} L${x+size7},${y} L${x+size7},${y+size7} Z`} fill="black" fillOpacity={0.1} />
                        </g>
                        <rect 
                            x={x + (2 * DOT_SIZE)} 
                            y={y + (2 * DOT_SIZE)} 
                            width={3 * DOT_SIZE} 
                            height={3 * DOT_SIZE} 
                            rx={8} 
                            fill={color} 
                        />
                    </g>
                );
            };

            newElements.push(renderFinder(0, 0, 'finder-tl')); 
            newElements.push(renderFinder(0, size - 7, 'finder-tr'));
            newElements.push(renderFinder(size - 7, 0, 'finder-bl'));

            setElements(newElements);
        } catch (err) { console.error(err); }
    }, [data, color, uniqueId]);

    return (
        <svg 
            viewBox={viewBox} 
            xmlns="http://www.w3.org/2000/svg" 
            className={className} 
            fill="none"
        >
            {/* 
               We wrap everything in a Group <g>.
               We apply the rotation around the center point.
            */}
            <g transform={`rotate(${rotation} ${centerPoint} ${centerPoint})`}>
                {elements}
            </g>
        </svg>
    );
};

export default TicketQR;