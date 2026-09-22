import { useMemo, useState } from 'react'
import './AgeCalculator.css'

function calculateAge(birthDateStr) {
  const birth = new Date(birthDateStr)
  const today = new Date()
  if (isNaN(birth.getTime()) || birth > today) return null

  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()
  let days = today.getDate() - birth.getDate()

  if (days < 0) {
    months -= 1
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  const totalDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24))

  return { years, months, days, totalDays }
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('')

  const result = useMemo(() => (birthDate ? calculateAge(birthDate) : null), [birthDate])

  return (
    <section className="age-calc">
      <p className="age-calc-eyebrow">Calculator</p>
      <h1 className="age-calc-title">How old exactly?</h1>
      <p className="age-calc-sub">Pick a birth date to see the precise age.</p>

      <label className="age-calc-field">
        <span>Date of birth</span>
        <input
          type="date"
          value={birthDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </label>

      {birthDate && !result && (
        <p className="age-calc-error">Pick a valid date that isn't in the future.</p>
      )}

      {result && (
        <div className="age-result">
          <div className="age-result-main">
            <div className="age-result-block">
              <span className="age-result-num">{result.years}</span>
              <span className="age-result-label">years</span>
            </div>
            <div className="age-result-block">
              <span className="age-result-num">{result.months}</span>
              <span className="age-result-label">months</span>
            </div>
            <div className="age-result-block">
              <span className="age-result-num">{result.days}</span>
              <span className="age-result-label">days</span>
            </div>
          </div>
          <p className="age-result-total">{result.totalDays.toLocaleString()} days lived, total</p>
        </div>
      )}
    </section>
  )
}
