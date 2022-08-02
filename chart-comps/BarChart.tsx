/** @jsx h */
import { h } from "../mod.ts";
import { Fragment } from "../mod.ts";
import { useEffect } from "../mod.ts";
import { d3 } from "../mod.ts";

export default function BarChart() {
  useEffect(() => {
    const dataset: number[] = [];
    for (let i = 0; i < 7; i++) {
      dataset.push(Math.floor(Math.random() * 100));
    }
    const svgWidth = 400;
    const svgHeight = 600;
    const barPadding = 5;
    const barWidth = svgWidth / dataset.length - 10;

    const xDataSet: number[] = [];
    for (let i = 0; i < 7; i++) {
      xDataSet.push(i);
    }

    const svg = d3
      .select("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset)])
      .range([svgHeight - 30, 0]); // 30 represents the padding on top

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(xDataSet)])
      .range([0, svgWidth]);

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function (d: number, i: number): number {
        return barWidth * i + 30;
      })
      .attr("width", barWidth - barPadding)
      .attr("y", function (d: number, i: number): number {
        return svgHeight - yScale(d) - 30;
      })
      .attr("height", function (d: number): number {
        return yScale(d);
      });

    const text = svg
      .selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .text(function (d: number): number {
        return d;
      })
      .attr("y", function (d: number, i: number): number {
        return svgHeight;
      })
      .attr("x", function (d: number, i: number): number {
        return barWidth * i + 30;
      })
      .attr("font-size", 12)
      .attr("fill", "black");

    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .call(yAxis)
      .attr("transform", "translate(" + 25 + ",0)");
  }, []);

  return (
    <Fragment>
      <svg
        style={{
          padding: 30,
        }}
        className="bar-chart"
      ></svg>
    </Fragment>
  );
}
