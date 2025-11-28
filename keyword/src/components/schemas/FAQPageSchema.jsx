import { useState, useEffect } from 'react'
import '../SchemaForm.css'

function FAQPageSchema({ onDataChange }) {
  const [formData, setFormData] = useState({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: []
  })

  useEffect(() => {
    onDataChange(formData)
  }, [formData, onDataChange])

  const addQuestion = () => {
    setFormData({
      ...formData,
      mainEntity: [...formData.mainEntity, {
        '@type': 'Question',
        name: '',
        acceptedAnswer: {
          '@type': 'Answer',
          text: ''
        }
      }]
    })
  }

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      mainEntity: formData.mainEntity.filter((_, i) => i !== index)
    })
  }

  const updateQuestion = (index, field, value) => {
    const newEntity = [...formData.mainEntity]
    if (field === 'question') {
      newEntity[index].name = value
    } else if (field === 'answer') {
      newEntity[index].acceptedAnswer.text = value
    }
    setFormData({
      ...formData,
      mainEntity: newEntity
    })
  }

  return (
    <form className="schema-form">
      <div className="form-section-header">FAQ Questions & Answers</div>

      {formData.mainEntity.map((item, index) => (
        <div key={index} className="nested-section">
          <div className="section-actions">
            <span className="section-label">Question {index + 1}</span>
            <button
              type="button"
              onClick={() => removeQuestion(index)}
              className="btn btn-delete-small"
            >
              ✕
            </button>
          </div>

          <div className="form-field-group">
            <label className="field-label">Question *</label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateQuestion(index, 'question', e.target.value)}
              placeholder="What is the question?"
              className="form-input"
              required
            />
          </div>

          <div className="form-field-group">
            <label className="field-label">Answer *</label>
            <textarea
              value={item.acceptedAnswer.text}
              onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
              placeholder="Provide the answer here..."
              className="form-input"
              rows="4"
              required
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="btn btn-secondary"
      >
        + Add Question
      </button>
    </form>
  )
}

export default FAQPageSchema
