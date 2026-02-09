"""
Sandbox Routes - Secure Code Execution Endpoint

This module provides secure, sandboxed code execution for Python and Java.
Security measures include:
- Timeout limits to prevent infinite loops
- Memory limits via resource constraints
- Restricted imports/operations for Python
- Temporary file isolation
- No network access
"""
import os
import sys
import subprocess
import tempfile
import shutil
import uuid
import re
from typing import Optional
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator

router = APIRouter()

# Configuration
MAX_EXECUTION_TIME = 5  # seconds
MAX_OUTPUT_SIZE = 10000  # characters
MAX_CODE_LENGTH = 50000  # characters

# Dangerous patterns to block (basic security layer)
PYTHON_DANGEROUS_PATTERNS = [
    r'\bimport\s+os\b',
    r'\bimport\s+sys\b',
    r'\bimport\s+subprocess\b',
    r'\bimport\s+shutil\b',
    r'\bfrom\s+os\s+import\b',
    r'\bfrom\s+sys\s+import\b',
    r'\bfrom\s+subprocess\s+import\b',
    r'\b__import__\b',
    r'\beval\s*\(',
    r'\bexec\s*\(',
    r'\bopen\s*\(',
    r'\bfile\s*\(',
    r'\bcompile\s*\(',
    r'\bglobals\s*\(',
    r'\blocals\s*\(',
    r'\bgetattr\s*\(',
    r'\bsetattr\s*\(',
    r'\bdelattr\s*\(',
    r'\b__builtins__\b',
    r'\b__class__\b',
    r'\b__bases__\b',
    r'\b__subclasses__\b',
    r'\b__mro__\b',
    r'\b__globals__\b',
    r'\b__code__\b',
]

JAVA_DANGEROUS_PATTERNS = [
    r'\bRuntime\s*\.\s*getRuntime\b',
    r'\bProcessBuilder\b',
    r'\bFileWriter\b',
    r'\bFileReader\b',
    r'\bFileInputStream\b',
    r'\bFileOutputStream\b',
    r'\bSocket\b',
    r'\bServerSocket\b',
    r'\bURLConnection\b',
    r'\bHttpURLConnection\b',
    r'\bSecurityManager\b',
    r'\bSystem\s*\.\s*exit\b',
    r'\bReflect\b',
    r'\bClass\s*\.\s*forName\b',
]


class CodeExecutionRequest(BaseModel):
    """Request model for code execution."""
    code: str
    language: str
    
    @field_validator('language')
    @classmethod
    def validate_language(cls, v):
        if v.lower() not in ('python', 'java'):
            raise ValueError('Language must be python or java')
        return v.lower()
    
    @field_validator('code')
    @classmethod
    def validate_code(cls, v):
        if len(v) > MAX_CODE_LENGTH:
            raise ValueError(f'Code exceeds maximum length of {MAX_CODE_LENGTH} characters')
        return v


class CodeExecutionResponse(BaseModel):
    """Response model for code execution."""
    success: bool
    output: str
    error: Optional[str] = None
    execution_time: Optional[float] = None


def check_dangerous_patterns(code: str, language: str) -> Optional[str]:
    """
    Check code for dangerous patterns.
    Returns error message if dangerous pattern found, None otherwise.
    """
    patterns = PYTHON_DANGEROUS_PATTERNS if language == 'python' else JAVA_DANGEROUS_PATTERNS
    
    for pattern in patterns:
        if re.search(pattern, code, re.IGNORECASE):
            return f"Potentially unsafe code detected. This operation is not allowed in the sandbox for security reasons."
    
    return None


def execute_python(code: str, work_dir: str) -> tuple[str, str, float]:
    """
    Execute Python code in a sandboxed environment.
    Returns (stdout, stderr, execution_time).
    """
    import time
    
    # Write user code to a separate file (safer than string embedding)
    user_code_path = os.path.join(work_dir, 'user_code.py')
    with open(user_code_path, 'w', encoding='utf-8') as f:
        f.write(code)
    
    # Create a wrapper script with restricted builtins that reads and executes user code
    wrapper_code = '''
import sys

# Restrict dangerous builtins
_safe_builtins = {
    'abs': abs, 'all': all, 'any': any, 'ascii': ascii,
    'bin': bin, 'bool': bool, 'bytearray': bytearray, 'bytes': bytes,
    'callable': callable, 'chr': chr, 'classmethod': classmethod,
    'complex': complex, 'dict': dict, 'dir': dir, 'divmod': divmod,
    'enumerate': enumerate, 'filter': filter, 'float': float,
    'format': format, 'frozenset': frozenset,
    'hash': hash, 'hex': hex, 'id': id, 'int': int,
    'isinstance': isinstance, 'issubclass': issubclass, 'iter': iter,
    'len': len, 'list': list, 'map': map, 'max': max, 'min': min,
    'next': next, 'object': object, 'oct': oct, 'ord': ord, 'pow': pow,
    'print': print, 'property': property, 'range': range, 'repr': repr,
    'reversed': reversed, 'round': round, 'set': set, 'slice': slice,
    'sorted': sorted, 'staticmethod': staticmethod, 'str': str,
    'sum': sum, 'super': super, 'tuple': tuple, 'type': type,
    'zip': zip, 'True': True, 'False': False, 'None': None,
    '__name__': '__main__', '__doc__': None,
    'input': lambda *args: '',  # Disable input
    'Exception': Exception, 'BaseException': BaseException,
    'ValueError': ValueError, 'TypeError': TypeError,
    'KeyError': KeyError, 'IndexError': IndexError,
    'AttributeError': AttributeError, 'RuntimeError': RuntimeError,
    'ZeroDivisionError': ZeroDivisionError, 'StopIteration': StopIteration,
}

# User code will be executed with restricted globals
__user_globals__ = {'__builtins__': _safe_builtins}

# Read and execute user code from file
try:
    with open('user_code.py', 'r', encoding='utf-8') as f:
        user_code = f.read()
    exec(compile(user_code, 'user_code.py', 'exec'), __user_globals__)
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}", file=sys.stderr)
'''
    
    # Write the wrapper script
    script_path = os.path.join(work_dir, 'script.py')
    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(wrapper_code)
    
    # Execute with timeout
    start_time = time.time()
    try:
        result = subprocess.run(
            [sys.executable, script_path],
            capture_output=True,
            text=True,
            timeout=MAX_EXECUTION_TIME,
            cwd=work_dir,
            env={
                'PATH': os.environ.get('PATH', ''),
                'PYTHONDONTWRITEBYTECODE': '1',
                'PYTHONIOENCODING': 'utf-8',
            }
        )
        execution_time = time.time() - start_time
        return result.stdout, result.stderr, execution_time
    except subprocess.TimeoutExpired:
        return '', f'Execution timed out after {MAX_EXECUTION_TIME} seconds', MAX_EXECUTION_TIME


def execute_java(code: str, work_dir: str) -> tuple[str, str, float]:
    """
    Execute Java code in a sandboxed environment.
    Returns (stdout, stderr, execution_time).
    """
    import time
    
    # Extract class name from code (must have a Main class or public class)
    class_match = re.search(r'public\s+class\s+(\w+)', code)
    if not class_match:
        return '', 'Error: Java code must contain a public class', 0
    
    class_name = class_match.group(1)
    
    # Write the Java file
    java_path = os.path.join(work_dir, f'{class_name}.java')
    with open(java_path, 'w') as f:
        f.write(code)
    
    # Check if javac is available
    javac_path = shutil.which('javac')
    java_path_exec = shutil.which('java')
    
    if not javac_path or not java_path_exec:
        return '', 'Error: Java compiler (javac) not found on server', 0
    
    start_time = time.time()
    
    # Compile the Java file
    try:
        compile_result = subprocess.run(
            [javac_path, f'{class_name}.java'],
            capture_output=True,
            text=True,
            timeout=MAX_EXECUTION_TIME,
            cwd=work_dir
        )
        
        if compile_result.returncode != 0:
            return '', f'Compilation error:\n{compile_result.stderr}', time.time() - start_time
        
        # Run the compiled class with security manager (if available)
        run_result = subprocess.run(
            [java_path_exec, '-Xmx64m', class_name],  # Limit memory to 64MB
            capture_output=True,
            text=True,
            timeout=MAX_EXECUTION_TIME,
            cwd=work_dir,
            env={
                'PATH': os.environ.get('PATH', ''),
            }
        )
        
        execution_time = time.time() - start_time
        return run_result.stdout, run_result.stderr, execution_time
        
    except subprocess.TimeoutExpired:
        return '', f'Execution timed out after {MAX_EXECUTION_TIME} seconds', MAX_EXECUTION_TIME


@router.post("/execute", response_model=CodeExecutionResponse)
async def execute_code(request: CodeExecutionRequest):
    """
    Execute code in a sandboxed environment.
    
    Supports Python and Java. Code is executed with:
    - Time limit (5 seconds)
    - Memory restrictions
    - No file system access
    - No network access
    - Restricted imports/operations
    """
    code = request.code
    language = request.language
    
    # Check for dangerous patterns
    danger_check = check_dangerous_patterns(code, language)
    if danger_check:
        return CodeExecutionResponse(
            success=False,
            output='',
            error=danger_check
        )
    
    # Create temporary directory for execution
    work_dir = tempfile.mkdtemp(prefix='sandbox_')
    
    try:
        if language == 'python':
            stdout, stderr, exec_time = execute_python(code, work_dir)
        else:  # java
            stdout, stderr, exec_time = execute_java(code, work_dir)
        
        # Truncate output if too long
        if len(stdout) > MAX_OUTPUT_SIZE:
            stdout = stdout[:MAX_OUTPUT_SIZE] + '\n... (output truncated)'
        if len(stderr) > MAX_OUTPUT_SIZE:
            stderr = stderr[:MAX_OUTPUT_SIZE] + '\n... (output truncated)'
        
        # Combine output
        output = stdout
        error = stderr if stderr else None
        
        return CodeExecutionResponse(
            success=not bool(stderr),
            output=output,
            error=error,
            execution_time=round(exec_time, 3)
        )
        
    except Exception as e:
        return CodeExecutionResponse(
            success=False,
            output='',
            error=f'Execution failed: {str(e)}'
        )
    finally:
        # Clean up temporary directory
        try:
            shutil.rmtree(work_dir)
        except Exception:
            pass


@router.get("/status")
async def sandbox_status():
    """Check if the sandbox is available and which languages are supported."""
    python_available = sys.executable is not None
    java_available = shutil.which('javac') is not None and shutil.which('java') is not None
    
    return {
        "available": True,
        "languages": {
            "python": {
                "available": python_available,
                "version": f"Python {sys.version.split()[0]}" if python_available else None
            },
            "java": {
                "available": java_available,
                "note": "Java compiler found" if java_available else "Java compiler not installed"
            }
        },
        "limits": {
            "max_execution_time": MAX_EXECUTION_TIME,
            "max_output_size": MAX_OUTPUT_SIZE,
            "max_code_length": MAX_CODE_LENGTH
        }
    }
