# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a hackathon project showcasing NVIDIA NeMo Agent Toolkit (AIQ) functionality through an AI chatbot. The system consists of:

- **Backend**: NVIDIA NeMo Agent Toolkit with React Agent workflow
- **Frontend**: Next.js UI adapted from official NVIDIA AIQ UI
- **Tools**: Tavily search integration and datetime utilities
- **Architecture**: Full-stack AI agent system with OpenAI-compatible API support

## Common Development Commands

### Environment Setup
```bash
# Initial setup (Linux/macOS)
chmod +x install.sh
./install.sh

# Windows setup
install.bat
```

### Backend Development
```bash
# Navigate to NeMo toolkit directory
cd NeMo-Agent-Toolkit

# Activate virtual environment
source .venv/bin/activate

# Start development server
aiq serve --config_file configs/hackathon_config.yml --host 0.0.0.0 --port 8001

# Start with verbose logging
aiq serve --config_file configs/hackathon_config.yml --verbose

# Run on different port
aiq serve --config_file configs/hackathon_config.yml --port 8002
```

### Frontend Development
```bash
# Navigate to frontend
cd external/aiqtoolkit-opensource-ui

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

### Testing
```bash
# Run Python tests
pytest packages/*/tests/

# Run specific test file
pytest packages/aiqtoolkit_agno/tests/test_llm.py

# Run frontend tests
cd external/aiqtoolkit-opensource-ui
npm test

# Run with coverage
npm run coverage
```

### Development Scripts
```bash
# Start both services
cd NeMo-Agent-Toolkit && ./start.sh

# Stop services
cd NeMo-Agent-Toolkit && ./stop.sh

# Check service health
curl http://localhost:8001/health
```

### Code Quality
```bash
# Python linting
pylint src/
flake8 src/

# Python formatting
yapf --in-place --recursive src/

# Import sorting
isort src/

# Type checking
pyright src/
```

## High-Level Architecture

### Core Components

**AIQ Toolkit Structure:**
- `src/aiq/`: Core AIQ toolkit implementation
  - `cli/`: Command-line interface with `aiq` entry point
  - `builder/`: Component builders (workflows, functions, LLMs)
  - `agent/`: Agent implementations and registry
  - `data_models/`: Pydantic models for configuration and data
  - `llm/`, `retriever/`, `embedder/`: Provider implementations

**Configuration System:**
- YAML-based configuration in `configs/hackathon_config.yml`
- Supports OpenAI-compatible APIs via `base_url` parameter
- Environment variable integration for API keys
- React Agent workflow with configurable tools and iterations

**Tool Integration:**
- Tavily search via `tavily_internet_search` function
- DateTime utilities via `current_datetime` function  
- MCP (Model Context Protocol) server support in `tavily_mcp_server.py`

**Frontend Architecture:**
- Next.js 14 with TypeScript
- Component-based UI with chat interface
- Real-time communication with backend API
- Authentication support via NextAuth

### Key Design Patterns

**Plugin Architecture:**
- Framework plugins in `packages/` (agno, langchain, llama-index, etc.)
- Type registration system via entry points
- Extensible component registration

**Configuration-Driven:**
- All components defined in YAML configuration
- Type-safe instantiation via `_type` field
- Builder pattern for component assembly

**Async/Streaming Support:**
- Async context managers throughout
- Streaming response support for real-time chat
- Background task handling

## Important Configuration

### API Keys Setup
1. **Tavily API**: Set in `install.sh` line ~185 and environment
2. **LLM API**: Configure in `configs/hackathon_config.yml` 
3. **Environment Variables**: `TAVILY_API_KEY` for search functionality

### Default Configuration
- **Backend Port**: 8001 
- **Frontend Port**: 3000
- **Default LLM**: Qwen-plus via Alibaba Cloud Dashscope
- **Agent Type**: React Agent with max 10 iterations
- **Search Provider**: Tavily with basic search depth

### Directory Structure Notes
- Main development happens in `NeMo-Agent-Toolkit/` (cloned during setup)
- Configuration files created during installation in `NeMo-Agent-Toolkit/configs/`
- Frontend is a git submodule in `external/aiqtoolkit-opensource-ui/`

### Testing Architecture
- Python tests use pytest with async support
- Mock-heavy testing pattern for external dependencies
- Component registration testing via type registry
- Frontend uses Vitest for unit testing

### Build System
- Python: uv-based dependency management with workspace support
- Frontend: Next.js build system with TypeScript
- Cross-platform installation scripts (bash/batch)
- Docker support via `docker/` directory

## Development Workflow Notes

**Starting Development:**
1. Ensure API keys are configured in appropriate files
2. Run installation script to set up both backend and frontend
3. Use `start.sh` for development or individual commands for debugging

**Making Changes:**
- Backend changes require restart of `aiq serve` command
- Frontend supports hot reload via `npm run dev`
- Configuration changes require backend restart

**Common Issues:**
- Port conflicts: Backend defaults to 8001, frontend to 3000
- API key errors: Check both environment variables and config files  
- Frontend connection issues: Verify backend is running on correct port
- Python environment: Ensure `.venv` is activated when running backend commands
