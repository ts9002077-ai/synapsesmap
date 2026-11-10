import * as photo from './data'
import * as sejarah from './sejarah'
import * as sejarahQuiz from './sejarahQuiz'

export const topics = [
  {
    id: 'photo',
    name: 'Photosynthesis',
    sample: 'Photosynthesis_notes.pdf',
    lang: 'en',
    nodes: photo.nodes,
    edges: photo.edges,
    summary: photo.summary,
    notes: photo.notes,
    mcq: photo.mcq,
    written: photo.written,
    diagram: { type: 'image', src: '/diagrams/photosynthesis.png' },
  },
  {
    id: 'sejarah',
    name: 'Sejarah: Jalan ke Kemerdekaan',
    sample: 'Sejarah_Kemerdekaan_Tanah_Melayu.pdf',
    lang: 'ms',
    nodes: sejarah.nodes,
    edges: sejarah.edges,
    summary: sejarah.summary,
    notes: sejarah.notes,
    mcq: sejarahQuiz.mcq,
    written: sejarahQuiz.written,
    diagram: { type: 'people', people: sejarah.people, timeline: sejarah.timeline },
  },
]