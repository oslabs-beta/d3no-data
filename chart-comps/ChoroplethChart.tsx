import { d3 } from "../mod.ts";
import { useEffect, useState }from "../mod.ts";
import { ChoroplethProps } from "../chart-props/ChoroplethProps.ts";

export default  function ChoroplethChart(props : ChoroplethProps) { 




  //VARIABLES
  const width =  props.width || 1200;
  const height = props.height || 800;
  let WorldData = props.data || [{"name":"Antigua and Barbuda","data":"83039"},{"name":"Algeria","data":"32854159"},{"name":"Azerbaijan","data":"8352021"},{"name":"Albania","data":"3153731"},{"name":"Armenia","data":"3017661"},{"name":"Angola","data":"16095214"},{"name":"American Samoa","data":"64051"},{"name":"Argentina","data":"38747148"},{"name":"Australia","data":"20310208"},{"name":"Bahrain","data":"724788"},{"name":"Barbados","data":"291933"},{"name":"Bermuda","data":"64174"},{"name":"Bahamas","data":"323295"},{"name":"Bangladesh","data":"15328112"},{"name":"Belize","data":"275546"},{"name":"Bosnia and Herzegovina","data":"3915238"},{"name":"Bolivia","data":"9182015"},{"name":"Burma","data":"47967266"},{"name":"Benin","data":"8490301"},{"name":"Solomon Islands","data":"472419"},{"name":"Brazil","data":"186830759"},{"name":"Bulgaria","data":"7744591"},{"name":"Brunei Darussalam","data":"373831"},{"name":"Canada","data":"32270507"},{"name":"Cambodia","data":"13955507"},{"name":"Sri Lanka","data":"19120763"},{"name":"Congo","data":"3609851"},{"name":"Democratic Republic of the Congo","data":"58740547"},{"name":"Burundi","data":"7858791"},{"name":"China","data":"1312978855"},{"name":"Afghanistan","data":"25067407"},{"name":"Bhutan","data":"637013"},{"name":"Chile","data":"16295102"},{"name":"Cayman Islands","data":"45591"},{"name":"Cameroon","data":"17795149"},{"name":"Chad","data":"10145609"},{"name":"Comoros","data":"797902"},{"name":"Colombia","data":"4494579"},{"name":"Costa Rica","data":"4327228"},{"name":"Central African Republic","data":"4191429"},{"name":"Cuba","data":"11259905"},{"name":"Cape Verde","data":"506807"},{"name":"Cook Islands","data":"13984"},{"name":"Cyprus","data":"836321"},{"name":"Denmark","data":"5416945"},{"name":"Djibouti","data":"804206"},{"name":"Dominica","data":"67827"},{"name":"Dominican Republic","data":"9469601"},{"name":"Ecuador","data":"13060993"},{"name":"Egypt","data":"72849793"},{"name":"Ireland","data":"4143294"},{"name":"Equatorial Guinea","data":"484098"},{"name":"Estonia","data":"1344312"},{"name":"Eritrea","data":"4526722"},{"name":"El Salvador","data":"6668356"},{"name":"Ethiopia","data":"78985857"},{"name":"Austria","data":"8291979"},{"name":"Czech Republic","data":"10191762"},{"name":"French Guiana","data":"192099"},{"name":"Finland","data":"5246004"},{"name":"Fiji","data":"828046"},{"name":"Falkland Islands (Malvinas)","data":"2975"},{"name":"Micronesia","data":"115021"},{"name":"French Polynesia","data":"255632"},{"name":"France","data":"60990544"},{"name":"Gambia","data":"1617029"},{"name":"Gabon","data":"1290693"},{"name":"Georgia","data":"4473409"},{"name":"Ghana","data":"2253501"},{"name":"Grenada","data":"105237"},{"name":"Greenland","data":"57475"},{"name":"Germany","data":"82652369"},{"name":"Guam","data":"16857"},{"name":"Greece","data":"11099737"},{"name":"Guatemala","data":"12709564"},{"name":"Guinea","data":"9002656"},{"name":"Guyana","data":"739472"},{"name":"Haiti","data":"9296291"},{"name":"Honduras","data":"683411"},{"name":"Croatia","data":"455149"},{"name":"Hungary","data":"10086387"},{"name":"Iceland","data":"295732"},{"name":"India","data":"1134403141"},{"name":"Iran (Islamic Republic of)","data":"69420607"},{"name":"Israel","data":"6692037"},{"name":"Italy","data":"5864636"},{"name":"Cote d'Ivoire","data":"18584701"},{"name":"Iraq","data":"27995984"},{"name":"Japan","data":"127896740"},{"name":"Jamaica","data":"2682469"},{"name":"Jordan","data":"5544066"},{"name":"Kenya","data":"35598952"},{"name":"Kyrgyzstan","data":"5203547"},{"name":"South Korea","data":"51780000"},{"name":"Kiribati","data":"92003"},{"name":"North Korea","data":"25780000"},{"name":"Kuwait","data":"2700"},{"name":"Kazakhstan","data":"15210609"},{"name":"Lao People's Democratic Republic","data":"566391"},{"name":"Lebanon","data":"401074"},{"name":"Latvia","data":"2301793"},{"name":"Belarus","data":"9795287"},{"name":"Lithuania","data":"3425077"},{"name":"Liberia","data":"3441796"},{"name":"Slovakia","data":"5386995"},{"name":"Liechtenstein","data":"34598"},{"name":"Libyan Arab Jamahiriya","data":"5918217"},{"name":"Madagascar","data":"18642586"},{"name":"Martinique","data":"395896"},{"name":"Mongolia","data":"2580704"},{"name":"Montserrat","data":"5628"},{"name":"The former Yugoslav Republic of Macedonia","data":"2033655"},{"name":"Mali","data":"1161109"},{"name":"Morocco","data":"30494991"},{"name":"Mauritius","data":"1241173"},{"name":"Mauritania","data":"2963105"},{"name":"Malta","data":"402617"},{"name":"Oman","data":"2507042"},{"name":"Maldives","data":"295297"},{"name":"Mexico","data":"104266392"},{"name":"Malaysia","data":"25652985"},{"name":"Mozambique","data":"20532675"},{"name":"Malawi","data":"13226091"},{"name":"New Caledonia","data":"234185"},{"name":"Niue","data":"1632"},{"name":"Niger","data":"1326419"},{"name":"Aruba","data":"102897"},{"name":"Anguilla","data":"12256"},{"name":"Belgium","data":"10398049"},{"name":"Hong Kong","data":"7057418"},{"name":"Northern Mariana Islands","data":"80258"},{"name":"Faroe Islands","data":"48205"},{"name":"Andorra","data":"73483"},{"name":"Gibraltar","data":"291"},{"name":"Isle of Man","data":"78357"},{"name":"Luxembourg","data":"456613"},{"name":"Macau","data":"47309"},{"name":"Monaco","data":"325"},{"name":"Palestine","data":"3762005"},{"name":"Montenegro","data":"607969"},{"name":"Mayotte","data":"270372"},{"name":"Åland Islands","data":"29789"},{"name":"Norfolk Island","data":"2169"},{"name":"Cocos (Keeling) Islands","data":"596"},{"name":"Antarctica","data":"5000"},{"name":"Bouvet Island","data":"0"},{"name":"French Southern and Antarctic Lands","data":"150"},{"name":"Heard Island and McDonald Islands","data":"0"},{"name":"British Indian Ocean Territory","data":"4000"},{"name":"Christmas Island","data":"1402"},{"name":"United States Minor Outlying Islands","data":"300"},{"name":"Vanuatu","data":"215366"},{"name":"Nigeria","data":"141356083"},{"name":"Netherlands","data":"1632769"},{"name":"Norway","data":"4638836"},{"name":"Nepal","data":"27093656"},{"name":"Nauru","data":"10111"},{"name":"Suriname","data":"452468"},{"name":"Nicaragua","data":"5462539"},{"name":"New Zealand","data":"4097112"},{"name":"Paraguay","data":"5904342"},{"name":"Peru","data":"27274266"},{"name":"Pakistan","data":"158080591"},{"name":"Poland","data":"38195558"},{"name":"Panama","data":"3231502"},{"name":"Portugal","data":"10528226"},{"name":"Papua New Guinea","data":"6069715"},{"name":"Guinea-Bissau","data":"1596929"},{"name":"Qatar","data":"796186"},{"name":"Reunion","data":"785159"},{"name":"Romania","data":"21627557"},{"name":"Republic of Moldova","data":"3876661"},{"name":"Philippines","data":"84566163"},{"name":"Puerto Rico","data":"3946779"},{"name":"Russia","data":"143953092"},{"name":"Rwanda","data":"9233793"},{"name":"Saudi Arabia","data":"2361236"},{"name":"Saint Kitts and Nevis","data":"49138"},{"name":"Seychelles","data":"85532"},{"name":"South Africa","data":"47938663"},{"name":"Lesotho","data":"1980831"},{"name":"Botswana","data":"1835938"},{"name":"Senegal","data":"1177034"},{"name":"Slovenia","data":"1999425"},{"name":"Sierra Leone","data":"5586403"},{"name":"Singapore","data":"4327468"},{"name":"Somalia","data":"8196395"},{"name":"Spain","data":"43397491"},{"name":"Saint Lucia","data":"16124"},{"name":"Sudan","data":"36899747"},{"name":"Sweden","data":"9038049"},{"name":"Syrian Arab Republic","data":"18893881"},{"name":"Switzerland","data":"7424389"},{"name":"Trinidad and Tobago","data":"1323722"},{"name":"Thailand","data":"63002911"},{"name":"Tajikistan","data":"6550213"},{"name":"Tokelau","data":"1401"},{"name":"Tonga","data":"99361"},{"name":"Togo","data":"6238572"},{"name":"Sao Tome and Principe","data":"152622"},{"name":"Tunisia","data":"10104685"},{"name":"Turkey","data":"72969723"},{"name":"Tuvalu","data":"10441"},{"name":"Turkmenistan","data":"4833266"},{"name":"United Republic of Tanzania","data":"38477873"},{"name":"Uganda","data":"28947181"},{"name":"United Kingdom","data":"60244834"},{"name":"Ukraine","data":"46917544"},{"name":"USA","data":"299846449"},{"name":"Burkina Faso","data":"13933363"},{"name":"Uruguay","data":"3325727"},{"name":"Uzbekistan","data":"26593123"},{"name":"Saint Vincent and the Grenadines","data":"119137"},{"name":"Venezuela","data":"26725573"},{"name":"British Virgin Islands","data":"22016"},{"name":"Viet Nam","data":"85028643"},{"name":"United States Virgin Islands","data":"111408"},{"name":"Namibia","data":"2019677"},{"name":"Wallis and Futuna Islands","data":"15079"},{"name":"Samoa","data":"183845"},{"name":"Swaziland","data":"1124529"},{"name":"Yemen","data":"21095679"},{"name":"Zambia","data":"11478317"},{"name":"Zimbabwe","data":"13119679"},{"name":"Indonesia","data":"226063044"},{"name":"Guadeloupe","data":"438403"},{"name":"Netherlands Antilles","data":"186392"},{"name":"United Arab Emirates","data":"4104291"},{"name":"Timor-Leste","data":"1067285"},{"name":"Pitcairn Islands","data":"5"},{"name":"Palau","data":"20127"},{"name":"Marshall Islands","data":"5672"},{"name":"Saint Pierre and Miquelon","data":"6346"},{"name":"Saint Helena","data":"6399"},{"name":"San Marino","data":"30214"},{"name":"Turks and Caicos Islands","data":"24459"},{"name":"Western Sahara","data":"440428"},{"name":"Serbia","data":"9863026"},{"name":"Holy See (Vatican City)","data":"783"},{"name":"Svalbard","data":"2642"},{"name":"Saint Martin","data":"40063"},{"name":"Saint Barthelemy","data":"9131"},{"name":"Guernsey","data":"63900"},{"name":"Jersey","data":"104200"},{"name":"South Georgia South Sandwich Islands","data":"30"},{"name":"Taiwan","data":"23588932"}]; // [{country:,data:, label:}]
  const legendSteps = props.legendSteps || 6;
  const legendSvgPadding = props.legendSvgPadding || 20;
  const lowColor:string = props.lowColor || "#e6f6fe" ;
  const highColor:string = props.highColor || "#00008B";
  const offHoverOpacity = props.offHoverOpacity || 0.8;
  const title = props.title || 'Example Title';
  const scale = props.scale || 100;
  const center = props.center || [0,0];
  const fontSize = props.fontSize || '10px';
  const widthPadding = props.widthPadding || 0;
  const heightPadding = props.heightPadding || 0;
  const paddingTitle = props.paddingTitle || 15;
  let legendArr:string[], dataArr:number[], dataMax:number, step:number;

  if (WorldData){
    dataArr = Array.from(WorldData,(country) => country.data);
    legendArr = [];
    dataMax = Math.max(...dataArr);
    step = (dataMax - Math.min(...dataArr))/legendSteps;
    legendArr.push(`<${Math.floor(step)}`)
    for (let i = 1; i < legendSteps; i++){
      legendArr.push(`${Math.floor(i*step)}`);
    }
  }
  else{
    legendArr = ["<20000","20000","40000","60000","80000"];
  }

  //Mouse functions handle tool tip visability on mouse hover
  const mouseOver = function(d:number) {
    d3.select(this.nextSibling)
      .attr("visibility","visible");

    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", offHoverOpacity)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
  }

  const mouseLeave = function(d:number) {
    d3.select(this.nextSibling)
      .attr("visibility","hidden");

    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", offHoverOpacity)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent")
  }

  function makeChoroplethChart(){
    const svg = d3.select('.ChoroplethMap');
    svg.attr('width',width);
    svg.attr('height',height);

    const projection = d3.geoMercator();
      projection.scale([scale])
      projection.center(center)
      .translate([width/2 + widthPadding, height/2 + heightPadding ])
    const svgPath = d3.geoPath() //given a GeoJson obj, generates SVG path
    .projection(projection); //sets the current projection to specificied projection

    //creates color scale based on thresholdScale
    let color:any;
    if (props.thresholdScale){

      step = (dataMax - Math.min(...dataArr))/legendSteps;
      const stepArr = [] || props.stepArr;
      const colorArr = [] || props.colorArr;

      if (!stepArr.length){
        colorArr.push(lowColor);
        const colorPicker = d3.interpolate(lowColor, highColor);
        for (let i = 1; i < legendSteps; i++){
          stepArr.push(step*i);
          colorArr.push(colorPicker(i/legendSteps));
        }
        colorArr.push(highColor);
      }
      
      color = d3.scaleThreshold()
      .domain(stepArr)
      .range(colorArr)
    }
    else{
     color = function(num){
      const colorPicker =  d3.interpolate(lowColor, highColor); // creates color scale from low to high
      return colorPicker(num/dataMax) //normalize by dataMax
    }
  }
    
    
    
    
    //draws map by grabbing polygon angles from online resource 
    const data = fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson") // Draws map
      .then(res => res.json())
      .then((res) =>{ 

        const g = svg.append('g')
        .attr("class","Country-Group-Container")
        .selectAll("path")
        .data(res.features)
        .enter()
        .append("g")
        .attr("class", function (d: number){return "Country-Group"})
        .append("path")
        .attr("d", svgPath)
        .attr("fill", function(d,i){
          let countryName = d.properties.name;
          let searchIndex = 0;
          for (let i = 0; i < WorldData.length; i++){
            if (WorldData[i].name === countryName){
              searchIndex = i;
              break;
            }
          }

          return color(WorldData[searchIndex].data) ///dataMax
          
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
            return "translate(" + svgPath.centroid(d) + ")";
          })
          .text( function(d, i: number){
            let countryName = d.properties.name;
            let searchIndex = 0;
            for (let i = 0; i < WorldData.length; i++){
              if (WorldData[i].name === countryName){
                searchIndex = i;
                break;
              }
            }

            return `${res.features[i].properties.name} has ${WorldData[searchIndex].data}`
          })
          .style("font-family","Arial")
          .style("font-size",fontSize)
          .attr("id",function (d:number, i:number){
            return res.features[i].properties.name;
          })
          .attr("pointer-events","none")
          .attr("visibility","hidden");
      })
      .catch(() =>{
        console.log('Data failed to load from url');
      });

      //Adding legend
      const legend = d3.selectAll(".ChoroplethMap")
      .append("g").attr("class", "legend-group")
      // 

      for (let i = 0; i < legendSteps; i++){ //creates legend squares
        d3.selectAll('.legend-group')
        .append("rect")
        .attr("class", "legend-rect")
        .attr("x", width - (width-legendSvgPadding))
        .attr("y",  function(){
          return i*20;
        })
        .attr("width",40)
        .attr("height",20)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", function (){
          console.log(step,i)
          return color(step*i);
        });

        d3.selectAll('.legend-group').append("text")
        .text(legendArr[i]) //`${(0.2*100000*i)|| `<${0.2*100000}`}`
        .attr("x", width - (width-legendSvgPadding-45))
        .attr("y",  function(){
          return i*20+15;
        })
        .attr("width",40)
        .attr("height",20)
        // .attr("position", "absolute")
      }

      //adds Title
      const titleRef = d3.select(".ChoroplethMap")
      .append("text")
      .attr("x", (width / 2))             
      .attr("y", paddingTitle) // padding from top for title
      .attr("text-anchor", "middle")  
      .attr("font-size", "16px") 
      .attr("text-decoration", "underline")
      .attr("fill","black")  
      .text(title);
    }

  
  useEffect( ()   =>  {
    makeChoroplethChart();
  }, [props]);

    
    
  return (    
    <>
        <svg        
            style={{
                padding: 0,
            }}
            className="ChoroplethMap"      
            >
              
            </svg>
    </>  
  )
}