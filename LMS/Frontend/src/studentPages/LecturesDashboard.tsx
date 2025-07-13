import React, { useState, useEffect, useMemo } from 'react';
import {
    Play,
    Calendar,
    Clock,
    BookOpen,
    Search,
    Filter,
    Eye,
    User,
    Video,
    FileText,
    Download,
    ExternalLink,
    ChevronRight,
    PlayCircle,
    PauseCircle,
    Volume2,
    Maximize,
    Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Types
interface Lecture {
    id: number;
    title: string;
    description: string;
    course_id: number;
    course_name?: string;
    video_url?: string;
    duration?: string;
    created_at: string;
    updated_at?: string;
    materials?: string[];
    transcript?: string;
    is_watched?: boolean;
    watch_progress?: number;
}

interface Course {
    id: number;
    title: string;
    instructor?: string;
}

// API functions for backend integration
const API_BASE = "http://127.0.0.1:5000/api/student";

const getToken = () => localStorage.getItem("token");

// Real API functions - replace mock data
const lecturesApi = {
    getEnrolledCourses: async (): Promise<Course[]> => {
        const res = await fetch(`${API_BASE}/my-courses`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to fetch enrolled courses");
        return await res.json();
    },

    getLecturesByCourse: async (courseId: number): Promise<Lecture[]> => {
        const res = await fetch(`${API_BASE}/my-courses/${courseId}/lectures`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to fetch lectures");
        return await res.json();
    },

    getLectureDetails: async (courseId: number, lectureId: number): Promise<Lecture> => {
        const res = await fetch(`${API_BASE}/my-courses/${courseId}/lectures/${lectureId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to fetch lecture details");
        return await res.json();
    }
};

export const LecturesDashboard: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
    const [loading, setLoading] = useState(true);
    const [lecturesLoading, setLecturesLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);

    // Filter lectures based on search
    const filteredLectures = useMemo(() => {
        return lectures.filter(lecture =>
            lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lecture.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [lectures, searchTerm]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await lecturesApi.getEnrolledCourses();
            setCourses(data);
            if (data.length > 0) {
                setSelectedCourse(data[0]);
            }
        } catch (err) {
            setError('Failed to load courses. Please try again.');
            console.error('Error loading courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadLectures = async (courseId: number) => {
        try {
            setLecturesLoading(true);
            setError(null);
            const data = await lecturesApi.getLecturesByCourse(courseId);
            setLectures(data);
        } catch (err) {
            setError('Failed to load lectures. Please try again.');
            console.error('Error loading lectures:', err);
        } finally {
            setLecturesLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            loadLectures(selectedCourse.id);
        }
    }, [selectedCourse]);

    const handleViewLecture = async (lecture: Lecture) => {
        try {
            const details = await lecturesApi.getLectureDetails(lecture.course_id, lecture.id);
            setSelectedLecture(details);
        } catch (err) {
            console.error('Error loading lecture details:', err);
        }
    };

    const handleWatchLecture = (lecture: Lecture) => {
        setSelectedLecture(lecture);
        setShowVideoPlayer(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDuration = (duration: string | undefined) => {
        return duration || 'N/A';
    };

    const getProgressColor = (progress: number) => {
        if (progress === 0) return 'bg-gray-200';
        if (progress < 50) return 'bg-yellow-400';
        if (progress < 100) return 'bg-blue-400';
        return 'bg-green-400';
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
                        <Video className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-700 text-lg mb-4">{error}</p>
                        <button
                            onClick={loadCourses}
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lectures Dashboard</h1>
                            <p className="text-gray-600">Access your course lectures and learning materials</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-6 lg:mt-0">
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-blue-900">{courses.length}</div>
                                <div className="text-xs text-blue-600">Courses</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <Video className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-green-900">{lectures.length}</div>
                                <div className="text-xs text-green-600">Lectures</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                <PlayCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-purple-900">
                                    {lectures.filter(l => l.is_watched).length}
                                </div>
                                <div className="text-xs text-purple-600">Completed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Course Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Courses</h2>
                            <div className="space-y-2">
                                {courses.map((course) => (
                                    <button
                                        key={course.id}
                                        onClick={() => setSelectedCourse(course)}
                                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${selectedCourse?.id === course.id
                                            ? 'bg-blue-50 border-blue-200 text-blue-900'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            } border`}
                                    >
                                        <div className="font-medium text-sm line-clamp-2">{course.title}</div>
                                        {course.instructor && (
                                            <div className="text-xs text-gray-500 mt-1">{course.instructor}</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Lectures Content */}
                    <div className="lg:col-span-3">
                        {selectedCourse && (
                            <>
                                {/* Course Header */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h2>
                                    {selectedCourse.instructor && (
                                        <p className="text-gray-600">Instructor: {selectedCourse.instructor}</p>
                                    )}
                                </div>

                                {/* Search Bar */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search lectures..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {/* Lectures List */}
                                {lecturesLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="relative">
                                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                        </div>
                                    </div>
                                ) : filteredLectures.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                        <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">No lectures available for this course</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredLectures.map((lecture, index) => (
                                            <div
                                                key={lecture.id}
                                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden"
                                            >
                                                <div className="p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-start space-x-4 flex-1">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                    <span className="text-blue-600 font-bold">{index + 1}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                                    {lecture.title}
                                                                </h3>
                                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                                    {lecture.description}
                                                                </p>
                                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                                    <div className="flex items-center">
                                                                        <Clock className="w-4 h-4 mr-1" />
                                                                        <span>{formatDuration(lecture.duration)}</span>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Calendar className="w-4 h-4 mr-1" />
                                                                        <span>{formatDate(lecture.created_at)}</span>
                                                                    </div>
                                                                    {lecture.materials && lecture.materials.length > 0 && (
                                                                        <div className="flex items-center">
                                                                            <FileText className="w-4 h-4 mr-1" />
                                                                            <span>{lecture.materials.length} materials</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {lecture.is_watched && (
                                                            <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                                <PlayCircle className="w-4 h-4 mr-1" />
                                                                <span className="text-xs font-medium">Completed</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Progress Bar */}
                                                    {lecture.watch_progress !== undefined && lecture.watch_progress > 0 && (
                                                        <div className="mb-4">
                                                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                                                <span>Progress</span>
                                                                <span>{lecture.watch_progress}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(lecture.watch_progress)}`}
                                                                    style={{ width: `${lecture.watch_progress}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleWatchLecture(lecture)}
                                                            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                                                        >
                                                            <Play className="w-4 h-4 mr-2" />
                                                            Watch Lecture
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewLecture(lecture)}
                                                            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Lecture Details Modal */}
            {selectedLecture && !showVideoPlayer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {selectedLecture.title}
                                    </h2>
                                    <div className="flex items-center text-gray-600 space-x-4">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            <span>{formatDuration(selectedLecture.duration)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            <span>{formatDate(selectedLecture.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedLecture(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-600">{selectedLecture.description}</p>
                                </div>

                                {selectedLecture.materials && selectedLecture.materials.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Materials</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {selectedLecture.materials.map((material, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                                >
                                                    <div className="flex items-center">
                                                        <FileText className="w-5 h-5 text-gray-500 mr-2" />
                                                        <span className="text-sm font-medium text-gray-700">{material}</span>
                                                    </div>
                                                    <button className="text-blue-600 hover:text-blue-700 transition-colors">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedLecture.transcript && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Transcript</h3>
                                        <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                                            <p className="text-gray-600 text-sm">{selectedLecture.transcript}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4 border-t">
                                    <button
                                        onClick={() => setSelectedLecture(null)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => handleWatchLecture(selectedLecture)}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Watch Lecture
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Player Modal */}
            {showVideoPlayer && selectedLecture && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-6xl">
                        <div className="bg-black rounded-lg overflow-hidden">
                            <div className="aspect-video bg-gray-900 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg mb-2">Video Player</p>
                                    <p className="text-sm opacity-75">
                                        Video URL: {selectedLecture.video_url}
                                    </p>
                                    <p className="text-xs opacity-50 mt-2">
                                        Integrate with your preferred video player component
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{selectedLecture.title}</h3>
                                        <p className="text-sm text-gray-600">{formatDuration(selectedLecture.duration)}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowVideoPlayer(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        Close Player
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