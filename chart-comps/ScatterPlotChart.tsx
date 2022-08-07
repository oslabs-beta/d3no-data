/** @jsx h */
import { h, Fragment, d3, useEffect } from "../mod.ts";
import { ScatterChartProps } from "../chart-props/ScatterChartProps.ts";

export default function ScatterPlotChart(props: ScatterChartProps) {
  const padding = {
    top: props.paddingTop || 70,
    bottom: props.paddingBottom || 70,
    left: props.paddingLeft || 70,
    right: props.paddingRight || 70,
  };
  const width = (props.width || 600) - padding.left - padding.right;
  const height = (props.height || 600) - padding.top - padding.bottom;
  const dotColor = props.dotColor || "#BFE4A3";
  const axesColor = props.axesColor || "#4D908E";
  const fontFamily = props.fontFamily || "Verdana";
  const data: { x: number; y: number }[] = [
    {
      x: 35,
      y: 92,
    },
    {
      x: 73,
      y: 74,
    },
    {
      x: 5,
      y: 107,
    },
    {
      x: 84,
      y: 36,
    },
    {
      x: 28,
      y: 99,
    },
    {
      x: 80,
      y: 8,
    },
    {
      x: 47,
      y: 2,
    },
    {
      x: 91,
      y: 104,
    },
    {
      x: 24,
      y: 15,
    },
    {
      x: 36,
      y: 1,
    },
    {
      x: 12,
      y: 46,
    },
    {
      x: 78,
      y: 77,
    },
    {
      x: 59,
      y: 103,
    },
    {
      x: 39,
      y: 71,
    },
    {
      x: 61,
      y: 6,
    },
    {
      x: 35,
      y: 112,
    },
    {
      x: 89,
      y: 40,
    },
    {
      x: 68,
      y: 104,
    },
    {
      x: 37,
      y: 3,
    },
    {
      x: 13,
      y: 83,
    },
    {
      x: 39,
      y: 94,
    },
    {
      x: 35,
      y: 47,
    },
    {
      x: 65,
      y: 62,
    },
    {
      x: 52,
      y: 77,
    },
    {
      x: 68,
      y: 50,
    },
    {
      x: 99,
      y: 7,
    },
    {
      x: 46,
      y: 98,
    },
    {
      x: 88,
      y: 1,
    },
    {
      x: 59,
      y: 90,
    },
    {
      x: 19,
      y: 40,
    },
    {
      x: 33,
      y: 42,
    },
    {
      x: 61,
      y: 26,
    },
    {
      x: 74,
      y: 31,
    },
    {
      x: 56,
      y: 95,
    },
    {
      x: 45,
      y: 58,
    },
    {
      x: 20,
      y: 57,
    },
    {
      x: 41,
      y: 49,
    },
    {
      x: 57,
      y: 17,
    },
    {
      x: 12,
      y: 13,
    },
    {
      x: 90,
      y: 87,
    },
    {
      x: 64,
      y: 21,
    },
    {
      x: 31,
      y: 45,
    },
    {
      x: 4,
      y: 113,
    },
    {
      x: 2,
      y: 48,
    },
    {
      x: 39,
      y: 63,
    },
    {
      x: 73,
      y: 55,
    },
    {
      x: 68,
      y: 118,
    },
    {
      x: 68,
      y: 41,
    },
    {
      x: 94,
      y: 24,
    },
    {
      x: 62,
      y: 21,
    },
  ];

  function updateChart() {
    // set up dimension for the chart
    const svg = d3
      .select(".scatter-chart")
      .attr("width", width + padding.left + padding.right)
      .attr("height", height + padding.top + padding.bottom);

    // create scale for y axis and x axis
    const xScale = d3
      .scaleLinear()
      .domain([
        data.reduce((first, second) => {
          return first.x < second.x ? first : second;
        }).x,
        data.reduce((first, second) => {
          return first.x > second.x ? first : second;
        }).x,
      ])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        data.reduce((first, second) => {
          return first.y < second.y ? first : second;
        }).y,
        data.reduce((first, second) => {
          return first.y > second.y ? first : second;
        }).y,
      ])
      .range([height, 0]);

    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);

    svg
      .append("g")
      .call(yAxis)
      .attr("transform", `translate(${padding.left}, ${padding.top})`)
      .attr("color", axesColor)
      .selectAll(".tick line")
      .attr("x2", width)
      .attr("stroke-width", "0.5")
      .attr("opacity", "0.3");

    svg
      .append("g")
      .call(xAxis)
      .attr(
        "transform",
        `translate(${padding.left}, ${height + padding.bottom})`
      )
      .attr("color", axesColor)
      .selectAll(".tick line")
      .attr("y2", -height)
      .attr("stroke-width", "0.5")
      .attr("opacity", "0.3");

    svg
      .append("g")
      .selectAll("circle")
      .data([...data])
      .join("circle")
      .attr("r", "3")
      .attr("cx", Math.random() * width + padding.left)
      .attr("cy", Math.random() * height + padding.top)
      .attr("fill", dotColor)
      .transition()
      .duration(1200)
      .attr("cx", function (d: { x: number; y: number }) {
        return xScale(d.x) + padding.left;
      })
      .attr("cy", function (d: { x: number; y: number }) {
        return yScale(d.y) + padding.top;
      });
  }

  function updateInteractivity() {}

  useEffect(() => {
    updateChart();
  }, []);

  return (
    <Fragment>
      <div className="chart-container">
        <svg className="scatter-chart"></svg>
      </div>
    </Fragment>
  );
}
