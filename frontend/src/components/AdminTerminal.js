/**
 * AdminTerminal Component
 * 
 * An interactive terminal for admins to execute SQLite commands
 * and manage the database directly from the admin dashboard.
 * Uses xterm.js for terminal emulation and WebSocket for communication.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import './AdminTerminal.css';
import { API_URL } from '../api';

// Delay in ms for terminal fitting after DOM operations
// Required because xterm.js needs time to measure container dimensions
const TERMINAL_FIT_DELAY = 100;

function AdminTerminal() {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const wsRef = useRef(null);
  const inputBufferRef = useRef('');
  const [isConnected, setIsConnected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Connect to WebSocket
  const connect = useCallback(() => {
    // Build WebSocket URL based on API_URL
    let wsUrl;
    if (API_URL) {
      // Replace http(s):// with ws(s)://
      wsUrl = API_URL.replace(/^http/, 'ws') + '/api/admin/terminal';
    } else {
      // Same origin - construct from window.location
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${window.location.host}/api/admin/terminal`;
    }

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      if (xtermRef.current) {
        xtermRef.current.writeln('\r\n\x1b[32mConnected to Quiz App Admin Terminal\x1b[0m');
        xtermRef.current.writeln('Type \x1b[33mhelp\x1b[0m for available commands.\r\n');
        xtermRef.current.write('\x1b[36madmin>\x1b[0m ');
      }
    };

    ws.onmessage = (event) => {
      if (xtermRef.current) {
        // Parse the response
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            xtermRef.current.writeln('\x1b[31m' + data.error + '\x1b[0m');
          } else if (data.output) {
            xtermRef.current.write(data.output);
          }
        } catch (e) {
          // Plain text response - expected for non-JSON messages
          // This is normal behavior, not an error condition
          xtermRef.current.write(event.data);
        }
        xtermRef.current.write('\r\n\x1b[36madmin>\x1b[0m ');
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      if (xtermRef.current) {
        xtermRef.current.writeln('\r\n\x1b[31mDisconnected from server\x1b[0m');
      }
    };

    ws.onerror = () => {
      setIsConnected(false);
      if (xtermRef.current) {
        xtermRef.current.writeln('\r\n\x1b[31mConnection error\x1b[0m');
      }
    };
  }, []);

  // Initialize terminal
  useEffect(() => {
    if (terminalRef.current && !xtermRef.current) {
      // Create terminal instance with League-inspired theme
      const term = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: '"Source Code Pro", "Fira Code", monospace',
        theme: {
          background: '#1a1a2e',
          foreground: '#e0e0e0',
          cursor: '#ef6c00',
          cursorAccent: '#1a1a2e',
          selectionBackground: 'rgba(239, 108, 0, 0.3)',
          black: '#1a1a2e',
          red: '#ff6b6b',
          green: '#4ecdc4',
          yellow: '#ffd93d',
          blue: '#6bcaff',
          magenta: '#c678dd',
          cyan: '#56b6c2',
          white: '#e0e0e0',
          brightBlack: '#4a4a5a',
          brightRed: '#ff8787',
          brightGreen: '#6ee6dd',
          brightYellow: '#ffe666',
          brightBlue: '#8ed6ff',
          brightMagenta: '#d699e6',
          brightCyan: '#7bc8d1',
          brightWhite: '#ffffff'
        },
        rows: 15,
        scrollback: 1000
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      
      xtermRef.current = term;
      fitAddonRef.current = fitAddon;

      term.open(terminalRef.current);
      
      // Initial fit after a short delay to allow DOM measurements
      setTimeout(() => {
        fitAddon.fit();
      }, TERMINAL_FIT_DELAY);

      // Welcome message
      term.writeln('\x1b[33m╔════════════════════════════════════════════╗\x1b[0m');
      term.writeln('\x1b[33m║\x1b[0m  \x1b[1mQuiz App Admin Terminal\x1b[0m                   \x1b[33m║\x1b[0m');
      term.writeln('\x1b[33m╚════════════════════════════════════════════╝\x1b[0m');
      term.writeln('');
      term.writeln('Connecting to server...');

      // Handle keyboard input
      term.onData((data) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return;
        }

        // Handle special keys
        if (data === '\r') {
          // Enter pressed - send command
          term.write('\r\n');
          const command = inputBufferRef.current.trim();
          if (command) {
            wsRef.current.send(JSON.stringify({ command }));
          } else {
            term.write('\x1b[36madmin>\x1b[0m ');
          }
          inputBufferRef.current = '';
        } else if (data === '\x7f' || data === '\b') {
          // Backspace
          if (inputBufferRef.current.length > 0) {
            inputBufferRef.current = inputBufferRef.current.slice(0, -1);
            term.write('\b \b');
          }
        } else if (data === '\x03') {
          // Ctrl+C - cancel current input
          inputBufferRef.current = '';
          term.write('^C\r\n\x1b[36madmin>\x1b[0m ');
        } else if (data >= ' ' && data <= '~') {
          // Printable characters
          inputBufferRef.current += data;
          term.write(data);
        }
      });

      // Connect to WebSocket
      connect();

      // Handle window resize
      const handleResize = () => {
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (wsRef.current) {
          wsRef.current.close();
        }
        term.dispose();
      };
    }
  }, [connect]);

  // Reconnect function
  const reconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (xtermRef.current) {
      xtermRef.current.clear();
      xtermRef.current.writeln('Reconnecting...');
    }
    connect();
  };

  // Re-fit terminal when minimized state changes
  useEffect(() => {
    if (!isMinimized && fitAddonRef.current) {
      setTimeout(() => {
        fitAddonRef.current.fit();
      }, TERMINAL_FIT_DELAY);
    }
  }, [isMinimized]);

  return (
    <div className={`admin-terminal-container ${isMinimized ? 'minimized' : ''}`}>
      <div className="terminal-header">
        <div className="terminal-title">
          <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}></span>
          Admin Terminal
          <span className="terminal-subtitle">SQLite & Admin Commands</span>
        </div>
        <div className="terminal-controls">
          {!isConnected && (
            <button 
              className="terminal-btn reconnect"
              onClick={reconnect}
              title="Reconnect"
            >
              ↻
            </button>
          )}
          <button 
            className="terminal-btn minimize"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
        </div>
      </div>
      <div 
        className="terminal-body" 
        ref={terminalRef}
        style={{ display: isMinimized ? 'none' : 'block' }}
      ></div>
    </div>
  );
}

export default AdminTerminal;
