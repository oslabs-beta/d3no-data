import { useEffect, d3 } from "../mod.ts";
import { LineChartProps } from "../chart-props/LineChartProps.ts";

export default function LineChart2(props: LineChartProps) {
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
  const datasets = [];

  // configure scale
  let drawPoints = [];
  function cleanDatasets() {
    for (let ds of receivedDatasets) {
      const tempData = [];
      for (let obj of ds.data) {
        const values = Object.values(obj);
        tempData.push({
          x: new Date(values[1]),
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
      .range([height + padding.bottom, padding.bottom]);
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
    svg
      .select("g")
      .selectAll(".tick line")
      .attr("stroke-width", "0.5")
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
      .attr("stroke-width", "0.5")
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
              const a = Object.keys(d);
              return xScale(d[a[0]]);
            })
            .y(function (d) {
              const a = Object.keys(d);
              return yScale(d[a[1]]);
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
      const padding = 20;
      const { x, y } = d3
        .select(this)
        .attr("cursor", "pointer")
        .node()
        .getBBox();

      toolTip
        .select(".tool-tip text")
        .text(`${yScale.invert(y)}`)
        .attr("fill", "white")
        .attr("transform", `translate(${padding / 2}, ${padding / 2})`);

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

      toolTip
        .select(".tool-tip")
        .transition()
        .duration(200)
        .attr("opacity", 1)
        .attr("transform", `translate(${x + 15}, ${y - 15})`);
    }

    function handleMouseLeave() {
      toolTip
        .select(".tool-tip")
        .transition()
        .duration(300)
        .attr("opacity", 0)
        .attr("transform", `translate(${Math.random() * width}, 0)`);
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

    toolTip
      .append("g")
      .classed("tool-tip", true)
      .attr("opacity", 0)
      .attr("font-family", fontFamily);
    toolTip
      .select(".tool-tip")
      .append("rect")
      .attr("fill", "#2d8fc0")
      .attr("width", 20)
      .attr("height", 20)
      .attr("transform", `translate(0, -15)`);
    toolTip.select(".tool-tip").append("text");
  }

  function updateLegend() {
    const squareHeight = 15;
    const squareWidth = 30;

    const legendTitle = d3.select(".line-chart").append("g");
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
        `translate(${xLabelPadding}, ${
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
    if (addLegend) {
      updateLegend();
    }
    if (addTitle) {
      updateTitle();
    }
    if (addTooltip) {
      updateTooltip();
    }
  }, []);

  return (
    <>
      <div className="chart-container">
        <svg className="line-chart"></svg>
      </div>
    </>
  );
}
