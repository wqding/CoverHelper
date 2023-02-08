import { useEffect } from 'react';
import * as d3 from 'd3';

import PropTypes from 'prop-types';
// ----------------------------------------------------------------------

CLSection.propTypes = {
    text: PropTypes.string,
};

export default function CLSection({ text = "" }) {
    const fontSize = 24;

    useEffect(() => {
      const svg = d3.select("#svg");
      const chars = text.split('');
      const x = 125;
      const y = 150;
  
      svg.append("rect")
        .attr("x", 100)
        .attr("y", 100)
        .attr("width", 300)
        .attr("height", 400)
        .attr("fill", "#fff");
  
      svg.selectAll("path")
        .data(chars)
        .enter()
        .append("path")
          .attr("d", (char, i) => {
            const path = d3.path();
            path.rect(x + i * fontSize, y - fontSize, fontSize, fontSize);
            return path.toString();
          })
          .attr("fill", "none")
          .attr("stroke", "#000");
    });

    return (
        <div style={{
            position: 'fixed',
            top: '0px',
            bottom: '0px',
            right: '0px',
            width: '50%',
            flex: '1 1 0%',
            display: 'flex',
            backgroundColor: 'rgb(101, 110, 131)',
            userSelect: 'none',
          }}>
            <svg id="svg" viewBox="0 0 500 500" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
    );
}

