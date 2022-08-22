/** @jsx h */
import { h, Fragment, render } from "preact/";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import * as d3 from "d3";
import { useEffect, useState }from "preact/hooks";
import { parse } from "parse";
import { ChoroplethProps } from "../chart-props/ChoroplethProps.ts";
import * as mod from "https://deno.land/std@0.95.0/io/mod.ts";

export default  function ChoroplethChart(props : ChoroplethProps) { 



  //VARIABLES
  const width =  props.width || 1800;
  const height = props.height || 1800;
  let WorldData = props.data;



  const mouseOver = function(d) {
    d3.select(this.nextSibling)
      .attr("visibility","visible");

    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
  }

  const mouseLeave = function(d) {
    d3.select(this.nextSibling)
      .attr("visibility","hidden");

    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent")
  }

  function makeChoroplethChart(){
    console.log (WorldData);
    const svg = d3.select('.ChoroplethMap');
    svg.attr('width',width);
    svg.attr('height',height);

    const projection = d3.geoMercator()
      .scale(100)
      .center([0,20])
      // .attr("transform", "translate(" + (width  / 2 ) + "," + (height  / 2 ) + ")");

    const pathGenerator = d3.geoPath().projection(projection); //

    const color = d3.interpolate("#ADD8E6", "#00008B"); // creates color scale from light blue to dark blue

    //draws map by grabbing polygon angles from online resource 
    const data = fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson") // Draws map
      .then(res => res.json())
      .then((res) =>{ 
      
        const g = svg.append('g')
        .selectAll("path")
        .data(res.features)
        .enter()
        .append("g")
        .attr("class", function (d: number){return "Country-Group"})
        .append("path")
        .attr("d", pathGenerator)
        .attr("fill", function(d,i){

          if (props.data === undefined){
            res.features[i].properties.beeCount = Math.floor(Math.random()*100000);
            // console.log(props.data[i].name, res.features[i].properties.name)
            return color(res.features[i].properties.beeCount/100000);
          }

          return color(WorldData[i].data/Math.max(...Array.from(data,(data) => data.data)))
          
        })
        .style("stroke","transparent")
        .attr("class", function (d: number){return "Country"})
        .style("opacity", 0.9)
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave )


        const groups = d3.selectAll(".Country-Group")

        //Label for each country,
        groups.append("text")
          .attr("transform", function(d: number){
            return "translate(" + pathGenerator.centroid(d) + ")";
          })
          .text( function(d:number, i: number){
            if (props.data === undefined){
              return  `${res.features[i].properties.name} has ${res.features[i].properties.beeCount}`;
            }
            return `${res.features[i].properties.name} has ${WorldData[i].pop}`
          })
          .style("font-family","Arial")
          .style("font-size",`36px`)
          .attr("id",function (d:number, i:number){
            return res.features[i].properties.name;
          })
          .attr("pointer-events","none")
          .attr("visibility","hidden");
      })
      .catch(() =>{
        console.log('Data failed to load from url');
      });
    }

  
  useEffect( ()   =>  {
    makeChoroplethChart();
  }, []);

    
    

  return (    
    <Fragment>      
        <svg        
            style={{
                padding: 0,
            }}
            className="ChoroplethMap"      
            >
              
            </svg>
            <div id ="tooltip"></div>
    </Fragment>  
  )
}