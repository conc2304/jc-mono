import * as d3 from 'd3';

export function wrap(text: d3.Selection<any, any, any, any>, width: number) {
  text.each(function () {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    const lineHeight = 1.4; // ems
    const y = text.attr('y');
    const x = text.attr('x');
    const dy = parseFloat(text.attr('dy'));
    let tspan = text
      .text(null)
      .append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', dy + 'em');

    let word;
    let line: string[] = [];
    let lineNumber = 0;

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      const node = tspan.node();
      if (node !== null && node.getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .text(word);
      }
    }
  });
}
