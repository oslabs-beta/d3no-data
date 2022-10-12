import { d3, useEffect } from "../mod.ts";
import { ScatterChartProps } from "../chart-props/ScatterChartProps.ts";

export default function ScatterPlotChart(props: ScatterChartProps) {
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
  const dotSize = props.dotSize || 3;
  const axesColor = props.axesColor || "#4D908E";
  const fontFamily = props.fontFamily || "Verdana";
  const addAxesLabel = props.addAxesLabel == false ? props.addAxesLabel : true;
  const xAxisLabel = props.xAxisLabel || "x label";
  const yAxisLabel = props.yAxisLabel || "y label";
  const axesFontSize = props.axesFontSize || "0.8em";
  const axesLabelColor = props.axesLabelColor || "#277DA1";
  const addTooltip = props.addTooltip == false ? props.addTooltip : true;
  const addTitle = props.addTitle == false ? props.addTitle : true;
  const setTitle = props.setTitle || "TITLE";
  const setTitleSize = props.setTitleSize || "1.5em";
  const setTitleColor = props.setTitleColor || axesLabelColor;
  const addLegend = props.addLegend == false ? props.addLegend : true;
  const animation = props.animation == false ? false : true;
  const animationDuration = props.animationDuration || 1200;
  const receivedDatasets = props.datasets || [];
  const datasets = [];

  // configure scale
  let drawPoints = [];
  function cleanDatasets() {
    for (let ds of receivedDatasets) {
      const tempData = [];
      for (let obj of ds.data) {
        const values = Object.values(obj);
        tempData.push({
          x: values[1],
          y: values[0],
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

  // create scale for y axis and x axis
  let xScale = null;
  let yScale = null;
  function configureScale() {
    xScale = d3
      .scaleLinear()
      .domain(
        d3.extent(drawPoints, function (d): number {
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
      .range([height, 0]);
  }

  function updateChart() {
    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);
    yAxis.tickSizeOuter(0);
    xAxis.tickSizeOuter(0);
    // set up dimension for the chart
    const svg = d3
      .select(".scatter-chart")
      .attr("width", width + padding.left + padding.right + 2 * xLabelPadding)
      .attr(
        "height",
        height + padding.top + padding.bottom + 2 * yLabelPadding
      );

    svg
      .append("g")
      .call(yAxis)
      .attr(
        "transform",
        `translate(${padding.left + xLabelPadding}, ${
          padding.top + yLabelPadding
        })`
      )
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
        `translate(${padding.left + xLabelPadding}, ${
          height + padding.bottom + yLabelPadding
        })`
      )
      .attr("color", axesColor)
      .attr("font-family", fontFamily)
      .selectAll(".tick line")
      .attr("y2", -height)
      .attr("stroke-width", "0.5")
      .attr("opacity", "0.3");

    for (let set of datasets) {
      svg
        .append("g")
        .classed("dots", true)
        .selectAll("circle")
        .data([...set.data])
        .join("circle")
        .attr("r", dotSize)
        .attr("cx", Math.random() * width + padding.left)
        .attr("cy", Math.random() * height + padding.top)
        .attr("fill", set.color)
        .transition()
        .duration(animationDuration * (animation ? 1 : 0))
        .attr("cx", function (d) {
          const x = Object.values(d)[0];
          return xScale(x) + padding.left + xLabelPadding + dotSize;
        })
        .attr("cy", function (d) {
          const y = Object.values(d)[1];
          return yScale(y) + padding.top + xLabelPadding - dotSize;
        });
    }
  }

  function updateTooltip() {
    const toolTip = d3.select(".scatter-chart");

    function handleMouseOver(): void {
      const [xValue, yValue] = Object.values(d3.select(this).data()[0]);
      const padding = 20;
      const { x, y } = d3
        .select(this)
        .attr("cursor", "pointer")
        .node()
        .getBBox();

      toolTip
        .select(".tool-tip")
        .transition()
        .duration(200)
        .attr("opacity", 1)
        .attr("transform", `translate(${x + 15}, ${y - 15})`);

      toolTip
        .select(".tool-tip text")
        .text(`x: ${xValue}, y: ${yValue}`)
        .attr("transform", `translate(${padding / 2}, ${padding / 2})`)
        .attr("fill", "white");

      toolTip
        .select(".tool-tip rect")
        .attr("width", function () {
          return (
            d3.select(this.parentNode).selectChild("text").node().getBBox()
              .width + padding
          );
        })
        .attr("height", function () {
          return (
            d3.select(this.parentNode).selectChild("text").node().getBBox()
              .height + padding
          );
        })
        .attr("rx", "5");
    }

    function handleMouseLeave(): void {
      toolTip
        .select(".tool-tip")
        .transition()
        .duration(300)
        .attr("opacity", 0)
        .attr("transform", `translate(${Math.random() * width}, 0)`);
    }

    const svg = d3
      .selectAll(".dots")
      .selectAll("circle")
      .on("mouseover", handleMouseOver)
      .on("mouseleave", handleMouseLeave);

    toolTip
      .append("g")
      .classed("tool-tip", true)
      .attr("font-family", fontFamily)
      .attr("opacity", 0);

    toolTip
      .select(".tool-tip")
      .append("rect")
      .attr("fill", "#2d8fc0")
      .attr("width", 20)
      .attr("height", 20)
      .attr("transform", `translate(0, -15)`);
    toolTip.select(".tool-tip").append("text");
  }

  function updateLabel() {
    d3.select(".scatter-chart")
      .append("text")
      .attr("font-family", fontFamily)
      .attr("font-size", axesFontSize)
      .attr("text-anchor", "start")
      .attr(
        "transform",
        `translate(${xLabelPadding}, ${
          (height + padding.bottom + padding.top) / 2
        }) rotate(-90)`
      )
      .style("text-anchor", "end")
      .attr("fill", axesLabelColor)
      .text(yAxisLabel);

    // add y axis label
    d3.select(".scatter-chart")
      .append("text")
      .attr("x", (width + padding.left + padding.right) / 2)
      .attr("y", height + padding.bottom + padding.top + yLabelPadding)
      .attr("font-family", fontFamily)
      .attr("font-size", axesFontSize)
      .attr("text-anchor", "middle")
      .attr("fill", axesLabelColor)
      .text(xAxisLabel);
  }

  function updateTitle() {
    d3.select(".scatter-chart")
      .append("text")
      .attr("x", (width + padding.left + padding.right + xLabelPadding * 2) / 2)
      .attr("y", padding.top / 2)
      .attr("font-family", fontFamily)
      .attr("font-size", setTitleSize)
      .attr("text-anchor", "middle")
      .attr("fill", setTitleColor)
      .text(setTitle);
  }

  function updateLegend() {
    const squareHeight = 15;
    const squareWidth = 30;

    const legendTitle = d3.select(".scatter-chart").append("g");
    for (let i = 0; i < datasets.length; i++) {
      // parent to group the label square and the label name
      const legendBox = legendTitle.append("g");

      // legend box for different cateogries
      legendBox
        .data([datasets[i]])
        .append("rect")
        .attr("x", function (d) {
          return i * squareWidth;
        })
        .attr("y", -squareHeight / 2)
        .attr("width", squareWidth)
        .attr("height", squareHeight)
        .attr("fill", function (d) {
          return datasets[i].color;
        })
        .attr("stroke", "black");

      // must be after square / rectangle to get the area where it is at
      legendBox
        .data([datasets[i]])
        .append("text")
        .text(datasets[i].label)
        .attr("x", function () {
          return (
            d3.select(this.parentNode).selectChild().node().getBBox().width *
              (i + 1) +
            5
          );
        })
        .attr("font-family", "Verdana")
        .attr("font-size", "0.8em")
        .attr("text-anchor", "right")
        .attr("alignment-baseline", "middle");

      legendBox.attr("transform", function () {
        const childrenArray = d3
          .select(this.parentNode)
          .selectChildren()
          .nodes();
        return `translate(${
          childrenArray[childrenArray.length - 1]?.getBBox().width * i
        }, 0)`;
      });
    }

    legendTitle.attr("transform", function () {
      const legendWidth = d3.select(this).node()?.getBBox().width;
      // to center the legends
      return `translate(${
        (width +
          padding.left +
          padding.right -
          legendWidth +
          xLabelPadding * 2) /
        2
      }, ${padding.top - 10})`;
    });
  }

  useEffect(() => {
    cleanDatasets();
    configureScale();
    updateChart();
    if (addAxesLabel) {
      updateLabel();
    }
    if (addTitle) {
      updateTitle();
    }
    if (addLegend) {
      updateLegend();
    }
    if (addTooltip) {
      updateTooltip();
    }
  }, []);

  return (
    <>
      <div className="chart-container">
        <svg className="scatter-chart"></svg>
      </div>
    </>
  );
}
