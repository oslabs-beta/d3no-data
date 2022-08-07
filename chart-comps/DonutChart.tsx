/** @jsx h */
import { h, useEffect, Fragment, d3 } from "../mod.ts";
import { DonutChartProps } from "../chart-props/DonutChartProps.ts";

export default function DonutChart(props: DonutChartProps) {
  const padding = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
  };
  const width = 500 - padding.left - padding.right;
  const height = 500 - padding.top - padding.bottom;

  const color = d3
    .scaleOrdinal()
    .range([
      "#CED89E",
      "#F9F9C5",
      "#6CC4A1",
      "#AEDBCE",
      "#76BA99",
      "#D9F8C4",
      "#90C8AC",
    ]);

  const data = [
    { ages: "<18", count: "727432" },
    { ages: "≥65", count: "629032" },
    { ages: "55-64", count: "515347" },
    { ages: "18-24", count: "341435" },
    { ages: "25-34", count: "444509" },
    { ages: "35-44", count: "426967" },
    { ages: "45-54", count: "480565" },
  ];

  function updateChart() {
    const svg = d3
      .select(".doughnut-chart")
      .attr("width", width + padding.left + padding.right)
      .attr("height", height + padding.bottom + padding.top)
      .append("g")
      .attr(
        "transform",
        `translate(${(width + padding.left + padding.right) / 2}, ${
          (height + padding.top + padding.bottom) / 2
        })`
      );

    const radius = Math.min(height, width) / 2;
    const pie = d3
      .pie()
      .value((d: { ages: string; count: string }): number => {
        return Number(d.count);
      })
      .sort(null);
    const path = d3.arc().outerRadius(radius).innerRadius(100);
    svg
      .selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("stroke-width", "1")
      .attr("stroke", "#277DA1")
      .attr("fill", function (d) {
        return color(d.data.ages);
      })
      .transition()
      .delay(function (d, i: number): number {
        return i * 120;
      })
      .duration(240)
      .attrTween("d", function (d) {
        const i = d3.interpolate(d.startAngle + 0, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return path(d);
        };
      });

    svg
      .selectAll("text")
      .data(pie(data))
      .join("text")
      .attr("transform", function (d) {
        return `translate(${path.centroid(d)})`;
      })
      .text(function (d) {
        return d.data.ages;
      })
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-family", "Verdana")
      .style("font-size", 15);
  }

  useEffect(() => {
    updateChart();
  }, []);

  return (
    <Fragment>
      <div className="chart-container">
        <svg className="doughnut-chart"></svg>
      </div>
    </Fragment>
  );
}
