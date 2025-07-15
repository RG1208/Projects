import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TeacherAssignmentSubmissions() {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [grading, setGrading] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`https://projects-1-88nz.onrender.com/api/teacher/submissions/${assignmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setSubmissions(data.submissions || []));
  }, [assignmentId, token]);

  const handleGradeChange = (id, field, value) => {
    setGrading(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const submitGrade = (submissionId) => {
    const { marks, feedback } = grading[submissionId] || {};
    if (marks === undefined || feedback === undefined) {
      alert("Please enter both marks and feedback.");
      return;
    }
    fetch(`https://projects-1-88nz.onrender.com/api/teacher/grade_submission/${submissionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ marks, feedback }),
    })
      .then(res => res.json())
      .then(() => {
        // Refresh submissions after grading
        fetch(`https://projects-1-88nz.onrender.com/api/teacher/submissions/${assignmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(data => setSubmissions(data.submissions || []));
        setGrading(prev => ({ ...prev, [submissionId]: {} }));
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">📝 Submissions for Assignment {assignmentId}</h2>
        {submissions.length === 0 ? (
          <div className="text-gray-500">No submissions yet.</div>
        ) : (
          submissions.map(sub => (
            <div key={sub.id} className="bg-white p-6 rounded-2xl shadow-md mb-4">
              <div className="mb-2">
                <span className="font-semibold">Student ID:</span> {sub.user_id}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Content:</span> {sub.content}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Status:</span> {sub.status}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Marks:</span> {sub.marks ?? "Not graded"}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Feedback:</span> {sub.feedback ?? "Not graded"}
              </div>
              <div className="flex gap-2 mt-4">
                <input
                  type="number"
                  placeholder="Marks"
                  className="border rounded-xl p-2"
                  value={grading[sub.id]?.marks || ""}
                  onChange={e => handleGradeChange(sub.id, "marks", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Feedback"
                  className="border rounded-xl p-2 flex-1"
                  value={grading[sub.id]?.feedback || ""}
                  onChange={e => handleGradeChange(sub.id, "feedback", e.target.value)}
                />
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded-xl"
                  onClick={() => submitGrade(sub.id)}
                >
                  Save Grade
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 