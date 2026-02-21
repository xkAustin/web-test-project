#!/bin/bash

# 环境检查脚本
# 验证所有必需的依赖和配置是否正确

set -e

echo "================================"
echo "  测试环境检查"
echo "================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# 函数：检查命令是否存在
check_command() {
  if command -v "$1" &> /dev/null; then
    echo -e "${GREEN}✓${NC} $1 已安装"
    return 0
  else
    echo -e "${RED}✗${NC} $1 未找到"
    return 1
  fi
}

# 函数：检查文件是否存在
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1 存在"
    return 0
  else
    echo -e "${RED}✗${NC} $1 不存在"
    return 1
  fi
}

# 函数：获取版本
get_version() {
  echo "$($1 --version 2>/dev/null | head -1)"
}

echo -e "${BLUE}检查系统环境${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查 Node.js
if check_command node; then
  VERSION=$(get_version node)
  echo "  版本: $VERSION"
else
  ERRORS=$((ERRORS + 1))
fi

# 检查 npm
if check_command npm; then
  VERSION=$(get_version npm)
  echo "  版本: $VERSION"
else
  ERRORS=$((ERRORS + 1))
fi

echo ""
echo -e "${BLUE}检查项目依赖${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查 node_modules
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓${NC} node_modules 存在"
else
  echo -e "${YELLOW}⚠${NC} node_modules 不存在，请运行: npm ci"
  WARNINGS=$((WARNINGS + 1))
fi

# 检查必需的包
check_package() {
  if [ -d "node_modules/$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    return 0
  else
    echo -e "${RED}✗${NC} $1 缺失"
    ERRORS=$((ERRORS + 1))
    return 1
  fi
}

check_package "@playwright/test"
check_package "dotenv"
check_package "axe-playwright"

echo ""
echo -e "${BLUE}检查项目文件${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "playwright.config.ts"
check_file ".env.example"
check_file "package.json"
check_file "package-lock.json"

echo ""
echo -e "${BLUE}检查配置文件${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f ".env" ]; then
  echo -e "${GREEN}✓${NC} .env 存在"

  # 检查必需的环境变量
  if grep -q "TEST_USERNAME" .env; then
    echo -e "  ${GREEN}✓${NC} TEST_USERNAME 已配置"
  else
    echo -e "  ${YELLOW}⚠${NC} TEST_USERNAME 未配置"
    WARNINGS=$((WARNINGS + 1))
  fi

  if grep -q "TEST_PASSWORD" .env; then
    echo -e "  ${GREEN}✓${NC} TEST_PASSWORD 已配置"
  else
    echo -e "  ${YELLOW}⚠${NC} TEST_PASSWORD 未配置"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${YELLOW}⚠${NC} .env 不存在"
  echo "  请从 .env.example 创建:"
  echo -e "  ${YELLOW}cp .env.example .env${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo -e "${BLUE}检查 Playwright 浏览器${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查 Playwright 缓存目录
if [ -d "$HOME/.cache/ms-playwright" ] || [ -d "$HOME/Library/Caches/ms-playwright" ]; then
  echo -e "${GREEN}✓${NC} Playwright 浏览器已安装"
else
  echo -e "${YELLOW}⚠${NC} Playwright 浏览器可能未安装"
  echo "  请运行: npx playwright install"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo -e "${BLUE}检查目录结构${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REQUIRED_DIRS=(
  "tests"
  "tests/e2e"
  "tests/api"
  "tests/security"
  "tests/performance"
  "tests/pages"
  "tests/utils"
  "docs"
  "reports"
)

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo -e "${GREEN}✓${NC} $dir"
  else
    echo -e "${RED}✗${NC} $dir 缺失"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}检查摘要${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✓ 所有检查通过！可以开始运行测试。${NC}"
  echo ""
  echo "运行测试:"
  echo -e "  ${YELLOW}npm test${NC}           # 运行所有测试"
  echo -e "  ${YELLOW}npm run test:ui${NC}    # 交互式 UI 模式"
  echo -e "  ${YELLOW}npm run test:debug${NC} # 调试模式"
  exit 0
else
  echo -e "${RED}找到 $ERRORS 个错误，$WARNINGS 个警告${NC}"
  exit 1
fi
