import { useState, useEffect } from 'react'
import '../SchemaForm.css'
import DateTimePicker from '../DateTimePicker'

function EventSchema({ onDataChange }) {
  const [formData, setFormData] = useState({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: '',
    description: '',
    image: '',
    url: '',
    startDate: '',
    endDate: '',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    organizer: {
      '@type': 'Organization',
      name: '',
      url: ''
    },
    location: {
      '@type': 'Place',
      name: '',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '',
        addressLocality: '',
        addressRegion: '',
        postalCode: '',
        addressCountry: ''
      }
    },
    offers: {
      '@type': 'Offer',
      url: '',
      price: '',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
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
        <label className="field-label">Event Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Event name"
          className="form-input"
          required
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Event description..."
          className="form-input"
          rows="4"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Event Image URL</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="https://example.com/event.jpg"
          className="form-input"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Event URL</label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="https://example.com/event"
          className="form-input"
        />
      </div>

      <div className="form-section-header">Event Schedule</div>

      <div className="form-row">
        <DateTimePicker
          label="Start Date"
          value={formData.startDate}
          onChange={(date) => handleChange('startDate', date)}
          required={true}
          hint="Event start time"
        />
        <DateTimePicker
          label="End Date"
          value={formData.endDate}
          onChange={(date) => handleChange('endDate', date)}
          required={true}
          hint="Event end time"
        />
      </div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">Event Status</label>
          <select
            value={formData.eventStatus}
            onChange={(e) => handleChange('eventStatus', e.target.value)}
            className="form-input"
          >
            <option value="https://schema.org/EventScheduled">Scheduled</option>
            <option value="https://schema.org/EventCancelled">Cancelled</option>
            <option value="https://schema.org/EventPostponed">Postponed</option>
            <option value="https://schema.org/EventRescheduled">Rescheduled</option>
          </select>
        </div>
        <div className="form-field-group">
          <label className="field-label">Attendance Mode</label>
          <select
            value={formData.eventAttendanceMode}
            onChange={(e) => handleChange('eventAttendanceMode', e.target.value)}
            className="form-input"
          >
            <option value="https://schema.org/OfflineEventAttendanceMode">In-Person</option>
            <option value="https://schema.org/OnlineEventAttendanceMode">Online</option>
            <option value="https://schema.org/MixedEventAttendanceMode">Hybrid</option>
          </select>
        </div>
      </div>

      <div className="form-section-header">Organizer</div>

      <div className="form-field-group">
        <label className="field-label">Organizer Name</label>
        <input
          type="text"
          value={formData.organizer.name}
          onChange={(e) => handleChange('organizer.name', e.target.value)}
          placeholder="Organization name"
          className="form-input"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Organizer URL</label>
        <input
          type="url"
          value={formData.organizer.url}
          onChange={(e) => handleChange('organizer.url', e.target.value)}
          placeholder="https://example.com"
          className="form-input"
        />
      </div>

      <div className="form-section-header">Location</div>

      <div className="form-field-group">
        <label className="field-label">Venue Name</label>
        <input
          type="text"
          value={formData.location.name}
          onChange={(e) => handleChange('location.name', e.target.value)}
          placeholder="Venue name"
          className="form-input"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Street Address</label>
        <input
          type="text"
          value={formData.location.address.streetAddress}
          onChange={(e) => handleChange('location.address.streetAddress', e.target.value)}
          placeholder="123 Main St"
          className="form-input"
        />
      </div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">City</label>
          <input
            type="text"
            value={formData.location.address.addressLocality}
            onChange={(e) => handleChange('location.address.addressLocality', e.target.value)}
            placeholder="New York"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">State</label>
          <input
            type="text"
            value={formData.location.address.addressRegion}
            onChange={(e) => handleChange('location.address.addressRegion', e.target.value)}
            placeholder="NY"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-section-header">Ticket Information</div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">Ticket Price</label>
          <input
            type="number"
            step="0.01"
            value={formData.offers.price}
            onChange={(e) => handleChange('offers.price', e.target.value)}
            placeholder="99.99"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">Currency</label>
          <input
            type="text"
            value={formData.offers.priceCurrency}
            onChange={(e) => handleChange('offers.priceCurrency', e.target.value)}
            placeholder="USD"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-field-group">
        <label className="field-label">Ticket URL</label>
        <input
          type="url"
          value={formData.offers.url}
          onChange={(e) => handleChange('offers.url', e.target.value)}
          placeholder="https://example.com/tickets"
          className="form-input"
        />
      </div>
    </form>
  )
}

export default EventSchema
