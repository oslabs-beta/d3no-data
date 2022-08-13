// deno-lint-ignore-file
/** @jsx h */
import { h, Fragment, useEffect, d3 } from "../mod.ts";
import { LineChartProps } from "../ChartProps/LineChartProps.ts";

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
  const receivedDatasets = props.datasets;
  const animation = props.animation || true;
  const animationDuration = props.animationDuration || 5000;
  const addLegend = props.addLegend === false ? props.addLegend : true;
  // create datasets variable in order to incorporate more lines in the chart
  const datasets = [];

  // configure scale
  let drawPoints = [];
  function cleanDatasets() {
    for (let ds of receivedDatasets) {
      const tempData = [];
      for (let obj of ds.data) {
        tempData.push({
          x: new Date(obj.x),
          y: obj.y,
        });
      }
      datasets.push({
        label: ds.label,
        color: ds.color,
        data: tempData,
      });

      drawPoints = [...drawPoints, ...tempData];
    }
  }

  let xScale = null;
  let yScale = null;

  function configureScale() {
    xScale = d3
      .scaleTime()
      .domain(
        d3.extent(drawPoints, function (d: { x: Date; y: number }): number {
          return d.x;
        })
      )
      .range([0, width]);
    yScale = d3
      .scaleLinear()
      .domain(
        d3.extent(drawPoints, function (d: { x: Date; y: number }): number {
          return d.y;
        })
      )
      .range([height + padding.bottom, padding.top]);
  }

  function updateChart() {
    const svg = d3
      .select(".line-chart")
      .attr("width", width + padding.left + padding.right + xLabelPadding * 2)
      .attr(
        "height",
        height + padding.top + padding.bottom + yLabelPadding * 2
      );

    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);
    yAxis.tickSizeOuter(0);
    xAxis.tickSizeOuter(0);

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

    // loop through the datasets to create lines
    for (let line of datasets) {
      svg
        .append("path")
        .classed("data-line", true)
        .data([line])
        .attr("stroke", function (d) {
          return d.color;
        })
        .data([line.data])
        .attr(
          "transform",
          `translate(${padding.left + xLabelPadding}, ${yLabelPadding})`
        )
        .attr("fill", "none")
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              // console.log(d);
              return xScale(d.x);
            })
            .y(function (d) {
              return yScale(d.y);
            })
            .curve(d3.curveLinear)
        )
        .attr("stroke-width", 2)
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
    }
  }

  function updateTooltip() {
    // need to work on tool tip
    const toolTip = d3.select(".line-chart");

    function handleMouseOver() {
      const { x, y } = d3
        .select(this)
        .attr("cursor", "pointer")
        .node()
        .getBBox();

      toolTip.select(".tool-tip text").text(`${y}`);

      toolTip
        .select(".tool-tip")
        .transition()
        .duration(200)
        .attr("opacity", 1)
        .attr("transform", `translate(${x + 15}, ${y - 15})`);
    }

    function handleMouseLeave() {
      toolTip.select(".tool-tip").transition().duration(200).attr("opacity", 0);
    }

    for (let i = 0; i < datasets.length; i++) {
      for (let data of datasets[i].data) {
        const focus = d3
          .select(".line-chart")
          .append("g")
          .data([data])
          .append("circle")
          .style("fill", datasets[i].color)
          .style("stroke", datasets[i].color)
          .attr("cx", function (d) {
            return xScale(data.x) + padding.left + xLabelPadding;
          })
          .attr("cy", function (d) {
            return yScale(data.y) + yLabelPadding;
          })
          .attr("r", 3)
          .style("opacity", 1)
          .on("mouseover", handleMouseOver)
          .on("mouseleave", handleMouseLeave);
      }
    }

    toolTip.append("g").classed("tool-tip", true).attr("opacity", 0);
    toolTip
      .select(".tool-tip")
      .append("rect")
      .attr("fill", "green")
      .attr("width", 50)
      .attr("height", 20);
    toolTip.select(".tool-tip").append("text").text("test");
  }

  function updateLegend() {
    if (addLegend) {
      // need to take into account the size of the square
      const squareSize = 20;

      for (let i = 0; i < datasets.length; i++) {
        const legendTitle = d3
          .select(".line-chart")
          .data([datasets[i]])
          .append("text")
          .text(datasets[i].label)
          .attr(
            "x",
            (padding.left + padding.right + width) / 2 + i * 20 + squareSize * i
          )
          .attr("y", padding.top)
          .attr("font-family", "Verdana")
          .attr("text-anchor", "right")
          .style("alignment-baseline", "middle");

        const legendCat = d3
          .select(".line-chart")
          .data([datasets[i]])
          .append("rect")
          .attr("x", function (d) {
            return (
              (padding.left + padding.right + width) / 2 +
              i * 20 -
              20 +
              squareSize * i
            );
          })
          .attr("y", padding.top - 10)
          .attr("width", squareSize)
          .attr("height", squareSize)
          .attr("fill", function (d) {
            return datasets[i].color;
          });
      }
    }
  }

  function updateTitle() {
    d3.select(".line-chart")
      .append("text")
      .attr("text-anchor", "left")
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

  useEffect(() => {
    cleanDatasets();
    configureScale();
    updateChart();
    if (addLabel) {
      updateLabel();
    }
    if (updateTooltip) {
      updateTooltip();
    }
    if (addTitle) {
      updateTitle();
    }
    updateLegend();
  }, []);

  return (
    <Fragment>
      <div className="chart-container">
        <svg className="line-chart"></svg>
      </div>
    </Fragment>
  );
}
