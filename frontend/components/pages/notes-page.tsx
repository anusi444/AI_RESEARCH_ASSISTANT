"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Download, Plus, Edit3, Trash2 } from "lucide-react"
import { notesApi } from "@/lib/api"

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Load notes from API
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await notesApi.getAllNotes();
        setNotes(fetchedNotes.map((note: any) => ({
          ...note,
          id: note._id,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        })));
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      }
    };
    fetchNotes();
  }, [])

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return

    try {
      if (currentNote) {
        // Update existing note
        const updatedNote = await notesApi.updateNote(currentNote.id, { title, content });
        const updatedNotes = notes.map((note) =>
          note.id === currentNote.id ? { ...updatedNote, id: updatedNote._id } : note,
        );
        setNotes(updatedNotes);
        setCurrentNote({ ...updatedNote, id: updatedNote._id });
      } else {
        // Create new note
        const newNote = await notesApi.createNote({ title, content });
        const noteWithId = { ...newNote, id: newNote._id };
        setNotes([noteWithId, ...notes]);
        setCurrentNote(noteWithId);
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      return;
    }

    setIsEditing(false)
  }

  const handleNewNote = () => {
    setCurrentNote(null)
    setTitle("")
    setContent("")
    setIsEditing(true)
  }

  const handleEditNote = (note: Note) => {
    setCurrentNote(note)
    setTitle(note.title)
    setContent(note.content)
    setIsEditing(true)
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      await notesApi.deleteNote(noteId);
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
      if (currentNote?.id === noteId) {
        setCurrentNote(null);
        setTitle("");
        setContent("");
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  }

  const handleExport = () => {
    if (!currentNote) return

    const blob = new Blob([`# ${currentNote.title}\n\n${currentNote.content}`], {
      type: "text/markdown",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentNote.title}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen p-4 pt-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-light-mint/20 to-light-aqua/20 border border-light-mint/30 dark:border-light-aqua/30">
            <Edit3 className="w-4 h-4 text-light-mint dark:text-light-aqua" />
            <span className="text-sm font-medium text-light-mint dark:text-light-aqua">Notes</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Research Notes
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes List */}
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/30 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Notes</CardTitle>
                <Button
                  onClick={handleNewNote}
                  size="sm"
                  className="rounded-xl bg-gradient-to-r from-light-aqua to-dark-teal hover:from-light-aqua/90 hover:to-dark-teal/90"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No notes yet. Create your first note!
                  </p>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
                        currentNote?.id === note.id
                          ? "bg-medium-aqua/10 dark:bg-medium-aqua/20 border-medium-aqua/50 dark:border-medium-aqua"
                          : "bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/70"
                      }`}
                      onClick={() => handleEditNote(note)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{note.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {note.updatedAt instanceof Date
                              ? note.updatedAt.toLocaleDateString()
                              : new Date(note.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteNote(note.id)
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/30 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{isEditing ? (currentNote ? "Edit Note" : "New Note") : "Note Viewer"}</CardTitle>
                <div className="flex gap-2">
                  {currentNote && !isEditing && (
                    <Button onClick={handleExport} variant="outline" size="sm" className="rounded-xl bg-transparent">
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                  {!isEditing && currentNote && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="rounded-xl">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Note title..."
                      className="rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50"
                    />
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Start writing your note..."
                      className="min-h-[400px] rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        disabled={!title.trim() || !content.trim()}
                        className="rounded-xl bg-gradient-to-r from-light-aqua to-dark-teal hover:from-light-aqua/90 hover:to-dark-teal/90"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Note
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false)
                          if (currentNote) {
                            setTitle(currentNote.title)
                            setContent(currentNote.content)
                          } else {
                            setTitle("")
                            setContent("")
                          }
                        }}
                        variant="outline"
                        className="rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : currentNote ? (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">{currentNote.title}</h2>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                        {currentNote.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    <Edit3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Select a note to view or create a new one</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
