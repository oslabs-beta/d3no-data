/** @jsx h */
import { h, Fragment, useEffect, d3 } from "../mod.ts";

// defining property for user to pass down props
interface barChartData {
  width?: number;
  height?: number;
  data: number[];
  labels: string[]; // for y axes
  xAxisLabel?: string;
  yAxisLabel?: string;
  barPadding?: number;
  color?: string;
  animation?: boolean;
  toolTip?: boolean;
  toolTipText?: string;
  fontFamily?: string;
}

// need to move all the variable up here

export default function BarChart() {
  const myData: number[] = [];
  const label: string[] = [];
  const numData = 12;

  // temp function to update data
  function updateData() {
    for (let i = 0; i < numData; i++) {
      myData.push(Math.floor(Math.random() * 100));
      label.push(i + "");
    }
  }

  // function to add tooltip
  function updateInteractivity() {
    // add a tool tip
    const toolTip = d3
      .select("body")
      .append("div")
      .style("opacity", 0)
      .classed("tooltip", true)
      .style("background-color", "white")
      .style("position", "absolute")
      .style("font-family", "Verdana")
      .style("width", "max-content")
      .style("border", "1px")
      .style("border-style", "solid")
      .style("border-radius", "5px")
      .style("padding", "5px");

    function handleMouseOver(): void {
      toolTip.style("opacity", 1);
      d3.select(this)
        .style("stroke", "#90BE6D")
        .style("stroke-width", "2")
        .style("opacity", 1)
        .style("cursor", "pointer");
    }

    function handleMouseMove(e: Event, d: number): void {
      const [x, y] = d3.pointer(e);
      toolTip
        .html(`${d}`)
        .style("left", `${x + 20}px`)
        .style("top", `${y - 30}px`);
    }
    function handleMouseLeave(): void {
      toolTip.style("opacity", 0);
      d3.select(this).style("stroke", "none");
    }

    d3.select(".bars")
      .selectAll("rect")
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseleave", handleMouseLeave);
  }

  function updateChart() {
    const yAxisSize = 44; // padding of the left and right section between the chart and the svg
    const xAxisSize = 80; // padding of the top and bottom between the chart and the svg
    const width = 700; // width of the svg
    const height = 700; // height of the svg
    const barPadding = 5; // padding provided between each bar
    const barPaddingBottom = 5; // padding provided between the chart and the x-axis
    // need to add coloring

    d3.select(".bar-chart").attr("width", width).attr("height", height);

    d3.select(".bar-chart")
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", xAxisSize)
      .attr("y", yAxisSize)
      .attr("font-family", "Verdana")
      .text("x label");

    d3.select(".bar-chart")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height - xAxisSize / 2)
      .attr("font-family", "Verdana")
      .text("y label");

    // scale function for y axis
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(myData)])
      .range([height - xAxisSize * 2, 0]);

    // scale function for x axis
    const xScale = d3
      .scaleBand()
      .domain(label)
      .range([0, width - yAxisSize * 2 + barPaddingBottom]);

    const barWidth = (width - yAxisSize * 2) / numData;

    const bars = d3
      .select(".bars")
      .selectAll("rect")
      .data(myData)
      .join("rect")
      .attr("x", function (d: number, i: number): number {
        return barWidth * i + yAxisSize + barPadding;
      })
      .attr("width", barWidth - barPadding)
      .attr("height", 0)
      .attr("y", height - xAxisSize - barPaddingBottom)
      .transition()
      .ease(d3.easeCubic)
      .delay(function (d: number, i: number): number {
        return i * 100;
      })
      .duration(800)
      .attr("y", function (d: number): number {
        return yScale(d) - xAxisSize - barPaddingBottom + xAxisSize * 2;
      })
      .attr("height", function (d: number, i: number): number {
        return height - yScale(d) - xAxisSize * 2;
      })
      .attr("rx", "3")
      .attr("fill", "#BFE4A3");

    const yAxis = d3.axisLeft(yScale).ticks(10);
    const xAxis = d3.axisBottom(xScale);

    const barChart = d3.select(".bar-chart");

    barChart
      .insert("g", "g")
      .call(yAxis)
      // have to make this data to show for charts dynamic
      .attr("transform", `translate(${yAxisSize}, ${xAxisSize})`)
      .attr("font-size", "0.5em")
      .attr("font-family", "Verdana")
      .attr("color", "#4D908E")
      .selectAll(".tick line")
      .attr("x2", width - yAxisSize * 2)
      .attr("opacity", "0.3")
      .attr("stroke-dasharray", "1, 1");

    barChart
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(${yAxisSize}, ${height - xAxisSize})`)
      .attr("font-size", "0.5em")
      .attr("font-family", "Verdana")
      .attr("color", "#4D908E")
      .selectAll(".tick text")
      .attr("transform", "translate(-10, 3)rotate(-45)") // have to take into account the variables for rotation too
      .style("text-anchor", "end");
  }

  useEffect(() => {
    updateData();
    updateChart();
    updateInteractivity();
  }, []);

  return (
    <Fragment>
      <div className="chart-container">
        <svg className="bar-chart">
          <g>
            <g className="bars"></g>
          </g>
        </svg>
      </div>
    </Fragment>
  );
}
