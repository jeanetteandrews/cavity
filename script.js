let toupee, glue, teacup, water, spit, drill, mouth, tongue, tooth, glass, drone, rubber, mirror, food, me, dentist, nurse, cavity, odor, enamel, home, hands, plaque, doctor, suction;
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
  ['dentist', 'glass'],
  ['glass', 'cavity'],
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

// Sample texts for each element
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
  glass: "The dentist will affix resin and glass, or just resin, or metal, to the groove they will carve into the enamel. Decay can form underneath the filling, too. The grooves of the back teeth collect food. Tooth location is a risk factor.",
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

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  let vars = ['toupee', 'glue', 'teacup', 'water', 'spit', 'drill', 'mouth', 'tongue', 
              'tooth', 'glass', 'drone', 'rubber', 'mirror', 'food', 'me', 'dentist', 
              'nurse', 'cavity', 'odor', 'enamel', 'home', 'hands', 'plaque', 'doctor', 'suction'];
              
  for (let i = 0; i < vars.length; i++) {
    let element = createDiv(vars[i]);
    let padding = 100;
    let randomX = random(padding, windowWidth - padding);
    let randomY = random(padding, windowHeight - padding);
    
    element.position(randomX, randomY);
    element.size(80, 20);
    element.style('background', 'orchid');
    element.style('padding', '5px');
    element.style('cursor', 'move');
    element.style('user-select', 'none');
    element.draggable();
    
    // Add click handler
    element.mouseClicked(function() {
      createInfoBox(vars[i], element);
    });
    
    elements[vars[i]] = element;
  }
}

function createInfoBox(elementName, sourceElement) {
  // Remove existing info box for this element if it exists
  if (infoBoxes[elementName]) {
    infoBoxes[elementName].remove();
    delete infoBoxes[elementName];
    return;
  }
  
  // Create info box
  let infoBox = createDiv();
  let pos = sourceElement.position();
  
  // Position info box to the right of the element
  infoBox.position(pos.x + sourceElement.width + 10, pos.y);
  
  // Style the info box
  infoBox.style('background', 'white');
  infoBox.style('border', '1px solid black');
  infoBox.style('padding', '10px');
  infoBox.style('width', '200px');
  infoBox.style('box-shadow', '2px 2px 5px rgba(0,0,0,0.2)');
  
  // Add close button
  let closeBtn = createButton('×');
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
  
  // Add content
  let content = elementTexts[elementName];
  let contentDiv = createDiv(content);
  contentDiv.parent(infoBox);
  contentDiv.style('margin-top', '20px');
  
  // Store reference to info box
  infoBoxes[elementName] = infoBox;
}

function draw() {
  clear();
  
  stroke(100);
  strokeWeight(2);
  
  for (let connection of connections) {
    let elem1 = elements[connection[0]];
    let elem2 = elements[connection[1]];
    
    let x1 = elem1.position().x + elem1.width / 2;
    let y1 = elem1.position().y + elem1.height / 2;
    let x2 = elem2.position().x + elem2.width / 2;
    let y2 = elem2.position().y + elem2.height / 2;
    
    line(x1, y1, x2, y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}