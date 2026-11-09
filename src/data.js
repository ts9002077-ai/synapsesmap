export const nodes = [
  { id: '1', position: { x: 315, y: 0 }, data: { label: 'Photosynthesis', size: 'large' } },
  { id: '11', position: { x: 640, y: 0 }, data: { label: 'Stomata' } },
  { id: '2', position: { x: -20, y: 130 }, data: { label: 'Sunlight' } },
  { id: '3', position: { x: 150, y: 130 }, data: { label: 'Water' } },
  { id: '8', position: { x: 340, y: 130 }, data: { label: 'Chloroplast', size: 'medium' } },
  { id: '7', position: { x: 560, y: 130 }, data: { label: 'Carbon Dioxide' } },
  { id: '9', position: { x: 90, y: 260 }, data: { label: 'Light Reactions', size: 'medium' } },
  { id: '10', position: { x: 420, y: 260 }, data: { label: 'Calvin Cycle', size: 'medium' } },
  { id: '4', position: { x: 720, y: 260 }, data: { label: 'Chlorophyll' } },
  { id: '6', position: { x: 100, y: 390 }, data: { label: 'Oxygen' } },
  { id: '5', position: { x: 430, y: 390 }, data: { label: 'Glucose' } },
]

export const edges = [
  { id: 'e1-8', source: '1', target: '8' },
  { id: 'e8-4', source: '8', target: '4' },
  { id: 'e8-9', source: '8', target: '9' },
  { id: 'e8-10', source: '8', target: '10' },
  { id: 'e2-9', source: '2', target: '9' },
  { id: 'e3-9', source: '3', target: '9' },
  { id: 'e9-6', source: '9', target: '6' },
  { id: 'e11-7', source: '11', target: '7' },
  { id: 'e7-10', source: '7', target: '10' },
  { id: 'e10-5', source: '10', target: '5' },
]

export const summary = [
  'Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
  'It happens in the chloroplasts of green plant cells.',
  'Two stages: the light reactions (thylakoid membranes) and the Calvin cycle (stroma).',
  'Inputs: carbon dioxide, water and light. Outputs: glucose and oxygen.',
  'Chlorophyll absorbs mostly red and blue light and reflects green.',
  'Rate depends on light intensity, CO₂ concentration and temperature. The factor in shortest supply is the limiting factor.',
]

export const notes = {
  '1': 'The process plants, algae and some bacteria use to turn light energy, carbon dioxide and water into glucose, releasing oxygen.',
  '2': 'The energy source. Chlorophyll absorbs the light, mainly red and blue wavelengths.',
  '3': 'Absorbed by the roots and carried up the xylem to the leaves. Split in the light reactions, which releases oxygen.',
  '4': 'Green pigment in the thylakoid membranes. Absorbs red and blue light and reflects green.',
  '5': 'The sugar made in the Calvin cycle. Used for respiration, stored as starch, or built into cellulose for cell walls.',
  '6': 'A by-product. Released when water is split in the light reactions, and leaves through the stomata.',
  '7': 'Enters the leaf through the stomata and is fixed into sugar in the Calvin cycle.',
  '8': 'The organelle where photosynthesis happens. Thylakoids are stacked in grana, surrounded by the fluid stroma.',
  '9': 'Happens in the thylakoid membranes and needs light. Splits water, releases oxygen and makes ATP and NADPH.',
  '10': 'Happens in the stroma. Uses ATP and NADPH from the light reactions to turn CO₂ into glucose.',
  '11': 'Tiny pores, mostly on the underside of the leaf, opened and closed by guard cells. Let CO₂ in and O₂ and water vapour out.',
}

export const mcq = [
  // ---------- EASY ----------
  {
    nodeId: '4', level: 'easy',
    question: 'What colour of light does chlorophyll reflect most?',
    options: ['Red', 'Green', 'Blue', 'Purple'],
    answer: 1,
  },
  {
    nodeId: '6', level: 'easy',
    question: 'Which gas is released during photosynthesis?',
    options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'],
    answer: 2,
  },
  {
    nodeId: '5', level: 'easy',
    question: 'What sugar does photosynthesis produce?',
    options: ['Glucose', 'Lactose', 'Salt', 'Protein'],
    answer: 0,
  },
  {
    nodeId: '7', level: 'easy',
    question: 'Which gas do plants take in for photosynthesis?',
    options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Methane'],
    answer: 1,
  },
  {
    nodeId: '8', level: 'easy',
    question: 'Where in the cell does photosynthesis take place?',
    options: ['Nucleus', 'Mitochondria', 'Chloroplast', 'Ribosome'],
    answer: 2,
  },
  {
    nodeId: '11', level: 'easy',
    question: 'What are the tiny pores on the underside of a leaf called?',
    options: ['Xylem cells', 'Root hairs', 'Veins', 'Stomata'],
    answer: 3,
  },
  {
    nodeId: '2', level: 'easy',
    question: 'What is the energy source for photosynthesis?',
    options: ['Heat from the soil', 'Sunlight', 'Wind', 'Water'],
    answer: 1,
  },
  {
    nodeId: '3', level: 'easy',
    question: 'How does most of the water enter a plant?',
    options: ['Through the stomata', 'Through the flowers', 'Through the bark', 'Through the roots'],
    answer: 3,
  },

  // ---------- MEDIUM ----------
  {
    nodeId: '1', level: 'medium',
    question: 'Which word equation summarises photosynthesis (with light energy)?',
    options: [
      'Carbon dioxide + water → glucose + oxygen',
      'Glucose + oxygen → carbon dioxide + water',
      'Carbon dioxide + oxygen → glucose + water',
      'Water + glucose → carbon dioxide + oxygen',
    ],
    answer: 0,
  },
  {
    nodeId: '9', level: 'medium',
    question: 'Where do the light reactions take place?',
    options: ['Stroma', 'Cell wall', 'Cytoplasm', 'Thylakoid membranes'],
    answer: 3,
  },
  {
    nodeId: '10', level: 'medium',
    question: 'Where does the Calvin cycle take place?',
    options: ['Thylakoid membranes', 'Cell membrane', 'Nucleus', 'Stroma'],
    answer: 3,
  },
  {
    nodeId: '9', level: 'medium',
    question: 'Which two products of the light reactions power the Calvin cycle?',
    options: ['Glucose and oxygen', 'CO₂ and water', 'ATP and NADPH', 'DNA and RNA'],
    answer: 2,
  },
  {
    nodeId: '1', level: 'medium',
    question: 'Which of these does NOT affect the rate of photosynthesis?',
    options: ['Light intensity', 'Carbon dioxide concentration', 'Temperature', 'Soil colour'],
    answer: 3,
  },
  {
    nodeId: '4', level: 'medium',
    question: 'Chlorophyll is found in which part of the chloroplast?',
    options: ['Thylakoid membranes', 'Outer cell wall', 'Vacuole', 'Nucleus'],
    answer: 0,
  },
  {
    nodeId: '11', level: 'medium',
    question: 'Which cells control the opening and closing of the stomata?',
    options: ['Root hairs', 'Palisade cells', 'Guard cells', 'Phloem cells'],
    answer: 2,
  },
  {
    nodeId: '5', level: 'medium',
    question: 'How do plants store excess glucose?',
    options: ['As oxygen', 'As starch', 'As chlorophyll', 'As carbon dioxide'],
    answer: 1,
  },

  // ---------- HARD ----------
  {
    nodeId: '6', level: 'hard',
    question: 'In the light reactions, the oxygen that is released comes from which molecule?',
    options: ['Carbon dioxide', 'Glucose', 'Water', 'ATP'],
    answer: 2,
  },
  {
    nodeId: '7', level: 'hard',
    question: 'What is the process of turning CO₂ into organic molecules in the Calvin cycle called?',
    options: ['Transpiration', 'Carbon fixation', 'Glycolysis', 'Fermentation'],
    answer: 1,
  },
  {
    nodeId: '1', level: 'hard',
    question: 'A plant’s rate of photosynthesis stops rising even though light intensity keeps increasing. What is the most likely reason?',
    options: [
      'The chlorophyll has changed colour',
      'The plant has run out of oxygen',
      'The leaf has too many stomata',
      'Another factor, such as CO₂ concentration, is now limiting',
    ],
    answer: 3,
  },
  {
    nodeId: '8', level: 'hard',
    question: 'What are the stacks of thylakoids inside a chloroplast called?',
    options: ['Cristae', 'Stroma', 'Grana', 'Cisternae'],
    answer: 2,
  },
]

// keywords: each inner list is one key point. Any word in the list counts.
// need: how many key points the answer must contain to pass.
export const written = [
  {
    nodeId: '1', level: 'easy',
    question: 'Write the word equation for photosynthesis.',
    keywords: [
      ['carbon dioxide', 'co2', 'co₂'],
      ['water', 'h2o'],
      ['glucose', 'sugar'],
      ['oxygen', 'o2', 'o₂'],
    ],
    need: 4,
    modelAnswer: 'Carbon dioxide + water → glucose + oxygen, using light energy absorbed by chlorophyll.',
  },
  {
    nodeId: '4', level: 'medium',
    question: 'Explain the role of chlorophyll in photosynthesis.',
    keywords: [
      ['absorb'],
      ['light', 'sunlight'],
      ['energy'],
      ['chloroplast', 'thylakoid', 'pigment'],
    ],
    need: 3,
    modelAnswer: 'Chlorophyll is the green pigment in the thylakoid membranes of chloroplasts. It absorbs light energy, mainly red and blue, and passes that energy to the light reactions.',
  },
  {
    nodeId: '7', level: 'medium',
    question: 'Describe how carbon dioxide gets into a leaf and what happens to it.',
    keywords: [
      ['stomata', 'stoma'],
      ['diffus'],
      ['guard cell'],
      ['calvin', 'fix', 'glucose', 'sugar'],
    ],
    need: 3,
    modelAnswer: 'CO₂ diffuses into the leaf through the stomata, which are opened by guard cells. In the Calvin cycle the CO₂ is fixed into glucose.',
  },
  {
    nodeId: '9', level: 'hard',
    question: 'Explain the difference between the light reactions and the Calvin cycle.',
    keywords: [
      ['thylakoid', 'grana'],
      ['stroma'],
      ['atp'],
      ['nadph'],
      ['water', 'split'],
      ['carbon dioxide', 'co2', 'co₂', 'glucose', 'sugar'],
    ],
    need: 4,
    modelAnswer: 'The light reactions happen in the thylakoid membranes. They need light, split water to release oxygen, and make ATP and NADPH. The Calvin cycle happens in the stroma and uses that ATP and NADPH to turn CO₂ into glucose.',
  },
  {
    nodeId: '1', level: 'hard',
    question: 'What is a limiting factor? Give an example from photosynthesis.',
    keywords: [
      ['limit'],
      ['shortest supply', 'short supply', 'lowest', 'not enough', 'too low', 'restrict', 'slowest'],
      ['light'],
      ['carbon dioxide', 'co2', 'co₂', 'temperature'],
    ],
    need: 3,
    modelAnswer: 'A limiting factor is the factor in shortest supply, which stops the rate from increasing. On a dim day light limits photosynthesis. Once there is plenty of light, CO₂ concentration or temperature may become the limiting factor.',
  },
]