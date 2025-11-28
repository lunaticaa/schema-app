import { useState, useEffect } from 'react'
import '../SchemaForm.css'

function QAPageSchema({ onDataChange }) {
  const [formData, setFormData] = useState({
    '@context': 'https://schema.org',
    '@type': 'QAPage',
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
        text: '',
        author: {
          '@type': 'Person',
          name: ''
        },
        answerCount: 0,
        acceptedAnswer: {
          '@type': 'Answer',
          text: '',
          author: {
            '@type': 'Person',
            name: ''
          }
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

  const updateQuestion = (index, path, value) => {
    const newEntity = [...formData.mainEntity]
    const keys = path.split('.')
    let current = newEntity[index]
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    setFormData({
      ...formData,
      mainEntity: newEntity
    })
  }

  return (
    <form className="schema-form">
      <div className="form-section-header">Q&A Items</div>

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
            <label className="field-label">Question Title *</label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateQuestion(index, 'name', e.target.value)}
              placeholder="Question title"
              className="form-input"
              required
            />
          </div>

          <div className="form-field-group">
            <label className="field-label">Question Details</label>
            <textarea
              value={item.text}
              onChange={(e) => updateQuestion(index, 'text', e.target.value)}
              placeholder="Full question details..."
              className="form-input"
              rows="3"
            />
          </div>

          <div className="form-field-group">
            <label className="field-label">Asker Name</label>
            <input
              type="text"
              value={item.author.name}
              onChange={(e) => updateQuestion(index, 'author.name', e.target.value)}
              placeholder="Name of the person asking"
              className="form-input"
            />
          </div>

          <div className="form-field-group">
            <label className="field-label">Answer Count *</label>
            <input
              type="number"
              min="0"
              value={item.answerCount}
              onChange={(e) => updateQuestion(index, 'answerCount', parseInt(e.target.value) || 0)}
              placeholder="Number of answers"
              className="form-input"
              required
            />
          </div>

          <div style={{ borderTop: '1px solid rgba(102, 126, 234, 0.2)', paddingTop: '15px', marginTop: '15px' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#667eea', fontSize: '0.95em', fontWeight: '600' }}>Accepted Answer</h4>

            <div className="form-field-group">
              <label className="field-label">Answer Text *</label>
              <textarea
                value={item.acceptedAnswer.text}
                onChange={(e) => updateQuestion(index, 'acceptedAnswer.text', e.target.value)}
                placeholder="The accepted answer..."
                className="form-input"
                rows="4"
                required
              />
            </div>

            <div className="form-field-group">
              <label className="field-label">Answerer Name</label>
              <input
                type="text"
                value={item.acceptedAnswer.author.name}
                onChange={(e) => updateQuestion(index, 'acceptedAnswer.author.name', e.target.value)}
                placeholder="Name of the person answering"
                className="form-input"
              />
            </div>
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

export default QAPageSchema
