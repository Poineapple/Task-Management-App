from flask import Flask, jsonify, request
from flask_cors import CORS
import json
app = Flask(__name__)
CORS(app)

# Function to load tasks from JSON file
def load_tasks():
    with open('tasks.json', 'r') as f:
        return json.load(f)

# Function to save tasks to JSON file
def save_tasks(tasks):
    with open('tasks.json', 'w') as f:
        json.dump(tasks, f, indent=4)


# Read all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = load_tasks()
    return jsonify(tasks)


# Read a single task by id
@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    tasks = load_tasks()
    task = next((task for task in tasks if task['id'] == task_id), None)
    if task is not None:
        return jsonify(task)
    else:
        return jsonify({'message': 'Task not found'}), 404

# Create a task
@app.route('/tasks', methods=['POST'])
def create_task():
    new_task = request.json
    tasks = load_tasks()
    tasks.append(new_task)
    save_tasks(tasks)
    return jsonify(new_task), 201 # 201: HTTP status code for Created

# Update a task
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    tasks = load_tasks()
    task = next((task for task in tasks if task['id'] == task_id), None)
    if task is not None:
        task.update(request.json)
        save_tasks(tasks)
        return jsonify(task)
    
    else:
        return jsonify({'message': 'Task not found'}), 404

# Delete a task
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    tasks = load_tasks()
    tasks = [task for task in tasks if task['id'] != task_id]
    save_tasks(tasks)
    return jsonify({'message': 'Task deleted'})

if __name__ == '__main__':
    app.run(debug=True)