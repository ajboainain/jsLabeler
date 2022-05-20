// Code for collapsing labels 
const boxes = document.querySelectorAll('.collapsed');

boxes.forEach(box => {
  box.addEventListener('click', function handleClick(event) {
    console.log('box clicked', event);

    box.classList.toggle('collapsed')
  });
});


const svg = document.querySelector('#svg');
const svgPoint = (elem, x, y) => {
  const p = svg.createSVGPoint();
  p.x = x;
  p.y = y;
  return p.matrixTransform(elem.getScreenCTM().inverse());
};

svg.addEventListener('mousedown', (event) => {
  const grouping = document.createElement('g');

  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  // const circleTL = document.createElementNS('http://www.w3.org/2000/circle', 'circle');
  const circleTL = document.createElement('circle');
  const circleTR = document.createElementNS('http://www.w3.org/2000/circle', 'circle');
  const circleBL = document.createElementNS('http://www.w3.org/2000/circle', 'circle');
  const circleBR = document.createElementNS('http://www.w3.org/2000/circle', 'circle');
  
  const start = svgPoint(svg, event.clientX, event.clientY);
  const drawRect = (e) => {
    const p = svgPoint(svg, e.clientX, e.clientY);
    const w = Math.abs(p.x - start.x);
    const h = Math.abs(p.y - start.y);
    if (p.x > start.x) {
      p.x = start.x;
    }

    if (p.y > start.y) {
      p.y = start.y;
    }

    circleTL.setAttribute('cx', p.x);
    circleTL.setAttribute('cy', p.y);
    circleTL.setAttribute('r', 3);
    
    circleTL.setAttribute('fill', "rgba(15, 252, 3, 0.8)");
    circleTL.setAttribute('stroke', "black");
    circleTL.setAttribute('stroke-opacity', "0.8");
    circleTL.setAttribute('stroke-width', "1");
    circleTL.setAttribute('fill-opacity', "0.1");


    rect.setAttribute('x', p.x);
    rect.setAttribute('y', p.y);
    rect.setAttribute('width', w);
    rect.setAttribute('height', h);
    rect.setAttribute('fill', "rgba(15, 252, 3, 0.8)");
    rect.setAttribute('stroke', "rgba(15, 252, 3, 0.8)");
    rect.setAttribute('stroke-opacity', "0.8");
    rect.setAttribute('stroke-width', "2");
    rect.setAttribute('fill-opacity', "0.1");

    // grouping.appendChild(rect);

    svg.appendChild(circleTL);
    svg.appendChild(rect);
  };

  const endDraw = (e) => {
    svg.removeEventListener('mousemove', drawRect);
    svg.removeEventListener('mouseup', endDraw);
    console.log(circleTL);
  };
  
  svg.addEventListener('mousemove', drawRect);
  svg.addEventListener('mouseup', endDraw);
});


