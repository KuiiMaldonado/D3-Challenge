var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

function xAxisScale(fileData){
  return d3.scaleLinear()
        .domain([d3.min(fileData, d => d.poverty) - 2, d3.max(fileData, d => d.poverty) + 2])
        .range([0, width]);
}

function yAxisScale(fileData){
  return d3.scaleLinear()
        .domain([d3.min(fileData, d => d.healthcare) - 2, d3.max(fileData, d => d.healthcare) + 2])
        .range([height, 0]);
}

//Loading the data from the data.csv file
d3.csv("assets/data/data.csv").then(function(fileData){

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    fileData.forEach(data => {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = xAxisScale(fileData);

    var yLinearScale = yAxisScale(fileData);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle").data(fileData).enter();
    var circles = circlesGroup
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .classed("stateCircle", true)
      .attr("cursor", "pointer");

    var circlesText = circlesGroup
      .append("text")
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare) + 3.5)
      .classed("stateText", true)
      .attr("font-size", "10px")
      .attr("cursor", "pointer")
      .text(d => d.abbr);

    // Create axes labels
    chartGroup.append("text")
    .classed("aText", true)
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

    chartGroup.append("text")
    .classed("aText", true)
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

}).catch(error => console.log(error));