// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 40
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv", function(err, NewsData) {
  if (err) throw err;

  console.log(NewsData);
  // Step 1: Parse Data/Cast as numbers
   // ==============================
  NewsData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([3, d3.max(NewsData, d => d.healthcare)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(NewsData, d => d.obesity)])
    .range([height, 0]);

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
  chartGroup.selectAll("circle")
  .data(NewsData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.healthcare))
  .attr("cy", d => yLinearScale(d.obesity))
  .attr("r", "15")
  .attr("fill", "blue")
  .attr("opacity", ".5")
  .text(d => d.abbr);

  chartGroup.selectAll("text")
  .data(NewsData)
  .enter()
  .append("text")
  .attr("x", d => xLinearScale(d.healthcare))
  .attr("y", d => yLinearScale(d.obesity))
  .attr("text-anchor","middle")
  .attr("font-family","sans-serif")
  .attr("font-size","10px")
  .attr("fill","white")
  .text(d => d.abbr);

});