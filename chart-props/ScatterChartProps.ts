export interface ScatterChartProps {
  data: {
    x: number;
    y: number;
  }[];
  width?: number;
  height?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  dotColor?: string;
  axesColor?: string;
  fontFamily?: string;
  addAxesLabel?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  axesFontSize?: string;
  axesLabelColor?: string;
  addTitle?: boolean;
  setTitle?: string;
  setTitleSize?: string;
  setTitleColor?: string;
  animation?: boolean;
  animationDuration?: number;
  dotHoverColor?: string;
  dotSize?: string;
}
