from flask import Flask, jsonify
from flask_cors import CORS #type:ignore
from flask import request
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Sample incident data
incidents = [
    {
        "id": 1,
        "vehicle_id": "SIDD-001",
        "time": "2025-06-20T20:50:00",
        "location": "Delhi, NH-44, km42",
        "severity": "High",
        "transcript": "help fire accident",
        "status": "Pending"
    },
    {
        "id": 2,
        "vehicle_id": "SIDD-002",
        "time": "2025-06-20T19:30:00",
        "location": "Mumbai, Western Express Highway, km15",
        "severity": "Medium",
        "transcript": "vehicle breakdown need assistance",
        "status": "In Progress"
    },
    {
        "id": 3,
        "vehicle_id": "SIDD-003",
        "time": "2025-06-20T18:15:00",
        "location": "Bangalore, Electronic City, Hosur Road",
        "severity": "Low",
        "transcript": "minor collision no injuries",
        "status": "Resolved"
    },
    {
        "id": 4,
        "vehicle_id": "SIDD-004",
        "time": "2025-06-20T21:20:00",
        "location": "Chennai, IT Corridor, OMR",
        "severity": "High",
        "transcript": "multiple vehicle collision medical assistance required",
        "status": "Pending"
    },
    {
        "id": 5,
        "vehicle_id": "SIDD-005",
        "time": "2025-06-20T17:45:00",
        "location": "Hyderabad, Outer Ring Road, Gachibowli",
        "severity": "Medium",
        "transcript": "vehicle rollover driver conscious",
        "status": "In Progress"
    }
]

@app.route('/api/incidents', methods=['GET'])
def get_incidents():
    """Get all incidents"""
    return jsonify(incidents)

@app.route('/api/incidents/<int:incident_id>', methods=['GET'])
def get_incident(incident_id):
    """Get a specific incident by ID"""
    incident = next((inc for inc in incidents if inc['id'] == incident_id), None)
    if incident:
        return jsonify(incident)
    return jsonify({'error': 'Incident not found'}), 404

@app.route('/api/incidents/severity/<severity>', methods=['GET'])
def get_incidents_by_severity(severity):
    """Get incidents by severity level"""
    filtered_incidents = [inc for inc in incidents if inc['severity'].lower() == severity.lower()]
    return jsonify(filtered_incidents)

@app.route('/api/incidents/status/<status>', methods=['GET'])
def get_incidents_by_status(status):
    """Get incidents by status"""
    filtered_incidents = [inc for inc in incidents if inc['status'].lower() == status.lower()]
    return jsonify(filtered_incidents)

@app.route('/api/incidents', methods=['POST'])
def create_incident():
    """Create a new incident"""
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No input data provided'}), 400
    
    required_fields = ['vehicle_id', 'time', 'location', 'severity', 'transcript', 'status']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
    
    new_incident = {
        'id': max(inc['id'] for inc in incidents) + 1 if incidents else 1,
        'vehicle_id': data['vehicle_id'],
        'time': data['time'],
        'location': data['location'],
        'severity': data['severity'],
        'transcript': data['transcript'],
        'status': data['status']
    }
    incidents.append(new_incident)
    return jsonify(new_incident), 201

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get incident statistics"""
    total = len(incidents)
    pending = len([inc for inc in incidents if inc['status'] == 'Pending'])
    in_progress = len([inc for inc in incidents if inc['status'] == 'In Progress'])
    resolved = len([inc for inc in incidents if inc['status'] == 'Resolved'])
    
    high_severity = len([inc for inc in incidents if inc['severity'] == 'High'])
    medium_severity = len([inc for inc in incidents if inc['severity'] == 'Medium'])
    low_severity = len([inc for inc in incidents if inc['severity'] == 'Low'])
    
    return jsonify({
        'total': total,
        'status': {
            'pending': pending,
            'in_progress': in_progress,
            'resolved': resolved
        },
        'severity': {
            'high': high_severity,
            'medium': medium_severity,
            'low': low_severity
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)