#!/usr/bin/env sh
# GitHub Pages 部署脚本：构建当前分支并推送到 origin/deploy
#   main 分支 → 站点根路径 /
#   v2 分支   → /v2/ 子路径（两分支共存，互不覆盖）
set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD)
case "$BRANCH" in
  main) BASE="/blive-sc-gen/"        ; SUBDIR="." ;;
  v2)   BASE="/blive-sc-gen/v2/"     ; SUBDIR="v2" ;;
  *) echo "仅支持部署 main / v2 分支，当前分支：$BRANCH"; exit 1 ;;
esac

echo "==> 部署分支: $BRANCH (base=$BASE)"
# Git Bash 的 MSYS 会把以 / 开头的参数当路径转换（/xxx → C:/Program Files/Git/xxx），必须禁用
MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL='*' npm run build -- --base=$BASE

WORKTREE=.deploy-tmp
git fetch origin deploy
# 用 worktree 检出 deploy 分支，保留另一分支已部署的内容
if git show-ref --verify --quiet refs/remotes/origin/deploy; then
  git worktree remove --force "$WORKTREE" 2>/dev/null || rm -rf "$WORKTREE"
  git worktree add "$WORKTREE" origin/deploy
else
  git worktree remove --force "$WORKTREE" 2>/dev/null || rm -rf "$WORKTREE"
  git worktree add --orphan "$WORKTREE"
fi

# 清空目标目录后放入新构建产物（main 部署到根时保留 v2/ 目录）
cd "$WORKTREE"
if [ "$SUBDIR" = "." ]; then
  find . -mindepth 1 -maxdepth 1 ! -name v2 ! -name .git -exec rm -rf {} +
  cp -r ../dist/. .
else
  rm -rf "$SUBDIR"
  mkdir -p "$SUBDIR"
  cp -r ../dist/. "$SUBDIR/"
fi
touch .nojekyll
git add -A
git commit -m "deploy: $BRANCH ($(date '+%Y-%m-%d %H:%M'))" || echo "无变更，跳过提交"
git push origin HEAD:deploy
cd - >/dev/null
git worktree remove --force "$WORKTREE"
echo "==> 部署完成: https://fangdingli.github.io${BASE%/}/"
