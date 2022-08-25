<p align="center" id="top"><img src="https://user-images.githubusercontent.com/103704106/186263018-98f1f8d8-97e2-472e-8abc-0c4a8b15ad32.svg"></img></p>

<p align="center">
  <a href="https://d3nodata.deno.dev/">
    homepage
  </a>
  |
  <a href="https://d3nodata.deno.dev/docs">
    documentation
  </a>
  |
  <a href="https://deno.land/x/d3nodata">
    deno.land
  </a>
</p>

<div align="center">
    
![GitHub Repo stars](https://img.shields.io/github/stars/oslabs-beta/d3no-data?color=%239ae17b&label=stars&style=flat-square)
![GitHub contributors](https://img.shields.io/github/contributors/oslabs-beta/d3no-data?color=%239d65c9&style=flat-square)

</div>

## INTRO

**D3NO DATA** is a chart component library written in D3.js and Preact, designed to be a simple but fully-featured way to implement D3 in Fresh projects at the lowest possible performance cost.

Key Features:
- Fully modular, lightweight charts with only one introduced dependency: D3
- A variety of charts, accepting one or multiple data sets where appropriate
- Customizable chart appearance, with default parameters to make it simpler to "plug n' play"
- Entire feature set of D3 through the imported components
- Efficient utilization of Preact to render changes to input data or parameters

## DOCUMENTATION

The documentation is available [on the website](https://d3nodata.deno.dev/docs).

## GETTING STARTED

1) Look through our site to determine the kind of chart you want to use and find its import link 
<br/> *picture of site & documentation*

2) Import the chart you want from our library, hosted at deno.land, into your project 
<br/> *picture of import code*

3) Implement the component where you want it within your web app built in Fresh
<br/> *Ex: <> \<Your Header /> \<BarChart datasets=\[{dataset}] /> </>*
<br/> *picture of the component nested in JSX*

4) Pass your data in the way specified in our documentation for the chart you're using
<br/> *picture of a data set getting passed into the component as props*
<br/> *picture of the chart with default properties rendering the user data*

5) If necessary, modify the appearance of the chart to fit the design of your application!
<br/> *picture of the code required for passing in to fit the appearance of the demo website in the screenshot (font, color scheme, size)*
<br/> *picture of the chart itself fitting in well with the simple demo application*
