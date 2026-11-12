import { useEffect, useState } from 'react'
import { theme } from './theme'
import { playFinish } from './sounds'

const levelColor = { easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444' }
const letters = ['A', 'B', 'C', 'D']

const mainBtn = {
  width: '100%',
  padding: 12,
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  background: theme.accent,
  color: 'white',
  fontFamily: theme.font,
  fontWeight: 600,
  fontSize: 14,
}

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

const sectionLabel = {
  margin: '0 0 6px',
  fontSize: 12,
  opacity: 0.6,
  textTransform: 'uppercase',
  letterSpacing: 1,
}

function ResultBox({ t, correct, total, percent, breakdown, otherLabel, onRetry, onOther }) {
  const [shown, setShown] = useState(0)
  const [confetti] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.9,
      duration: 1.8 + Math.random() * 1.4,
      size: 6 + Math.random() * 6,
      color: ['#facc15', '#7c5cff', '#38bdf8', '#22c55e', '#f472b6'][i % 5],
    }))
  )

  useEffect(() => {
    let raf
    const start = performance.now()

    function tick(now) {
      const p = Math.min((now - start) / 1100, 1)
      setShown(Math.round(percent * p))
      if (p < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [percent])

  const stars = percent >= 90 ? 3 : percent >= 70 ? 2 : percent >= 50 ? 1 : 0
  const rating = t.ratings[percent >= 90 ? 0 : percent >= 70 ? 1 : percent >= 50 ? 2 : 3]
  const R = 52
  const C = 2 * Math.PI * R

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        padding: '8px 4px 4px',
        animation: 'fadeUp 0.5s ease both',
      }}
    >
      {percent >= 70 &&
        confetti.map((c, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: -12,
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 0.6,
              background: c.color,
              borderRadius: 2,
              pointerEvents: 'none',
              animation: `confettiFall ${c.duration}s ease-in ${c.delay}s forwards`,
            }}
          />
        ))}

      <h2 style={{ marginTop: 0 }}>{t.resultsTitle}</h2>

      <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 8px' }}>
        <svg width="140" height="140" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={R} fill="none" stroke="#1f1f3a" strokeWidth="10" />
          <circle
            cx="65"
            cy="65"
            r={R}
            fill="none"
            stroke={theme.accent}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - shown / 100)}
            transform="rotate(-90 65 65)"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            fontWeight: 700,
            color: theme.glow,
          }}
        >
          {shown}%
        </div>
      </div>

      <div style={{ fontSize: 30, letterSpacing: 4, marginBottom: 4 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              color: i < stars ? theme.glow : '#2d2d52',
              textShadow: i < stars ? `0 0 14px ${theme.glow}` : 'none',
              animation: `popIn 0.5s ease ${0.5 + i * 0.25}s both`,
            }}
          >
            ★
          </span>
        ))}
      </div>

      <p style={{ fontSize: 20, fontWeight: 600, margin: '4px 0' }}>{rating}</p>
      <p style={{ opacity: 0.75, margin: '0 0 16px' }}>
        {correct} / {total} {t.correctWord}
      </p>

      {breakdown.length > 0 && (
        <div style={{ textAlign: 'left', marginBottom: 16 }}>
          <p style={{ opacity: 0.6, fontSize: 13, margin: '0 0 6px' }}>{t.byLevel}</p>
          {breakdown.map((b) => (
            <div key={b.level} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: levelColor[b.level] }}>● {t.levels[b.level]}</span>
                <span>
                  {b.correct} / {b.total}
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: '#1f1f3a', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(b.correct / b.total) * 100}%`,
                    background: levelColor[b.level],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="lift" onClick={onRetry} style={mainBtn}>
        {t.tryAgain}
      </button>
      <button
        className="lift"
        onClick={onOther}
        style={{ ...chip(false), width: '100%', marginTop: 8, padding: 10, textTransform: 'none' }}
      >
        {otherLabel}
      </button>
    </div>
  )
}

export default function Quiz({ topic, t, lit, onLight, onAnswer, onReset }) {
  const [quizType, setQuizType] = useState('mcq')
  const [level, setLevel] = useState('all')
  const [qIndex, setQIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)
  const [triedWritten, setTriedWritten] = useState(false)

  const all = quizType === 'mcq' ? topic.mcq : topic.written
  const pool = all.filter((item) => level === 'all' || item.level === level)
  const q = pool[qIndex]
  const linkedNode = topic.nodes.find((n) => n.id === q.nodeId)
  const answered = quizType === 'mcq' ? picked !== null : result !== null
  const isLast = qIndex === pool.length - 1

  const correctCount = Object.values(answers).filter(Boolean).length
  const percent = Math.round((correctCount / pool.length) * 100)
  const breakdown = ['easy', 'medium', 'hard']
    .map((lv) => {
      const items = pool.filter((x) => x.level === lv)
      return {
        level: lv,
        total: items.length,
        correct: items.filter((x) => answers[x.question]).length,
      }
    })
    .filter((b) => b.total > 0)

  function resetRound() {
    setQIndex(0)
    setPicked(null)
    setText('')
    setResult(null)
    setAnswers({})
    setFinished(false)
  }

  function changeType(ty) {
    if (ty === quizType) return
    if (ty === 'written') setTriedWritten(true)
    setQuizType(ty)
    resetRound()
  }

  function changeLevel(l) {
    if (l === level) return
    setLevel(l)
    resetRound()
  }

  function record(correct) {
    setAnswers((prev) => ({ ...prev, [q.question]: correct }))
    if (correct) onLight(q.nodeId)
    onAnswer(correct, q, quizType)
  }

  function choose(i) {
    if (picked !== null) return
    setPicked(i)
    record(i === q.answer)
  }

  function submitWritten() {
    if (result !== null || text.trim() === '') return
    const answer = text.toLowerCase()
    const hits = q.keywords.map((group) => group.some((word) => answer.includes(word)))
    const count = hits.filter(Boolean).length
    const pass = count >= q.need
    setResult({ hits, count, pass })
    record(pass)
  }

  function next() {
    if (isLast) {
      playFinish(percent >= 50)
      setFinished(true)
      return
    }
    setQIndex(qIndex + 1)
    setPicked(null)
    setText('')
    setResult(null)
  }

  if (finished) {
    return (
      <ResultBox
        t={t}
        correct={correctCount}
        total={pool.length}
        percent={percent}
        breakdown={level === 'all' ? breakdown : []}
        otherLabel={quizType === 'mcq' ? t.tryWritten : t.tryMcq}
        onRetry={resetRound}
        onOther={() => changeType(quizType === 'mcq' ? 'written' : 'mcq')}
      />
    )
  }

  const progress = ((qIndex + (answered ? 1 : 0)) / pool.length) * 100

  return (
    <>
      <p style={sectionLabel}>{t.questionType}</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        {[
          ['mcq', '☑️', t.mcq],
          ['written', '✍️', t.written],
        ].map(([id, icon, label]) => {
          const active = quizType === id
          const count = (id === 'mcq' ? topic.mcq : topic.written).filter(
            (x) => level === 'all' || x.level === level
          ).length
          return (
            <button
              key={id}
              className="lift"
              onClick={() => changeType(id)}
              style={{
                position: 'relative',
                flex: 1,
                padding: '12px 8px',
                borderRadius: 12,
                border: `2px solid ${active ? theme.accent : '#2d2d52'}`,
                background: active ? 'linear-gradient(135deg, #3b2f8f, #1f3a8a)' : '#12122a',
                color: 'white',
                cursor: 'pointer',
                fontFamily: theme.font,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22 }}>{icon}</div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{label}</div>
              <div style={{ opacity: 0.7, fontSize: 12 }}>{count}</div>
              {id === 'written' && !triedWritten && (
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: theme.glow,
                    boxShadow: `0 0 10px ${theme.glow}`,
                    animation: 'glowBreath 1.6s ease-in-out infinite',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
      <p style={{ margin: '0 0 14px', fontSize: 12, opacity: 0.65 }}>
        {quizType === 'mcq' ? t.mcqHint : t.writtenHint}
      </p>

      <p style={sectionLabel}>{t.difficulty}</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {['all', 'easy', 'medium', 'hard'].map((l) => (
          <button key={l} className="lift" style={chip(level === l)} onClick={() => changeLevel(l)}>
            <span style={{ color: levelColor[l] || '#9a9ab8' }}>● </span>
            {t.levels[l]}
          </button>
        ))}
      </div>

      <div style={{ height: 6, borderRadius: 3, background: '#1f1f3a', overflow: 'hidden', marginBottom: 12 }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${theme.accent}, #38bdf8)`,
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      <p style={{ opacity: 0.6, margin: '4px 0', fontSize: 13 }}>
        {t.question} {qIndex + 1} {t.of} {pool.length} · {t.linkedTo}: {linkedNode.data.label}
      </p>
      <p style={{ margin: '4px 0 10px', fontSize: 13 }}>
        <span style={{ color: levelColor[q.level] }}>● {t.levels[q.level]}</span>
        {'   '}
        <span style={{ color: theme.glow }}>
          {t.connectionsLit}: {lit} / {topic.nodes.length}
        </span>
      </p>

      <div key={`${quizType}-${level}-${qIndex}`} style={{ animation: 'fadeUp 0.35s ease both' }}>
        <div
          style={{
            background: '#12122a',
            borderLeft: `4px solid ${levelColor[q.level]}`,
            borderRadius: 10,
            padding: '12px 14px',
            margin: '0 0 14px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: 17, lineHeight: 1.4 }}>{q.question}</h3>
        </div>

        {quizType === 'mcq' && (
          <>
            {q.options.map((option, i) => {
              const isRight = picked !== null && i === q.answer
              const isWrongPick = picked !== null && i === picked && i !== q.answer
              return (
                <button
                  key={i}
                  className="opt"
                  onClick={() => choose(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    textAlign: 'left',
                    padding: 12,
                    marginBottom: 8,
                    borderRadius: 8,
                    border: `1px solid ${isRight ? '#22c55e' : isWrongPick ? '#ef4444' : '#3b3b6b'}`,
                    cursor: 'pointer',
                    color: 'white',
                    fontFamily: 'inherit',
                    background: isRight ? '#14532d' : isWrongPick ? '#7f1d1d' : '#1a1a2e',
                    animation: isRight ? 'correctPop 0.5s ease' : isWrongPick ? 'shake 0.45s ease' : 'none',
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: '#232347',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {letters[i]}
                  </span>
                  <span>{option}</span>
                </button>
              )
            })}

            {picked !== null && (
              <>
                <p
                  style={{
                    fontWeight: 600,
                    color: picked === q.answer ? '#4ade80' : '#f87171',
                    animation: 'fadeUp 0.3s ease both',
                  }}
                >
                  {picked === q.answer ? '✅ ' + t.correct : '❌ ' + t.wrong}
                </p>
                <button className="lift" onClick={next} style={mainBtn}>
                  {isLast ? t.seeResults : t.next}
                </button>
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
                borderRadius: 8,
                border: '1px solid #3b3b6b',
                background: '#1a1a2e',
                color: 'white',
                fontFamily: 'inherit',
              }}
            />

            {result === null ? (
              <button className="lift" onClick={submitWritten} style={{ ...mainBtn, marginTop: 8 }}>
                {t.submit}
              </button>
            ) : (
              <div style={{ animation: 'fadeUp 0.3s ease both' }}>
                <p style={{ fontWeight: 600, color: result.pass ? '#4ade80' : '#f87171' }}>
                  {result.pass ? '✅ ' + t.goodAnswer : '❌ ' + t.notEnough}
                </p>
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
                <button className="lift" onClick={next} style={mainBtn}>
                  {isLast ? t.seeResults : t.next}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <button className="lift" onClick={onReset} style={{ ...chip(false), marginTop: 20, opacity: 0.7 }}>
        {t.reset}
      </button>
    </>
  )
}