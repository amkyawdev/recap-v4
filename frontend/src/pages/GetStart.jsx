import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function GetStart() {
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)
  const [recentProjects, setRecentProjects] = useState([])
  const [dragActive, setDragActive] = useState(false)

  const handleUpload = async (file) => {
    if (!file) return
    
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('user_session_id', 'default')
    
    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      navigate(`/editing/${data.project_id}`)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.type.startsWith('video/') || file.name.match(/\.(mp4|mov|webm)$/i))) {
      handleUpload(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => {
    setDragActive(false)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    handleUpload(file)
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          {/* Hero Section */}
          <div className="text-center mb-5 fade-in">
            <h1 className="display-4 fw-bold mb-2" style={{ fontFamily: 'Cloud AI Sans' }}>
              <i className="bi bi-camera-reels me-2"></i>
              Burme Movie Recap
            </h1>
            <p className="text-secondary">Create stunning recap videos with custom subtitles</p>
          </div>

          {/* Upload Area */}
          <div 
            className={`glass rounded-4 p-5 text-center mb-4 ${dragActive ? 'border-danger' : ''}`}
            style={{ 
              border: dragActive ? '2px dashed #ef4444' : '2px dashed rgba(255,255,255,0.1)',
              transition: 'border-color 0.2s'
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {isUploading ? (
              <div className="py-5">
                <div className="spinner-border text-danger mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Uploading video...</p>
              </div>
            ) : (
              <>
                <i className="bi bi-cloud-arrow-up display-1 text-secondary mb-3"></i>
                <h3 className="mb-3">Drop your video here</h3>
                <p className="text-secondary mb-4">Supports MP4, MOV, WebM</p>
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <i className="bi bi-folder2-open me-2"></i>
                  Choose File
                </button>
                <input
                  id="fileInput"
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </>
            )}
          </div>

          {/* Recent Projects */}
          {recentProjects.length > 0 && (
            <div className="glass rounded-4 p-4">
              <h4 className="mb-3">Recent Projects</h4>
              <div className="d-flex gap-3 overflow-auto pb-2">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex-shrink-0" style={{ width: '140px' }}>
                    <div className="bg-dark rounded-3 p-2">
                      <div className="bg-secondary rounded-2" style={{ height: '80px' }}></div>
                      <p className="small mt-2 mb-0 text-truncate">{project.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-5">
            <a href="/about" className="text-secondary text-decoration-none">
              About <i className="bi bi-info-circle ms-1"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GetStart