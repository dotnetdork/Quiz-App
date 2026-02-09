/**
 * Learn Page Component
 * 
 * A comprehensive learning hub with mini-courses, structured content,
 * and interactive timeline for computer history.
 */
import { useState } from 'react';
import { learningModules } from '../data/learningData';
import './Learn.css';

/**
 * Category metadata for display
 */
const CATEGORIES = {
  python: { name: 'Python', icon: '🐍', color: '#3776ab' },
  java: { name: 'Java', icon: '☕', color: '#f89820' },
  technology: { name: 'Technology', icon: '🖥️', color: '#607d8b' },
  'computer-science': { name: 'Computer Science', icon: '🎓', color: '#9c27b0' }
};

/**
 * Timeline Component for Computer History
 */
function Timeline({ events }) {
  return (
    <div className="timeline">
      {events.map((event, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-marker">
            <span className="timeline-icon">{event.icon}</span>
          </div>
          <div className="timeline-content">
            <div className="timeline-year">{event.year}</div>
            <h4 className="timeline-title">{event.title}</h4>
            <p className="timeline-description">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Code Block Component with syntax highlighting styling
 */
function CodeBlock({ code, language }) {
  return (
    <pre className={`code-block language-${language || 'text'}`}>
      <code>{code}</code>
    </pre>
  );
}

/**
 * Mermaid Diagram Placeholder Component
 * Displays Mermaid code that can be rendered by external tools
 */
function MermaidDiagram({ code }) {
  return (
    <div className="mermaid-container">
      <div className="mermaid-label">📊 Diagram (Mermaid.js)</div>
      <pre className="mermaid-code">
        <code>{code}</code>
      </pre>
      <p className="mermaid-note">
        <em>Paste this code into <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer">mermaid.live</a> to view the diagram.</em>
      </p>
    </div>
  );
}

/**
 * Renders markdown-like content with code blocks
 */
function ContentRenderer({ content }) {
  // Split content into segments (text and code blocks)
  const segments = [];
  
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      });
    }
    // Add code block
    segments.push({
      type: 'code',
      language: match[1] || 'text',
      content: match[2].trim()
    });
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      content: content.slice(lastIndex)
    });
  }
  
  return (
    <div className="content-renderer">
      {segments.map((segment, index) => {
        if (segment.type === 'code') {
          return <CodeBlock key={index} code={segment.content} language={segment.language} />;
        }
        // Render text with basic markdown support
        return (
          <div 
            key={index} 
            className="text-content"
            dangerouslySetInnerHTML={{ 
              __html: renderMarkdown(segment.content) 
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * Simple markdown renderer
 */
function renderMarkdown(text) {
  return text
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

/**
 * Sidebar Table of Contents
 */
function TableOfContents({ module, activeSection, onSectionClick }) {
  return (
    <nav className="toc">
      <h3 className="toc-title">Contents</h3>
      <ul className="toc-list">
        {module.sections?.map((section) => (
          <li 
            key={section.id}
            className={`toc-item ${activeSection === section.id ? 'active' : ''}`}
          >
            <button onClick={() => onSectionClick(section.id)}>
              {section.title}
            </button>
          </li>
        ))}
        {module.isTimeline && (
          <li className={`toc-item ${activeSection === 'timeline' ? 'active' : ''}`}>
            <button onClick={() => onSectionClick('timeline')}>
              Interactive Timeline
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

/**
 * Module Card for grid display
 */
function ModuleCard({ module, onClick }) {
  return (
    <div 
      className="module-card"
      style={{ '--module-color': module.color }}
      onClick={onClick}
    >
      <div className="module-icon">{module.icon}</div>
      <h3 className="module-title">{module.title}</h3>
      <p className="module-description">{module.description}</p>
      <div className="module-meta">
        <span className="module-time">⏱️ {module.estimatedTime}</span>
        <span className="module-sections">📑 {module.sections?.length || 0} sections</span>
      </div>
    </div>
  );
}

/**
 * Module Content View
 */
function ModuleView({ module, onBack }) {
  const [activeSection, setActiveSection] = useState(module.sections?.[0]?.id || 'intro');
  
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  return (
    <div className="module-view">
      {/* Sidebar */}
      <aside className="module-sidebar">
        <button className="back-button" onClick={onBack}>
          ← Back to Modules
        </button>
        <TableOfContents 
          module={module} 
          activeSection={activeSection}
          onSectionClick={scrollToSection}
        />
      </aside>
      
      {/* Main Content */}
      <main className="module-content">
        <header className="module-header" style={{ '--module-color': module.color }}>
          <span className="module-header-icon">{module.icon}</span>
          <div>
            <h1>{module.title}</h1>
            <p>{module.description}</p>
          </div>
        </header>
        
        {/* Sections */}
        {module.sections?.map((section) => (
          <section 
            key={section.id} 
            id={`section-${section.id}`}
            className="content-section"
          >
            <h2 className="section-title">{section.title}</h2>
            <ContentRenderer content={section.content} />
            {section.mermaid && (
              <MermaidDiagram code={section.mermaid} />
            )}
          </section>
        ))}
        
        {/* Timeline for History module */}
        {module.isTimeline && module.timeline && (
          <section id="section-timeline" className="content-section">
            <h2 className="section-title">Interactive Timeline</h2>
            <Timeline events={module.timeline} />
          </section>
        )}
      </main>
    </div>
  );
}

/**
 * Main Learn Component
 */
function Learn() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Get unique categories
  const categories = [...new Set(learningModules.map(m => m.category))];
  
  // Filter modules by category
  const filteredModules = selectedCategory 
    ? learningModules.filter(m => m.category === selectedCategory)
    : learningModules;
  
  // Handle module selection
  const handleModuleClick = (module) => {
    setSelectedModule(module);
    window.scrollTo(0, 0);
  };
  
  // Handle back navigation
  const handleBack = () => {
    setSelectedModule(null);
  };
  
  // If a module is selected, show it
  if (selectedModule) {
    return (
      <div className="learn-page">
        <ModuleView module={selectedModule} onBack={handleBack} />
      </div>
    );
  }
  
  return (
    <div className="learn-page">
      <header className="learn-header">
        <h1>📚 Learn Hub</h1>
        <p>Comprehensive mini-courses to master programming and technology</p>
      </header>
      
      {/* Category Filter */}
      <div className="category-filter">
        <button 
          className={`filter-btn ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All Topics
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            style={{ '--cat-color': CATEGORIES[cat]?.color }}
            onClick={() => setSelectedCategory(cat)}
          >
            {CATEGORIES[cat]?.icon} {CATEGORIES[cat]?.name}
          </button>
        ))}
      </div>
      
      {/* Module Grid */}
      <div className="modules-grid">
        {filteredModules.map((module) => (
          <ModuleCard 
            key={module.id}
            module={module}
            onClick={() => handleModuleClick(module)}
          />
        ))}
      </div>
      
      {/* Info Footer */}
      <div className="learn-footer">
        <p>
          💡 <strong>Tip:</strong> Each module includes code examples, best practices, and common pitfalls to help you learn effectively!
        </p>
      </div>
    </div>
  );
}

export default Learn;
