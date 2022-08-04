/** @jsx h */
import { h, Fragment, useEffect, d3 } from "../mod.ts";

interface LineProps {
  data: {
    x: number;
    y: number;
  };
}

export default function LineChart() {
  const margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30,
  };
  const width = 500 - margin.left - margin.right;
  const height = 500 - margin.bottom - margin.top;
  let data: { x: Date; y: number }[] = [];

  function updateData() {
    for (let i = 1900; i <= 2000; i += 5) {
      data.push({ x: new Date(i, 1, 1), y: Math.floor(Math.random() * 200) });
    }
  }

  function updateChart() {
    const svg = d3
      .select(".line-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    // configure scale
    const xScale = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d: { x: Date; y: number }): Date {
          return d.x;
        })
      )
      .range([0, width]);
    const xAxis = d3.axisBottom(xScale);
    svg
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(${margin.left}, ${height})`)
      .attr("font-size", "0.5em")
      .attr("font-family", "Verdana")
      .attr("color", "#4D908E")
      .selectAll(".tick text")
      .attr("transform", "translate(-10, 3)rotate(-45)") // have to take into account the variables for rotation too
      .style("text-anchor", "end");

    const yScale = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function (d: { x: Date; y: number }): number {
          return d.y;
        })
      )
      .range([height, margin.top]);
    const yAxis = d3.axisLeft(yScale);
    svg
      .append("g")
      .call(yAxis)
      .attr("transform", `translate(${margin.left})`)
      .attr("font-size", "0.5em")
      .attr("font-family", "Verdana")
      .attr("color", "#4D908E")
      .selectAll(".tick line");

    svg
      .append("path")
      .data([data])
      .attr("fill", "none")
      .attr("stroke", "#BFE4A3")
      .attr("stroke-width", 2)
      .transition()
      .duration(1000)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return xScale(d.x);
          })
          .y(function (d) {
            return yScale(d.y);
          })
      )
      .attr("transform", `translate(${margin.left})`);
  }

  useEffect(() => {
    updateData();
    updateChart();
  }, []);

  return (
    <Fragment>
      <div className="chart-container">
        <svg className="line-chart">
          {/* to group line */}
          <g></g>
        </svg>
      </div>
    </Fragment>
  );
}
