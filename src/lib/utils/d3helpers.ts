import * as d3 from 'd3';

export interface AxisConfig {
  width: number;
  height: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
}

export function createXScale(domain: [number, number], config: AxisConfig) {
  return d3.scaleLinear()
    .domain(domain)
    .range([config.marginLeft, config.width - config.marginRight]);
}

export function createYScale(domain: [number, number], config: AxisConfig) {
  return d3.scaleLinear()
    .domain(domain)
    .range([config.height - config.marginBottom, config.marginTop]);
}

export function drawXAxis(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  scale: d3.ScaleLinear<number, number>,
  config: AxisConfig,
  label: string
) {
  const axis = d3.axisBottom(scale);
  
  svg.select('.x-axis').remove();
  
  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${config.height - config.marginBottom})`)
    .call(axis);
  
  svg.select('.x-axis-label').remove();
  
  svg.append('text')
    .attr('class', 'x-axis-label')
    .attr('text-anchor', 'middle')
    .attr('x', (config.width + config.marginLeft - config.marginRight) / 2)
    .attr('y', config.height - 5)
    .text(label);
}

export function drawYAxis(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  scale: d3.ScaleLinear<number, number>,
  config: AxisConfig,
  label: string
) {
  const axis = d3.axisLeft(scale);
  
  svg.select('.y-axis').remove();
  
  svg.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${config.marginLeft},0)`)
    .call(axis);
  
  svg.select('.y-axis-label').remove();
  
  svg.append('text')
    .attr('class', 'y-axis-label')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(config.height + config.marginTop - config.marginBottom) / 2)
    .attr('y', 15)
    .text(label);
}

export function drawCurve(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  points: [number, number][],
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  className: string,
  color: string = '#2563eb'
) {
  const line = d3.line()
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]));
  
  svg.selectAll(`.${className}`).remove();
  
  svg.append('path')
    .datum(points)
    .attr('class', className)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 2)
    .attr('d', line);
}

export function drawPoint(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  className: string,
  color: string = '#dc2626'
) {
  svg.selectAll(`.${className}`).remove();
  
  svg.append('circle')
    .attr('class', className)
    .attr('cx', xScale(x))
    .attr('cy', yScale(y))
    .attr('r', 5)
    .attr('fill', color)
    .attr('stroke', '#fff')
    .attr('stroke-width', 2);
}
