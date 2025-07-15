import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import {
    BookOpen,
    Users,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    GraduationCap,
    Clock,
    Filter,
    Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ✅ NEW

// Course Type
export interface Course {
    teacher_name: ReactNode;
    id: number;
    title: string;
    description: string;
    instructor?: string;
    duration?: string;
    students_count?: number;
    created_at: string;
    category?: string;
    difficulty?: string;
}

// API functions for backend integration
const API_BASE = "https://projects-1-88nz.onrender.com/api/student";

const getToken = () => localStorage.getItem("token");

const api = {
    getAllCourses: async () => {
        const res = await fetch(`${API_BASE}/courses`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to fetch all courses");
        return await res.json();
    },
    getEnrolledCourses: async () => {
        const res = await fetch(`${API_BASE}/my-courses`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to fetch enrolled courses");
        return await res.json();
    },
    enrollInCourse: async (courseId: number) => {
        const res = await fetch(`${API_BASE}/courses/${courseId}/enroll`, {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to enroll in course");
        }
        return await res.json();
    },
    unenrollFromCourse: async (courseId: number) => {
        const res = await fetch(`${API_BASE}/courses/${courseId}/unenroll`, {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to unenroll from course");
        }
        return await res.json();
    },
};

// CourseCard Component

export const CourseCard: React.FC<{
    course: Course;
    isEnrolled?: boolean;
    onEnroll?: (courseId: number) => void;
    isEnrolling?: boolean;
    onViewCourse?: (courseId: number) => void;
    onDeroll?: (courseId: number) => void;
    isDerolling?: boolean;
}> = ({
    course,
    isEnrolled = false,
    onEnroll,
    isEnrolling = false,
    onViewCourse,
    onDeroll,
    isDerolling = false
}) => {
        return (
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                            {course.teacher_name && (
                                <p className="text-sm text-gray-600 mb-2">Instructor: {course.teacher_name}</p>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                            {course.duration && (
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>{course.duration}</span>
                                </div>
                            )}
                            {course.students_count !== undefined && (
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    <span>{course.students_count} students</span>
                                </div>
                            )}
                        </div>
                        {course.category && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                {course.category}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500">
                            <BookOpen className="w-4 h-4 mr-1" />
                            <span className="text-xs">{new Date(course.created_at).toLocaleDateString()}</span>
                        </div>

                        {isEnrolled ? (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => onViewCourse?.(course.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                >
                                    View Course
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDeroll?.(course.id)}
                                    disabled={isDerolling}
                                    className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium ${isDerolling ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isDerolling ? 'Removing...' : 'Deroll'}
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onEnroll?.(course.id)}
                                disabled={isEnrolling}
                                className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium ${isEnrolling ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };


// CourseSection Component
const CourseSection: React.FC<{
    title: string;
    courses: Course[];
    isEnrolled?: boolean;
    onEnroll?: (courseId: number) => void;
    enrollingCourseId?: number | null;
    onViewCourse?: (courseId: number) => void;
    onDeroll?: (courseId: number) => void;
    derollingCourseId?: number | null;
    emptyMessage: string;
    icon: 'book' | 'graduation';
}> = ({
    title,
    courses,
    isEnrolled = false,
    onEnroll,
    enrollingCourseId,
    onViewCourse,
    onDeroll,
    derollingCourseId,
    emptyMessage,
    icon
}) => {
        const IconComponent = icon === 'book' ? BookOpen : GraduationCap;

        return (
            <section className="mb-12">
                <div className="flex items-center mb-6">
                    <IconComponent className="w-6 h-6 mr-3 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        {courses.length}
                    </span>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <IconComponent className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">{emptyMessage}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isEnrolled={isEnrolled}
                                onEnroll={onEnroll}
                                isEnrolling={enrollingCourseId === course.id}
                                onViewCourse={onViewCourse}
                                onDeroll={onDeroll}
                                isDerolling={derollingCourseId === course.id}
                            />
                        ))}
                    </div>
                )}
            </section>
        );
    };

// SearchBar Component
const SearchBar: React.FC<{
    searchTerm: string;
    onSearchChange: (term: string) => void;
    filterCategory: string;
    onFilterChange: (category: string) => void;
    categories: string[];
}> = ({ searchTerm, onSearchChange, filterCategory, onFilterChange, categories }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
            </div>

            <div className="relative min-w-[200px]">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                    value={filterCategory}
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

// Main CourseManagement Component
export const CourseManagement: React.FC = () => {
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enrollingCourseId, setEnrollingCourseId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [enrollmentMessage, setEnrollmentMessage] = useState<string | null>(null);
    const [derollingCourseId, setDerollingCourseId] = useState<number | null>(null);

    const navigate = useNavigate(); // ✅ NEW

    const categories = useMemo(() => {
        const allCategories = allCourses.map(c => c.category).filter((c): c is string => Boolean(c));
        return Array.from(new Set(allCategories));
    }, [allCourses]);

    const availableCourses = useMemo(() => {
        const enrolledIds = new Set(enrolledCourses.map(c => c.id));
        return allCourses
            .filter(c => !enrolledIds.has(c.id))
            .filter(c =>
                c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.instructor && c.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .filter(c => !filterCategory || c.category === filterCategory);
    }, [allCourses, enrolledCourses, searchTerm, filterCategory]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [allCoursesData, enrolledCoursesData] = await Promise.all([
                api.getAllCourses(),
                api.getEnrolledCourses()
            ]);
            setAllCourses(allCoursesData as Course[]);
            setEnrolledCourses(enrolledCoursesData as Course[]);
        } catch (err) {
            setError('Failed to load courses. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEnroll = async (courseId: number) => {
        try {
            setEnrollingCourseId(courseId);
            setEnrollmentMessage(null);
            await api.enrollInCourse(courseId);
            const enrolledCourse = allCourses.find(c => c.id === courseId);
            if (enrolledCourse) {
                setEnrolledCourses(prev => [...prev, enrolledCourse]);
                setEnrollmentMessage('Successfully enrolled in the course!');
                setTimeout(() => setEnrollmentMessage(null), 3000);
            }
        } catch (err) {
            setEnrollmentMessage('Failed to enroll in the course. Please try again.');
            console.error(err);
            setTimeout(() => setEnrollmentMessage(null), 5000);
        } finally {
            setEnrollingCourseId(null);
        }
    };

    const handleDeroll = async (courseId: number) => {
        try {
            setDerollingCourseId(courseId);
            await api.unenrollFromCourse(courseId);
            setEnrolledCourses(prev => prev.filter(c => c.id !== courseId));
            // Move course back to allCourses if not already present
            setAllCourses(prevAll => {
                const derolledCourse = enrolledCourses.find(c => c.id === courseId);
                if (derolledCourse && !prevAll.some(c => c.id === courseId)) {
                    return [...prevAll, derolledCourse];
                }
                return prevAll;
            });
            setEnrollmentMessage('Successfully unenrolled from the course!');
            setTimeout(() => setEnrollmentMessage(null), 3000);
        } catch (err) {
            setEnrollmentMessage('Failed to unenroll from the course. Please try again.');
            setTimeout(() => setEnrollmentMessage(null), 5000);
        } finally {
            setDerollingCourseId(null);
        }
    };

    const handleViewCourse = (courseId: number) => {
        console.log(`Viewing course ${courseId}`);
        // Add routing logic if needed
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Dashboard</h1>
                            <p className="text-gray-600">Discover new courses and manage your learning journey</p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 lg:mt-0">
                            <StatCard icon={<BookOpen />} label="Total Courses" count={allCourses.length} color="blue" />
                            <StatCard icon={<CheckCircle />} label="Enrolled" count={enrolledCourses.length} color="green" />
                            <StatCard icon={<Users />} label="Available" count={availableCourses.length} color="purple" />
                            <StatCard icon={<TrendingUp />} label="Categories" count={categories.length} color="orange" />
                        </div>
                        <div className="flex justify-end mt-4 lg:mt-0">
                            <button
                                onClick={() => navigate('/student/courses-enrolled')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
                            >
                                View Enrolled Courses
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {enrollmentMessage && (
                    <div className={`mb-6 p-4 rounded-lg ${enrollmentMessage.includes('Successfully')
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        <div className="flex items-center">
                            {enrollmentMessage.includes('Successfully') ? (
                                <CheckCircle className="w-5 h-5 mr-2" />
                            ) : (
                                <AlertCircle className="w-5 h-5 mr-2" />
                            )}
                            {enrollmentMessage}
                        </div>
                    </div>
                )}

                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterCategory={filterCategory}
                    onFilterChange={setFilterCategory}
                    categories={categories}
                />

                <CourseSection
                    title="Available Courses"
                    courses={availableCourses}
                    isEnrolled={false}
                    onEnroll={handleEnroll}
                    enrollingCourseId={enrollingCourseId}
                    emptyMessage="No courses match your search criteria. Try adjusting your search or filter settings."
                    icon="book"
                />

            </div>
        </div>
    );
};

// StatCard Component
const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    count: number;
    color: string;
}> = ({ icon, label, count, color }) => (
    <div className={`bg-${color}-50 rounded-lg p-4 text-center`}>
        <div className={`text-${color}-600 mx-auto mb-2`}>{icon}</div>
        <div className={`text-2xl font-bold text-${color}-900`}>{count}</div>
        <div className={`text-xs text-${color}-600`}>{label}</div>
    </div>
);
