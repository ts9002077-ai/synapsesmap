import { useState } from 'react'
import { ReactFlow, Background, Controls } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const baseNodes = [
  { id: '1', position: { x: 300, y: 200 }, data: { label: 'Photosynthesis' } },
  { id: '2', position: { x: 50, y: 50 }, data: { label: 'Sunlight' } },
  { id: '3', position: { x: 50, y: 350 }, data: { label: 'Water' } },
  { id: '4', position: { x: 300, y: 0 }, data: { label: 'Chlorophyll' } },
  { id: '5', position: { x: 550, y: 100 }, data: { label: 'Glucose' } },
  { id: '6', position: { x: 550, y: 330 }, data: { label: 'Oxygen' } },
]

const baseEdges = [
  { id: 'e2-1', source: '2', target: '1' },
  { id: 'e3-1', source: '3', target: '1' },
  { id: 'e4-1', source: '4', target: '1' },
  { id: 'e1-5', source: '1', target: '5' },
  { id: 'e1-6', source: '1', target: '6' },
]

const notes = {
  '1': 'The process plants use to turn light, water and carbon dioxide into food.',
  '2': 'Provides the light energy that powers photosynthesis.',
  '3': 'Absorbed by the roots. Split during photosynthesis to release oxygen.',
  '4': 'The green pigment in chloroplasts that absorbs sunlight.',
  '5': 'The sugar the plant makes and uses as energy.',
  '6': 'Released into the air as a by-product.',
}

const questions = [
  {
    nodeId: '4',
    question: 'What does chlorophyll do?',
    options: ['Absorbs sunlight', 'Absorbs water', 'Stores sugar', 'Releases oxygen'],
    answer: 0,
  },
  {
    nodeId: '6',
    question: 'Which gas is released during photosynthesis?',
    options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'],
    answer: 2,
  },
  {
    nodeId: '5',
    question: 'What sugar does the plant make?',
    options: ['Glucose', 'Starch only', 'Protein', 'Salt'],
    answer: 0,
  },
]

function App() {
  const [mode, setMode] = useState('notes')
  const [selected, setSelected] = useState(null)
  const [qIndex, setQIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [lit, setLit] = useState([])

  const q = questions[qIndex]
  const linkedNode = baseNodes.find((n) => n.id === q.nodeId)

  const nodes = baseNodes.map((n) =>
    lit.includes(n.id)
      ? { ...n, style: { border: '2px solid #facc15', boxShadow: '0 0 18px #facc15' } }
      : n
  )

  const edges = baseEdges.map((e) =>
    lit.includes(e.source) || lit.includes(e.target)
      ? {
          ...e,
          animated: true,
          style: { stroke: '#facc15', strokeWidth: 3, filter: 'drop-shadow(0 0 6px #facc15)' },
        }
      : e
  )

  function choose(i) {
    if (picked !== null) return
    setPicked(i)
    if (i === q.answer && !lit.includes(q.nodeId)) {
      setLit([...lit, q.nodeId])
    }
  }

  function nextQuestion() {
    setPicked(null)
    setQIndex((qIndex + 1) % questions.length)
  }

  const btn = (active) => ({
    flex: 1,
    padding: 10,
    border: 'none',
    cursor: 'pointer',
    background: active ? '#3b3b6b' : '#1a1a2e',
    color: 'white',
  })

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          colorMode="dark"
          fitView
          onNodeClick={(event, node) => setSelected(node)}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      <div style={{ width: 320, background: '#0b0b14', color: 'white', overflowY: 'auto' }}>
        <div style={{ display: 'flex' }}>
          <button style={btn(mode === 'notes')} onClick={() => setMode('notes')}>Notes</button>
          <button style={btn(mode === 'quiz')} onClick={() => setMode('quiz')}>Quiz</button>
        </div>

        <div style={{ padding: 24 }}>
          {mode === 'notes' && (
            selected ? (
              <>
                <h2>{selected.data.label}</h2>
                <p>{notes[selected.id]}</p>
              </>
            ) : (
              <p>Click a node to see its notes.</p>
            )
          )}

          {mode === 'quiz' && (
            <>
              <p style={{ opacity: 0.6 }}>
                Question {qIndex + 1} of {questions.length} · linked to: {linkedNode.data.label}
              </p>
              <p style={{ color: '#facc15' }}>
                Connections lit: {lit.length} / {questions.length}
              </p>
              <h3>{q.question}</h3>

              {q.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: 12,
                    marginBottom: 8,
                    borderRadius: 6,
                    border: '1px solid #3b3b6b',
                    cursor: 'pointer',
                    color: 'white',
                    background:
                      picked === null
                        ? '#1a1a2e'
                        : i === q.answer
                        ? '#14532d'
                        : i === picked
                        ? '#7f1d1d'
                        : '#1a1a2e',
                  }}
                >
                  {option}
                </button>
              ))}

              {picked !== null && (
                <>
                  <p>{picked === q.answer ? 'Correct! Connection lit up.' : 'Not quite.'}</p>
                  <button onClick={nextQuestion} style={btn(true)}>Next question</button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App