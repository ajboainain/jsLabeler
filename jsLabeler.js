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

function setCircleAttributes(circle, cx, cy, r, fill) {
  circle.setAttributeNS(null, 'cx', cx);
  circle.setAttributeNS(null, 'cy', cy);
  circle.setAttributeNS(null, 'r', r);
  circle.setAttributeNS(null, 'fill', fill);
  circle.setAttributeNS(null, 'stroke', "black");
  circle.setAttributeNS(null, 'stroke-opacity', "0.8");
  circle.setAttributeNS(null, 'stroke-width', "1");
  circle.setAttributeNS(null, 'fill-opacity', "1");
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
//rgba(15, 252, 3, 0.8)

const svg = document.querySelector('#svg');
const svgPoint = (elem, x, y) => {
  const p = svg.createSVGPoint();
  p.x = x;
  p.y = y;
  return p.matrixTransform(elem.getScreenCTM().inverse());
};
//https://javascript.info/mouse-drag-and-drop
svg.onmousedown = function (event) {
  var moving = false;
  
  
  if (event.target.nodeName == 'rect') {
    
    var currentRect = event.target;
    var currentGrouping = currentRect.parentNode;

    let shiftX = event.clientX - currentRect.getBoundingClientRect().left;
    let shiftY = event.clientY - currentRect.getBoundingClientRect().top ;
    let shiftBottom = event.clientY - currentRect.getBoundingClientRect().bottom;
    let shiftRight = event.clientX - currentRect.getBoundingClientRect().right;

    currentRect.style.position = 'absolute';
    currentRect.style.zIndex = 1000;
    currentGrouping.append(currentRect);

    function moveAt(pageX, pageY) {
      const coords = svgPoint(svg, event.clientX, event.clientY);
      var circles = function () {
        var temp = []
        currentGrouping.childNodes.forEach(child =>{
          if (child.tagName == "circle") 
            temp.push(child);
        });
        return temp;
      }
      var circlesList = circles();
      if (circlesList.length > 0) {
        setCircleAttributes(circlesList[0], pageX - shiftX, pageY - shiftY, 3, "black");
        setCircleAttributes(circlesList[1], pageX - shiftX, pageY - shiftBottom - 8, 3, "white");
        setCircleAttributes(circlesList[2], pageX - shiftRight - 20, pageY - shiftY, 3, "orange");
        setCircleAttributes(circlesList[3], pageX - shiftRight - 20, pageY - shiftBottom - 8, 3, "blue");

      }
      // setCircleAttributes(circlesList[2], pageX - shiftX, pageY - shiftY, 3);
      // setCircleAttributes(circlesList[3], pageX - shiftX, pageY - shiftY, 3);
      
      currentRect.setAttributeNS(null, 'x', pageX - shiftX);
      currentRect.setAttributeNS(null, 'y', pageY - shiftY);
    }

  function onMouseMove(event) {
    const coords = svgPoint(svg, event.clientX, event.clientY);
    moveAt(coords.x, coords.y);
  }

    document.addEventListener('mousemove', onMouseMove);

    currentRect.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      currentRect.onmouseup = null;
      moving = false;
    };
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

    
    setCircleAttributes(circleTL, p.x, p.y, 3, "black");
    setCircleAttributes(circleTR, p.x, p.y+h, 3, "white");
    setCircleAttributes(circleBL, p.x+w, p.y, 3, "orange");
    setCircleAttributes(circleBR, p.x+w, p.y+h, 3, "blue");

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
  };
  
  svg.addEventListener('mousemove', drawRect);
  svg.addEventListener('mouseup', endDraw);
};

function reportWindowSize() {
  // put code to change the width and height attributes of svg for better rect moving
  console.log(window.innerHeight);
  console.log(window.innerWidth);
}

window.onresize = reportWindowSize;