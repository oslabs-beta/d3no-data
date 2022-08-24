export interface ChoroplethProps {
    fontSize: string;
    widthPadding: number;
    heightPadding: number;
    paddingTitle: number;
        stepArr?: never[];
        colorArr?: never[];
        legendSteps?: number;
        legendSvgPadding?: number;
        lowColor?: string;
        highColor?: string;
        offHoverOpacity?: number;
        title?: string;
        scale?: number;
        center?: number[];
        thresholdScale: boolean;
        data?: {
            name?: string,
            label?: string,
            data?: number,
        }[],
        width?: number,
        height?: number
    }