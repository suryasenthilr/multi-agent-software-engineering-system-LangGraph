import pathlib
import subprocess
from typing import Tuple

from langchain_core.tools import tool

PROJECT_ROOT = pathlib.Path.cwd() / "generated_project"


def safe_path_for_project(path: str) -> pathlib.Path:
    project_root = PROJECT_ROOT.resolve()
    p = (project_root / path).resolve()

    try:
        p.relative_to(project_root)
    except ValueError:
        raise ValueError("Attempt to access outside project root")

    return p


@tool
def write_file(path: str, content: str) -> str:
    """
    TOOL NAME: write_file

    Use this tool to create or overwrite a file inside the generated project.

    Arguments:
    - path: relative path inside the generated project
    - content: complete file contents

    When updating a file, write the FULL file content.

    Never attempt to write outside the generated project.

    Call this tool using the exact name: write_file.
    """
    """Writes content to a file at the specified path within the project root."""
    p = safe_path_for_project(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)
    return f"WROTE:{p}"


@tool
def read_file(path: str) -> str:
    
    """
    TOOL NAME: read_file

    Use this tool to read an existing file from the generated project.

    Arguments:
    - path: relative path inside the generated project

    Use this tool whenever you need to inspect source code.

    Never attempt to read files outside the generated project.

    Call this tool using the exact name: read_file.
    """
    p = safe_path_for_project(path)
    if not p.exists():
        return ""
    with open(p, "r", encoding="utf-8") as f:
        return f.read()


@tool
def get_current_directory() -> str:
    """
    TOOL NAME: get_current_directory

    Returns the root directory of the generated project.

    Use this tool to discover the project root before creating files.

    Call this tool using the exact name: get_current_directory.
    """
    return str(PROJECT_ROOT)


@tool
def list_files(directory: str = ".") -> str:
    """
    TOOL NAME: list_files

    Lists files located inside the generated project.

    Arguments:
    - directory: relative directory path inside the generated project

    Valid examples:
    - "."
    - "src"
    - "components"

    Invalid examples:
    - "/"
    - "C:\\"
    - "../"

    Use this tool whenever you need to discover project files.

    Never attempt to access locations outside the generated project.

    Call this tool using the exact name: list_files.
    """
    p = safe_path_for_project(directory)
    if not p.is_dir():
        return f"ERROR: {p} is not a directory"
    files = [str(f.relative_to(PROJECT_ROOT)) for f in p.glob("**/*") if f.is_file()]
    return "\n".join(files) if files else "No files found."

@tool
def run_cmd(cmd: str, cwd: str = None, timeout: int = 30) -> Tuple[int, str, str]:
    """
    TOOL NAME: run_cmd

    Executes a shell command inside the generated project.

    Arguments:
    - cmd: command to execute
    - cwd: relative directory inside the generated project
    - timeout: maximum execution time in seconds

    Use this tool for:
    - npm install
    - npm run build
    - python scripts
    - testing

    Never attempt to execute commands outside the generated project.

    Call this tool using the exact name: run_cmd.
    """
    cwd_dir = safe_path_for_project(cwd) if cwd else PROJECT_ROOT
    res = subprocess.run(cmd, shell=True, cwd=str(cwd_dir), capture_output=True, text=True, timeout=timeout)
    return res.returncode, res.stdout, res.stderr


def init_project_root():
    PROJECT_ROOT.mkdir(parents=True, exist_ok=True)
    return str(PROJECT_ROOT)