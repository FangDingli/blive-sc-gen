#!/usr/bin/env sh
# GitHub Pages 部署脚本：构建当前分支并推送到 origin/deploy（站点根路径）
# main / v2 分支均可部署，v2 为重构版，直接替换原站点
set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD)
case "$BRANCH" in
  main|v2) BASE="/blive-sc-gen/" ;;
  *) echo "仅支持部署 main / v2 分支，当前分支：$BRANCH"; exit 1 ;;
esac

echo "==> 部署分支: $BRANCH (base=$BASE)"
# Git Bash 的 MSYS 会把以 / 开头的参数当路径转换（/xxx → C:/Program Files/Git/xxx），必须禁用
MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL='*' npm run build -- --base=$BASE

WORKTREE=.deploy-tmp
git fetch origin deploy
git worktree remove --force "$WORKTREE" 2>/dev/null || rm -rf "$WORKTREE"
git worktree add "$WORKTREE" origin/deploy

# 整站替换：清空 deploy 分支全部内容后放入新构建产物
cd "$WORKTREE"
find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r ../dist/. .
touch .nojekyll
git add -A
git commit -m "deploy: $BRANCH ($(date '+%Y-%m-%d %H:%M'))" || echo "无变更，跳过提交"
git push origin HEAD:deploy
cd - >/dev/null
git worktree remove --force "$WORKTREE"
echo "==> 部署完成: https://fangdingli.github.io/blive-sc-gen/"
