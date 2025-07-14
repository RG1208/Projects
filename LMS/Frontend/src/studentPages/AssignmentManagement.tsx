import React, { useState, useEffect, useMemo } from 'react';
import {
    FileText,
    Calendar,
    Clock,
    BookOpen,
    Send,
    CheckCircle,
    AlertCircle,
    Search,
    Filter,
    Eye,
    Upload,
    X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// API functions for backend integration
const API_BASE = "http://127.0.0.1:5000/api/student";

const getToken = () => localStorage.getItem("token");

const assignmentsApi = {
    getAssignments: async () => {
        const res = await fetch(`${API_BASE}/my-courses/assignments`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to fetch assignments");
        return await res.json();
    },
    getAssignment: async (assignmentId: number) => {
        const res = await fetch(`${API_BASE}/my-courses/assignments/${assignmentId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to fetch assignment details");
        return await res.json();
    },
    submitAssignment: async (assignmentId: number, content: string) => {
        const res = await fetch(`${API_BASE}/my-courses/assignments/${assignmentId}/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify({ content }),
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to submit assignment");
        }
        return await res.json();
    },
};

// Types
interface Assignment {
    id: number;
    title: string;
    description: string;
    course_id: number;
    course_title?: string;
    due_date: string;
    created_at: string;
    max_points?: number;
    instructions?: string;
    status?: 'pending' | 'submitted' | 'graded';
    submission_id?: number;
    grade?: number;
    feedback?: string;
}

interface Submission {
    id: number;
    assignment_id: number;
    content: string;
    submitted_at: string;
    grade?: number;
    feedback?: string;
}

export const AssignmentsDashboard: React.FC = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [submissionContent, setSubmissionContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

    // Filter assignments based on search and status
    const filteredAssignments = useMemo(() => {
        return assignments.filter(assignment => {
            const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (assignment.course_title && assignment.course_title.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus = !statusFilter || assignment.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [assignments, searchTerm, statusFilter]);

    // Group assignments by status
    const groupedAssignments = useMemo(() => {
        const groups = {
            pending: filteredAssignments.filter(a => a.status === 'pending'),
            submitted: filteredAssignments.filter(a => a.status === 'submitted'),
            graded: filteredAssignments.filter(a => a.status === 'graded')
        };
        return groups;
    }, [filteredAssignments]);

    const loadAssignments = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await assignmentsApi.getAssignments();
            setAssignments(data);
        } catch (err) {
            setError('Failed to load assignments. Please try again.');
            console.error('Error loading assignments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssignments();
    }, []);

    const handleViewAssignment = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
    };

    const handleSubmitAssignment = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        setShowSubmissionModal(true);
        setSubmissionContent('');
    };

    const handleSubmissionSubmit = async () => {
        if (!selectedAssignment || !submissionContent.trim()) return;

        try {
            setSubmitting(true);
            setSubmissionMessage(null);

            await assignmentsApi.submitAssignment(selectedAssignment.id, submissionContent);

            // Update assignment status
            setAssignments(prev => prev.map(assignment =>
                assignment.id === selectedAssignment.id
                    ? { ...assignment, status: 'submitted' as const }
                    : assignment
            ));

            setShowSubmissionModal(false);
            setSubmissionMessage('Assignment submitted successfully!');

            setTimeout(() => setSubmissionMessage(null), 3000);
        } catch (err) {
            setSubmissionMessage('Failed to submit assignment. Please try again.');
            setTimeout(() => setSubmissionMessage(null), 5000);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'submitted': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'graded': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'submitted': return <Upload className="w-4 h-4" />;
            case 'graded': return <CheckCircle className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 bg-blue-600 rounded-full opacity-75 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-700 text-lg mb-4">{error}</p>
                        <button
                            onClick={loadAssignments}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments Dashboard</h1>
                            <p className="text-gray-600">Track and submit your course assignments</p>
                        </div>
                        {/* View My Submissions Button */}
                        <button
                            onClick={() => window.location.href = '/student/submissions'}
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 mb-4 lg:mb-0"
                        >
                            <Upload className="w-5 h-5 mr-2" />
                            View My Submissions
                        </button>
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-6 lg:mt-0">
                            <div className="bg-amber-50 rounded-lg p-4 text-center">
                                <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-amber-900">{groupedAssignments.pending.length}</div>
                                <div className="text-xs text-amber-600">Pending</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <Upload className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-blue-900">{groupedAssignments.submitted.length}</div>
                                <div className="text-xs text-blue-600">Submitted</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-green-900">{groupedAssignments.graded.length}</div>
                                <div className="text-xs text-green-600">Graded</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Submission Message */}
                {submissionMessage && (
                    <div className={`mb-6 p-4 rounded-lg ${submissionMessage.includes('successfully')
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        <div className="flex items-center">
                            {submissionMessage.includes('successfully') ? (
                                <CheckCircle className="w-5 h-5 mr-2" />
                            ) : (
                                <AlertCircle className="w-5 h-5 mr-2" />
                            )}
                            {submissionMessage}
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search assignments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div className="relative min-w-[200px]">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="submitted">Submitted</option>
                            <option value="graded">Graded</option>
                        </select>
                    </div>
                </div>

                {/* Assignments Grid */}
                {filteredAssignments.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No assignments match your search criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAssignments
                            .filter(assignment => assignment.status !== 'submitted') // 👈 Hides submitted assignments
                            .map((assignment) => (
                                <div
                                    key={assignment.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden"
                                >
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {assignment.title}
                                                </h3>
                                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                                    <BookOpen className="w-4 h-4 mr-1" />
                                                    <span>{assignment.course_title}</span>
                                                </div>
                                            </div>
                                            <div className={`flex items-center px-2 py-1 rounded-full border ${getStatusColor(assignment.status || 'pending')}`}>
                                                {getStatusIcon(assignment.status || 'pending')}
                                                <span className="text-xs font-medium ml-1 capitalize">
                                                    {assignment.status || 'pending'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {assignment.description}
                                        </p>

                                        {/* Due Date */}
                                        <div className={`flex items-center text-sm mb-4 ${isOverdue(assignment.due_date) && assignment.status === 'pending'
                                            ? 'text-red-600'
                                            : 'text-gray-500'
                                            }`}>
                                            <Calendar className="w-4 h-4 mr-1" />
                                            <span>Due: {formatDate(assignment.due_date)}</span>
                                            {isOverdue(assignment.due_date) && assignment.status === 'pending' && (
                                                <span className="ml-2 text-red-600 font-medium">(Overdue)</span>
                                            )}
                                        </div>

                                        {/* Points and Grade */}
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <div className="flex items-center">
                                                <span>Max Points: {assignment.max_points || 'N/A'}</span>
                                            </div>
                                            {assignment.grade !== undefined && (
                                                <div className="flex items-center text-green-600 font-medium">
                                                    <span>Grade: {assignment.grade}/{assignment.max_points}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewAssignment(assignment)}
                                                className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View Details
                                            </button>

                                            {assignment.status === 'pending' && (
                                                <button
                                                    onClick={() => handleSubmitAssignment(assignment)}
                                                    className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                                                >
                                                    <Send className="w-4 h-4 mr-1" />
                                                    Submit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {/* Assignment Details Modal */}
            {selectedAssignment && !showSubmissionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {selectedAssignment.title}
                                    </h2>
                                    <div className="flex items-center text-gray-600">
                                        <BookOpen className="w-4 h-4 mr-1" />
                                        <span>{selectedAssignment.course_title}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedAssignment(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-600">{selectedAssignment.description}</p>
                                </div>

                                {selectedAssignment.instructions && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructions</h3>
                                        <p className="text-gray-600">{selectedAssignment.instructions}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">Due Date</h4>
                                        <p className="text-gray-600">{formatDate(selectedAssignment.due_date)}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">Max Points</h4>
                                        <p className="text-gray-600">{selectedAssignment.max_points || 'N/A'}</p>
                                    </div>
                                </div>

                                {selectedAssignment.grade !== undefined && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">Grade</h4>
                                        <p className="text-green-600 font-semibold">
                                            {selectedAssignment.grade}/{selectedAssignment.max_points}
                                        </p>
                                        {selectedAssignment.feedback && (
                                            <div className="mt-2">
                                                <h4 className="font-medium text-gray-900 mb-1">Feedback</h4>
                                                <p className="text-gray-600">{selectedAssignment.feedback}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedAssignment.status === 'pending' && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button
                                            onClick={() => setSelectedAssignment(null)}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={() => handleSubmitAssignment(selectedAssignment)}
                                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                        >
                                            Submit Assignment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Submission Modal */}
            {showSubmissionModal && selectedAssignment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Submit Assignment
                                    </h2>
                                    <p className="text-gray-600">{selectedAssignment.title}</p>
                                </div>
                                <button
                                    onClick={() => setShowSubmissionModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assignment Content
                                    </label>
                                    <textarea
                                        value={submissionContent}
                                        onChange={(e) => setSubmissionContent(e.target.value)}
                                        placeholder="Enter your assignment submission here..."
                                        rows={10}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4 border-t">
                                    <button
                                        onClick={() => setShowSubmissionModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmissionSubmit}
                                        disabled={submitting || !submissionContent.trim()}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Submitting...
                                            </div>
                                        ) : (
                                            'Submit Assignment'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};