import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function Editing() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [videoSrc, setVideoSrc] = useState('')
  const [srtContent, setSrtContent] = useState('')
  const [fontFamily, setFontFamily] = useState('Cloud AI Sans')
  const [fontColor, setFontColor] = useState('#FFFFFF')
  const [fontSize, setFontSize] = useState(24)
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.5)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (projectId) {
      setVideoSrc(`${API_URL}/api/projects/${projectId}/video`)
      loadSubtitle()
    }
  }, [projectId])

  const loadSubtitle = async () => {
    try {
      const response = await fetch(`${API_URL}/api/subtitle/${projectId}`)
      const data = await response.json()
      setSrtContent(data.srt_content || '')
      setFontFamily(data.font_family)
      setFontColor(data.font_color)
      setFontSize(data.font_size)
      setBackgroundOpacity(data.background_opacity)
    } catch (error) {
      console.error('Failed to load subtitle:', error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await fetch(`${API_URL}/api/subtitle/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          srt_content: srtContent,
          font_family: fontFamily,
          font_color: fontColor,
          font_size: fontSize,
          background_opacity: backgroundOpacity
        })
      })
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleRender = () => {
    navigate(`/render/${projectId}`)
  }

  const togglePlay = () => {
    const video = document.getElementById('videoPlayer')
    if (video) {
      if (isPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    const video = document.getElementById('videoPlayer')
    if (video) {
      setCurrentTime(video.currentTime)
    }
  }

  return (
    <div className="container-fluid py-3">
      <div className="row g-0">
        {/* Desktop Layout - Two Columns */}
        <div className="col-lg-6 col-md-12 mb-3 mb-lg-0">
          <div className="glass rounded-4 p-3 h-100">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <button className="btn btn-link text-light text-decoration-none" onClick={() => navigate('/')}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Back
                </button>
              </div>
              <h5 className="mb-0">Editing</h5>
              <button 
                className="btn btn-primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                <i className="bi bi-save me-2"></i>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>

            {/* Video Player */}
            <div className="position-relative rounded-3 overflow-hidden" style={{ background: '#000' }}>
              <video
                id="videoPlayer"
                className="w-100"
                src={videoSrc}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Subtitle Preview Overlay */}
              <div 
                className="position-absolute w-100 text-center"
                style={{ 
                  bottom: '20%',
                  left: 0,
                  right: 0,
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}px`,
                  color: fontColor,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  pointerEvents: 'none'
                }}
              >
                <span 
                  className="px-2 py-1 rounded"
                  style={{ 
                    background: `rgba(0,0,0,${backgroundOpacity})` 
                  }}
                >
                  Subtitle Preview
                </span>
              </div>

              {/* Play/Pause Button */}
              <button
                className="btn btn-light rounded-circle position-absolute"
                style={{ 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  width: '60px',
                  height: '60px',
                  opacity: 0.9
                }}
                onClick={togglePlay}
              >
                <i className={`bi bi-${isPlaying ? 'pause-fill' : 'play-fill'} fs-4`}></i>
              </button>
            </div>

            {/* Video Controls */}
            <div className="mt-3">
              <div className="progress-bar mb-2">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(currentTime / (document.getElementById('videoPlayer')?.duration || 1)) * 100}%` }}
                ></div>
              </div>
              <div className="d-flex justify-content-between text-secondary small">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(document.getElementById('videoPlayer')?.duration || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Settings */}
        <div className="col-lg-6 col-md-12">
          <div className="glass rounded-4 p-4">
            <h4 className="mb-4">Subtitle Editor</h4>
            
            {/* SRT Content */}
            <div className="mb-4">
              <label className="form-label text-secondary">SRT Content</label>
              <textarea
                className="input-glass w-100"
                rows={6}
                value={srtContent}
                onChange={(e) => setSrtContent(e.target.value)}
                placeholder="1
00:00:01,000 --> 00:00:03,000
Hello world

2
00:00:04,000 --> 00:00:06,000
Welcome to my video"
              ></textarea>
            </div>

            {/* Font Selector */}
            <div className="mb-3">
              <label className="form-label text-secondary">Font</label>
              <select 
                className="input-glass w-100"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option value="Cloud AI Sans">Cloud AI Sans</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Inter">Inter</option>
              </select>
            </div>

            {/* Color Picker */}
            <div className="mb-3">
              <label className="form-label text-secondary">Font Color</label>
              <div className="d-flex gap-2 align-items-center">
                <input 
                  type="color" 
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="form-control form-control-color"
                  style={{ width: '50px', height: '40px', padding: 0 }}
                />
                <div className="d-flex gap-2">
                  {['#FFFFFF', '#FF4444', '#FFFF00', '#00FF00', '#00FFFF'].map(color => (
                    <button
                      key={color}
                      className={`btn btn-sm rounded-circle ${fontColor === color ? 'border border-2 border-light' : ''}`}
                      style={{ width: '32px', height: '32px', background: color }}
                      onClick={() => setFontColor(color)}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

            {/* Font Size */}
            <div className="mb-3">
              <label className="form-label text-secondary">Font Size: {fontSize}px</label>
              <input 
                type="range" 
                className="form-range"
                min="12"
                max="48"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
              />
            </div>

            {/* Background Opacity */}
            <div className="mb-4">
              <label className="form-label text-secondary">Background Opacity: {Math.round(backgroundOpacity * 100)}%</label>
              <input 
                type="range" 
                className="form-range"
                min="0"
                max="1"
                step="0.1"
                value={backgroundOpacity}
                onChange={(e) => setBackgroundOpacity(parseFloat(e.target.value))}
              />
            </div>

            {/* Render Button */}
            <button 
              className="btn btn-primary w-100 btn-lg"
              onClick={handleRender}
            >
              <i className="bi bi-play-circle me-2"></i>
              Render Video
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default Editing