/** @jsx h */
import { h, Fragment, useEffect, d3 } from "../mod.ts";

// defining property for user to pass down props
interface barChartData {
  width: number;
  height: number;
  data: number[];
  label: string[];
}

// need to move all the variable up here

export default function BarChart() {
  const myData: number[] = [];
  const label: string[] = [];
  const numData = 7;

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
    const barPadding = 5;
    const barPaddingBottom = 5;
    const chartHeightPadding = 22;
    const chartWidthPadding = 40;
    const barsPaddingFromYAxis = 3;

    d3.select(".bar-chart").attr("width", width).attr("height", height);

    // scale function for y axis

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(myData)])
      .range([0, height - xAxisSize - chartHeightPadding]);

    // scale function for x axis
    const xScale = d3
      .scaleBand()
      .domain(label)
      .range([0, width - yAxisSize - chartWidthPadding + barsPaddingFromYAxis]);

    const barWidth = (width - yAxisSize - chartWidthPadding) / numData;

    const toolTip = d3
      .select(".chart-container")
      .append("div")
      .style("opacity", 0)
      .classed("tooltip", true)
      .style("background-color", "white")
      .style("border", "black")
      .style("border-radius", "5px")
      .style("padding", "5px");

    function handleMouseOver(): void {
      toolTip.style("opacity", 1);
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
        .style("cursor", "pointer");
    }
    function handleMouseMove(d: number): void {
      toolTip.html(`The value is ${d}`);
    }
    function handleMouseLeave(): void {
      toolTip.style("opacity", 0);
      d3.select(this).style("stroke", "none").style("opacity", 0.8);
    }

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
      })
      .attr("rx", "3")
      .attr("fill", "#BFE4A3")
      .attr("stroke", "#90BE6D")
      .attr("stroke-width", "2")
      .filter(() => true)
      .on("mouseover", handleMouseOver)
      .on("mousemove", function (e: Event, d: number) {
        handleMouseMove(d);
      })
      .on("mouseleave", handleMouseLeave);

    const yAxis = d3.axisLeft(yScale).ticks(10);
    const xAxis = d3.axisBottom(xScale);

    const barChart = d3.select(".bar-chart");

    barChart
      .insert("g", "g")
      .call(yAxis)
      // have to make this data to show for charts dynamic
      .attr("transform", `translate(${yAxisSize}, ${chartHeightPadding})`)
      .attr("font-size", "0.5em")
      .attr("font-family", "Verdana")
      .attr("color", "#4D908E")
      .selectAll(".tick line")
      .attr("x2", width - yAxisSize - chartWidthPadding)
      .attr("opacity", "0.3")
      .attr("stroke-dasharray", "1, 1");

    barChart
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(${yAxisSize}, ${height - xAxisSize})`)
      .attr("font-size", "0.5em")
      .attr("font-family", "Verdana")
      .attr("color", "#4D908E")
      .selectAll(".tick line")
      .attr("y2", "0"); // shows the ticks of the line
  }

  useEffect(() => {
    updateData();
    updateChart();
  }, []);

  return (
    <Fragment>
      <div className="chart-container">
        <svg className="bar-chart">
          {/* grouping for bars and axes */}
          <g>
            <g className="bars"></g>
          </g>
        </svg>
      </div>
    </Fragment>
  );
}
