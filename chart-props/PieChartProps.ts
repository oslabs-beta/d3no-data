export interface PieChartProps {
  labelDistanceToEdge?: number;
  piePadToEdge?: number;
  strokeColor?: string;
  strokeWidth?: number;
  fontSize?: number;
  font?: string;
  width?: number;
  data?: {
    label: string;
    value: number;
  }[];
  colorStart?: string;
  colorEnd?: string;
}
