@echo off
chcp 65001 > nul
setlocal

REM AI 智能体课程咨询网站 - 前端启动脚本
cd /d "%~dp0\frontend"

echo ==========================================
echo   AI 课程咨询前端启动中（开发模式）
echo   访问地址: http://127.0.0.1:8080
echo   提示: 也可仅运行 start_backend.bat 在 8000 端口一体化访问
echo ==========================================

REM 检查 Python
where python >nul 2>nul
if %errorlevel%==0 (
    python -m http.server 8080
) else (
    echo [ERROR] 未找到 Python，请先安装 Python 3.11+
    pause
)

endlocal
