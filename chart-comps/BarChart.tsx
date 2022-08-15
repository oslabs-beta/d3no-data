/** @jsx h */
import { h, Fragment, useEffect, d3 } from "../mod.ts";
import { BarChartProps } from "../ChartProps/BarChartProps.ts";

// need to work on paddings that dynamically update to avoid overlapping with the graph

// need to work on paddings that dynamically update to avoid overlapping with the graph

export default function BarChart(props: BarChartProps) {
  // setting up data
  const padding = {
    // to avoid label to go out of svg
    top: (props.paddingTop || 40) + 20,
    left: (props.paddingLeft || 40) + 20,
    right: (props.paddingRight || 40) + 20,
    bottom: (props.paddingBottom || 40) + 20,
  };

  const data: { x: string; y: number }[] = props.data || [];
  const label: string[] = [];
  const width = (props.width || 700) - padding.left - padding.right; // width of the svg
  const height = (props.height || 700) - padding.top - padding.bottom; // height of the svg

  const barPadding = 5; // padding provided between each bar
  const barPaddingBottom = 5; // padding provided between the chart and the x-axis
  const toolTip = props.toolTip == false ? props.toolTip : true;
  const addAxesLabel = props.addAxesLabel == true ? props.addAxesLabel : false;
  const animation = props.animation == false ? props.animation : true;
  const animationDuration = props.animationDuration || 800;
  const animationDelay = props.animationDelay || 100;
  const xAxisLabel = props.xAxisLabel || "x label";
  const yAxisLabel = props.yAxisLabel || "ylabel";
  const barColor = props.barColor || "#BFE4A3";
  const barHoverColor = props.barHoverColor || "#90BE6D";
  const fontFamily = props.fontFamily || "Verdana";
  const axesColor = props.axesColor || "#4D908E";
  const axesLabelColor = props.axesLabelColor || "#277DA1";
  const addTitle = props.addTitle || false;
  const setTitle = props.setTitle || "TITLE";
  const setTitleSize = props.setTitleSize || "1.5em";
  const setTitleColor = props.setTitleColor || axesLabelColor;
  const setTitlePadding = props.setTitlePaddingTop || 40;

  // function to add tooltip
  function updateInteractivity() {
    const toolTipBackground = d3
      .select(".bar-chart")
      .append("rect")
      .attr("fill", "white")
      .attr("rx", 5)
      .attr("opacity", 0);
    const toolTip = d3
      .select(".bar-chart")
      .append("text")
      .attr("opacity", 0)
      .attr("font-family", fontFamily);

    function handleMouseOver(): void {
      toolTip.attr("opacity", 1);
      toolTipBackground.attr("opacity", 1);
    // .style("background-color", "white")
    // .style("position", "relative")
    // .style("width", "max-content")
    // .style("border", "1px")
    // .style("border-style", "solid")
    // .style("border-radius", "5px")
    // .style("padding", "5px");

    function handleMouseOver(): void {
      toolTip.attr("opacity", 1);
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 0.8)
        .style("cursor", "pointer");
    }

    function handleMouseMove(e: Event, d: { x: string; y: number }): void {
      const toolTipPaddingLeft = 15;
      const toolTipPaddingTop = 10;
      const [x, y] = d3.pointer(e);
      toolTip
        .text(`${d.y}`)
        .attr("x", x + toolTipPaddingLeft)
        .attr("y", y - toolTipPaddingTop);

      const { width, height } = toolTip.node()?.getBBox();

      const padding = 10;

      toolTipBackground
        .attr("x", x + toolTipPaddingLeft - padding / 2)
        .attr("y", y - height - (padding + toolTipPaddingTop) / 2)
        .attr("width", width + padding)
        .attr("height", height + padding);
    }
    function handleMouseLeave(): void {
      toolTip.attr("opacity", 0).text("");
      toolTipBackground.attr("opacity", 0).attr("width", 0).attr("height", 0);
      d3.select(this).transition().duration(100).style("opacity", 1);
      const [x, y] = d3.pointer(e);
      toolTip
        .text(`${d.y}`)
        .attr("x", x + 10)
        .attr("y", y - 5);
    }
    function handleMouseLeave(): void {
      toolTip.attr("opacity", 0);
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
      .domain([
        0,
        data.reduce((obj1, obj2) => {
          return obj1.y > obj2.y ? obj1 : obj2;
        }).y,
      ])
      .range([height - padding.top - padding.bottom, 0]);

    for (let obj of data) {
      label.push(obj.x);
    }

    // scale function for x axis
    const xScale = d3
      .scaleBand()
      .domain(label)
      .range([0, width - padding.left - padding.right + barPaddingBottom]);

    const barWidth = (width - padding.left - padding.right) / data.length;

    // rendering bar charts
    d3.select(".bars")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", function (d: { x: string; y: number }, i: number): number {
        return barWidth * i + padding.left + barPadding;
      })
      .attr("width", barWidth - barPadding)
      .attr("height", 0)
      .attr("y", height - barPaddingBottom)
      .transition()
      .ease(d3.easeCubic)
      .delay(function (d: { x: string; y: number }, i: number): number {
        return i * animationDelay * (animation ? 1 : 0);
      })
      .duration(animationDuration * (animation ? 1 : 0))
      .attr("y", function (d: { x: string; y: number }): number {
        return (
          yScale(d.y) -
          padding.bottom -
          barPaddingBottom +
          padding.bottom +
          padding.top
        );
      })
      .attr(
        "height",
        function (d: { x: string; y: number }, i: number): number {
          return height - yScale(d.y) - padding.bottom - padding.top;
        }
      )
      .attr("rx", "3")
      .attr("fill", barColor);

    const yAxis = d3.axisLeft(yScale).ticks(8);
    const xAxis = d3.axisBottom(xScale);

    const barChart = d3.select(".bar-chart");

    // render y Axis
    barChart
      .insert("g", "g")
      .call(yAxis)
      // have to make this data to show for charts dynamic
      .attr(
        "transform",
        `translate(${padding.left + padding.right}, ${
          padding.top + padding.bottom
        })`
      )
      .attr("font-size", "0.5em")
      .attr("font-family", fontFamily)
      .attr("color", axesColor)
      .selectAll(".tick line")
      .attr("x2", width - padding.left - padding.right)
      .attr("opacity", "0.5");

    // render x Axis
    barChart
      .append("g")
      .call(xAxis)
      .attr(
        "transform",
        `translate(${padding.left + padding.right}, ${height})`
      )
      .attr("font-size", "0.5em")
      .attr("font-family", fontFamily)
      .attr("color", axesColor)
      .selectAll(".tick text")
      .attr("transform", "translate(-10, 3) rotate(-30)"); // have to take into account the variables for rotation too

    d3.select(".bar-chart").selectAll(".tick line").attr("y2", 0);
  }

  function updateLabel() {
    // add label to the chart
    d3.select(".bar-chart")
      .append("text")
      .attr(
        "transform",
        `translate(${padding.left}, ${
          (height + padding.top + padding.bottom) / 2
        }) rotate(-90)`
      )
      .attr("fill", axesLabelColor)
      .attr("font-family", fontFamily)
      .attr("font-size", "0.8em")
      .attr("text-anchor", "middle")
      .text(`${yAxisLabel}`);

    d3.select(".bar-chart")
      .append("text")
      .text(`${xAxisLabel}`)
      .attr("x", (width + padding.left) / 2)
      .attr("y", height + padding.bottom)
      .attr("font-family", fontFamily)
      .attr("font-size", "0.8em")
      .attr("text-anchor", "middle")
      .attr("fill", axesLabelColor);
  }

  function updateTitle() {
    d3.select(".bar-chart")
      .append("text")
      .attr("x", (width + padding.left) / 2)
      .attr("y", setTitlePadding)
      .attr("font-family", fontFamily)
      .attr("font-size", setTitleSize)
      .attr("fill", setTitleColor)
      .text(setTitle);
  }

  useEffect(() => {
    updateChart();
    if (toolTip) {
      updateInteractivity();
    }
    if (addAxesLabel) {
      updateLabel();
    }
    if (addTitle) {
      updateTitle();
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
