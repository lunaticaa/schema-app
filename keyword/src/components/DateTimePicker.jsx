import './SchemaForm.css'
import './DateTimePicker.css'

function DateTimePicker({ value, onChange, label, required = false, hint = '' }) {
  // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
  const getLocalDateTime = () => {
    if (!value) return ''
    const date = new Date(value)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const handleChange = (e) => {
    if (e.target.value) {
      // Convert datetime-local to ISO string
      const localDateTime = e.target.value
      const date = new Date(localDateTime)
      onChange(date.toISOString())
    }
  }

  return (
    <div className="form-field-group">
      <label className="field-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <div className="datetime-picker-wrapper">
        <span className="calendar-icon">📅</span>
        <input
          type="datetime-local"
          value={getLocalDateTime()}
          onChange={handleChange}
          className="form-input datetime-input"
          required={required}
          placeholder="Select date and time"
        />
      </div>
      {value && (
        <small className="field-hint datetime-hint">
          ✓ {hint && hint + ' - '}
          {new Date(value).toLocaleString()}
        </small>
      )}
      {!value && hint && (
        <small className="field-hint datetime-hint-placeholder">
          {hint}
        </small>
      )}
    </div>
  )
}

export default DateTimePicker
