export interface LineChartProps {
  data: {
    x: number;
    y: number;
  };
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  width?: number;
  height?: number;
  lineColor?: string;
  axesColor?: string;
  addLabel?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  axesLabelColor?: string;
  axesLabelSize?: string;
  animation?: boolean;
  animationDuration?: number;
  toolTip?: boolean;
  fontFamily?: string;
  addInteractivity?: boolean;
  addTitle?: boolean;
  setTitle?: string;
  setTitleColor?: string;
}
