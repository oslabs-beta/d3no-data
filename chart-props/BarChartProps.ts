export interface BarChartProps {
  data: {
    x: string;
    y: number;
  }[];
  datasets?: {
    label: string;
    color: string;
    data: {
      x: string;
      y: number;
    }[];
  }[];
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  width?: number | string;
  height?: number | string;
  addAxesLabel?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  axesColor?: string;
  axesLabelColor?: string;
  barColor?: string;
  barHoverColor?: string;
  animation?: boolean;
  animationDuration?: number;
  animationDelay?: number;
  toolTip?: boolean;
  fontFamily?: string;
  addTitle?: boolean;
  setTitle?: string;
  setTitleSize?: string;
  setTitleColor?: string;
  setTitlePaddingTop?: number;
  addLegend?: boolean;
}
