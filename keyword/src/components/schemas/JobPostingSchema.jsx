import { useState, useEffect } from 'react'
import '../SchemaForm.css'
import DateTimePicker from '../DateTimePicker'

function JobPostingSchema({ onDataChange }) {
  const getDefaultValidThrough = () => {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date.toISOString()
  }

  const [formData, setFormData] = useState({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: '',
    description: '',
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '',
        addressLocality: '',
        addressRegion: '',
        postalCode: '',
        addressCountry: ''
      }
    },
    hiringOrganization: {
      '@type': 'Organization',
      name: ''
    },
    employmentType: 'FULL_TIME',
    baseSalary: {
      '@type': 'PriceSpecification',
      currency: 'USD',
      value: {
        '@type': 'QuantitativeValue',
        minValue: '',
        maxValue: ''
      }
    },
    datePosted: new Date().toISOString(),
    validThrough: getDefaultValidThrough()
  })

  useEffect(() => {
    onDataChange(formData)
  }, [formData, onDataChange])

  const handleChange = (path, value) => {
    const keys = path.split('.')
    const newData = JSON.parse(JSON.stringify(formData))
    let current = newData
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    setFormData(newData)
  }

  return (
    <form className="schema-form">
      <div className="form-field-group">
        <label className="field-label">Job Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Senior Software Engineer"
          className="form-input"
          required
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Job Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Detailed job description..."
          className="form-input"
          rows="5"
          required
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Employment Type</label>
        <select
          value={formData.employmentType}
          onChange={(e) => handleChange('employmentType', e.target.value)}
          className="form-input"
        >
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="CONTRACTOR">Contractor</option>
          <option value="TEMPORARY">Temporary</option>
          <option value="INTERN">Intern</option>
        </select>
      </div>

      <div className="form-section-header">Hiring Organization</div>

      <div className="form-field-group">
        <label className="field-label">Company Name *</label>
        <input
          type="text"
          value={formData.hiringOrganization.name}
          onChange={(e) => handleChange('hiringOrganization.name', e.target.value)}
          placeholder="Company name"
          className="form-input"
          required
        />
      </div>

      <div className="form-section-header">Job Location</div>

      <div className="form-field-group">
        <label className="field-label">Street Address</label>
        <input
          type="text"
          value={formData.jobLocation.address.streetAddress}
          onChange={(e) => handleChange('jobLocation.address.streetAddress', e.target.value)}
          placeholder="123 Main St"
          className="form-input"
        />
      </div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">City</label>
          <input
            type="text"
            value={formData.jobLocation.address.addressLocality}
            onChange={(e) => handleChange('jobLocation.address.addressLocality', e.target.value)}
            placeholder="New York"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">State</label>
          <input
            type="text"
            value={formData.jobLocation.address.addressRegion}
            onChange={(e) => handleChange('jobLocation.address.addressRegion', e.target.value)}
            placeholder="NY"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">Postal Code</label>
          <input
            type="text"
            value={formData.jobLocation.address.postalCode}
            onChange={(e) => handleChange('jobLocation.address.postalCode', e.target.value)}
            placeholder="10001"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">Country</label>
          <input
            type="text"
            value={formData.jobLocation.address.addressCountry}
            onChange={(e) => handleChange('jobLocation.address.addressCountry', e.target.value)}
            placeholder="US"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-section-header">Salary Information</div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">Currency</label>
          <input
            type="text"
            value={formData.baseSalary.currency}
            onChange={(e) => handleChange('baseSalary.currency', e.target.value)}
            placeholder="USD"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">Salary Frequency</label>
          <select
            className="form-input"
            defaultValue="YEAR"
          >
            <option value="HOUR">Per Hour</option>
            <option value="DAY">Per Day</option>
            <option value="WEEK">Per Week</option>
            <option value="MONTH">Per Month</option>
            <option value="YEAR">Per Year</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">Minimum Salary</label>
          <input
            type="number"
            value={formData.baseSalary.value.minValue}
            onChange={(e) => handleChange('baseSalary.value.minValue', e.target.value)}
            placeholder="50000"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">Maximum Salary</label>
          <input
            type="number"
            value={formData.baseSalary.value.maxValue}
            onChange={(e) => handleChange('baseSalary.value.maxValue', e.target.value)}
            placeholder="100000"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-section-header">Dates</div>

      <div className="form-row">
        <DateTimePicker
          label="Date Posted"
          value={formData.datePosted}
          onChange={(date) => handleChange('datePosted', date)}
          required={true}
          hint="When the job was posted"
        />
        <DateTimePicker
          label="Valid Until"
          value={formData.validThrough}
          onChange={(date) => handleChange('validThrough', date)}
          required={true}
          hint="Application deadline"
        />
      </div>
    </form>
  )
}

export default JobPostingSchema
