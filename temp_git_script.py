import subprocess
import pathlib

root = pathlib.Path(r'C:\Users\HP\Desktop\smacom')

# Check current branch
branch_cmd = ['git', 'branch', '--show-current']
proc_branch = subprocess.run(branch_cmd, cwd=root, capture_output=True, text=True)
print('Current branch:', proc_branch.stdout.strip())

# Check status
status_cmd = ['git', 'status', '--porcelain']
proc_status = subprocess.run(status_cmd, cwd=root, capture_output=True, text=True)
print('Status:', proc_status.stdout.strip())

# If there are staged changes, commit
if proc_status.stdout.strip():
    commit_cmd = ['git', 'commit', '-m', 'Restructure project: move backend into green-cycle-hub, fix signup and auth, add Google OAuth, update logo']
    proc = subprocess.run(commit_cmd, cwd=root, capture_output=True, text=True)
    print('Commit CMD:', commit_cmd)
    print('Return code:', proc.returncode)
    print('Stdout:', proc.stdout)
    print('Stderr:', proc.stderr)

    if proc.returncode == 0:
        # Push to origin master
        push_cmd = ['git', 'push', 'origin', 'master']
        proc2 = subprocess.run(push_cmd, cwd=root, capture_output=True, text=True)
        print('Push CMD:', push_cmd)
        print('Return code:', proc2.returncode)
        print('Stdout:', proc2.stdout)
        print('Stderr:', proc2.stderr)
    else:
        print('Commit failed, not pushing')
else:
    print('No changes to commit, trying to push anyway')
    push_cmd = ['git', 'push', 'origin', 'master']
    proc2 = subprocess.run(push_cmd, cwd=root, capture_output=True, text=True)
    print('Push CMD:', push_cmd)
    print('Return code:', proc2.returncode)
    print('Stdout:', proc2.stdout)
    print('Stderr:', proc2.stderr)