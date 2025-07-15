// EnrolledCourses.tsx
import React, { useEffect, useState } from 'react';
import { Course, CourseCard } from './CourseManagement'; // Adjust import as needed
import { useNavigate } from 'react-router-dom';
import { GraduationCap, CheckCircle } from 'lucide-react';

const API_BASE = "https://projects-1-88nz.onrender.com/api/student";
const getToken = () => localStorage.getItem("token");

const api = {
    getEnrolledCourses: async () => {
        const res = await fetch(`${API_BASE}/my-courses`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to fetch enrolled courses");
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

export const EnrolledCourses: React.FC = () => {
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [derollingCourseId, setDerollingCourseId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEnrolled = async () => {
            try {
                const data = await api.getEnrolledCourses();
                setEnrolledCourses(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrolled();
    }, []);

    const handleDeroll = async (courseId: number) => {
        try {
            setDerollingCourseId(courseId);
            await api.unenrollFromCourse(courseId);
            setEnrolledCourses(prev => prev.filter(c => c.id !== courseId));
            setMessage('Successfully unenrolled from the course!');
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage('Failed to unenroll from the course. Please try again.');
            setTimeout(() => setMessage(null), 5000);
        } finally {
            setDerollingCourseId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <GraduationCap className="w-6 h-6 text-blue-600 mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900">My Enrolled Courses</h2>
                </div>
                <button
                    onClick={() => navigate('/student/course-management')}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
                >
                    Back to All Courses
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : enrolledCourses.length === 0 ? (
                <div className="text-center py-12 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                    <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">You're not enrolled in any courses yet.</p>
                </div>
            ) : (
                <>
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${message.includes('Successfully')
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                            <div className="flex items-center">
                                {message.includes('Successfully') ? (
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                ) : null}
                                {message}
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isEnrolled={true}
                                onViewCourse={(id) => console.log("View course", id)}
                                onDeroll={handleDeroll}
                                isDerolling={derollingCourseId === course.id}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
