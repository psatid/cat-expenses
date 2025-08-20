.PHONY: help setup check-nvm check-corepack install-node install-pnpm install-deps dev build clean lint test

# Environment
SHELL := /bin/bash
TERM := xterm-256color
export TERM

# Variables
PNPM_VERSION := 10.9.0
NVM_DIR := $(shell echo $$HOME/.nvm)
NVM_SCRIPT := $(NVM_DIR)/nvm.sh

# Colors
GREEN = \x1b[32m
RED = \x1b[31m
YELLOW = \x1b[33m
CYAN = \x1b[36m
NC = \x1b[0m

# Symbols
CHECK = ${GREEN}✓${NC}
CROSS = ${RED}✗${NC}

help:  ## Show this help message
	@printf "Keyword Crawler Frontend Development Setup\n\n"
	@printf "Usage:\n"
	@printf "  make $(CYAN)<target>$(NC)\n\n"
	@printf "Targets:\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-15s$(NC) %s\n", $$1, $$2}'

check-nvm: ## Check if nvm is installed
	@if [ ! -f "$(NVM_SCRIPT)" ]; then \
		printf "$(CROSS) nvm is not installed\n"; \
		printf "Please install nvm from: https://github.com/nvm-sh/nvm#installing-and-updating\n"; \
		exit 1; \
	fi
	@. $(NVM_SCRIPT) && command -v nvm >/dev/null 2>&1 || { \
		printf "$(CROSS) nvm is not properly loaded\n"; \
		printf "Please ensure nvm is properly sourced in your shell\n"; \
		exit 1; \
	}
	@printf "$(CHECK) nvm is installed and working\n"

check-corepack: ## Check and install corepack if needed
	@command -v corepack >/dev/null 2>&1 || { \
		printf "📦 Installing corepack...\n"; \
		npm install -g corepack; \
	}
	@printf "$(CHECK) corepack is installed\n"
	@corepack enable

install-node: check-nvm ## Install and use the correct Node.js version
	@printf "📦 Installing and switching to the correct Node.js version...\n"
	@. $(NVM_SCRIPT) && nvm install
	@. $(NVM_SCRIPT) && nvm use
	@printf "$(CHECK) Node.js $(shell node -v) is active\n"

install-pnpm: check-corepack ## Install/upgrade pnpm to the correct version
	@printf "📦 Installing/upgrading pnpm...\n"
	@corepack prepare pnpm@$(PNPM_VERSION) --activate
	@printf "$(CHECK) pnpm $(shell pnpm -v) is installed\n"

install-deps: ## Install project dependencies
	@printf "📦 Installing project dependencies...\n"
	@pnpm install
	@printf "$(CHECK) Dependencies installed\n"

dev: ## Start development server
	@printf "🚀 Starting development server...\n"
	@FORCE_COLOR=1 pnpm dev

build: ## Build for production
	@printf "🏗️  Building for production...\n"
	@FORCE_COLOR=1 pnpm build
	@printf "$(CHECK) Built successfully\n"

preview: ## Preview production build
	@printf "🔍 Starting preview server...\n"
	@FORCE_COLOR=1 pnpm preview

test: ## Run tests
	@printf "🧪 Running tests...\n"
	@FORCE_COLOR=1 pnpm test

test-ui: ## Run tests with UI
	@printf "🧪 Running tests with UI...\n"
	@FORCE_COLOR=1 pnpm test:ui

test-coverage: ## Run tests with coverage
	@printf "🧪 Running tests with coverage...\n"
	@FORCE_COLOR=1 pnpm test:coverage
	@printf "$(CHECK) Coverage report generated in coverage/\n"

lint: ## Lint code
	@printf "🔍 Linting code...\n"
	@FORCE_COLOR=1 pnpm lint
	@printf "$(CHECK) Linting completed\n"

clean: ## Clean build artifacts
	@printf "🧹 Cleaning build artifacts...\n"
	@rm -rf dist coverage
	@printf "$(CHECK) Build artifacts cleaned\n"

setup: install-node install-pnpm install-deps ## Setup complete development environment
	@printf "\n$(GREEN)✅ Development environment setup complete!$(NC)\n"
	@printf "You can now run:\n"
	@printf "  $(YELLOW)make dev$(NC)      to start development server\n"
	@printf "  $(YELLOW)make test$(NC)     to run tests\n"
	@printf "  $(YELLOW)make build$(NC)    to build for production\n"

.DEFAULT_GOAL := help