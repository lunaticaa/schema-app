import { useState } from 'react'
import './SchemaForm.css'

function SchemaForm({ schema }) {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validateField = (field, value) => {
    if (field.required && !value) {
      return `${field.label} is required`
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return `${field.label} must be a valid email`
      }
    }

    if (field.type === 'number' && value) {
      if (isNaN(value)) {
        return `${field.label} must be a number`
      }
    }

    if (field.type === 'date' && value) {
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        return `${field.label} must be a valid date`
      }
    }

    return null
  }

  const handleInputChange = (e, fieldId) => {
    const { value, type, checked } = e.target
    const field = schema.fields.find(f => f.id === fieldId)
    const inputValue = type === 'checkbox' ? checked : value

    setFormData({
      ...formData,
      [fieldId]: inputValue
    })

    const error = validateField(field, inputValue)
    if (error) {
      setErrors({
        ...errors,
        [fieldId]: error
      })
    } else {
      const newErrors = { ...errors }
      delete newErrors[fieldId]
      setErrors(newErrors)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(false)

    const newErrors = {}
    schema.fields.forEach(field => {
      const value = formData[field.id] || ''
      const error = validateField(field, value)
      if (error) {
        newErrors[field.id] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setSubmitted(true)
    console.log('Form Data:', formData)
  }

  const handleReset = () => {
    setFormData({})
    setErrors({})
    setSubmitted(false)
  }

  const renderField = (field) => {
    const value = formData[field.id] || ''
    const error = errors[field.id]
    const inputProps = {
      id: `field-${field.id}`,
      value,
      onChange: (e) => handleInputChange(e, field.id),
      className: `form-input ${error ? 'error' : ''}`
    }

    switch (field.type) {
      case 'email':
        return (
          <input
            {...inputProps}
            type="email"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )
      case 'password':
        return (
          <input
            {...inputProps}
            type="password"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )
      case 'number':
        return (
          <input
            {...inputProps}
            type="number"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )
      case 'date':
        return <input {...inputProps} type="date" />
      case 'checkbox':
        return (
          <div className="checkbox-wrapper">
            <input
              {...inputProps}
              type="checkbox"
              checked={value}
            />
            <span>{field.label}</span>
          </div>
        )
      case 'textarea':
        return (
          <textarea
            {...inputProps}
            rows="4"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )
      case 'select':
        return (
          <select {...inputProps}>
            <option value="">Select {field.label}</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        )
      case 'radio':
        return (
          <div className="radio-wrapper">
            <label>
              <input
                type="radio"
                name={`field-${field.id}`}
                value="yes"
                checked={value === 'yes'}
                onChange={(e) => handleInputChange(e, field.id)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`field-${field.id}`}
                value="no"
                checked={value === 'no'}
                onChange={(e) => handleInputChange(e, field.id)}
              />
              No
            </label>
          </div>
        )
      case 'text':
      default:
        return (
          <input
            {...inputProps}
            type="text"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )
    }
  }

  return (
    <div className="schema-form-container">
      {schema.fields.length === 0 ? (
        <div className="no-fields-message">
          <h3>No fields in schema</h3>
          <p>Go to Schema Builder tab and add some fields to see the form here.</p>
        </div>
      ) : (
        <>
          <h2>{schema.title}</h2>
          <form onSubmit={handleSubmit} className="schema-form">
            {schema.fields.map(field => (
              <div key={field.id} className="form-field-group">
                {field.type !== 'checkbox' && (
                  <label htmlFor={`field-${field.id}`} className="field-label">
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                  </label>
                )}
                {renderField(field)}
                {errors[field.id] && (
                  <span className="error-message">{errors[field.id]}</span>
                )}
              </div>
            ))}

            <div className="form-actions">
              <button type="submit" className="btn btn-submit">
                Submit
              </button>
              <button type="button" className="btn btn-reset" onClick={handleReset}>
                Reset
              </button>
            </div>
          </form>

          {submitted && (
            <div className="success-message">
              <h3>✓ Form submitted successfully!</h3>
              <pre className="submitted-data">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SchemaForm
