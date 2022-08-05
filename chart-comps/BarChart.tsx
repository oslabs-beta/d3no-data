/** @jsx h */
import { h, Fragment, useEffect, d3 } from "../mod.ts";
import { BarChartProps } from "../ChartProps/BarChartProps.ts";

// need to work on paddings that dynamically update to avoid overlapping with the graph

export default function BarChart(props: BarChartProps) {
  // setting up data
  const padding = {
    top: props.paddingTop || 0,
    left: props.paddingLeft || 0,
    right: props.paddingRight || 0,
    bottom: props.paddingBottom || 0,
  };
  const myData: number[] = props.data || [];
  const label: string[] = props.labels || [];
  const width = props.width || 700; // width of the svg
  const height = props.height || 700; // height of the svg
  const barPadding = 5; // padding provided between each bar
  const barPaddingBottom = 5; // padding provided between the chart and the x-axis
  const toolTip = props.toolTip == false ? props.toolTip : true;
  const addLabel = props.addLabel == false ? props.addLabel : true;
  const animation = props.animation == false ? props.animation : true;
  const animationDuration = props.animationDuration || 800;
  const animationDelay = props.animationDelay || 100;
  const xAxisLabel = props.xAxisLabel || "x label";
  const yAxisLabel = props.yAxisLabel || "ylabel";
  const barColor = props.barColor || "#BFE4A3";
  const barHoverColor = props.barHoverColor || "#90BE6D";
  const fontFamily = props.fontFamily || "Verdana";
  const axesColor = props.axesColor || "#4D908E";

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
      .style("font-family", fontFamily)
      .style("width", "max-content")
      .style("border", "1px")
      .style("border-style", "solid")
      .style("border-radius", "5px")
      .style("padding", "5px");

    function handleMouseOver(): void {
      toolTip.style("opacity", 1);
      d3.select(this)
        .style("stroke", barHoverColor)
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
    d3.select(".bar-chart").attr("width", width).attr("height", height);

    // scale function for y axis
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(myData)])
      .range([height - padding.top - padding.bottom, 0]);

    // scale function for x axis
    const xScale = d3
      .scaleBand()
      .domain(label)
      .range([0, width - padding.left - padding.right + barPaddingBottom]);

    const barWidth = (width - padding.left - padding.right) / myData.length;

    d3.select(".bars")
      .selectAll("rect")
      .data(myData)
      .join("rect")
      .attr("x", function (d: number, i: number): number {
        return barWidth * i + padding.left + barPadding;
      })
      .attr("width", barWidth - barPadding)
      .attr("height", 0)
      .attr("y", height - padding.bottom - barPaddingBottom)
      .transition()
      .ease(d3.easeCubic)
      .delay(function (d: number, i: number): number {
        return i * animationDelay * (animation ? 1 : 0);
      })
      .duration(animationDuration * (animation ? 1 : 0))
      .attr("y", function (d: number): number {
        return (
          yScale(d) -
          padding.bottom -
          barPaddingBottom +
          padding.bottom +
          padding.top
        );
      })
      .attr("height", function (d: number, i: number): number {
        return height - yScale(d) - padding.bottom - padding.top;
      })
      .attr("rx", "3")
      .attr("fill", barColor);

    const yAxis = d3.axisLeft(yScale).ticks(10);
    const xAxis = d3.axisBottom(xScale);

    const barChart = d3.select(".bar-chart");

    barChart
      .insert("g", "g")
      .call(yAxis)
      // have to make this data to show for charts dynamic
      .attr("transform", `translate(${padding.left}, ${padding.top})`)
      .attr("font-size", "0.5em")
      .attr("font-family", fontFamily)
      .attr("color", axesColor)
      .selectAll(".tick line")
      .attr("x2", width - padding.left - padding.right)
      .attr("opacity", "0.3")
      .attr("stroke-dasharray", "1, 1");

    barChart
      .append("g")
      .call(xAxis)
      .attr(
        "transform",
        `translate(${padding.left}, ${height - padding.bottom})`
      )
      .attr("font-size", "0.5em")
      .attr("font-family", fontFamily)
      .attr("color", axesColor)
      .selectAll(".tick text")
      .attr("transform", "translate(-10, 3)rotate(-45)") // have to take into account the variables for rotation too
      .style("text-anchor", "end");
  }

  function updateLabel() {
    // add label to the chart
    d3.select(".bar-chart")
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", padding.bottom)
      .attr("y", padding.left)
      .attr("font-family", fontFamily)
      .text(yAxisLabel);

    d3.select(".bar-chart")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height - padding.bottom / 2)
      .attr("font-family", fontFamily)
      .text(xAxisLabel);
  }

  useEffect(() => {
    updateChart();
    if (toolTip) {
      updateInteractivity();
    }
    if (addLabel) {
      updateLabel();
    }
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
