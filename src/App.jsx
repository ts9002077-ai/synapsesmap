import { useState } from 'react'
import { ReactFlow, Background, Controls } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import SynapseNode from './SynapseNode'
import { theme } from './theme'
import './effects.css'
import ScoreBoard from './ScoreBoard'
import {
  nodes as baseNodes,
  edges as baseEdges,
  notes,
  summary,
  mcq,
  written,
} from './data'

const levelColor = { easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444' }
const nodeTypes = { synapse: SynapseNode }

function Diagram() {
  return (
    <>
      <svg viewBox="0 0 320 280" style={{ width: '100%', background: '#10101c', borderRadius: 8 }}>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="#facc15" />
          </marker>
        </defs>

        <circle cx="45" cy="45" r="22" fill="#facc15" />
        <text x="45" y="85" fill="white" fontSize="11" textAnchor="middle">Sunlight</text>
        <line x1="65" y1="62" x2="120" y2="112" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow)" />

        <path
          d="M120 160 Q 160 80 260 100 Q 250 200 140 205 Q 125 185 120 160 Z"
          fill="#166534" stroke="#4ade80" strokeWidth="2"
        />
        <text x="190" y="148" fill="white" fontSize="12" textAnchor="middle">Leaf</text>
        <text x="190" y="164" fill="white" fontSize="10" textAnchor="middle">(chloroplasts)</text>

        <line x1="300" y1="62" x2="258" y2="105" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="305" y="50" fill="white" fontSize="11" textAnchor="end">CO₂ in</text>

        <line x1="40" y1="235" x2="130" y2="198" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="15" y="255" fill="white" fontSize="11">Water (from roots)</text>

        <line x1="235" y1="198" x2="285" y2="238" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="310" y="256" fill="white" fontSize="11" textAnchor="end">O₂ out</text>

        <line x1="180" y1="206" x2="180" y2="236" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="180" y="254" fill="white" fontSize="11" textAnchor="middle">Glucose</text>
      </svg>

      <p style={{ marginTop: 16 }}><b>6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂</b></p>
      <p style={{ opacity: 0.7, fontSize: 13 }}>
        Tip: later you can replace this with your own drawing. Put the image in the
        public folder and show it with an img tag.
      </p>
    </>
  )
}

function DiagramImage() {
  const [failed, setFailed] = useState(false)

  if (failed) return <Diagram />

  return (
    <>
      <a href="/diagrams/photosynthesis.png" target="_blank" rel="noreferrer">
        <img
          src="/diagrams/photosynthesis.png"
          alt="Photosynthesis diagram"
          onError={() => setFailed(true)}
          style={{ width: '100%', borderRadius: 8, background: '#10101c' }}
        />
      </a>
      <p style={{ opacity: 0.7, fontSize: 13 }}>Click the image to open it full size.</p>
    </>
  )
}

function App() {
  const [tab, setTab] = useState('notes')
  const [selected, setSelected] = useState(null)
  const [quizType, setQuizType] = useState('mcq')
  const [level, setLevel] = useState('all')
  const [qIndex, setQIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [lit, setLit] = useState([])
    const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [done, setDone] = useState([])
  const [toast, setToast] = useState(null)

  const all = quizType === 'mcq' ? mcq : written
  const pool = all.filter((item) => level === 'all' || item.level === level)
  const q = pool[qIndex]
  const linkedNode = baseNodes.find((n) => n.id === q.nodeId)

    const nodes = baseNodes.map((n) => ({
    ...n,
    type: 'synapse',
    data: { ...n.data, lit: lit.includes(n.id) },
  }))

  const edges = baseEdges.map((e) => {
    const on = lit.includes(e.source) || lit.includes(e.target)
    return {
      ...e,
      animated: on,
      style: on
        ? { stroke: theme.glow, strokeWidth: 3, filter: `drop-shadow(0 0 6px ${theme.glow})` }
        : { stroke: theme.accent, strokeWidth: 2, opacity: 0.6 },
    }
  }) 
  
  function resetQuestion() {
    setPicked(null)
    setText('')
    setResult(null)
  }

  function changeType(t) {
    setQuizType(t)
    setQIndex(0)
    resetQuestion()
  }

  function changeLevel(l) {
    setLevel(l)
    setQIndex(0)
    resetQuestion()
  }

  function reward(correct) {
    if (!correct) {
      setStreak(0)
      return
    }
    const newStreak = streak + 1
    setStreak(newStreak)
    const key = quizType + '-' + q.question
    if (done.includes(key)) {
      setToast({ id: Date.now(), text: '✓ Correct (already scored)' })
      return
    }
    const points = { easy: 10, medium: 20, hard: 30 }[q.level]
    const bonus = newStreak >= 3 ? 5 : 0
    setDone([...done, key])
    setScore(score + points + bonus)
    setToast({
      id: Date.now(),
      text: `+${points + bonus}` + (newStreak >= 2 ? `  🔥 ${newStreak} in a row` : ''),
    })
  }

  function resetAll() {
    setLit([])
    setScore(0)
    setStreak(0)
    setDone([])
    setToast(null)
  }  function lightUp(id) {
    setLit((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  function choose(i) {
    if (picked !== null) return
    setPicked(i)
        if (i === q.answer) lightUp(q.nodeId)
    reward(i === q.answer)
  }

  function submitWritten() {
    if (result !== null || text.trim() === '') return
    const answer = text.toLowerCase()
    const hits = q.keywords.map((group) => group.some((word) => answer.includes(word)))
    const count = hits.filter(Boolean).length
    const pass = count >= q.need
    setResult({ hits, count, pass })
        if (pass) lightUp(q.nodeId)
    reward(pass)
  }

  function nextQuestion() {
    setQIndex((qIndex + 1) % pool.length)
    resetQuestion()
  }

  const btn = (active) => ({
    flex: 1,
    padding: '12px 14px',
    border: 'none',
    cursor: 'pointer',
    background: active ? theme.accent : 'transparent',
    color: active ? 'white' : '#9a9ab8',
    fontFamily: theme.font,
    fontWeight: 600,
    fontSize: 14,
    borderRadius: 8,
  })

  const chip = (active) => ({
    padding: '6px 12px',
    borderRadius: 14,
    border: `1px solid ${active ? theme.accent : '#2d2d52'}`,
    cursor: 'pointer',
    background: active ? theme.accent : 'transparent',
    color: 'white',
    fontFamily: theme.font,
    fontSize: 13,
    textTransform: 'capitalize',
  })
    return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', fontFamily: theme.font }}>
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
                    nodeTypes={nodeTypes}
          style={{ background: theme.background }}
          colorMode="dark"
          fitView
          onNodeClick={(event, node) => {
            setSelected(node)
            setTab('notes')
          }}
        >
          <Background color={theme.accent} gap={28} />
          <Controls />
        </ReactFlow>
                <ScoreBoard score={score} streak={streak} lit={lit.length} total={baseNodes.length} toast={toast} />
      </div>

      <div style={{ width: 360, background: theme.panel, textAlign: 'left', color: 'white', overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: 6, padding: 10, borderBottom: '1px solid #1f1f3a' }}>
          <button style={btn(tab === 'notes')} onClick={() => setTab('notes')}>Notes</button>
          <button style={btn(tab === 'diagram')} onClick={() => setTab('diagram')}>Diagram</button>
          <button style={btn(tab === 'quiz')} onClick={() => setTab('quiz')}>Quiz</button>
        </div>

        <div style={{ padding: 20 }}>
          {tab === 'notes' && (
            selected ? (
              <>
                <h2>{selected.data.label}</h2>
                <p>{notes[selected.id]}</p>
                <button
                  onClick={() => setSelected(null)}
                  style={{ ...chip(false), marginTop: 8 }}
                >
                  Back to summary
                </button>
              </>
            ) : (
              <>
                <h2>Short notes</h2>
                <ul style={{ paddingLeft: 18, lineHeight: 1.5 }}>
                  {summary.map((line, i) => (
                    <li key={i} style={{ marginBottom: 8 }}>{line}</li>
                  ))}
                </ul>
                <p style={{ opacity: 0.6 }}>Click any node on the map for its own notes.</p>
              </>
            )
          )}

          {tab === 'diagram' && <DiagramImage />}

          {tab === 'quiz' && (
            <>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <button style={chip(quizType === 'mcq')} onClick={() => changeType('mcq')}>Multiple choice</button>
                <button style={chip(quizType === 'written')} onClick={() => changeType('written')}>Written</button>
              </div>

              <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {['all', 'easy', 'medium', 'hard'].map((l) => (
                  <button key={l} style={chip(level === l)} onClick={() => changeLevel(l)}>{l}</button>
                ))}
              </div>

              <p style={{ opacity: 0.6, margin: '4px 0' }}>
                Question {qIndex + 1} of {pool.length} · linked to: {linkedNode.data.label}
              </p>
              <p style={{ margin: '4px 0' }}>
                <span style={{ color: levelColor[q.level] }}>● {q.level}</span>
                {'  '}
                <span style={{ color: '#facc15' }}>Connections lit: {lit.length} / {baseNodes.length}</span>
              </p>

              <h3>{q.question}</h3>

              {quizType === 'mcq' && (
                <>
                  {q.options.map((option, i) => (
                    <button
                      key={i}
                      className="opt"
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

              {quizType === 'written' && (
                <>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={result !== null}
                    rows={5}
                    placeholder="Type your answer here..."
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: 10,
                      borderRadius: 6,
                      border: '1px solid #3b3b6b',
                      background: '#1a1a2e',
                      color: 'white',
                      fontFamily: 'inherit',
                    }}
                  />

                  {result === null ? (
                    <button
                      onClick={submitWritten}
                      style={{ ...btn(true), flex: 'none', width: '100%', marginTop: 8, borderRadius: 6 }}
                    >
                      Submit answer
                    </button>
                  ) : (
                    <>
                      <p>{result.pass ? 'Good answer! Connection lit up.' : 'Not enough key points yet.'}</p>
                      <p>
                        Key points found: {result.count} / {q.keywords.length} (need {q.need})
                      </p>
                      <p>
                        {q.keywords.map((group, i) => (
                          <span
                            key={i}
                            style={{ marginRight: 12, color: result.hits[i] ? '#4ade80' : '#f87171' }}
                          >
                            {result.hits[i] ? '✓' : '✗'} {group[0]}
                          </span>
                        ))}
                      </p>
                      <p style={{ opacity: 0.85 }}><b>Model answer:</b> {q.modelAnswer}</p>
                      <button onClick={nextQuestion} style={btn(true)}>Next question</button>
                    </>
                  )}
                </>
              )}

              <button
                onClick={() => {
          if (window.confirm('Reset your score and all lit connections?')) resetAll()
        }}
                style={{ ...chip(false), marginTop: 20, opacity: 0.7 }}
              >
                Reset map
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App