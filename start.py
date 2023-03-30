import os
import subprocess

if not os.path.exists("chat-app/package.json"):
    print("Initializing NPM in /chat-app...")
    subprocess.run(["npm.cmd", "init", "-y"], cwd="chat-app")

print("Starting Flask app...")
flask_process = subprocess.Popen(["flask", "run"], env=dict(os.environ, FLASK_APP="app.py"))

print("Starting React app...")
subprocess.run(["npm.cmd", "start"], cwd="chat-app")

flask_process.terminate()
