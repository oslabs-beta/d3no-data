import { useEffect, d3 } from "../mod.ts";
import { DonutChartProps } from "../chart-props/DonutChartProps.ts";

export default function DonutChart(props: DonutChartProps) {
  const padding = {
    top: props.paddingTop || 50,
    bottom: props.paddingBottom || 50,
    left: props.paddingLeft || 50,
    right: props.paddingRight || 50,
  };
  const width = (props.width || 500) - padding.left - padding.right;
  const height = (props.height || 500) - padding.top - padding.bottom;
  const radius = Math.min(height, width) / 2;
  const fontFamily = props.fontFamily || "Verdana";
  const setTitle = props.setTitle || "TITLE";
  const setTitleColor = props.setTitleColor || "#277DA1";
  const setTitleSize = props.setTitleSize || "1em";
  const animation = props.animation == false ? false : true;
  const animationDuration = props.animationDuration || 120;
  const colorStart = props.colorStart || '#cefad0';
  const colorEnd = props.colorEnd || 'green';
  const color = d3.interpolate(colorStart, colorEnd);
  const data = props.data || [];
  const toolTip = props.toolTip || true;
  const innerRadius = props.innerRadius || 100;

  function updateChart() {
    const svg = d3
      .select(".donut-chart")
      .attr("width", width + padding.left + padding.right)
      .attr("height", height + padding.bottom + padding.top)
      .append("g")
      .attr(
        "transform",
        `translate(${(width + padding.left + padding.right) / 2}, ${
          (height + padding.top + padding.bottom) / 2
        })`
      );

    const pie = d3
      .pie()
      .value((d: { ages: string; count: string }): number => {
        return Number(d.count);
      })
      .sort(null);
    const path = d3.arc().outerRadius(radius).innerRadius(innerRadius);
    svg
      .selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("stroke-width", "1")
      .attr("stroke", "#277DA1")
      .attr("fill", function (d, i) {
        return color(i / data.length);
      })
      .transition()
      .delay(function (d, i: number): number {
        return i * animationDuration * (animation ? 1 : 0);
      })
      .duration(animationDuration * 2 * (animation ? 1 : 0))
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

  function updateInteractivity() {
    const toolTip = d3.select(".donut-chart").append("text").attr("opacity", 0);

    function handleMouseOver() {
      toolTip.attr("opacity", "1");
      d3.select(this)
        .transition()
        .duration(300)
        .attr("opacity", "0.6")
        .attr("stroke-width", "4")
        .style("cursor", "pointer");
    }

    function handleMouseMove(e: Event, d) {
      const [x, y] = d3.pointer(e);
      toolTip
        .attr("x", x + 10 + (width + padding.left + padding.right) / 2)
        .attr("y", y + (height + padding.top + padding.bottom) / 2)
        .attr("opacity", "1")
        .attr("font-family", fontFamily)
        .attr("font-size", "0.8em")
        .attr("fill", "black")
        .text(`${d.data.count}`);
    }

    function handleMouseLeave() {
      toolTip.attr("opacity", 0);
      d3.select(this)
        .transition()
        .duration(300)
        .attr("opacity", "1")
        .attr("stroke-width", "1");
    }

    d3.select(".donut-chart")
      .selectAll("path")
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseleave", handleMouseLeave);
  }

  function updateTitle() {
    d3.select(".donut-chart")
      .append("text")
      .attr("x", (width + padding.left + padding.right) / 2)
      .attr("y", padding.top / 2)
      .attr("font-family", fontFamily)
      .attr("text-anchor", "middle")
      .attr("fill", setTitleColor)
      .attr("font-size", setTitleSize)
      .text(setTitle);
  }

  useEffect(() => {
    updateChart();
    updateInteractivity();
    updateTitle();
  }, []);

  return (
    <>
      <div className="chart-container">
        <svg className="donut-chart"></svg>
      </div>
    </>
  );
}
