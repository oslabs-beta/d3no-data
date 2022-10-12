import { useEffect, d3 } from "../mod.ts";
import { BarChartProps } from "../chart-props/BarChartProps.ts";

// need to work on paddings that dynamically update to avoid overlapping with the graph

export default function BarChart(props: BarChartProps) {
  const yLabelPadding = 20;
  const xLabelPadding = 20;
  const padding = {
    top: (props.paddingTop || 50) + yLabelPadding,
    right: (props.paddingRight || 50) + xLabelPadding,
    bottom: (props.paddingBottom || 50) + yLabelPadding,
    left: (props.paddingLeft || 50) + xLabelPadding,
  };
  const width =
    (props.width || 800) - padding.left - padding.right - yLabelPadding * 2;
  const height =
    (props.height || 600) - padding.bottom - padding.top - xLabelPadding * 2;
  const barPadding = 3; // padding provided between each bar
  const toolTip = props.toolTip == false ? props.toolTip : true;
  const addAxesLabel = props.addAxesLabel == true ? props.addAxesLabel : false;
  const animation = props.animation == false ? props.animation : true;
  const animationDuration = props.animationDuration || 800;
  const animationDelay = props.animationDelay || 100;
  const xAxisLabel = props.xAxisLabel || "x label";
  const yAxisLabel = props.yAxisLabel || "ylabel";
  const barHoverColor = props.barHoverColor || "#90BE6D";
  const fontFamily = props.fontFamily || "Verdana";
  const axesColor = props.axesColor || "#4D908E";
  const axesLabelColor = props.axesLabelColor || "#277DA1";
  const addTitle = props.addTitle || false;
  const setTitle = props.setTitle || "TITLE";
  const setTitleSize = props.setTitleSize || "1.5em";
  const setTitleColor = props.setTitleColor || axesLabelColor;
  const setTitlePadding = props.setTitlePaddingTop || 40;
  const addLegend = props.addLegend == false ? props.addLegend : true;

  const receivedDatasets = props.datasets || [];
  const datasets = []; // cleaned datasets are stored here

  let drawPoints = [];
  function cleanDatasets() { //cleans data sets by reading from receivedDatasets
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

  let xScale = null;
  let yScale = null;
  function configureScale() {
    const labels = [];
    datasets[0].data.forEach((name) => {
      labels.push(name.x);
    });

    xScale = d3.scaleBand().domain(labels).range([0, width]);

    const maxObj = drawPoints.reduce((obj1, obj2) => {
      return obj1.y > obj2.y ? obj1 : obj2;
    });
    const minObj = drawPoints.reduce((obj1, obj2) => {
      return obj1.y < obj2.y ? obj1 : obj2;
    });

    yScale = d3.scaleLinear().domain([0, maxObj.y]).range([height, 0]);
  }

  function updateChart() {
    d3.select(".bar-chart")
      .attr("width", width + padding.left + padding.right + 2 * yLabelPadding)
      .attr(
        "height",
        height + padding.top + padding.bottom + 2 * xLabelPadding
      );

    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);
    yAxis.tickSizeOuter(0);
    xAxis.tickSizeOuter(0);

    // update with width / datasets.length;

    const paddingBarGroup = 10;
    const barContainer = width / datasets[0].data.length - paddingBarGroup;
    const barWidth = barContainer / datasets.length;
    // idea is to group chart of specific group into one area and then provide spacing for the other grouped chart
    for (let i = 0; i < datasets[0].data.length; i++) {
      // append g first
      const currGroup = d3
        .select(".bars")
        .append("g")
        .attr("x", paddingBarGroup * i);
      for (let j = 0; j < datasets.length; j++) {
        currGroup
          .append("rect")
          .attr("x", function (): number {
            return (
              Number(currGroup.node()?.getAttribute("x")) +
              barWidth * i * datasets.length +
              barWidth * j +
              yLabelPadding +
              padding.left +
              paddingBarGroup / 2
            );
          })
          .attr("width", barWidth)
          .attr("height", 0)
          .attr("y", height + padding.top + yLabelPadding - barPadding)
          .transition()
          .ease(d3.easeCubic)
          .delay(function (): number {
            return i * animationDelay * (animation ? 1 : 0);
          })
          .duration(animationDuration * (animation ? 1 : 0))
          .attr("y", function (): number {
            return (
              yScale(datasets[j].data[i].y) +
              padding.top +
              yLabelPadding -
              barPadding
            );
          })
          .attr("height", function (): number {
            return height - yScale(datasets[j].data[i].y);
          })
          .attr("stroke-width", 1)
          .attr("stroke", barHoverColor)
          .attr("rx", "3")
          .attr("fill", datasets[j].color);
      }
    }

    const barChart = d3.select(".bar-chart");

    // render y Axis
    barChart
      .insert("g", "g")
      .call(yAxis)
      // have to make this data to show for charts dynamic
      .attr(
        "transform",
        `translate(${padding.left + yLabelPadding}, ${
          padding.top + xLabelPadding
        })`
      )
      .attr("font-size", "0.5em")
      .attr("font-family", fontFamily)
      .attr("color", axesColor)
      .selectAll(".tick line")
      .attr("x2", width)
      .attr("stroke-width", "0.5")
      .attr("opacity", "0.3");

    // render x Axis
    barChart
      .insert("g", "g")
      .call(xAxis)
      .attr(
        "transform",
        `translate(${padding.left + yLabelPadding}, ${
          height + padding.bottom + xLabelPadding
        })`
      )
      .attr("font-size", "0.5em")
      .attr("font-family", fontFamily)
      .attr("color", axesColor)
      .selectAll(".tick line")
      .attr("stroke-width", "0.5")
      .attr("opacity", "0.3")
      .attr("y2", -height);
  }

  function updateTooltip() {
    const maxObj = drawPoints.reduce((obj1, obj2) => {
      return obj1.y > obj2.y ? obj1 : obj2;
    });
    const toolTip = d3.select(".bar-chart");

    function handleMouseOver(): void {
      // switch opacity and turn cursor to pointer
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 0.8)
        .style("cursor", "pointer");

      // add and style tooltip
      const toolTipPaddingLeft = 15;
      const toolTipPaddingTop = 10;
      const padding = 20;

      const { width, height } = toolTip
        .select(".tool-tip text")
        .node()
        .getBBox();
      toolTip
        .select(".tool-tip text")
        .text(() => {
          return `${
            maxObj.y - yScale.invert(d3.select(this).node().getBBox().height)
          }`;
        })
        .attr("x", padding / 2)
        .attr("y", padding / 2);

      toolTip
        .select(".tool-tip")
        .transition()
        .duration(400)
        .attr("opacity", 1)
        .attr("transform", () => {
          return `translate(${
            d3.select(this).node().getBBox().x + toolTipPaddingLeft
          }, ${d3.select(this).node().getBBox().y - toolTipPaddingTop})`;
        });

      toolTip
        .select(".tool-tip rect")
        .attr("width", (): number => {
          return width + padding;
        })
        .attr("height", height + padding);
    }

    function handleMouseLeave(): void {
      toolTip
        .select(".tool-tip")
        .transition()
        .duration(400)
        .attr("transform", `translate(${Math.random() * width}, 0)`)
        .attr("opacity", 0);
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
      .attr("transform", `translate(0, -15)`)
      .attr("rx", 5);

    toolTip.select(".tool-tip").append("text").attr("fill", "white");

    d3.select(".bars")
      .selectAll("rect")
      .on("mouseover", handleMouseOver)
      .on("mouseleave", handleMouseLeave);
  }

  function updateLabel() {
    // add label to the chart
    d3.select(".bar-chart")
      .append("text")
      .attr(
        "transform",
        `translate(${yLabelPadding}, ${
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
      .attr(
        "transform",
        `translate(${
          (width + padding.left + padding.right + 2 * yLabelPadding) / 2
        }, ${height + padding.top + padding.bottom + yLabelPadding})`
      )
      .attr("font-family", fontFamily)
      .attr("font-size", "0.8em")
      .attr("text-anchor", "middle")
      .attr("fill", axesLabelColor);
  }

  function updateTitle() {
    d3.select(".bar-chart")
      .append("text")
      .attr("x", (width + padding.left + yLabelPadding * 2) / 2)
      .attr("y", setTitlePadding)
      .attr("font-family", fontFamily)
      .attr("font-size", setTitleSize)
      .attr("fill", setTitleColor)
      .text(setTitle);
  }

  function updateLegend() {
    const squareHeight = 15;
    const squareWidth = 30;

    const legendTitle = d3.select(".bar-chart").append("g");
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
      // decreasing barPaddinggroup so 10 pixels to the left
      return `translate(${
        (width +
          padding.left +
          padding.right +
          xLabelPadding * 2 -
          legendWidth) /
        2
      }, ${padding.top - 10})`;
    });
  }

  useEffect(() => {
    cleanDatasets();
    configureScale();
    updateChart();
    if (toolTip) {
      updateTooltip();
    }
    if (addAxesLabel) {
      updateLabel();
    }
    if (addTitle) {
      updateTitle();
    }
    if (addLegend) {
      updateLegend();
    }
  }, []);

  return (
    <>
      <div className="chart-container">
        <svg className="bar-chart">
          <g>
            <g className="bars"></g>
          </g>
        </svg>
      </div>
    </>
  );
}
