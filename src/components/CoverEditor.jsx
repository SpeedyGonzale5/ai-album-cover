'use client'

import { useState, useRef } from 'react'
import { editAlbumCover } from '../lib/geminiImageGenerator'
import Modal from './Modal'

export default function CoverEditor({ cover, analysis, onComplete, onCancel }) {
  const [editInstruction, setEditInstruction] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editedImageUrl, setEditedImageUrl] = useState(cover.previewUrl)
  const [editHistory, setEditHistory] = useState([cover.previewUrl])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0)
  const [error, setError] = useState(null)
  const textareaRef = useRef(null)

  const handleEdit = async () => {
    if (!editInstruction.trim()) return

    setIsEditing(true)
    setError(null)

    try {
      const editedImage = await editAlbumCover(
        editedImageUrl,
        editInstruction,
        analysis
      )
      
      // Add to history
      const newHistory = [...editHistory.slice(0, currentHistoryIndex + 1), editedImage]
      setEditHistory(newHistory)
      setCurrentHistoryIndex(newHistory.length - 1)
      setEditedImageUrl(editedImage)
      setEditInstruction('')
    } catch (error) {
      console.error('Edit failed:', error)
      setError(error.message)
    } finally {
      setIsEditing(false)
    }
  }

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1
      setCurrentHistoryIndex(newIndex)
      setEditedImageUrl(editHistory[newIndex])
    }
  }

  const handleRedo = () => {
    if (currentHistoryIndex < editHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1
      setCurrentHistoryIndex(newIndex)
      setEditedImageUrl(editHistory[newIndex])
    }
  }

  const handleComplete = () => {
    const editedCover = {
      ...cover,
      previewUrl: editedImageUrl,
      downloadUrl: editedImageUrl,
      style: `${cover.style} (Edited)`,
      description: `${cover.description} - Custom edited version`
    }
    onComplete(editedCover)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleEdit()
    }
  }

  const suggestedEdits = [
    "Make the background darker and more moody",
    "Add more vibrant colors",
    "Make it more minimalist with cleaner lines",
    "Add text with the artist name 'Artist Name'",
    "Change the style to be more vintage and retro",
    "Make it more abstract and artistic",
    "Add geometric patterns",
    "Make the composition more dynamic"
  ]

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-black mb-2">Edit Album Cover</h2>
          <p className="text-gray-600">Make changes to your AI-generated album cover</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Preview */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
              {isEditing ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 mb-4"></div>
                    <p className="text-gray-600">Editing your cover...</p>
                    <p className="text-sm text-gray-500 mt-1">This may take a moment</p>
                  </div>
                </div>
              ) : (
                <img 
                  src={editedImageUrl}
                  alt="Album cover being edited"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* History Controls */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={handleUndo}
                  disabled={currentHistoryIndex === 0}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-colors"
                >
                  ↶ Undo
                </button>
                <button
                  onClick={handleRedo}
                  disabled={currentHistoryIndex === editHistory.length - 1}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-colors"
                >
                  ↷ Redo
                </button>
              </div>
              <span className="text-sm text-gray-500">
                Version {currentHistoryIndex + 1} of {editHistory.length}
              </span>
            </div>
          </div>

          {/* Editing Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your edit
              </label>
              <textarea
                ref={textareaRef}
                value={editInstruction}
                onChange={(e) => setEditInstruction(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 'Make the background darker', 'Add the text ALBUM NAME', 'Change colors to warmer tones'..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isEditing}
              />
              <p className="text-xs text-gray-500 mt-1">
                Press Cmd/Ctrl + Enter to apply edit
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Suggested Edits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick suggestions
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedEdits.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setEditInstruction(suggestion)}
                    disabled={isEditing}
                    className="p-2 text-sm text-left bg-gray-50 hover:bg-gray-100 disabled:bg-gray-25 rounded-lg transition-colors text-gray-700 hover:text-gray-900"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleEdit}
                disabled={!editInstruction.trim() || isEditing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {isEditing ? 'Editing...' : 'Apply Edit'}
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleComplete}
                  disabled={isEditing}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={onCancel}
                  disabled={isEditing}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Music Context Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <h4 className="font-medium text-blue-900 mb-2">Music Context</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Genre:</strong> {analysis.genre?.join(', ') || 'Unknown'}</p>
            <p><strong>Mood:</strong> {analysis.mood || 'Unknown'}</p>
            <p><strong>Vibe:</strong> {analysis.vibe || 'Unknown'}</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}