let font;
let letterGroups = []; 
let svgGroups = [];   
let currentGroups = []; 
let targetGroups = [];
let isHovering = false;
const letters = "cavity!".split("");
let noiseOffset = 0;

const svgPath = "M18.5 11C18.5 3 13.5858 7.35786 13 1.5C17.491 4.81946 20.9999 8 25 10C29 12 39.5 5.5 39.5 5.5C39.5 5.5 30.8066 13.5 33.8066 13C36.8066 12.5 40.8066 21.5 40.8066 21.5C39 18.0038 28.1863 14.791 27 17C23.6918 21.783 32.8362 25.4225 35.3066 30L33.8066 41.5C33.118 27.5 25.3665 24.3834 19.5 22.5C12.4184 27.4494 10.5 30 8.30656 41.5C3.49999 31 15.2645 27.2176 15.5 19.5L0.306641 22.5C0.306641 22.5 18.5 19 18.5 11Z";

fontlink = 'cavity.otf';

const div1 = document.getElementById("div1");
const caption = document.getElementById("caption");

function parseSVGPath(pathData, numPoints = 100) {
  let tempDiv = document.createElement('div');
  tempDiv.innerHTML = `<svg><path d="${pathData}"/></svg>`;
  let path = tempDiv.querySelector('path');
  let points = [];
  
  let length = path.getTotalLength();
  
  for (let i = 0; i < numPoints; i++) {
    let point = path.getPointAtLength(i * length / numPoints);
    points.push({
      x: point.x,
      y: point.y
    });
  }
  
  return points;
}

// Function for first canvas
function sketch1(p) {
  p.preload = function () {
    font = p.loadFont(fontlink);
  };

  p.setup = function () {
    p.createCanvas(window.innerWidth, window.innerHeight, canvas1);

    // Scale font size based on actual window width, ensure a reasonable minimum and maximum size
    let fontSize = window.innerWidth * 0.2; // Font size is 20% of the actual window width
    fontSize = p.constrain(fontSize, 50, 200); // Constrain the font size to a range
    let textWidth = font.textBounds(letters.join(""), 0, 0, fontSize).w;
    
    let xOffset = window.innerWidth / 2 - textWidth / 2;
    let yOffset = window.innerHeight / 2;

    letters.forEach(letter => {
      let points = font.textToPoints(letter, xOffset, yOffset, fontSize, {
        sampleFactor: 0.5,
        simplifyThreshold: 0,
      });
    
      let letterWidth = font.textBounds(letter, xOffset, yOffset, fontSize).w;
      xOffset += letterWidth + fontSize * 0.05; 
    
      if (points.length > 0) {
        letterGroups.push(points);
    
        let svgPoints = parseSVGPath(svgPath, points.length);
        let scaleFactor = window.innerWidth / 200;
        
        let [minX, maxX, minY, maxY] = [
          Math.min(...svgPoints.map(p => p.x)),
          Math.max(...svgPoints.map(p => p.x)),
          Math.min(...svgPoints.map(p => p.y)),
          Math.max(...svgPoints.map(p => p.y))
        ];
    
        let [svgWidth, svgHeight] = [maxX - minX, maxY - minY];
        let [svgOffsetX, svgOffsetY] = [
          window.innerWidth / 2 - svgWidth * scaleFactor / 2,
          window.innerHeight / 2 - svgHeight * scaleFactor / 1.5
        ];
    
        svgGroups.push(svgPoints.map(pt => ({
          x: pt.x * scaleFactor + svgOffsetX,
          y: pt.y * scaleFactor + svgOffsetY,
        })));
    
        currentGroups.push(points.map(pt => ({ x: pt.x, y: pt.y })));
        targetGroups.push(points.map(pt => ({ x: pt.x, y: pt.y })));
      }
    });
    caption.style.display = "block";
  };

  p.draw = function () {
    p.clear();

    const bounds1 = window.innerWidth * 2/8;
    const bounds2 = window.innerWidth * 6/8;
    const bounds3 = window.innerHeight * 3/8;
    const bounds4 = window.innerHeight * 5/8;

    if (p.mouseX >= bounds1 && p.mouseX <= bounds2 && p.mouseY >= bounds3 && p.mouseY <= bounds4) {
      if (!isHovering) {
        isHovering = true;
        targetGroups = svgGroups;
      }
    } else {
      if (isHovering) {
        isHovering = false;
        targetGroups = letterGroups;
      }
    }

    for (let g = 0; g < currentGroups.length; g++) {
      for (let i = 0; i < currentGroups[g].length; i++) {
        currentGroups[g][i].x = p.lerp(currentGroups[g][i].x, targetGroups[g][i].x, 0.1);
        currentGroups[g][i].y = p.lerp(currentGroups[g][i].y, targetGroups[g][i].y, 0.1);

        let noiseVal = p.noise(currentGroups[g][i].x * 0.1, currentGroups[g][i].y * 0.1, noiseOffset);
        currentGroups[g][i].x += p.map(noiseVal, 0, 1, -1, 1);
        currentGroups[g][i].y += p.map(noiseVal, 0, 1, -1, 1);
      }

      p.fill(0);
      p.noStroke();
      p.beginShape();
      for (let pos of currentGroups[g]) {
        p.vertex(pos.x, pos.y);
      }
      p.endShape(p.CLOSE);
    }

    noiseOffset += 0.01;
  };
}
  
// Run first p5 instance
new p5(sketch1);

let elements = {};
let infoBoxes = {}; 

let connections = [
  ['my_mouth', 'me'],
  ['my_mouth', 'tooth'],
  ['tooth', 'cavity'],
  ['drill', 'cavity'],
  ['my_original_tongue', 'my_mouth'],
  ['my_original_tongue', 'the_tools'],
  ['my_tiny_mouth', 'my_mouth'],
  ['glue', 'toupee'],
  ['glue', 'nurse'],
  ['toupee', 'nurse'],
  ['hands', 'suction_hose'],
  ['suction_hose', 'teacup'],
  ['suction_hose', 'my_tiny_mouth'],
  ['my_mouth', 'spit'],
  ['teacup', 'my_tiny_mouth'],
  ['teacup', 'nurse'],
  ['cavity', 'food'],
  ['me', 'food'],
  ['decay', 'filling'],
  ['decay', 'cavity'],
  ['filling', 'cavity'],
  ['rubber', 'my_mouth'],
  ['hands', 'the_tools'],
  ['the_tools', 'my_mouth'],
  ['odor', 'drill'],
  ['enamel', 'cavity'],
  ['enamel', 'tooth'],
  ['home', 'me'],
  ['plaque', 'tooth'],
  ['plaque', 'cavity'],
  ['doctor', 'hands'],
  ['nurse', 'hands'],
  ['doctor', 'me'],
  ['hands', 'drill'],
  ['me', 'my_tiny_mouth'],
  ['me', 'spit'],
  ['spit', 'suction_hose']
];

let elementTexts = {
  my_mouth: "My mouth is open and noise is coming out of it: I am a creature: and the drill against my tooth is my voice. Before this, both halves of the soundmaking were mine: fleshy parts of myself slap-clacking together. Now that the drill bit is continuous with my tooth, hard against hard, I speak in a long drone, pitch determined by angle.",
  rubber: "The mechanism that opens my mouth becomes rubber, not muscle.",
  my_original_tongue: "My original tongue is irrelevant now — really, it’s mostly an inconvenience: when I swallow, which I can’t help but do, it pushes and pulses, and this disrupts the tools:",
  the_tools: "the drill and mirror and suction hose have to shudder and resettle.",
  enamel: "Around this movement, noisy, the doctor is trying her very best to squeeze every last bit of my cavity out of that enamel.",
  nurse: "The nurse is leaning so close I can see his toupee.",
  toupee: "I think it’s peeling a little at the edges. On his behalf and on my own I get a little embarrassed, but he doesn’t know that I see it, or the possibility of it. It’s less that it’s embarrassing to wear a toupee or be let in on the secret of someone else’s toupee, and more that there is skin getting unhidden.",
  glue: "Knowing that this upper edge of his forehead should be touching glue but this agreement is failing and getting flaky and so now it is touching air. Embarrassed on behalf of the glue.",
  my_tiny_mouth: "Around their work, noisy, the nurse can’t stop talking about how tiny my mouth is. He exclaims to me every time he puts something new in my mouth that it’s the child-sized version, the pediatric object.",
  teacup: "Earnestly, he tells the doctor, It’s like looking into a teacup! when he has to switch his suction hose out for a smaller one. I think to myself that teacups are not that small. ",
  spit: "I laugh with my mouth stretched open and inadvertently gargle some spit-water. It romps upwards briefly, a small splash.",
  suction_hose: "What a teacup is, though, is something to be sipped out of. I swallow out of myself: the suction hose slurps with gusto. It takes into and through itself so much diluted spit, on and on without a breath. It’s not particular — it’s here to gobble-gulp and not to filter. We are two suckers connected by a pool of water and saliva.",
  doctor: "This is a chimeric relationship. As the doctor pushes the drill into me, she remains flesh. We wonder who’s in charge: here is the doctor, paid to perform an excision.",
  me: "Here I am. We’re all here because of the bacteria, collectively called decay, that I left on the grooves of my teeth for too long, and they took this opportunity to live and eat and keep living, so I asked for an appointment.",
  drill: "The doctor and the nurse are drilling, drilling with such direction and precision, because the cavity grows if left to its own devices.",
  tooth: "The cavity is a collective object. The cavity is bacterial relations. Its nest is its food. Its burrow, the bite out of my tooth, is a consequence of the way it eats.",
  food: "It’s my own food, my leftovers, that they make a new meal out of. The consequence is acid. Eventually they would reach the soft core of their chosen tooth, which is called the pulp cavity. At this point I would be touching myself, cavity to cavity.",
  hands: "There are four hands attending to my mouth to prevent this. They are all here, and I open wide.",
  odor: "In the process I am flying everywhere: the odor is coming from inside my mouth. The smell is so warm it becomes like something approaching a burn, but this is not the reason I close my nose to it. The reality is that the smell is my own body pulverized and shooting back at me through the insides of my nostrils, which is more repugnant than the odor itself.",
  plaque: "What I must remember is that the outer surface of my teeth is so many clinging bodies, a sticky layer of bacteria called plaque. That this is continuous with the wet skin of my gums.",
  cavity: "The cavity is digging into me, and it smells, too. The cavity realizes that I am uncontained. It takes something preexisting on my hard surfaces and makes them vulnerable. The inhabitants of the cavity are invaders even as we live together. We are living together, so together.",
  filling: "The dentist will affix resin and glass, or just resin, or metal, to the groove they will carve into the enamel. Decay can form underneath the filling, too. The grooves of the back teeth collect food. Tooth location is a risk factor.",
  decay: "Signs and symptoms of tooth decay include pain, spots on teeth, bad breath that is resistant to brushing and mouthwash, and sometimes there are no symptoms at all. The dentist has to take a very close look.",
  home: "On my way home I tongue the uninterrupted surface of my smooth tooth again and again in order to celebrate my victory."
};

// Function for second canvas
function sketch2(p) {
  let scaleFactor = 1;
    if (window.innerWidth < 500) {
      scaleFactor = 0.75;
    }

  p.setup = function () {
    p.createCanvas(window.innerWidth, window.innerHeight, canvas2);

    let vars = ['my_mouth', 'rubber', 'my_original_tongue', 'the_tools', 'enamel', 'nurse', 'toupee', 'glue', 'my_tiny_mouth', 'teacup', 'spit', 'suction_hose', 'doctor', 'me', 'drill', 'tooth', 'food', 'hands', 'odor', 'plaque', 'cavity', 'filling', 'decay', 'home'];

    for (let i = 0; i < vars.length; i++) {
      let displayName = vars[i].replace(/_/g, ' ');
      let element = p.createDiv(displayName);

      // Random position with scale factor
      let randomX = p.random(20 * scaleFactor, window.innerWidth - (183 * scaleFactor));  
      let randomY = p.random(25 * scaleFactor, window.innerHeight - (25* scaleFactor));

      element.position(randomX, randomY);
      let textWidthValue = p.textWidth(displayName);

      // Size based on text width and scale factor
      element.size(textWidthValue + (37* scaleFactor), 21 * scaleFactor);
      element.style('background', 'black');
      element.style('padding-left', `${10 * scaleFactor}px`);
      element.style('font-size', `${13 * scaleFactor}px`);
      element.style('-webkit-touch-callout', 'none');
      element.style('-webkit-user-select', 'none');
      element.style('-khtml-user-select', 'none');
      element.style('-moz-user-select', 'none');  
      element.style('-ms-user-select', 'none');
      element.style('user-select', 'none');
      element.style('white-space', 'nowrap');
      element.draggable();

      function createInfoBox(elementName, sourceElement) {
        if (infoBoxes[elementName]) {
          infoBoxes[elementName].remove();
          delete infoBoxes[elementName];
        }

        let infoBox = p.createDiv();
        let pos = sourceElement.position();

        infoBox.position(pos.x + sourceElement.width + 15 * scaleFactor, pos.y);

        infoBox.style('background', 'white');
        infoBox.style('border', '1px solid black');
        infoBox.style('padding', `${10 * scaleFactor}px`);
        infoBox.style('width', `${200 * scaleFactor}px`);
        infoBox.style('box-shadow', `${2 * scaleFactor}px ${2 * scaleFactor}px ${5 * scaleFactor}px rgba(0,0,0,0.2)`);
        infoBox.style('-webkit-touch-callout', 'none');
        infoBox.style('-webkit-user-select', 'none');
        infoBox.style('-khtml-user-select', 'none');
        infoBox.style('-moz-user-select', 'none');
        infoBox.style('-ms-user-select', 'none');
        infoBox.style('user-select', 'none');
        infoBox.style('font-size', `${13 * scaleFactor}px`);
        infoBox.draggable();

        let closeBtn = p.createButton('×');
        closeBtn.parent(infoBox);
        closeBtn.style('float', 'right');
        closeBtn.style('border', 'none');
        closeBtn.style('background', 'none');
        closeBtn.style('font-size', `${20 * scaleFactor}px`);
        closeBtn.style('cursor', 'pointer');
        closeBtn.style('color', 'black');
        closeBtn.style('margin', '0px');
        closeBtn.style('padding', '0px');
        closeBtn.style('line-height', '1');
        closeBtn.style('font-family', 'Arial');
        closeBtn.mousePressed(function () {
          infoBox.remove();
          delete infoBoxes[elementName];
        });

        let content = elementTexts[elementName];
        let contentDiv = p.createDiv(content);
        contentDiv.parent(infoBox);
        contentDiv.style('margin-top', `${20 * scaleFactor}px`);

        infoBoxes[elementName] = infoBox;
      }

      element.mouseClicked(function () {
        createInfoBox(vars[i], element);
        element.style('color', 'green');
      });

      element.elt.addEventListener('drag', function (event) {
        let infoBox = infoBoxes[vars[i]];
        if (infoBox) {
          let newPos = element.position();
          infoBox.position(newPos.x + element.width() + 25, newPos.y);
        }
      });

      elements[vars[i]] = element;
    }
  };

  p.draw = function () {
    p.clear();

    p.strokeWeight(1.5);

    for (let connection of connections) {
      let elem1 = elements[connection[0]];
      let elem2 = elements[connection[1]];

      let x1 = elem1.position().x + elem1.width / 2;
      let y1 = elem1.position().y + elem1.height / 2;
      let x2 = elem2.position().x + elem2.width / 2;
      let y2 = elem2.position().y + elem2.height / 2;

      // Calculate the distance and angle between the two points
      let distance = p.dist(x1, y1, x2, y2);
      let angle = p.atan2(y2 - y1, x2 - x1);

      // Set pixel size
      let pixelSize = 5 * scaleFactor;

      // Draw "pixelated" line using rectangles
      for (let i = 0; i < distance; i += pixelSize) {
        let px = x1 + p.cos(angle) * i;
        let py = y1 + p.sin(angle) * i;

        // Draw a small square
        p.noStroke();
        p.fill(0); // Set the color of the "pixels"
        p.rect(px, py, pixelSize, pixelSize / 2);
      }
    }
  }
}

  
// Run second p5 instance
function handleFirstClick() {
  // const div1 = document.getElementById("div1");
  const infoContainer = document.getElementById("info-container");
  
  // Hide the first canvas and display the second
  div1.style.display = "none";

  new p5(sketch2);
  infoContainer.style.display = "flex";

  // Remove the event listener to prevent subsequent clicks from being handled
  document.body.removeEventListener("click", handleFirstClick);
}

document.body.addEventListener("click", handleFirstClick);

const infoButton = document.getElementById('info-button');
const infoContent = document.getElementById('info-content');
const closeBtn = document.getElementById('close');

// When the user clicks the info button, toggle the display of the content
infoButton.addEventListener('click', function() {
    // Toggle the 'show' class to animate the reveal of content
    infoContent.classList.toggle('show');
});

closeBtn.addEventListener('click', function() {
  infoContent.classList.toggle('show');
});

window.onload = function() {
  // Get the initial window width
  const initialWidth = window.innerWidth;
  const initialHeight = window.innerHeight;
  
  // Set the width of the container to the initial window width
  div1.style.width = `${initialWidth}px`;
  div1.style.height = `${initialHeight}px`;

  caption.style.width = `${initialWidth}px`;
  caption.style.top = `${initialHeight*.7}px`;
};