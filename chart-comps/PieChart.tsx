import { useEffect, d3 } from "../mod.ts";
import { PieChartProps } from "../chart-props/PieChartProps.ts";

// exporting PieChart
export default function PieChart(props: PieChartProps) {
  function makePiechart(props: PieChartProps) {
    const dataset: number[] = [];
    for (let i = 0; i < 5; i++) {
      dataset.push(Math.floor(Math.random() * 100));
    }
    const letterset = ["a", "b", "c", "d", "e"];

    //VARIABLES
    const labelDistanceToEdge = props.labelDistanceToEdge || 80;
    const piePadToEdge = props.piePadToEdge || 10;
    const strokeColor = props.strokeColor || "black";
    const strokeWidth = props.strokeWidth || 0;
    const fontSize = props.fontSize || 30;
    const font = props.font || "Verdana";
    const width = props.width || 410,
      height = width;
    const colorStart = props.colorStart || "#cefad0";
    const colorEnd = props.colorEnd || "green";

    //Select piechart svg and set attributes, defaults to 410 for width x height
    const svg = d3.select(".pie-chart");
    svg.attr("width", width);
    svg.attr("height", width);

    const radius = Math.min(width, height) / 2,
      g = svg
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // To change colors, set color equal to an array of colors containing the colors you want. They will be applied to the data in ascending order
    // const color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);
    const color = d3.interpolate(colorStart, colorEnd);
    // color(0-1)

    //creates d3 pie instance
    const pie = d3.pie();
    // pie.padAngle(1/radius);

    //creates d3 arc instance
    const arc = d3.arc();
    arc.outerRadius(radius - piePadToEdge);
    arc.innerRadius(0);

    //appends each arc to pie w/ data from dataset
    const arcs = g
      .selectAll("arc")
      .data(pie(dataset))
      .enter()
      .append("g")
      .attr("class", "arc");

    //positions label a distance away from edge equal to labelDistanceToEdge
    const label = d3.arc();
    label.outerRadius(radius);
    label.innerRadius(radius - labelDistanceToEdge);

    //Sort arcs by data value before adding color, so that gradiant is applied in ascending order
    arcs._groups[0].sort((obj1: {}, obj2: {}) => {
      return obj1.__data__.data - obj2.__data__.data;
    });

    //selects tooltip div and saves reference in tooltip
    const tooltip = d3
      .select("#tooltip")
      .style("background-color", "darkgray")
      .style("visibility", "hidden")
      .style("position", "absolute")
      .html("<p> I AM A TOOLTIP LET ME TELL YOU STUFF<p/>");

    //appends path and fills with color by index from color
    arcs
      .append("path")
      .attr("fill", function (d: number[], i: number) {
        return color(i / dataset.length);
      })
      .attr("d", arc)
      .style("stroke", strokeColor)
      .style("stroke-width", strokeWidth)
      .on("mouseover", function (d) {
        tooltip.transition().duration(100).style("visibility", "visible");
        tooltip
          .html(`<p> This slice  is ${d.target.__data__.data} <p/>`)
          .style("left", d.layerX + 10 + "px")
          .style("top", d.layerY + 10 + "px");
      })
      .on("mousemove", function (d) {
        tooltip
          .html(`<p> This slice is ${d.target.__data__.data} <p/>`)
          // .style("opacity", 0.9)
          .style("left", d.layerX + 10 + "px")
          .style("top", d.layerY + 10 + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(100).style("visibility", "hidden");
      });

    //appends label text to each section
    arcs
      .append("text")
      .attr("transform", function (d: number) {
        return "translate(" + label.centroid(d) + ")";
      })
      .text(function (d: number, i: number) {
        return letterset[i];
      })
      .style("font-family", font)
      .style("font-size", `${fontSize}px`);
  }

  useEffect(() => {
    makePiechart(props);
  }, []);


  return (
    <> 
      <svg        
          style={{
              padding: 0,
          }}
          className="pie-chart"      
          >
            
      </svg>
      <div id="tooltip"></div>    
    </>  
  );}
