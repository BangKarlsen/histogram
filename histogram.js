'use strict';

function updateHistogram() {
    var inputData = getInputData();
    drawHistogram(inputData.values, inputData.bins);
}

function getInputData() {
    /* Simple parsing of the input string. This should be improved
    to sanitize data by removing extra commas, letters, and other invalid input. */
    var valuesString = d3.select("#numbers").property("value");
    var values = valuesString.split(",").map(Number);

    /* The number of bins in the histogram is currently
    set to the highest value in the input data. Alternatively, a slider could have
    been shown to let the user control the number of bins. */
    var bins = d3.max(values) + 1;
    return {
        values: values,
        bins: bins
    };
}

/* Histogram code is adapted from http://bl.ocks.org/mbostock/3048450 */
function drawHistogram(values, bins) {

    // Remove existing histogram before creating a new.
    d3.select("svg").remove();

    var margin = {
            top: 10,
            right: 30,
            bottom: 30,
            left: 30
        };
    var width = 450 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var formatCount = d3.format(",.0f");

    var x = d3.scale.linear()
        .domain([0, bins])
        .range([0, width]);

    // Generate a histogram using uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(bins))
        (values);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function (d) {
            return d.y;
        })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var svg = d3.select("#histogram").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function (d) {
            return "translate(" + x(d.x) + "," + y(d.y) + ")";
        });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(data[0].dx) - 1)
        .attr("height", function (d) {
            return height - y(d.y);
        });

    bar.append("text")
        .attr("dy", "1em")
        .attr("y", 6)
        .attr("x", x(data[0].dx) / 2)
        .attr("text-anchor", "middle")
        .text(function (d) {
            return formatCount(d.y);
        });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
}

$(updateHistogram());
$("#numbers").on("keyup", updateHistogram);
