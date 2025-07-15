import React, { useEffect, useState } from 'react';
import { AlertCircle, FileText, CheckCircle, Loader2 } from 'lucide-react';

const API_BASE = "https://projects-1-88nz.onrender.com/api/student";
const getToken = () => localStorage.getItem("token");

interface Submission {
  assignment_title: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
  content: string;
  max_points?: number;
}

const fetchSubmissions = async (): Promise<Submission[]> => {
  const res = await fetch(`${API_BASE}/my-courses/assignments/submissions`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch submissions");
  return await res.json();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const StudentSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSubmissions();
        setSubmissions(data);
      } catch (err) {
        setError('Failed to load submissions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-blue-700 font-medium">Loading submissions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No submissions found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Submitted Assignments</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-md border border-gray-100">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="py-3 px-4">Assignment</th>
              <th className="py-3 px-4">Submitted At</th>
              <th className="py-3 px-4">Grade</th>
              <th className="py-3 px-4">Feedback</th>
              <th className="py-3 px-4">Content</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, idx) => (
              <tr key={idx} className="border-t border-gray-100 hover:bg-blue-50">
                <td className="py-3 px-4 font-medium">{sub.assignment_title}</td>
                <td className="py-3 px-4">{formatDate(sub.submitted_at)}</td>
                <td className="py-3 px-4">
                  {sub.grade !== undefined ? (
                    <span className="text-green-700 font-semibold">
                      {sub.grade}/{sub.max_points ?? 'N/A'}
                    </span>
                  ) : (
                    <span className="text-gray-500">Not graded</span>
                  )}
                </td>
                <td className="py-3 px-4">{sub.feedback || <span className="text-gray-400">-</span>}</td>
                <td className="py-3 px-4 max-w-xs truncate" title={sub.content}>{sub.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentSubmissions; 