export interface DonutChartProps {
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
  colorStart?: string;
  colorEnd?: string;
  fontFamily?: string;
  addTitle?: boolean;
  setTitle?: string;
  setTitleSize?: string;
  setTitleColor?: string;
  animation?: boolean;
  animationDuration?: number;
  toolTip?: boolean;
  toolTipContent?: string;
}
