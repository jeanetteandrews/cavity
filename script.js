let font;
let letterGroups = []; 
let svgGroups = [];   
let currentGroups = []; 
let targetGroups = [];
let isHovering = false;
const letters = "c^vIty".split("");
let noiseOffset = 0;

const svgPath = "M18.5 11C18.5 3 13.5858 7.35786 13 1.5C17.491 4.81946 20.9999 8 25 10C29 12 39.5 5.5 39.5 5.5C39.5 5.5 30.8066 13.5 33.8066 13C36.8066 12.5 40.8066 21.5 40.8066 21.5C39 18.0038 28.1863 14.791 27 17C23.6918 21.783 32.8362 25.4225 35.3066 30L33.8066 41.5C33.118 27.5 25.3665 24.3834 19.5 22.5C12.4184 27.4494 10.5 30 8.30656 41.5C3.49999 31 15.2645 27.2176 15.5 19.5L0.306641 22.5C0.306641 22.5 18.5 19 18.5 11Z";

fontlink = 'https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf';

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
      p.createCanvas(p.windowWidth, p.windowHeight, canvas1);
      let xOffset = p.windowWidth / 2 - font.textBounds(letters.join(""), 0, 0, 220).w / 2;
      let yOffset = p.windowHeight / 2 + 50; // Center vertically
  
      for (let letter of letters) {
        if (letter === " ") {
          xOffset += 40;
          continue;
        }
  
        let points = font.textToPoints(letter, xOffset, yOffset, 200, {
          sampleFactor: 0.5,
          simplifyThreshold: 0,
        });
  
        let letterWidth = font.textBounds(letter, xOffset, yOffset, 250).w;
        xOffset += letterWidth + 10;
  
        if (points.length > 0) {
          letterGroups.push(points);
  
          let svgPoints = parseSVGPath(svgPath, points.length);
  
          let scaleFactor = 8;
          let svgOffsetX = p.windowWidth / 2 - 180; // Center SVG horizontally
          let svgOffsetY = p.windowHeight / 2 - 230; // Position SVG above text
  
          let svgScaled = svgPoints.map((pt) => ({
            x: pt.x * scaleFactor + svgOffsetX,
            y: pt.y * scaleFactor + svgOffsetY,
          }));
  
          svgGroups.push(svgScaled);
  
          currentGroups.push(points.map((pt) => ({ x: pt.x, y: pt.y })));
          targetGroups.push(points.map((pt) => ({ x: pt.x, y: pt.y })));
        }
      }
    };
  
    p.draw = function () {
      p.clear();
  
      const bounds1 = p.windowWidth * 2/8;
      const bounds2 = p.windowWidth * 6/8;
      const bounds3 = p.windowHeight * 3/8;
      const bounds4 = p.windowHeight * 5/8;
  
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

let toupee, glue, teacup, water, spit, drill, mouth, tongue, tooth, resin, drone, rubber, mirror, food, me, dentist, nurse, cavity, odor, enamel, home, hands, plaque, doctor, suction;
let elements = {};
let infoBoxes = {}; 

let connections = [
  ['mouth', 'me'],
  ['mouth', 'tooth'],
  ['tooth', 'cavity'],
  ['drill', 'cavity'],
  ['tongue', 'mouth'],
  ['nurse', 'glue'],
  ['glue', 'toupee'],
  ['hands', 'suction'],
  ['suction', 'teacup'],
  ['suction', 'mouth'],
  ['suction', 'water'],
  ['mouth', 'spit'],
  ['teacup', 'water'],
  ['cavity', 'food'],
  ['dentist', 'resin'],
  ['resin', 'cavity'],
  ['rubber', 'mouth'],
  ['hands', 'mirror'],
  ['mirror', 'mouth'],
  ['odor', 'cavity'],
  ['enamel', 'tooth'],
  ['home', 'me'],
  ['plaque', 'tooth'],
  ['hands', 'dentist'],
  ['hands', 'nurse'],
  ['doctor', 'hands'],
  ['hands', 'drill'],
  ['me', 'water'],
  ['me', 'spit'],
  ['spit', 'suction'],
  ['drone', 'drill'],
  ['mouth', 'drone']
];

let elementTexts = {
  mouth: "My mouth is open and noise is coming out of it: I am a creature: and the drill against my tooth is my voice. Before this, both halves of the soundmaking were mine: fleshy parts of myself slap-clacking together.",
  tooth: "The cavity is a collective object. The cavity is bacterial relations. Its nest is its food. Its burrow, the bite out of my tooth, is a consequence of the way it eats.",
  enamel: "Around this movement, noisy, the doctor is trying her very best to squeeze every last bit of my cavity out of that enamel.",
  drone: "Now that the drill bit is continuous with my tooth, hard against hard, I speak in a long drone, pitch determined by angle.",
  cavity: "The cavity is digging into me, and it smells, too. The cavity realizes that I am uncontained. It takes something preexisting on my hard surfaces and makes them vulnerable. The inhabitants of the cavity are invaders even as we live together. We are living together, so together.",
  tongue: "My original tongue is irrelevant now — really, it’s mostly an inconvenience: when I swallow, which I can’t help but do, it pushes and pulses, and this disrupts the tools.",
  toupee: "The nurse is leaning so close I can see his toupee. I think it’s peeling a little at the edges. On his behalf and on my own I get a little embarrassed, but he doesn’t know that I see it, or the possibility of it. It’s less that it’s embarrassing to wear a toupee or be let in on the secret of someone else’s toupee, and more that there is skin getting unhidden.",
  glue: "Knowing that this upper edge of his forehead should be touching glue but this agreement is failing and getting flaky and so now it is touching air. Embarrassed on behalf of the glue.",
  spit: "I laugh with my mouth stretched open and inadvertently gargle some spit-water. It romps upwards briefly, a small splash.",
  teacup: "Earnestly, he tells the doctor, It’s like looking into a teacup! when he has to switch his suction hose out for a smaller one. I think to myself that teacups are not that small. ",
  nurse: "Around their work, noisy, the nurse can’t stop talking about how tiny my mouth is. He exclaims to me every time he puts something new in my mouth that it’s the child-sized version, the pediatric object.",
  water: "We are two suckers connected by a pool of water and saliva.",
  suction: "What a teacup is, though, is something to be sipped out of. I swallow out of myself: the suction hose slurps with gusto. It takes into and through itself so much diluted spit, on and on without a breath. It’s not particular — it’s here to gobble-gulp and not to filter.",
  doctor: "This is a chimeric relationship. As the doctor pushes the drill into me, she remains flesh. We wonder who’s in charge: here is the doctor, paid to perform an excision.",
  food: "It’s my own food, my leftovers, that they make a new meal out of. The consequence is acid. Eventually they would reach the soft core of their chosen tooth, which is called the pulp cavity. At this point I would be touching myself, cavity to cavity.",
  resin: "The dentist will affix resin and glass, or just resin, or metal, to the groove they will carve into the enamel. Decay can form underneath the filling, too. The grooves of the back teeth collect food. Tooth location is a risk factor.",
  rubber: "The mechanism that opens my mouth becomes rubber, not muscle.",
  mirror: "The drill and mirror and suction hose have to shudder and resettle.",
  me: "Here I am. We’re all here because of the bacteria, collectively called decay, that I left on the grooves of my teeth for too long, and they took this opportunity to live and eat and keep living, so I asked for an appointment.",
  dentist: "Signs and symptoms of tooth decay include pain, spots on teeth, bad breath that is resistant to brushing and mouthwash, and sometimes there are no symptoms at all. The dentist has to take a very close look.",
  hands: "There are four hands attending to my mouth to prevent this. They are all here, and I open wide.",
  odor: "In the process I am flying everywhere: the odor is coming from inside my mouth. The smell is so warm it becomes like something approaching a burn, but this is not the reason I close my nose to it. The reality is that the smell is my own body pulverized and shooting back at me through the insides of my nostrils, which is more repugnant than the odor itself.",
  plaque: "What I must remember is that the outer surface of my teeth is so many clinging bodies, a sticky layer of bacteria called plaque. That this is continuous with the wet skin of my gums.",
  home: "On my way home I tongue the uninterrupted surface of my smooth tooth again and again in order to celebrate my victory.",
  drill: "The doctor and the nurse are drilling, drilling with such direction and precision, because the cavity grows if left to its own devices."
};
  
let description1 = "I went to the dentist and got grossed out & got gross stuff taken out of me."
let description2 = "I went to the dentist and thought: the thing that’s gross about a cavity is that it eats you, and that it smells. Cavities make our hard surfaces vulnerable. Cavities remind us that our mouths are always full — we imagine those bacteria as invaders, but they’re always there. It’s disgusting to mix bodies like this, smush them together; it’s disgusting to notice that that’s already happening. The fact of it is disgusting; the noticing is disgusting; I become disgusting in noticing it."
let description3 = "One heart of disgust is the fear that we are not ourselves, or that we are not contained in the ways we think we are. At the dentist we arrive at this heart."
let description4 = "essay by Ahana Ganguly"
let description5 = "code by Jeanette Andrews"

  // Function for second canvas
  function sketch2(p) {
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight, canvas2);
        let description = p.createDiv();
        description.position(30, 50);
        description.style('background', 'white');
        description.style('border', '1px solid black');
        description.style('padding', '20px');
        description.style('width', '300px');
        // infoBox.style('font-size', '11px');
        description.style('box-shadow', '2px 2px 5px rgba(0,0,0,0.2)');
        let p1 = p.createDiv(description1);
        let p2 = p.createDiv(description2);
        let p3 = p.createDiv(description3);
        let p4 = p.createDiv(description4);
        let p5 = p.createDiv(description5);
        p1.parent(description);
        p2.parent(description);
        p3.parent(description);
        p4.parent(description);
        p5.parent(description);
        p2.style('padding-top', '20px');
        p3.style('padding-top', '20px');
        p4.style('padding-top', '40px');
        p4.style('font-size', '0.8em')
        p5.style('font-size', '0.8em')

        let vars = ['toupee', 'glue', 'teacup', 'water', 'spit', 'drill', 'mouth', 'tongue', 
                    'tooth', 'resin', 'drone', 'rubber', 'mirror', 'food', 'me', 'dentist', 
                    'nurse', 'cavity', 'odor', 'enamel', 'home', 'hands', 'plaque', 'doctor', 'suction'];
                    
        for (let i = 0; i < vars.length; i++) {
            let element = p.createDiv(vars[i]);
            
            let padding = 100;
            let randomX = p.random(padding + 280, p.windowWidth - padding);
            let randomY = p.random(padding, p.windowHeight - padding);
            
            element.position(randomX, randomY);
            element.size(60, 20);
            // element.style('font-size', '11px')
            element.style('background', 'black');
            element.style('padding-left', '20px');
            element.style('cursor', 'move');
            element.style('user-select', 'none');
            element.draggable();

            function createInfoBox(elementName, sourceElement) {
                if (infoBoxes[elementName]) {
                  infoBoxes[elementName].remove();
                  delete infoBoxes[elementName];
                }
                
                let infoBox = p.createDiv();
                let pos = sourceElement.position();
                
                infoBox.position(pos.x + sourceElement.width + 25, pos.y);
                
                infoBox.style('background', 'white');
                infoBox.style('border', '1px solid black');
                infoBox.style('padding', '10px');
                infoBox.style('width', '200px');
                // infoBox.style('font-size', '11px');
                infoBox.style('box-shadow', '2px 2px 5px rgba(0,0,0,0.2)');
              
                let closeBtn = p.createButton('×');
                closeBtn.parent(infoBox);
                closeBtn.style('float', 'right');
                closeBtn.style('border', 'none');
                closeBtn.style('background', 'none');
                closeBtn.style('font-size', '20px');
                closeBtn.style('cursor', 'pointer');
                closeBtn.mousePressed(function() {
                  infoBox.remove();
                  delete infoBoxes[elementName];
                });
                
                let content = elementTexts[elementName];
                let contentDiv = p.createDiv(content);
                contentDiv.parent(infoBox);
                contentDiv.style('margin-top', '20px');
                
                infoBoxes[elementName] = infoBox;
              }
          
            element.mouseClicked(function() {
              createInfoBox(vars[i], element);
              element.style('color', 'green')
            //   element.style('background', 'repeating-radial-gradient(circle at 51% 0%, #dd15e0 0%, #91ba45 93%, #090979 100%');
            //   element.style('box-shadow', 'inset 29px 26px 44px -42px #2d54f0');
            //   element.style('clip-path', 'polygon(100% 43%, 91% 79%, 93% 97%, 0% 100%, 17% 67%, 0% 9%, 23% 0%, 44% 6%, 78% 0%, 100% 14%, 92% 21%)');
            });
            
            element.elt.addEventListener('drag', function(event) {
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
            let pixelSize = 5; // Adjust for finer or coarser pixelation
        
            // Draw "pixelated" line using rectangles
            for (let i = 0; i < distance; i += pixelSize) {
                let px = x1 + p.cos(angle) * i;
                let py = y1 + p.sin(angle) * i;
        
                // Draw a small square or dot
                p.noStroke();
                p.fill(0); // Set the color of the "pixels"
                p.rect(px, py, pixelSize, pixelSize/2);
            }
        }
    }
  }
  
  // Run second p5 instance
  function handleFirstClick() {
    const div1 = document.getElementById("div1");
    
    // Hide the first canvas and display the second
    div1.style.display = "none";
    new p5(sketch2);
  
    // Remove the event listener to prevent subsequent clicks from being handled
    document.body.removeEventListener("click", handleFirstClick);
  }

  document.body.addEventListener("click", handleFirstClick);