/** @jsx h */
import { h, Fragment } from "../mod.ts";
import { useEffect, useState } from "../mod.ts";
import { d3 } from "../mod.ts";

export default function BarChart() {
  useEffect(() => {
    const dataset: number[] = [];
    for (let i = 0; i < 7; i++) {
      dataset.push(Math.floor(Math.random() * 100));
    }
    const svgWidth = 400;
    const svgHeight = 100;
    const barPadding = 20;
    const barWidth = svgWidth / dataset.length;

    const svg = d3
      .select("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset)])
      .range([0, svgHeight]);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset)])
      .range([0, svgWidth]);

    const barChart = svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("y", function (d: number): number {
        return svgHeight - yScale(d);
      })
      .attr("height", function (d: number): number {
        return yScale(d);
      })
      .attr("width", barWidth - barPadding)
      .attr("transform", function (d: number, i: number) {
        console.log("i", i, "barWidth", barWidth);
        const translate = [barWidth * i];
        return "translate(" + translate + ")";
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
        return svgHeight - yScale(d) - 2;
      })
      .attr("x", function (d: number, i: number): number {
        return barWidth * i;
      })
      .attr("fill", "blue");
  }, []);

  return (
    <Fragment>
      <svg className="bar-chart"></svg>
    </Fragment>
  );
}
