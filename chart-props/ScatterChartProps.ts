export interface ScatterChartProps {
  data?: {
    x: number;
    y: number;
  }[];
  datasets?: {
    label: string;
    color: string;
    data: {
      x: Date;
      y: number;
    }[];
  }[];
  width?: number;
  height?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  axesColor?: string;
  fontFamily?: string;
  addAxesLabel?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  axesFontSize?: string;
  axesLabelColor?: string;
  addTooltip?: boolean;
  addTitle?: boolean;
  setTitle?: string;
  setTitleSize?: string;
  setTitleColor?: string;
  animation?: boolean;
  animationDuration?: number;
  dotSize?: string;
  addLegend?: boolean;
}
