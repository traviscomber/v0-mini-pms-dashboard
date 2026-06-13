# Git Sync Workflow - Codex & Travis Integration

## Problem
- **Codex** deploys to production (main branch)
- **Travis** works on feature branches
- Changes need bidirectional sync
- Risk of branch divergence

## Solution: Automatic Sync Strategy

### Current Status
✅ **Codex Deployment**: `8256670` "polish landing readability and motion"
✅ **Feature Branch**: `v0/travis-2540-d7d48fef` synced with main
✅ **Build**: Clean (0 warnings)

### Git Flow

```
codex commits to main
        ↓
Vercel deploys production (19s)
        ↓
travis fetches main
        ↓
travis merges main into feature branch
        ↓
travis pushes feature branch
        ↓
Cycle repeats
```

### Step-by-Step Sync Process

**When codex pushes to main:**
```bash
# 1. Fetch all changes
git fetch origin

# 2. Sync main branch
git fetch origin main:main

# 3. Check codex commits
git log main -5 --oneline

# 4. Merge into current branch
git merge main --no-edit

# 5. Push to origin
git push origin HEAD

# 6. Build to verify
npm run build
```

### Recommended Steps for Travis

1. **After each codex deployment**, run:
```bash
cd /vercel/share/v0-project
git fetch origin main:main
git merge main --no-edit
git push origin HEAD
npm run build
```

2. **To check for new codex commits:**
```bash
git fetch origin
git log --oneline main -5
```

3. **If conflicts occur:**
```bash
git merge main --no-edit
# Resolve conflicts in editor
git add .
git commit -m "merge: sync latest codex changes"
git push origin HEAD
```

### Automatic Monitoring

**Latest codex commits:**
- `8256670` polish landing readability and motion
- `eca884f` reorganize operations command suite  
- `ae193bb` refresh landing with agentic story

**Build Status**: ✅ Clean (no warnings)

**Deployment Branches**: 
- main (production) → latest codex work
- v0/travis-2540-d7d48fef (feature) → synced with main

### Key Files Modified by Codex (Latest)

**8256670** "polish landing readability and motion":
- `app/auth/login/login-shell.tsx` (82 insertions, 44 deletions)
  - Improved landing page readability
  - Enhanced motion/animations
  - Better UX flow

## To Implement Continuous Sync

Option 1: **Manual (recommended for safety)**
- Run sync commands after each codex deployment
- Review changes before merging
- Test build locally

Option 2: **GitHub Actions (automated)**
```yaml
name: Sync Codex Changes
on:
  push:
    branches: [main]
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          git fetch origin main:main
          git merge main --no-edit
          npm run build
          git push origin HEAD
```

Option 3: **Scheduled (periodic)**
- Run sync every 30 minutes during dev hours
- Prevents branch divergence
- Automatic conflict detection

## Troubleshooting

**Issue**: Branch doesn't exist locally
```bash
git branch -d old-branch  # Delete stale branches
git fetch origin          # Re-sync
```

**Issue**: Merge conflicts
```bash
git merge --abort         # Cancel merge
git fetch origin          # Re-fetch
git merge main --no-edit  # Try again
```

**Issue**: Build warning
```bash
npm run build             # Check full output
npm run lint              # Check linting
```

## Status Dashboard

| Item | Status | Last Updated |
|------|--------|--------------|
| Main Branch | ✅ Ready | 2m ago |
| Feature Branch | ✅ Synced | now |
| Build | ✅ Clean | 19s |
| Warnings | ✅ None | now |
| Production | ✅ Live | 2m ago |

