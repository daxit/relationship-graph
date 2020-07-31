const CANVAS_WIDTH = document.getElementById('list-sections').offsetWidth * 2 - 20;
const CANVAS_CLASS = 'rel-graph__map';
const CANVAS_CLASS_TERMS = 'rel-graph__map rel-graph__map--term';
const CANVAS_CURVE_COLOR =  '#e3e3e3';
const CANVAS_CURVE_COLOR_BIZ = 'rgba(0, 98, 255, 0.3)';
const CANVAS_CURVE_COLOR_ASSET = 'rgba(7, 241, 216, 0.3)';
const MAX_SECTION_SIZE = 150;
const sections = [
  {
    name: 'GDPR - SEC. 3. - 1798.120',
    freq: 210,
    regTerms: [
      {
        name: 'Deidentified',
        freq: 130,
        dataAssets: [
          { name: 'Business', freq: 90 },
          { name: 'Device model', freq: 15 },
        ],
        bizTerms: [
          { name: 'Employee', freq: 25 },
        ]
      },
      {
        name: 'Device',
        freq: 80,
        dataAssets: [
          { name: 'Retail', freq: 45 },
        ],
        bizTerms: [
          { name: 'Employee', freq: 35 },
        ]
      },
    ]
  },
  {
    name: 'GDPR - SEC. 3. - 1798.145',
    freq: 170,
    regTerms: [
      {
        name: 'Rank',
        freq: 50,
        dataAssets: [
          { name: 'Retail', freq: 7.5 },
          { name: 'Professional', freq: 10 },
        ],
        bizTerms: [
          { name: 'Product Type', freq: 32.5 },
        ]
      },
      {
        name: 'Share',
        freq: 40,
        dataAssets: [
          { name: 'Student', freq: 10 }
        ],
        bizTerms: [
          { name: 'Employee', freq: 30 },
        ]
      },
      {
        name: 'Business',
        freq: 20,
        dataAssets: [
        ],
        bizTerms: [
          { name: 'Request', freq: 20 },
        ]
      },
      {
        name: 'Control',
        freq: 20,
        dataAssets: [
          { name: 'Retail', freq: 10 },
        ],
        bizTerms: [
          { name: 'Information Service', freq: 10 },
        ]
      },
      {
        name: 'Collects',
        freq: 10,
        dataAssets: [
        ],
        bizTerms: [
          { name: 'Request', freq: 10 },
        ]
      },
      {
        name: 'Homepage',
        freq: 10,
        dataAssets: [
          { name: 'Device model', freq: 10 },
        ],
        bizTerms: [
        ]
      },
      {
        name: 'History',
        freq: 10,
        dataAssets: [
        ],
        bizTerms: [
          { name: 'Consumer Finance', freq: 10 }
        ]
      },
      {
        name: 'Consumer',
        freq: 10,
        dataAssets: [
        ],
        bizTerms: [
          { name: 'Request', freq: 10 },
        ]
      },
    ]
  },

];

const regulationTerms = [
  { name: 'Deidentified', freq: 130 },
  { name: 'Device', freq: 80 },
  { name: 'Rank', freq: 50 },
  { name: 'Share', freq: 40 },
  { name: 'Business', freq: 20 },
  { name: 'Control', freq: 20 },
  { name: 'Collects', freq: 10 },
  { name: 'Homepage', freq: 10 },
  { name: 'History', freq: 10 },
  { name: 'Consumer', freq: 10 }
];

const dataAssets = [
  { name: 'Business', freq: 90 },
  { name: 'Retail', freq: 62.5 },
  { name: 'Device model', freq: 25 },
  { name: 'Professional', freq: 10 },
  { name: 'Student', freq: 10 }
];

const businessTerms = [
  { name: 'Employee', freq: 90 },
  { name: 'Request', freq: 40 },
  { name: 'Product Type', freq: 32.5 },
  { name: 'Information Service', freq: 10 },
  { name: 'Consumer Finance', freq: 10 }
];

var allMaps = [];
function setup() {
  load(sections, regulationTerms, dataAssets, businessTerms);
};
function load(listOne, listTwo, listThree, listFour) {
  while(document.getElementById('rel-graph').querySelector('canvas')) {
    document.getElementById('rel-graph').removeChild(document.getElementById('rel-graph').querySelector('canvas'));
  }
  for (let list of document.getElementsByClassName('rel-graph__list')) {
    list.innerHTML = '';
  }
  // while (document.getElementById('rel-graph').querySelector('li')) {
  //   console.log(document.getElementById('rel-graph').querySelector('li'));
  //   document.getElementById('rel-graph').removeChild(document.getElementById('rel-graph').querySelector('li'));
  // }
  // render out all the lists first to allow for relative positioning
  renderList(listOne, 'list-sections', 'rel-graph__item-section', 'rel-graph__tab-section');
  renderList(listTwo, 'list-terms-reg', 'rel-graph__item-term', 'rel-graph__tab-term');
  renderList(listThree, 'list-terms-biz', 'rel-graph__item-term', 'rel-graph__tab-term rel-graph__tab-term--asset');
  renderList(listFour, 'list-terms-biz', 'rel-graph__item-term', 'rel-graph__tab-term rel-graph__tab-term--biz');


  // now render out all the mappings between the list items
  for (let section of listOne) {
    for (let regTerm of section.regTerms) {
      let regTermObject = listTwo.find(obj => {
        return obj.name === regTerm.name;
      });
      if (regTermObject !== undefined) {
        let sectionCanvas = drawCurve(section.element, regTermObject.element, section.offset, 0, regTermObject.freq, CANVAS_CURVE_COLOR);
        sectionCanvas.className = CANVAS_CLASS;
        document.getElementById('rel-graph').append(sectionCanvas);
        section.maps.push(sectionCanvas);
        regTermObject.maps.push(sectionCanvas);
        allMaps.push(sectionCanvas);
        section.offset += regTerm.freq;
        for (let asset of regTerm.dataAssets) {
          let assetObject = listThree.find(obj => {
            return obj.name === asset.name;
          });
          if (assetObject !== undefined) {
            let canvas = drawCurve(regTermObject.element, assetObject.element, regTermObject.offset, assetObject.offset, asset.freq, CANVAS_CURVE_COLOR_ASSET);
            canvas.className = CANVAS_CLASS_TERMS;
            document.getElementById('rel-graph').append(canvas);
            section.maps.push(canvas);
            regTermObject.maps.push(canvas);
            assetObject.maps.push(canvas);
            assetObject.maps.push(sectionCanvas);
            allMaps.push(canvas);
            regTermObject.offset += asset.freq;
            assetObject.offset += asset.freq;
          }
        }

        for (let term of regTerm.bizTerms) {
          let termObject = listFour.find(obj => {
            return obj.name === term.name;
          });
          if (termObject !== undefined) {
            let canvas = drawCurve(regTermObject.element, termObject.element, regTermObject.offset, termObject.offset, term.freq, CANVAS_CURVE_COLOR_BIZ);
            canvas.className = CANVAS_CLASS_TERMS;
            document.getElementById('rel-graph').append(canvas);
            section.maps.push(canvas);
            regTermObject.maps.push(canvas);
            termObject.maps.push(canvas);
            termObject.maps.push(sectionCanvas);
            allMaps.push(canvas);
            regTermObject.offset += term.freq;
            termObject.offset += term.freq;
          }
        }
      }
    }
  }

  let typingTimer = 0;
  document.getElementById('finder').addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    // debugger;

    typingTimer = setTimeout(() => {
      let query = document.getElementById('finder').value.toLowerCase();
      console.log(query);
      let filteredSections = sections.filter(term => term.name.toLowerCase().includes(query));
      let filteredRegTerms = regulationTerms.filter(term => term.name.toLowerCase().includes(query));
      let filteredDataAssets = dataAssets.filter(term => term.name.toLowerCase().includes(query));
      let filteredBizTerms = businessTerms.filter(term => term.name.toLowerCase().includes(query));

      //TODO add to lists to include references for search results
      load(filteredSections, filteredRegTerms, filteredDataAssets, filteredBizTerms);
    }, 550);
  });
}

function renderList(list, target, className, classNameTab) {
  for (let item of list) {
    let itemElement = document.createElement('li');
    itemElement.className = className;
    itemElement.style.lineHeight = item.freq + 'px';
    let itemElementTab = document.createElement('div');
    itemElementTab.className = classNameTab;
    itemElement.append(itemElementTab);
    itemElement.append(item.name);
    document.getElementById(target).append(itemElement);
    item.element = itemElement;
    item.maps = [];
    item.offset = 0;
    addHover(item.element, item.maps, allMaps);
  }
}
function addHover(obj, myMaps, allMaps) {
  obj.querySelector('div').addEventListener('mouseover', (event) => {
    for (let map of allMaps) {
        map.classList.add('rel-graph--hidden');
    }
    for (let child of document.getElementById('list-sections').children) {
      child.classList.add('rel-graph--hidden');
    }
    for (let child of document.getElementById('list-terms-reg').children) {
      child.classList.add('rel-graph--hidden');
    }
    for (let child of document.getElementById('list-terms-biz').children) {
      child.classList.add('rel-graph--hidden');
    }
    for (let map of myMaps) {
      map.classList.remove('rel-graph--hidden');
      map.objFrom.classList.remove('rel-graph--hidden');
      map.objTo.classList.remove('rel-graph--hidden');
    }
  });
  obj.querySelector('div').addEventListener('mouseout', (event) => {
    for (let map of allMaps) {
      map.classList.remove('rel-graph--hidden');
    }
    for (let child of document.getElementById('list-sections').children) {
      child.classList.remove('rel-graph--hidden');
    }
    for (let child of document.getElementById('list-terms-reg').children) {
      child.classList.remove('rel-graph--hidden');
    }
    for (let child of document.getElementById('list-terms-biz').children) {
      child.classList.remove('rel-graph--hidden');
    }
  });
}

/**
 * Creates a canvas with a curve drawn from the starting object to the ending object
 *
 * @param {*} objFrom
 * @param {*} objTo
 * @param {*} objFromOffset
 * @param {*} objToOffset
 * @param {*} size
 * @param {*} color
 * @returns the created canvas
 */
function drawCurve(objFrom, objTo, objFromOffset, objToOffset, size, color) {
  let canvas = document.createElement('canvas');
  canvas.objFrom = objFrom;
  canvas.objTo = objTo;
  if (!canvas.getContext) {
    return undefined;
  }
  let ctx = canvas.getContext('2d');
  let mapOffset = (objFrom.offsetTop + objFromOffset) - objTo.offsetTop - objToOffset;
  ctx.canvas.width = CANVAS_WIDTH;

  if (mapOffset > 0) {
    ctx.canvas.style.top = objTo.offsetTop + objToOffset + 'px';
    ctx.canvas.height = mapOffset + size;
    drawCurveFromBottom(ctx, size, color);
  }
  else {
    ctx.canvas.style.top = objFrom.offsetTop + objFromOffset + 'px';
    ctx.canvas.height = mapOffset * -1 + size;
    drawCurveFromTop(ctx, size, color);
  }
  return canvas;
}

/**
 * Draws a curve from the top left of the canvas to the bottom right
 *
 * @param {*} ctx
 * @param {*} size
 * @param {*} color
 */
function drawCurveFromTop(ctx, size, color) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(
    ctx.canvas.width / 2, 0,
    ctx.canvas.width / 2, ctx.canvas.height - size,
    ctx.canvas.width, ctx.canvas.height - size);
  ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
  ctx.bezierCurveTo(
    ctx.canvas.width / 2, ctx.canvas.height,
    ctx.canvas.width / 2, size,
    0, size);
  ctx.fillStyle = color;
  // ctx.fillStyle = getRandomColor();
  ctx.fill();
}

/**
 * Draws a curve from the bottom left of the canvas to the top right
 *
 * @param {*} ctx
 * @param {*} size
 * @param {*} color
 */
function drawCurveFromBottom(ctx, size, color) {
  ctx.beginPath();
  ctx.moveTo(0, ctx.canvas.height);
  ctx.bezierCurveTo(
      ctx.canvas.width / 2, ctx.canvas.height,
      ctx.canvas.width / 2, size,
      ctx.canvas.width, size);
  ctx.lineTo(ctx.canvas.width, 0);
  ctx.bezierCurveTo(
    ctx.canvas.width / 2, 0,
    ctx.canvas.width / 2, ctx.canvas.height - size,
    0, ctx.canvas.height - size);
  ctx.fillStyle = color;
  // ctx.fillStyle = getRandomColor();
  ctx.fill();
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawVector(objFrom, objTo, objFromOffset, objToOffset, size, color) {
  let svg = document.createElement('SVG', 'svg');
  svg.objFrom = objFrom;
  svg.objTo = objTo;
  let mapOffset = (objFrom.offsetTop + objFromOffset) - objTo.offsetTop - objToOffset;
  svg.setAttribute('width', CANVAS_WIDTH);
  svg.setAttribute('fill', color);
  console.log(svg);
  if (mapOffset > 0) {
    svg.style.top = objTo.offsetTop + objToOffset + 'px';
    svg.setAttribute('height', mapOffset + size);
    drawVectorFromBottom(svg, size, color);
  }
  else {
    svg.style.top = objFrom.offsetTop + objFromOffset + 'px';
    svg.setAttribute('height', mapOffset * -1 + size);
    drawVectorFromTop(svg, size, color);
  }
  return svg;
}

function drawVectorFromTop(svg, size, color) {
  let center = svg.width / 2;
  let path = document.createElementNS('SVG', 'path');
  let coords = 'M0 0 C ' +
    center + ' 0, ' +
    center + ' ' + (svg.height - size) + ', ' +
    svg.width + ' ' + (svg.height - size);
  console.log('start' + coords);
  path.setAttribute('d', coords);


  coords = 'L ' + svg.width + ' ' + svg.height;

  coords = 'C ' +
    center + ' ' + svg.height + ', ' +
    center + ' ' + size + ', ' +
    '0 ' + size;
  console.log('end' + coords);

  coords = 'L 0 0';
}

function drawVectorFromBottom(ctx, size, color) {
  return;
  ctx.beginPath();
  ctx.moveTo(0, ctx.canvas.height);
  ctx.bezierCurveTo(
    ctx.canvas.width / 2, ctx.canvas.height,
    ctx.canvas.width / 2, size,
    ctx.canvas.width, size);
  ctx.lineTo(ctx.canvas.width, 0);
  ctx.bezierCurveTo(
    ctx.canvas.width / 2, 0,
    ctx.canvas.width / 2, ctx.canvas.height - size,
    0, ctx.canvas.height - size);
  ctx.fillStyle = color;
  ctx.fill();
}
