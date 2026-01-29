import React, { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import SortableItem from './SortableItem'

function ParsonsProblem({ codeLines, onSubmit, result }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    // Shuffle the code lines initially
    const shuffled = [...codeLines].sort(() => Math.random() - 0.5)
    setItems(shuffled.map((line, index) => ({ id: `item-${index}`, content: line })))
  }, [codeLines])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSubmit = () => {
    const answer = items.map((item) => item.content)
    onSubmit(answer)
  }

  return (
    <div className="parsons-problem">
      <div className="code-container">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} content={item.content} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      
      <div className="actions">
        <button onClick={handleSubmit} className="btn btn-primary">
          Submit Answer
        </button>
      </div>

      {result && (
        <div className={`result ${result.is_correct ? 'correct' : 'incorrect'}`}>
          {result.message}
        </div>
      )}
    </div>
  )
}

export default ParsonsProblem
