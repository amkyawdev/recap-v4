import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function Render() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('pending')
  const [progress, setProgress] = useState(0)
  const [statusLog, setStatusLog] = useState([])
  const [outputPath, setOutputPath] = useState('')

  useEffect(() => {
    if (projectId) {
      startRender()
      pollStatus()
    }
  }, [projectId])

  const startRender = async () => {
    addLog('Starting render...')
    setStatus('processing')
    
    try {
      const response = await fetch(`${API_URL}/api/render/${projectId}`, {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.status === 'done') {
        setStatus('done')
        setProgress(100)
        setOutputPath(data.output_path)
        addLog('Render complete!')
        addLog('Video ready for download')
      }
    } catch (error) {
      setStatus('failed')
      addLog(`Error: ${error.message}`)
    }
  }

  const pollStatus = async () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/api/render/status/${projectId}`)
        const data = await response.json()
        
        if (data.status === 'done') {
          setStatus('done')
          setProgress(100)
          setOutputPath(data.output_path)
          addLog('Render complete!')
          clearInterval(interval)
        } else if (data.status === 'failed') {
          setStatus('failed')
          addLog('Render failed')
          clearInterval(interval)
        }
      } catch (error) {
        console.error('Status check failed:', error)
      }
    }, 2000)
  }

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString()
    setStatusLog(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const handleDownload = async () => {
    if (!outputPath) return
    
    const filename = outputPath.split('/').pop()
    window.open(`${API_URL}/api/download/${filename}`, '_blank')
  }

  const handleShare = async () => {
    if (outputPath) {
      const filename = outputPath.split('/').pop()
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Burme Movie Recap',
            text: 'Check out my recap video!',
            url: `${API_URL}/api/download/${filename}`
          })
        } catch (error) {
          console.log('Share cancelled')
        }
      } else {
        navigator.clipboard.writeText(`${API_URL}/api/download/${filename}`)
        alert('Link copied to clipboard!')
      }
    }
  }

  const handleCancel = () => {
    navigate(`/editing/${projectId}`)
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="glass rounded-4 p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button className="btn btn-link text-light text-decoration-none" onClick={() => navigate(`/editing/${projectId}`)}>
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </button>
              <h4 className="mb-0">Rendering</h4>
              <div></div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="progress-bar" style={{ height: '16px' }}>
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span className="text-danger fw-bold">{progress}%</span>
              </div>
            </div>

            {/* Status Log */}
            <div className="bg-dark rounded-3 p-3 mb-4" style={{ maxHeight: '200px', overflow: 'auto' }}>
              {statusLog.map((log, index) => (
                <p key={index} className="mb-1 small">{log}</p>
              ))}
            </div>

            {/* Cancel Button */}
            {status === 'processing' && (
              <button 
                className="btn btn-outline-light w-100 mb-4"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

            {/* After Completion */}
            {status === 'done' && (
              <div className="mt-4">
                <hr className="border-secondary" />
                <h5 className="text-center mb-3">When Complete:</h5>
                
                <div className="d-flex gap-3 justify-content-center">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={handleDownload}
                  >
                    <i className="bi bi-download me-2"></i>
                    Download
                  </button>
                  <button 
                    className="btn btn-outline-light btn-lg"
                    onClick={handleShare}
                  >
                    <i className="bi bi-share me-2"></i>
                    Share
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {status === 'failed' && (
              <div className="text-center">
                <i className="bi bi-exclamation-triangle display-1 text-danger mb-3"></i>
                <p className="text-danger">Render failed. Please try again.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate(`/editing/${projectId}`)}
                >
                  Back to Editor
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Render