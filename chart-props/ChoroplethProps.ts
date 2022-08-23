export interface ChoroplethProps {
    legendSteps: number;
    legendSvgPadding: number;
    lowColor: string;
    highColor: string;
    offHoverOpacity: number;
    title: string;
    scale: number;
    center: number[];
    thresholdScale: any;
    stepArr: number[];
    colorArr: string[];
    data?: {
        name?: string,
        label?: string,
        data?: number
    }[],
    width?: number,
    height?: number
}