/** @jsx h */
import { h, Fragment, useEffect, d3 } from "../mod.ts";

interface LineProps {
  data: {
    x: number;
    y: number;
  };
}

export default function LineChart() {
  const margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30,
  };
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.bottom - margin.top;
  let data: { x: Date; y: number }[] = [];

  function updateData() {
    for (let i = 1900; i <= 2000; i += 1) {
      data.push({ x: new Date(i, 1, 1), y: Math.floor(Math.random() * 1000) });
    }
  }

  function updateChart() {
    const svg = d3
      .select(".line-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

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
      .range([height, margin.top]);

    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);

    svg
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(${margin.left}, ${height})`)
      .attr("font-size", "0.5em")
      .attr("font-family", "Verdana")
      .attr("color", "#4D908E")
      .selectAll(".tick text")
      .attr("transform", "translate(-10, 3)rotate(-45)") // have to take into account the variables for rotation too
      .style("text-anchor", "end");
    svg
      .append("g")
      .call(yAxis)
      .attr("transform", `translate(${margin.left})`)
      .attr("font-size", "0.5em")
      .attr("font-family", "Verdana")
      .attr("color", "#4D908E")
      .selectAll(".tick line")
      .attr("x2", width)
      .attr("opacity", "0.3")
      .attr("stroke-dasharray", "1, 1");

    svg
      .append("path")
      .classed("data-line", true)
      .data([data])
      .attr("transform", `translate(${margin.left})`)
      .attr("fill", "none")
      .attr("stroke", "#BFE4A3")
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x(function (d) {
            return xScale(d.x);
          })
          .y(function (d) {
            return yScale(d.y);
          })
      )
      .attr("stroke-width", 3)
      .filter(() => true)
      .attr("stroke-dasharray", function () {
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function () {
        return this.getTotalLength();
      })
      .transition()
      .duration(5000)
      .attr("stroke-dashoffset", 0);

    const focus = d3
      .select(".line-chart")
      .append("g")
      .append("circle")
      .style("fill", "none")
      .style("stroke", "black")
      .style("r", 5)
      .style("opacity", 0);
    const focusText = d3
      .select(".line-chart")
      .append("g")
      .append("text")
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");
    const bisect = d3.bisector(function (d) {
      return d.y;
    }).left;

    function handleMouseOver() {
      focus.style("opacity", 1);
      focusText.style("opacity", 1);
    }

    function handleMouseLeave() {
      focus.style("opacity", 0);
      focusText.style("opacity", 0);
    }

    function handleMouseMove(e: Event) {
      const [x, y] = d3.pointer(e);
      const x0 = xScale.invert(x);
      const i = bisect(data, x0, 1);
    }

    d3.select(".line-chart")
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseleave", handleMouseLeave);
  }

  // add label to the x and y axes
  function updateLabel() {
    d3.select(".line-chart")
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", margin.left + margin.right)
      .attr("y", margin.top - 10) // between the y label and the axes
      .attr("font-family", "Verdana")
      .text("y label");

    d3.select(".line-chart")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", (width + margin.left + margin.right) / 2)
      .attr("y", height + margin.bottom + margin.top)
      .attr("font-family", "Verdana")
      .text("x label");
  }

  function updateInteractivity() {
    const focus = d3
      .select(".line-chart")
      .append("g")
      .append("circle")
      .style("fill", "none")
      .style("stroke", "black")
      .style("r", 5)
      .style("opacity", 0);
    const focusText = d3
      .select(".line-chart")
      .append("g")
      .append("text")
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");

    const bisect = d3.bisector(function (d) {
      return d.x;
    }).left;

    function handleMouseOver() {
      focus.style("opacity", 1);
      focusText.style("opacity", 1);
    }

    function handleMouseLeave() {
      focus.style("opacity", 0);
      focusText.style("opacity", 0);
    }

    function handleMouseMove(e: Event) {
      const [x, y] = d3.pointer(e);
      const xScale = d3.scaleTime().domain(
        d3.extent(data, function (d: { x: Date; y: number }): Date {
          return d.x;
        })
      );
      const x0 = xScale.invert(y);
      const i = bisect(data, x0, 1);
      console.log(i);
    }

    d3.select(".line-chart")
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseleave", handleMouseLeave);
  }

  // create another function to add animation instead of grouping theme into create chart

  useEffect(() => {
    updateData();
    updateChart();
    updateLabel();
    // updateInteractivity();
  }, []);

  return (
    <Fragment>
      <div className="chart-container">
        <svg className="line-chart">
          {/* to group line */}
          <g></g>
        </svg>
      </div>
    </Fragment>
  );
}
