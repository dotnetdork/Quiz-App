/**
 * ParsonsProblem Component
 * 
 * A drag-and-drop interface for reordering code blocks.
 * Uses @dnd-kit library for accessible drag and drop.
 */
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * SortableBlock - Individual draggable code block
 * 
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the block
 * @param {string} props.code - The code text to display
 * @param {number} props.position - Position number (1-based)
 * @param {boolean} props.syntaxHighlight - Whether to apply syntax highlighting
 */
function SortableBlock({ id, code, position, syntaxHighlight = true }) {
  // Set up sortable behavior from dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  // Apply transform styles when dragging
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`parsons-block ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      {/* Drag handle icon (using hamburger menu for better compatibility) */}
      <span className="drag-handle" aria-label="Drag handle">
        ☰
      </span>
      
      {/* Position number */}
      <span 
        style={{ 
          marginRight: '1rem',
          fontWeight: 'bold',
          color: 'var(--color-secondary)',
          flexShrink: 0
        }}
      >
        {position}.
      </span>
      
      {/* Code content with optional syntax highlighting */}
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        {syntaxHighlight ? (
          <SyntaxHighlighter
            language="python"
            style={oneLight}
            customStyle={{
              margin: 0,
              padding: 0,
              background: 'transparent',
              fontSize: 'var(--font-base)',
            }}
            codeTagProps={{
              style: {
                fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
              }
            }}
          >
            {code}
          </SyntaxHighlighter>
        ) : (
          <span style={{
            fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
            fontSize: 'var(--font-base)',
          }}>
            {code}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * ParsonsProblem - Main component for drag-and-drop code ordering
 * 
 * @param {Object} props
 * @param {Array} props.blocks - Array of code strings
 * @param {Array} props.order - Current order of block indices
 * @param {Function} props.onOrderChange - Callback when order changes
 * @param {boolean} props.syntaxHighlight - Whether to apply syntax highlighting (default: true)
 */
function ParsonsProblem({ blocks, order, onOrderChange, syntaxHighlight = true }) {
  // Set up sensors for mouse/touch and keyboard drag
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Handle drag end event
   * Updates the order when a block is dropped
   */
  function handleDragEnd(event) {
    const { active, over } = event;

    // If dropped on a different position
    if (over && active.id !== over.id) {
      // Find the indices in the current order
      const oldIndex = order.indexOf(parseInt(active.id));
      const newIndex = order.indexOf(parseInt(over.id));

      // Create new order and notify parent
      const newOrder = arrayMove(order, oldIndex, newIndex);
      onOrderChange(newOrder);
    }
  }

  // Create string IDs for dnd-kit (requires strings)
  const itemIds = order.map((index) => index.toString());

  return (
    <div className="parsons-container">
      {/* Instructions */}
      <p 
        className="text-secondary mb-sm"
        style={{ fontSize: 'var(--font-small)' }}
      >
        Drag and drop the code blocks to arrange them in the correct order.
      </p>

      {/* DnD Context wraps the sortable area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* Sortable context for vertical list */}
        <SortableContext
          items={itemIds}
          strategy={verticalListSortingStrategy}
        >
          {/* Render blocks in current order */}
          {order.map((blockIndex, position) => (
            <SortableBlock
              key={blockIndex}
              id={blockIndex.toString()}
              code={blocks[blockIndex]}
              position={position + 1}
              syntaxHighlight={syntaxHighlight}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default ParsonsProblem;
