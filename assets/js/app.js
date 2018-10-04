// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 70,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create the svg, using the width and height specified above, before offsetting it by the left & top margins
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initialize the axes desired on page load
var chosenXAxis = "obesity";
var chosenYAxis = "poverty";

// function for setting new xScale
function xScale(newsData, chosenXAxis) {

  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(newsData, d => d[chosenXAxis]) * 0.9,
      d3.max(newsData, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;

};

// function for setting new yScale
function yScale(newsData, chosenYAxis) {

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(newsData, d => d[chosenYAxis]) * 0.8,
      d3.max(newsData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

    return yLinearScale;

};

// Updater for the x-axis when a variable is changed
function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// Updater for the y-axis when a variable is changed
function renderAxesY(newYScale,yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;

}

// function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//   if (chosenXAxis === "hair_length") {
//     var label = "Hair Length:";
//   }
//   else {
//     var label = "# of Albums:";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/newsData.csv", function(err, newsData) {
  if (err) throw err;

  // parse data
  newsData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // use xLinearScale function
  var xLinearScale = xScale(newsData, chosenXAxis);

  // use yLinearScale function
  var yLinearScale = yScale(newsData, chosenYAxis);

  // Create the starting axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(newsData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".5");

  // Create group for x-axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var obesityLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "obesity") // value for event listener
    .classed("active", true)
    .text("Percentage of Obese");

  var smokesLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "smokes") // value for event listener
    .classed("inactive", true)
    .text("Percentage of Smokers");

  // append y axis
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)")

  var povertyLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - 50)
    .attr("dy", "1em")
    .attr("value", "poverty") // value for event listener
    .classed("active", true)
    .text("Percentage in Poverty");

  var healthcareLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - 70)
    .attr("dy", "1em")
    .attr("value", "healthcare") // value for event listener
    .classed("inactive", true)
    .text("Percentage that Lacks Healthcare")

  // updateToolTip function above csv import
  // var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {

      // retrieve value of clicked item
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replace the chosenXAxis with value
        chosenXAxis = value;
        console.log(chosenXAxis);

        // update the x scale for new data
        xLinearScale = xScale(newsData, chosenXAxis);

        // update the x axis
        xAxis = renderAxesX(xLinearScale, xAxis);

        // update the circles with new x values
        circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

      // y axis labels event listener
  yLabelsGroup.selectAll("text")
  .on("click", function() {

    // retrieve value of clicked item
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replace the chosenYAxis with value
      chosenYAxis = value;

      // update the y scale for new data
      yLinearScale = yScale(newsData, chosenYAxis);

      // update the y axis
      yAxis = renderAxesY(yLinearScale, yAxis);

      // update the circles with new y values
      circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      // circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

      // change classes to change bold text
      if (chosenYAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });

});