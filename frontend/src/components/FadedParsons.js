/**
 * FadedParsons Component
 * 
 * A variant of Parsons problems where some lines are fixed/faded
 * and users only arrange the remaining blocks.
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
 * FixedBlock - Non-draggable faded code block
 */
function FixedBlock({ code, position, syntaxHighlight = true }) {
  return (
    <div
      className="parsons-block fixed-block"
      style={{
        opacity: 0.5,
        backgroundColor: '#e0e0e0',
        cursor: 'default'
      }}
    >
      {/* No drag handle for fixed blocks */}
      <span style={{ 
        marginRight: '1rem',
        fontWeight: 'bold',
        color: 'var(--color-secondary)',
        marginLeft: '1.5rem',
        flexShrink: 0
      }}>
        {position}.
      </span>
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
 * SortableBlock - Individual draggable code block
 */
function SortableBlock({ id, code, position, syntaxHighlight = true }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

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
      <span className="drag-handle" aria-label="Drag handle">
        ☰
      </span>
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
 * FadedParsons - Main component
 * 
 * @param {Object} props
 * @param {Array} props.blocks - Array of all code strings
 * @param {Array} props.fixedIndices - Array of indices for fixed (non-draggable) blocks
 * @param {Array} props.order - Current order of movable block indices
 * @param {Function} props.onOrderChange - Callback when order changes
 * @param {boolean} props.syntaxHighlight - Whether to apply syntax highlighting (default: true)
 */
function FadedParsons({ blocks, fixedIndices = [], order, onOrderChange, syntaxHighlight = true }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = order.indexOf(parseInt(active.id));
      const newIndex = order.indexOf(parseInt(over.id));

      const newOrder = arrayMove(order, oldIndex, newIndex);
      onOrderChange(newOrder);
    }
  }

  // Combine fixed and movable blocks into a single display array
  const allBlocks = [];
  let movableIdx = 0;
  
  for (let i = 0; i < blocks.length; i++) {
    if (fixedIndices.includes(i)) {
      allBlocks.push({ type: 'fixed', index: i });
    } else {
      allBlocks.push({ type: 'movable', index: order[movableIdx] });
      movableIdx++;
    }
  }

  const itemIds = order.map((index) => index.toString());

  return (
    <div className="parsons-container">
      <p 
        className="text-secondary mb-sm"
        style={{ fontSize: 'var(--font-small)' }}
      >
        Drag and drop the blocks to complete the code. Faded lines are already in the correct position.
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={itemIds}
          strategy={verticalListSortingStrategy}
        >
          {allBlocks.map((block, position) => {
            if (block.type === 'fixed') {
              return (
                <FixedBlock
                  key={`fixed-${block.index}`}
                  code={blocks[block.index]}
                  position={position + 1}
                  syntaxHighlight={syntaxHighlight}
                />
              );
            } else {
              return (
                <SortableBlock
                  key={block.index}
                  id={block.index.toString()}
                  code={blocks[block.index]}
                  position={position + 1}
                  syntaxHighlight={syntaxHighlight}
                />
              );
            }
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default FadedParsons;
