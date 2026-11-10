import { useState } from 'react'
import { ReactFlow, Background, Controls } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './effects.css'
import SynapseNode from './SynapseNode'
import ScoreBoard from './ScoreBoard'
import UploadPanel from './UploadPanel'
import { DiagramImage, PeopleDiagram } from './Diagrams'
import { playReaction } from './sounds'
import { topics } from './topics'
import { ui } from './ui'
import { theme } from './theme'

const levelColor = { easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444' }
const nodeTypes = { synapse: SynapseNode }

function App() {
  const [started, setStarted] = useState(false)
  const [topicId, setTopicId] = useState(topics[0].id)
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

  const topic = topics.find((x) => x.id === topicId)
  const t = ui[topic.lang]
  const baseNodes = topic.nodes
  const baseEdges = topic.edges

  const all = quizType === 'mcq' ? topic.mcq : topic.written
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

  function resetAll() {
    setLit([])
    setScore(0)
    setStreak(0)
    setDone([])
    setToast(null)
  }

  function changeTopic(id) {
    setTopicId(id)
    setSelected(null)
    setTab('notes')
    setQuizType('mcq')
    setLevel('all')
    setQIndex(0)
    resetQuestion()
    resetAll()
  }

  function changeType(ty) {
    setQuizType(ty)
    setQIndex(0)
    resetQuestion()
  }

  function changeLevel(l) {
    setLevel(l)
    setQIndex(0)
    resetQuestion()
  }

  function lightUp(id) {
    setLit((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  function reward(correct) {
    playReaction(correct)
    if (!correct) {
      setStreak(0)
      return
    }
    const newStreak = streak + 1
    setStreak(newStreak)
    const key = quizType + '-' + q.question
    if (done.includes(key)) {
      setToast({ id: Date.now(), text: t.alreadyScored })
      return
    }
    const points = { easy: 10, medium: 20, hard: 30 }[q.level]
    const bonus = newStreak >= 3 ? 5 : 0
    setDone([...done, key])
    setScore(score + points + bonus)
    setToast({
      id: Date.now(),
      text: `+${points + bonus}` + (newStreak >= 2 ? `  🔥 ${newStreak} ${t.inARow}` : ''),
    })
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

  if (!started) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.background,
          color: 'white',
          fontFamily: theme.font,
          textAlign: 'left',
        }}
      >
        <div style={{ width: 460, maxWidth: '90%' }}>
          <UploadPanel
            topics={topics}
            onDone={(id) => {
              changeTopic(id)
              setStarted(true)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', fontFamily: theme.font }}>
      <div style={{ flex: 1 }}>
        <ReactFlow
          key={topicId}
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
        <ScoreBoard
          score={score}
          streak={streak}
          lit={lit.length}
          total={baseNodes.length}
          toast={toast}
          label={t.connections}
        />
      </div>

      <div
        style={{
          width: 360,
          background: theme.panel,
          textAlign: 'left',
          color: 'white',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '10px 10px 0' }}>
          <select
            value={topicId}
            onChange={(e) => changeTopic(e.target.value)}
            style={{
              width: '100%',
              padding: 8,
              borderRadius: 8,
              border: '1px solid #2d2d52',
              background: '#12122a',
              color: 'white',
              fontFamily: 'inherit',
            }}
          >
            {topics.map((x) => (
              <option key={x.id} value={x.id}>{x.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 6, padding: 10, borderBottom: '1px solid #1f1f3a' }}>
          <button style={btn(tab === 'notes')} onClick={() => setTab('notes')}>{t.notes}</button>
          <button style={btn(tab === 'diagram')} onClick={() => setTab('diagram')}>{t.diagram}</button>
          <button style={btn(tab === 'quiz')} onClick={() => setTab('quiz')}>{t.quiz}</button>
        </div>

        <div style={{ padding: 20 }}>
          {tab === 'notes' && (
            selected ? (
              <>
                <h2>{selected.data.label}</h2>
                <p>{topic.notes[selected.id]}</p>
                <button onClick={() => setSelected(null)} style={{ ...chip(false), marginTop: 8 }}>
                  {t.backToSummary}
                </button>
              </>
            ) : (
              <>
                <h2>{t.shortNotes}</h2>
                <ul style={{ paddingLeft: 18, lineHeight: 1.5 }}>
                  {topic.summary.map((line, i) => (
                    <li key={i} style={{ marginBottom: 8 }}>{line}</li>
                  ))}
                </ul>
                <p style={{ opacity: 0.6 }}>{t.clickNode}</p>
              </>
            )
          )}

          {tab === 'diagram' && (
            topic.diagram.type === 'people' ? (
              <PeopleDiagram people={topic.diagram.people} timeline={topic.diagram.timeline} t={t} />
            ) : (
              <DiagramImage src={topic.diagram.src} hint={t.imgHint} />
            )
          )}

          {tab === 'quiz' && (
            <>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <button style={chip(quizType === 'mcq')} onClick={() => changeType('mcq')}>{t.mcq}</button>
                <button style={chip(quizType === 'written')} onClick={() => changeType('written')}>{t.written}</button>
              </div>

              <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                {['all', 'easy', 'medium', 'hard'].map((l) => (
                  <button key={l} style={chip(level === l)} onClick={() => changeLevel(l)}>
                    {t.levels[l]}
                  </button>
                ))}
              </div>

              <p style={{ opacity: 0.6, margin: '4px 0' }}>
                {t.question} {qIndex + 1} {t.of} {pool.length} · {t.linkedTo}: {linkedNode.data.label}
              </p>
              <p style={{ margin: '4px 0' }}>
                <span style={{ color: levelColor[q.level] }}>● {t.levels[q.level]}</span>
                {'  '}
                <span style={{ color: '#facc15' }}>
                  {t.connectionsLit}: {lit.length} / {baseNodes.length}
                </span>
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
                      <p>{picked === q.answer ? t.correct : t.wrong}</p>
                      <button onClick={nextQuestion} style={btn(true)}>{t.next}</button>
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
                    placeholder={t.placeholder}
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
                      style={{ ...btn(true), flex: 'none', width: '100%', marginTop: 8 }}
                    >
                      {t.submit}
                    </button>
                  ) : (
                    <>
                      <p>{result.pass ? t.goodAnswer : t.notEnough}</p>
                      <p>
                        {t.keyPoints}: {result.count} / {q.keywords.length} ({t.need} {q.need})
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
                      <p style={{ opacity: 0.85 }}>
                        <b>{t.modelAnswer}:</b> {q.modelAnswer}
                      </p>
                      <button onClick={nextQuestion} style={btn(true)}>{t.next}</button>
                    </>
                  )}
                </>
              )}

              <button
                onClick={() => {
                  if (window.confirm(t.resetConfirm)) resetAll()
                }}
                style={{ ...chip(false), marginTop: 20, opacity: 0.7 }}
              >
                {t.reset}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App