import './JSONLDViewer.css'

function JSONLDViewer({ data, onCopy, copied }) {
  const jsonLd = `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    onCopy()
  }

  return (
    <div className="json-viewer">
      <div className="viewer-header">
        <h3>📄 JSON-LD Output</h3>
        <div className="viewer-actions">
          <button
            className="btn btn-small"
            onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
            title="Copy JSON"
          >
            {copied ? '✓ Copied JSON' : 'Copy JSON'}
          </button>
          <button
            className="btn btn-small"
            onClick={() => copyToClipboard(jsonLd)}
            title="Copy Script Tag"
          >
            Copy Script
          </button>
        </div>
      </div>

      <div className="viewer-content">
        <div className="json-output">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>

        <div className="script-tag-section">
          <div className="section-title">HTML Implementation:</div>
          <div className="script-tag-output">
            <pre>{jsonLd}</pre>
          </div>
        </div>
      </div>

      <div className="viewer-footer">
        <p className="info-text">ℹ️ Add the above script tag to your HTML &lt;head&gt; section</p>
      </div>
    </div>
  )
}

export default JSONLDViewer
