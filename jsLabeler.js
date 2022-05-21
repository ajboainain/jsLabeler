// Code for collapsing labels 
const boxes = document.querySelectorAll('.collapsed');

boxes.forEach(box => {
  box.addEventListener('click', function handleClick(event) {
    console.log('box clicked', event);

    box.classList.toggle('collapsed')
  });
});

// document.addEventListener("click", function(e){
//   //your desired nodeName like : DIV , SPAN , LI etc
//   if(e.target.nodeName == 'rect') {
//     //add a function below to trigger 
//     console.log('yes');
//   }
// });

function setCircleAttributes(circle, cx, cy, r) {
  circle.setAttributeNS(null, 'cx', cx);
  circle.setAttributeNS(null, 'cy', cy);
  circle.setAttributeNS(null, 'r', r);
  circle.setAttributeNS(null, 'fill', "rgba(15, 252, 3, 0.8)");
  circle.setAttributeNS(null, 'stroke', "black");
  circle.setAttributeNS(null, 'stroke-opacity', "0.8");
  circle.setAttributeNS(null, 'stroke-width', "1");
  circle.setAttributeNS(null, 'fill-opacity', "0.1");
  return;
}

function setRectAttributes(rect, x, y, w, h) {
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', w);
  rect.setAttribute('height', h);
  rect.setAttribute('fill', "rgba(15, 252, 3, 0.8)");
  rect.setAttribute('stroke', "rgba(15, 252, 3, 0.8)");
  rect.setAttribute('stroke-opacity', "0.8");
  rect.setAttribute('stroke-width', "2");
  rect.setAttribute('fill-opacity', "0.1");
}

const svg = document.querySelector('#svg');
const svgPoint = (elem, x, y) => {
  const p = svg.createSVGPoint();
  p.x = x;
  p.y = y;
  return p.matrixTransform(elem.getScreenCTM().inverse());
};

svg.onmousedown = function (event) {
  // ('mousedown', (event) => {

  var moving = false;
  
  
  if (event.target.nodeName == 'rect') {
    var pt = svg.createSVGPoint();

    moving = true;
    // move the rect + circles here
    var clickedGrouping = event.target.parentNode;
    
    // Get point in global SVG space
    function cursorPoint(evt){
      pt.x = evt.clientX; pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    const moveRect = (e) => {
      var loc = cursorPoint(event);
      const w = event.target.getAttribute('width');
      const h = event.target.getAttribute('height');

      setRectAttributes(event.target, loc.x, loc.y, w, h);
      
    }
    const endMove = (e) => {
      event.target.removeEventListener('mousemove', moveRect);
      event.target.removeEventListener('mouseup', endMove);
      return;
      
    };
    event.target.addEventListener('mousemove', moveRect);
    event.target.addEventListener('mouseup', endMove);
    moving = false;
  }
  if (moving) {
    return;
  }
  
  const grouping = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  var circleTL = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  var circleTR = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  var circleBL = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  var circleBR = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  
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

    
    setCircleAttributes(circleTL, p.x, p.y, 3);
    setCircleAttributes(circleTR, p.x, p.y+h, 3);
    setCircleAttributes(circleBL, p.x+w, p.y, 3);
    setCircleAttributes(circleBR, p.x+w, p.y+h, 3);

    setRectAttributes(rect, p.x, p.y, w, h);

    grouping.appendChild(rect);
    grouping.appendChild(circleTL);
    grouping.appendChild(circleTR);
    grouping.appendChild(circleBL);
    grouping.appendChild(circleBR);
    grouping.classList.add("label-group");

    svg.appendChild(grouping);
  };

  const endDraw = (e) => {
    svg.removeEventListener('mousemove', drawRect);
    svg.removeEventListener('mouseup', endDraw);
    console.log(circleTL);
    console.log(grouping);
  };
  
  svg.addEventListener('mousemove', drawRect);
  svg.addEventListener('mouseup', endDraw);
};

