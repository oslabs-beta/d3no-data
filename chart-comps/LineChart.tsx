// deno-lint-ignore-file
/** @jsx h */
import { h, Fragment, useEffect, d3 } from "../mod.ts";
import { LineChartProps } from "../chart-props/LineChartProps.ts";

export default function LineChart(props: LineChartProps) {
  const yLabelPadding = 20;
  const xLabelPadding = 20;
  const padding = {
    top: (props.paddingTop || 50) + yLabelPadding,
    right: (props.paddingRight || 50) + xLabelPadding,
    bottom: (props.paddingBottom || 50) + yLabelPadding,
    left: (props.paddingLeft || 50) + xLabelPadding,
  };
  const width =
    (props.width || 800) - padding.left - padding.right - xLabelPadding * 2;
  const height =
    (props.height || 600) - padding.bottom - padding.top - yLabelPadding * 2;
  const fontFamily = props.fontFamily || "Verdana";
  const xAxisLabel = props.xAxisLabel || "x label";
  const yAxisLabel = props.yAxisLabel || "y label";
  const axesLabelColor = props.axesLabelColor || "#277DA1";
  const axesLabelSize = props.axesLabelSize || "0.8em";
  const axesColor = props.axesColor || "#4D908E";
  const axesFontSize = props.axesFontSize || "0.5em";
  const addLabel = props.addLabel || false;
  const addTooltip = props.addTooltip === false ? false : true;
  const addTitle = props.addTitle || false;
  const setTitle = props.setTitle || "TITLE";
  const setTitleColor = props.setTitleColor || axesLabelColor;
  const lineColor = props.lineColor || "#BFE4A3";
  const receivedData = props.data;
  const data: { x: Date; y: number }[] = [];
  const animation = props.animation || true;
  const animationDuration = props.animationDuration || 5000;

  // create datasets variable in order to incorporate more lines in the chart

  function cleanData() {
    for (let d of receivedData) {
      data.push({
        x: new Date(d.x),
        y: d.y,
      });
    }
  }
  function updateChart() {
    const svg = d3
      .select(".line-chart")
      .attr("width", width + padding.left + padding.right + xLabelPadding * 2)
      .attr(
        "height",
        height + padding.top + padding.bottom + yLabelPadding * 2
      );

    // configure scale
    const xScale = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d: { x: Date; y: number }): Date {
          return d.x;
        })
      )
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function (d: { x: Date; y: number }): number {
          return d.y;
        })
      )
      .range([height + padding.bottom, padding.top]);

    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);

    // customizing x axis
    svg
      .append("g")
      .call(xAxis)
      .attr(
        "transform",
        `translate(${padding.left + xLabelPadding}, ${
          height + padding.bottom + yLabelPadding
        })`
      )
      .attr("font-size", axesFontSize)
      .attr("font-family", fontFamily)
      .attr("color", axesColor)
      .selectAll(".tick text")
      .attr("transform", "translate(-10, 3)rotate(-45)") // have to take into account the variables for rotation too
      .style("text-anchor", "end");

    // select the first g component which is the y axis in the graph
    d3.select("g")
      .selectAll(".tick line")
      .attr("y2", -height)
      .attr("opacity", "0.3");

    // customizing y axis
    svg
      .append("g")
      .call(yAxis)
      .attr(
        "transform",
        `translate(${padding.left + xLabelPadding}, ${yLabelPadding})`
      )
      .attr("font-family", fontFamily)
      .attr("font-size", axesFontSize)
      .attr("color", axesColor)
      .selectAll(".tick line")
      .attr("x2", width)
      .attr("opacity", "0.3");

    svg
      .append("path")
      .classed("data-line", true)
      .data([data])
      .attr(
        "transform",
        `translate(${padding.left + xLabelPadding}, ${yLabelPadding})`
      )
      .attr("fill", "none")
      .attr("stroke", lineColor)
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
          .curve(d3.curveLinear)
      )
      .attr("stroke-width", 3)
      .filter(() => animation)
      .attr("stroke-dasharray", function () {
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function () {
        return this.getTotalLength();
      })
      .transition()
      .duration(animationDuration)
      .attr("stroke-dashoffset", 0);

    if (addTooltip) {
      const focus = d3
        .select(".line-chart")
        .append("g")
        .append("circle")
        .style("fill", "#4D908E")
        .style("stroke", "#4D908E")
        .style("r", 5)
        .style("opacity", 0);

      const focusSquare = d3
        .select(".line-chart")
        .attr("fill", "white")
        .attr("rx", 5)
        .append("rect")
        .attr("opacity", 0);

      const focusText = d3
        .select(".line-chart")
        .append("text")
        .attr("opacity", 0)
        .attr("text-anchor", "start");

      const bisect = d3.bisector(function (d) {
        return d.x;
      }).left;

      function handleMouseOver() {
        focus.transition().duration(1000).style("opacity", 1);
        focusText.style("opacity", 1);
        focusSquare.style("opacity", 1);
      }

      function handleMouseLeave() {
        focus.style("opacity", 0);
        focusText.style("opacity", 0);
        focusSquare.style("opacity", 0);
      }

      function handleMouseMove(e: Event) {
        const toolTipPaddingLeft = 15;
        const toolTipPaddingTop = 10;
        const [x, y] = d3.pointer(e);
        const x0 = xScale.invert(x - padding.left);
        const i = bisect(data, x0, 1);
        const selectedData = data[i - 1];

        const { width, height } = focusText.node()?.getBBox();

        focus
          .style("cx", xScale(selectedData.x) + padding.left + xLabelPadding)
          .style("cy", yScale(selectedData.y) + yLabelPadding);

        focusSquare
          .attr("x", `${xScale(selectedData.x) + xLabelPadding + padding.left}`)
          .attr("y", `${yScale(selectedData.y) - height}`)
          .attr("width", width + toolTipPaddingLeft)
          .attr("height", height + toolTipPaddingTop)
          .attr("stroke", "black")
          .attr("stroke-opacity", "0.5")
          .attr("rx", 8);

        focusText
          .html(`${selectedData.y}`)
          .attr(
            "x",
            `${
              xScale(selectedData.x) +
              xLabelPadding +
              padding.left +
              toolTipPaddingLeft / 2
            }`
          )
          .attr("y", `${yScale(selectedData.y)}`)
          .attr("font-family", fontFamily)
          .attr("fill", "black");
      }

      d3.select(".line-chart")
        .on("mouseover", handleMouseOver)
        .on("mousemove", handleMouseMove)
        .on("mouseleave", handleMouseLeave);
    }
  }

  function updateTitle() {
    d3.select(".line-chart")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", (width + padding.left + padding.right) / 2)
      .attr("y", padding.top / 2)
      .attr("font-family", fontFamily)
      .attr("fill", setTitleColor)
      .text(setTitle);
  }

  // add label to the x and y axes
  function updateLabel() {
    d3.select(".line-chart")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-family", fontFamily)
      .attr("fill", axesLabelColor)
      .attr("font-size", axesLabelSize)
      .attr(
        "transform",
        `translate(${padding.left / 2}, ${
          (height + padding.bottom + padding.top) / 2
        }) rotate(-90)`
      )
      .text(yAxisLabel);

    d3.select(".line-chart")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", (width + padding.left + padding.right) / 2)
      .attr("y", height + padding.bottom + padding.top + yLabelPadding)
      .attr("font-family", fontFamily)
      .attr("fill", axesLabelColor)
      .attr("font-size", axesLabelSize)
      .text(xAxisLabel);
  }

  // create another function to add animation instead of grouping theme into create chart

  useEffect(() => {
    cleanData();
    updateChart();
    if (addLabel) {
      updateLabel();
    }
    if (addTitle) {
      updateTitle();
    }
  }, []);

  return (
    <Fragment>
      <div className="chart-container">
        <svg className="line-chart"></svg>
      </div>
    </Fragment>
  );
}
