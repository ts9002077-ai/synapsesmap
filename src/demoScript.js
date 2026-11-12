const text = {
  en: {
    intro: 'SynapseMap Ai turns study notes into a living brain map.',
    notes: 'Every concept is a node with its own short notes.',
    diagram: 'Each topic comes with its own diagram.',
    quiz: 'Questions are linked to the map. Answer correctly and a connection lights up.',
    light: 'Watch the network light up as each concept is mastered.',
    done: 'Network complete! Every concept is connected.',
  },
  ms: {
    intro: 'SynapseMap Ai menukar nota pelajaran kepada peta otak yang hidup.',
    notes: 'Setiap konsep ialah satu nod dengan nota ringkasnya sendiri.',
    diagram: 'Setiap topik disertakan gambar rajah.',
    quiz: 'Soalan dikaitkan dengan peta. Jawab dengan betul dan satu sambungan menyala.',
    light: 'Lihat rangkaian menyala apabila setiap konsep dikuasai.',
    done: 'Rangkaian lengkap! Semua konsep telah disambungkan.',
  },
}

export function buildScript(topic, isMobile) {
  const L = text[topic.lang] || text.en
  const first = topic.nodes[0]
  const go = (tab) => (isMobile ? undefined : tab)

  return [
    { caption: L.intro, tab: isMobile ? 'map' : 'notes', select: null, reset: true, wait: 3200 },
    { caption: L.notes, tab: go('notes'), select: first, wait: 3800 },
    { caption: L.diagram, tab: go('diagram'), wait: 3200 },
    { caption: L.quiz, tab: go('quiz'), wait: 3800 },
    { caption: L.light, tab: isMobile ? 'map' : undefined, wait: 1800 },
    ...topic.nodes.map((n) => ({ light: n.id, wait: 1150 })),
    { caption: L.done, wait: 4500 },
  ]
}