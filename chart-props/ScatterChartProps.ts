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
}
