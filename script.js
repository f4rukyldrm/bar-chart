const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let data;
let values;

let yScale
let xScale
let xAxisScale
let yAxisScale

let width = 800;
let height = 500;
let padding = 40;

let svg = d3.select('svg');

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});


const drawCanvas = () => {
    svg.attr('width', width);
    svg.attr('height', height);
}

const generateScales = () => {
    yScale = d3.scaleLinear()
        .domain([0, d3.max(values, item => item[1])])
        .range([0, height - (padding * 2)]);

    xScale = d3.scaleLinear()
        .domain([0, values.length - 1])
        .range([padding, width - padding - 2]);

    let datesArray = values.map(item => {
        return new Date(item[0])
    });

    xAxisScale = d3.scaleTime()
        .domain([d3.min(datesArray), d3.max(datesArray)])
        .range([padding, width - padding]);

    yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(values, item => item[1])])
        .range([height - padding, padding])
}

const drawBars = () => {

    let tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('position', 'relative')
        .text('1947 - 2015')
        .style('top', '-200px')


    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2 * padding)) / values.length)
        .attr('data-date', (item) => item[0])
        .attr('data-gdp', (item) => item[1])
        .attr('height', item => yScale(item[1]))
        .attr('x', (item, index) => xScale(index))
        .attr('y', item => height - padding - yScale(item[1]))
        .on('mouseover', (item, index) => {
            tooltip.transition()
                .style('visibility', 'visible');

            tooltip.text(item[0] + '\n' + formatter.format(item[1]))
                .style('left', (xScale(index) - 300) + 'px')


            document.querySelector('#tooltip').setAttribute('data-date', item[0])
        })
        .on('mouseout', item => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
}

const generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale);
    let yAxis = d3.axisLeft(yAxisScale);

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (height - padding) + ')');

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ',0)')
}

const fetchData = async () => {
    data = await fetch(url).then(response => response.json());
    values = await data.data;

    drawCanvas();
    generateScales();
    drawBars();
    generateAxes();

}

fetchData();