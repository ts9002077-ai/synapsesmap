import { useEffect, useState } from 'react'
import { ReactFlow, Background, Controls, Panel } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './effects.css'
import SynapseNode from './SynapseNode'
import SynapseEdge from './SynapseEdge'
import NetworkComplete from './NetworkComplete'
import DemoBar from './DemoBar'
import CameraFollow from './CameraFollow'
import { buildScript } from './demoScript'
import ScoreBoard from './ScoreBoard'
import UploadPanel from './UploadPanel'
import Splash from './Splash'
import NeuralBackground from './NeuralBackground'
import Quiz from './Quiz'
import VoiceSwitch from './VoiceSwitch'
import { DiagramImage, PeopleDiagram } from './Diagrams'
import { playReaction, playSwitch, playNetwork, playChime } from './sounds'
import { topics } from './topics'
import { ui } from './ui'
import { theme } from './theme'

const nodeTypes = { synapse: SynapseNode }
const edgeTypes = { synapse: SynapseEdge }

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return mobile
}

function App() {
  const isMobile = useIsMobile()
  const [splash, setSplash] = useState(true)
  const [started, setStarted] = useState(false)
  const [topicId, setTopicId] = useState(topics[0].id)
  const [rawTab, setTab] = useState('notes')
  const [selected, setSelected] = useState(null)
  const [lit, setLit] = useState([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [done, setDone] = useState([])
  const [toast, setToast] = useState(null)
    const [pulse, setPulse] = useState(null)
      const [celebrate, setCelebrate] = useState(null)
        const [demo, setDemo] = useState(null)
  const [caption, setCaption] = useState('')
    const [follow, setFollow] = useState(true)
  const [overview, setOverview] = useState(0)
  const [voice, setVoice] = useState(() => {
    try {
      return localStorage.getItem('voice') === 'female' ? 'female' : 'male'
    } catch {
      return 'male'
    }
  })

  const tab = isMobile ? rawTab : rawTab === 'map' ? 'notes' : rawTab
  const topic = topics.find((x) => x.id === topicId)
  const t = ui[topic.lang]
  const baseNodes = topic.nodes

  const nodes = baseNodes.map((n) => ({
    ...n,
    type: 'synapse',
    data: { ...n.data, lit: lit.includes(n.id) },
  }))

  const edges = topic.edges.map((e) => {
    const on = lit.includes(e.source) || lit.includes(e.target)
    return {
      ...e,
      type: 'synapse',
      animated: on,
      data:
        pulse && (e.source === pulse.id || e.target === pulse.id)
          ? { pulse: pulse.stamp, reverse: e.target === pulse.id }
          : undefined,
      style: on
        ? { stroke: theme.glow, strokeWidth: 3, filter: `drop-shadow(0 0 6px ${theme.glow})` }
        : { stroke: theme.accent, strokeWidth: 2, opacity: 0.6 },
    }
  })

  function resetAll() {
    setLit([])
    setScore(0)
    setStreak(0)
    setDone([])
    setToast(null)
        setPulse(null)
            setOverview(Date.now())
    setCelebrate(null)
  }

  function changeTopic(id) {
    setTopicId(id)
    setSelected(null)
    setTab(isMobile ? 'map' : 'notes')
    resetAll()
  }

  function changeVoice(v) {
    if (v === voice) return
    setVoice(v)
    try {
      localStorage.setItem('voice', v)
    } catch {
      // storage not available, the choice just won't be remembered
    }
    playSwitch(v)
    setToast({
      id: Date.now(),
      text: `🎙️ ${t.voice}: ${v === 'female' ? t.voiceFemaleName : t.voiceMaleName}`,
    })
  }

  function lightUp(id) {
    if (lit.includes(id)) return
    setLit((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setPulse({ id, stamp: Date.now() })
    if (lit.length + 1 === baseNodes.length) {
      setCelebrate(Date.now())
      setTimeout(playNetwork, 1200)
    }
  }

  function reward(correct, q, quizType) {
    playReaction(correct, topic.lang, voice)
    if (!correct) {
      setStreak(0)
      return
    }
    const newStreak = streak + 1
    setStreak(newStreak)
    const key = topicId + '-' + quizType + '-' + q.question
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

  const script = buildScript(topic, isMobile)

  function startDemo() {
    setDemo({ step: 0 })
  }

  function stopDemo() {
    setDemo(null)
    setCaption('')
  }

  function demoLight(id) {
    lightUp(id)
    const newStreak = streak + 1
    setStreak(newStreak)
    const gain = 10 + (newStreak >= 3 ? 5 : 0)
    setScore(score + gain)
    setToast({ id: Date.now(), text: `+${gain}` + (newStreak >= 2 ? `  🔥 ${newStreak}` : '') })
    playChime()
  }

  useEffect(() => {
    if (!demo) return
    const s = script[demo.step]
    if (!s) {
      setDemo(null)
      setCaption('')
      return
    }
    if (s.reset) resetAll()
    if (s.tab) setTab(s.tab)
    if (s.select !== undefined) setSelected(s.select)
    if (s.caption) setCaption(s.caption)
    if (s.light) demoLight(s.light)
    const timer = setTimeout(() => setDemo((d) => (d ? { step: d.step + 1 } : d)), s.wait)
    return () => clearTimeout(timer)
  }, [demo])
  
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

  const chip = {
    padding: '6px 12px',
    borderRadius: 14,
    border: '1px solid #2d2d52',
    cursor: 'pointer',
    background: 'transparent',
    color: 'white',
    fontFamily: theme.font,
    fontSize: 13,
  }

  const topicSelect = (
    <select
      value={topicId}
      onChange={(e) => changeTopic(e.target.value)}
      style={{
        display: 'block',
        flex: isMobile ? 1 : 'none',
        width: isMobile ? 'auto' : '100%',
        minWidth: 0,
        padding: 8,
        borderRadius: 8,
        border: '1px solid #2d2d52',
        background: '#12122a',
        color: 'white',
        fontFamily: 'inherit',
      }}
    >
      {topics.map((x) => (
        <option key={x.id} value={x.id}>
          {x.name}
        </option>
      ))}
    </select>
  )

  const mapView = (
    <>
      <ReactFlow
        key={topicId}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        style={{ background: theme.background }}
        colorMode="dark"
        minZoom={0.2}
        fitView
        onNodeClick={(event, node) => {
          setSelected(node)
          setTab('notes')
        }}
      >
        <Background color={theme.accent} gap={28} />
                <CameraFollow focus={pulse} overview={overview} enabled={follow || !!demo} zoom={isMobile ? 0.8 : 0.9} />
        <Controls showInteractive={false} />
               <Panel position="top-right" style={{ display: 'flex', gap: 8 }}>
          {!isMobile && (
            <button
              className="lift"
              onClick={() => setFollow(!follow)}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                border: `1px solid ${theme.accent}`,
                background: follow ? theme.accent : 'rgba(13, 13, 26, 0.85)',
                color: 'white',
                fontFamily: theme.font,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🎥 {t.follow}
            </button>
          )}
          {!demo && (
            <button
              className="lift"
              onClick={startDemo}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                border: `1px solid ${theme.accent}`,
                background: 'rgba(13, 13, 26, 0.85)',
                color: 'white',
                fontFamily: theme.font,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ▶ {t.demo}
            </button>
          )}
        </Panel>
      </ReactFlow>
      <ScoreBoard
        score={score}
        streak={streak}
        lit={lit.length}
        total={baseNodes.length}
        toast={toast}
        label={t.connections}
      />
    </>
  )

  const body = (
    <>
      {(tab === 'notes' || tab === 'diagram') && (
        <div key={tab} style={{ animation: 'fadeUp 0.35s ease both' }}>
          {tab === 'notes' &&
            (selected ? (
              <>
                <h2>{selected.data.label}</h2>
                <p>{topic.notes[selected.id]}</p>
                <button className="lift" onClick={() => setSelected(null)} style={{ ...chip, marginTop: 8 }}>
                  {t.backToSummary}
                </button>
              </>
            ) : (
              <>
                <h2>{t.shortNotes}</h2>
                <ul style={{ paddingLeft: 18, lineHeight: 1.5 }}>
                  {topic.summary.map((line, i) => (
                    <li key={i} style={{ marginBottom: 8 }}>
                      {line}
                    </li>
                  ))}
                </ul>
                <p style={{ opacity: 0.6 }}>{t.clickNode}</p>
              </>
            ))}

          {tab === 'diagram' &&
            (topic.diagram.type === 'people' ? (
              <PeopleDiagram people={topic.diagram.people} timeline={topic.diagram.timeline} t={t} />
            ) : (
              <DiagramImage src={topic.diagram.src} hint={t.imgHint} />
            ))}
        </div>
      )}

            {celebrate && (
        <NetworkComplete
          key={celebrate}
          title={t.networkTitle}
          subtitle={t.networkSub}
          onDone={() => setCelebrate(null)}
        />
      )}
            {demo && (
        <DemoBar
          caption={caption}
          progress={demo.step / script.length}
          stopLabel={t.demoStop}
          onStop={stopDemo}
          right={isMobile ? 16 : 376}
          bottom={isMobile ? 84 : 24}
        />
      )}
      <div style={{ display: tab === 'quiz' ? 'block' : 'none' }}>
        <Quiz
          key={topicId}
          topic={topic}
          t={t}
          lit={lit.length}
          onLight={lightUp}
          onAnswer={reward}
          onReset={() => {
            if (window.confirm(t.resetConfirm)) resetAll()
          }}
        />
      </div>
    </>
  )

  if (splash) {
    return <Splash onFinish={() => setSplash(false)} />
  }

  if (!started) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          overflowY: 'auto',
          background: theme.logoBg,
          color: 'white',
          fontFamily: theme.font,
          textAlign: 'left',
        }}
      >
        <NeuralBackground />
        <div
          style={{
            width: 460,
            maxWidth: '90%',
            margin: 'auto',
            padding: '20px 0',
            position: 'relative',
            zIndex: 1,
          }}
        >
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

  if (isMobile) {
    const navItems = [
      ['map', '🗺️', t.map],
      ['notes', '📝', t.notes],
      ['diagram', '🖼️', t.diagram],
      ['quiz', '❓', t.quiz],
    ]

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          background: theme.panel,
          color: 'white',
          textAlign: 'left',
          fontFamily: theme.font,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderBottom: '1px solid #1f1f3a',
          }}
        >
          {topicSelect}
          <VoiceSwitch voice={voice} onChange={changeVoice} t={t} />
          {tab !== 'map' && (
            <div style={{ whiteSpace: 'nowrap', fontWeight: 600, color: theme.glow }}>
              ⚡ {score}
              {streak >= 2 ? ` 🔥${streak}` : ''}
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            position: 'relative',
            overflowY: tab === 'map' ? 'hidden' : 'auto',
          }}
        >
          {tab === 'map' && <div style={{ position: 'absolute', inset: 0 }}>{mapView}</div>}
          <div style={{ padding: 16, display: tab === 'map' ? 'none' : 'block' }}>{body}</div>
        </div>

        <div
          style={{
            display: 'flex',
            borderTop: '1px solid #1f1f3a',
            background: theme.panel,
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {navItems.map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1,
                padding: '8px 4px',
                border: 'none',
                borderTop: `2px solid ${tab === id ? theme.accent : 'transparent'}`,
                background: 'transparent',
                color: tab === id ? 'white' : '#8a8aa8',
                fontFamily: theme.font,
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 20 }}>{icon}</div>
              {label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', fontFamily: theme.font }}>
      <div style={{ flex: 1 }}>{mapView}</div>

      <div
        style={{
          width: 360,
          background: theme.panel,
          textAlign: 'left',
          color: 'white',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '14px 10px 0' }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 10,
              background: 'linear-gradient(90deg, #38bdf8, #7c5cff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
            }}
          >
            SynapseMap Ai
          </div>
          {topicSelect}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}
          >
            <span style={{ fontSize: 13, opacity: 0.7 }}>🎙️ {t.voice}</span>
            <VoiceSwitch voice={voice} onChange={changeVoice} t={t} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, padding: 10, borderBottom: '1px solid #1f1f3a' }}>
          <button className="lift" style={btn(tab === 'notes')} onClick={() => setTab('notes')}>
            {t.notes}
          </button>
          <button className="lift" style={btn(tab === 'diagram')} onClick={() => setTab('diagram')}>
            {t.diagram}
          </button>
          <button className="lift" style={btn(tab === 'quiz')} onClick={() => setTab('quiz')}>
            {t.quiz}
          </button>
        </div>

        <div style={{ padding: 20 }}>{body}</div>
      </div>
    </div>
  )
}

export default App