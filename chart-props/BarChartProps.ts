// defining property for user to pass down props
export interface BarChartProps {
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  width?: number;
  height?: number;
  data: number[];
  labels: string[]; // for y axes
  addLabel?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  axesColor?: string;
  axesLabelColor?: string;
  barPadding?: number;
  barColor?: string;
  barHoverColor?: string;
  animation?: boolean;
  animationDuration?: number;
  animationDelay?: number;
  toolTip?: boolean;
  toolTipText?: string;
  fontFamily?: string;
  addTitle?: boolean;
  setTitle?: string;
  setTitleSize?: string;
  setTitleColor?: string;
  setTitlePaddingTop?: number;
}
