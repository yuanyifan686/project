@echo off
chcp 65001 > nul
setlocal

REM AI 智能体课程咨询网站 - 后端启动脚本
cd /d "%~dp0"

echo ==========================================
echo   AI 课程咨询 API 启动中...
echo   一体化访问: http://127.0.0.1:8000
echo   API 文档:   http://127.0.0.1:8000/docs
echo ==========================================

REM 检查虚拟环境
if not exist "venv\Scripts\python.exe" (
    echo [INFO] 未检测到虚拟环境，使用系统 Python
    set PYTHON=python
) else (
    echo [INFO] 使用虚拟环境
    set PYTHON=venv\Scripts\python.exe
)

REM 启动后端
%PYTHON% backend\app.py

endlocal
