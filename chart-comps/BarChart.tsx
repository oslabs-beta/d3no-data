/** @jsx h */
import { h, Fragment, useEffect, d3 } from "../mod.ts";

interface barChartData {
  width: number;
  height: number;
  data: number[];
  label: string[];
}

export default function BarChart() {
  const myData: number[] = [];
  const label: string[] = [];
  const numData = 20;

  function updateData() {
    for (let i = 0; i < numData; i++) {
      myData.push(Math.floor(Math.random() * 100));
      label.push(i + "");
    }
  }

  function updateChart() {
    const yAxisSize = 22;
    const xAxisSize = 22;
    const width = 800; // width - yAxisSize
    const height = 600;
    d3.select(".bar-chart").attr("width", width).attr("height", height);

    // need to account for padding and size for x and y axes
    // this is full width of the chart

    const barPadding = 5;
    const barPaddingBottom = 5;
    const chartHeightPadding = 22;
    const chartWidthPadding = 40;
    const barsPaddingFromYAxis = 3;

    // scale function for y axis
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(myData)])
      .range([height - xAxisSize - chartHeightPadding, 0]);

    // scale function for x axis
    const xScale = d3
      .scaleBand()
      .domain(label)
      .range([0, width - yAxisSize - chartWidthPadding + barsPaddingFromYAxis]);

    const barWidth = (width - yAxisSize - chartWidthPadding) / numData;

    const bars = d3
      .select(".bars")
      .selectAll("rect")
      .data(myData)
      .join("rect")
      .attr("width", barWidth - barPadding)
      .attr("height", function (d: number, i: number): number {
        return yScale(d);
      })
      .attr("x", function (d: number, i: number): number {
        return barWidth * i + yAxisSize + barsPaddingFromYAxis;
      })
      .attr("y", function (d: number): number {
        return height - yScale(d) - xAxisSize - barPaddingBottom;
      });

    const yAxis = d3.axisLeft(yScale).ticks(10);
    const xAxis = d3.axisBottom(xScale);

    const chartContainer = d3.select(".bar-chart g");

    chartContainer
      .append("g")
      .call(yAxis)
      // have to make this data to show for charts dynamic
      .attr("transform", `translate(${yAxisSize}, ${chartHeightPadding})`);

    chartContainer
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(${yAxisSize}, ${height - xAxisSize})`);
  }

  useEffect(() => {
    updateData();
    updateChart();
  }, []);

  return (
    <Fragment>
      <svg class="bar-chart">
        {/* grouping for bars and axes */}
        <g>
          <g class="bars"></g>
        </g>
      </svg>
    </Fragment>
  );
}
