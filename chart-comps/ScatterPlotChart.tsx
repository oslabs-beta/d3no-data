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
  const dotHoverColor = props.dotHoverColor || "#90BE6D";
  const dotSize = props.dotSize || "5";
  const axesColor = props.axesColor || "#4D908E";
  const fontFamily = props.fontFamily || "Verdana";
  const addAxesLabel = props.addAxesLabel || true;
  const xAxisLabel = props.xAxisLabel || "x label";
  const yAxisLabel = props.yAxisLabel || "y label";
  const axesFontSize = props.axesFontSize || "0.8em";
  const axesLabelColor = props.axesLabelColor || "#277DA1";
  const addTitle = props.addTitle || false;
  const setTitle = props.setTitle || "TITLE";
  const setTitleSize = props.setTitleSize || "1.5em";
  const setTitleColor = props.setTitleColor || axesLabelColor;
  const animation = props.animation == false ? false : true;
  const animationDuration = props.animationDuration || 1200;
  const data: { x: number; y: number }[] = props.data || [];

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
      .attr("font-family", fontFamily)
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
      .attr("font-family", fontFamily)
      .selectAll(".tick line")
      .attr("y2", -height)
      .attr("stroke-width", "0.5")
      .attr("opacity", "0.3");

    svg
      .append("g")
      .classed("dots", true)
      .selectAll("circle")
      .data([...data])
      .join("circle")
      .attr("r", dotSize)
      .attr("cx", Math.random() * width + padding.left)
      .attr("cy", Math.random() * height + padding.top)
      .attr("fill", dotColor)
      .transition()
      .duration(animationDuration * (animation ? 1 : 0))
      .attr("cx", function (d: { x: number; y: number }) {
        return xScale(d.x) + padding.left;
      })
      .attr("cy", function (d: { x: number; y: number }) {
        return yScale(d.y) + padding.top;
      });
  }

  // upon hover
  function updateInteractivity() {
    const toolTip = d3
      .select(".chart-container")
      .append("div")
      .style("opacity", 0)
      .classed("toolTip", true)
      .style("background-color", "white")
      .style("position", "relative")
      .style("font-family", fontFamily)
      .style("width", "max-content")
      .style("border", "1px")
      .style("border-style", "solid")
      .style("border-radius", "5px")
      .style("padding", "5px");

    function handleMouseOver(e: Event, d: { x: number; y: number }): void {
      const [x, y] = d3.pointer(e);
      toolTip
        .style("opacity", 1)
        .style("position", "relative")
        .html(`x: ${d.x}, y: ${d.y}`)
        .style("left", `${x + 5}px`)
        .style("top", `${y - height - padding.top - padding.bottom - 40}px`);

      d3.select(this)
        .style("stroke", dotHoverColor)
        .style("stroke-width", 1)
        .style("cursor", "pointer");
    }

    function handleMouseLeave(): void {
      toolTip.style("opacity", 0).style("position", "absolute");
      d3.select(this).style("stroke-width", 0);
    }

    const svg = d3
      .select(".dots")
      .selectAll("circle")
      .on("mouseover", handleMouseOver)
      .on("mouseleave", handleMouseLeave);
  }

  function updateLabel() {
    // add x axis label
    d3.select(".scatter-chart")
      .append("text")
      .attr("x", padding.left / 2)
      .attr("y", padding.top - 5)
      .attr("font-family", fontFamily)
      .attr("font-size", axesFontSize)
      .attr("text-anchor", "start")
      .attr("fill", axesLabelColor)
      .text(xAxisLabel);

    // add y axis label
    d3.select(".scatter-chart")
      .append("text")
      .attr("x", (width + padding.left + padding.right) / 2)
      .attr("y", height + padding.bottom + padding.top - 5)
      .attr("font-family", fontFamily)
      .attr("font-size", axesFontSize)
      .attr("text-anchor", "middle")
      .attr("fill", axesLabelColor)
      .text(yAxisLabel);
  }

  // to add title
  function updateTitle() {
    d3.select(".scatter-chart")
      .append("text")
      .attr("x", (width + padding.left + padding.right) / 2)
      .attr("y", padding.top / 2)
      .attr("font-family", fontFamily)
      .attr("font-size", setTitleSize)
      .attr("text-anchor", "middle")
      .attr("fill", setTitleColor)
      .text(setTitle);
  }

  useEffect(() => {
    updateChart();
    if (addAxesLabel) {
      updateLabel();
    }
    if (addTitle) {
      updateTitle();
    }
    updateInteractivity();
  }, []);

  return (
    <Fragment>
      <div className="chart-container">
        <svg className="scatter-chart"></svg>
      </div>
    </Fragment>
  );
}
