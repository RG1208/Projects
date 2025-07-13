import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Calendar,
    Edit3,
    Save,
    X,
    Trash2,
    BookOpen,
    FileText,
    Award,
    Settings,
    Shield,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    Clock,
    Target
} from 'lucide-react';

// Types
interface UserProfile {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at?: string;
    role?: string;
    avatar_url?: string;
}

interface StudentStats {
    total_courses_enrolled: number;
    enrolled_courses: string[];
    total_assignments: number;
}

// Mock API functions - replace with actual API calls
const profileApi = {
    getProfile: async (): Promise<UserProfile> => {
        // Replace with actual API call: fetch('/api/student/profile')
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    id: 1,
                    name: "John Doe",
                    email: "john.doe@example.com",
                    created_at: "2024-01-15T00:00:00Z",
                    updated_at: "2024-12-01T00:00:00Z",
                    role: "student",
                    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                });
            }, 800);
        });
    },

    updateProfile: async (data: Partial<UserProfile>): Promise<void> => {
        // Replace with actual API call: fetch('/api/student/profile', { method: 'PUT', body: JSON.stringify(data) })
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error("Failed to update profile. Please try again."));
                }
            }, 1000);
        });
    },

    deleteProfile: async (): Promise<void> => {
        // Replace with actual API call: fetch('/api/student/profile', { method: 'DELETE' })
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error("Failed to delete profile. Please try again."));
                }
            }, 1500);
        });
    },

    getStudentStats: async (): Promise<StudentStats> => {
        // Replace with actual API call: fetch('/api/student/stats')
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    total_courses_enrolled: 4,
                    enrolled_courses: [
                        "Introduction to React Development",
                        "Data Science Fundamentals",
                        "Advanced Python Programming",
                        "Mobile App Development with Flutter"
                    ],
                    total_assignments: 12
                });
            }, 600);
        });
    }
};

export const ProfileSection: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', email: '' });
    const [updating, setUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadProfileData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [profileData, statsData] = await Promise.all([
                profileApi.getProfile(),
                profileApi.getStudentStats()
            ]);

            setProfile(profileData);
            setStats(statsData);
            setEditForm({ name: profileData.name, email: profileData.email });
        } catch (err) {
            setError('Failed to load profile data. Please try again.');
            console.error('Error loading profile:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfileData();
    }, []);

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing - reset form
            setEditForm({ name: profile?.name || '', email: profile?.email || '' });
        }
        setIsEditing(!isEditing);
        setUpdateMessage(null);
    };

    const handleUpdateProfile = async () => {
        if (!profile) return;

        try {
            setUpdating(true);
            setUpdateMessage(null);

            await profileApi.updateProfile({
                name: editForm.name,
                email: editForm.email
            });

            // Update local state
            setProfile(prev => prev ? { ...prev, name: editForm.name, email: editForm.email } : null);
            setIsEditing(false);
            setUpdateMessage('Profile updated successfully!');

            setTimeout(() => setUpdateMessage(null), 3000);
        } catch (err) {
            setUpdateMessage('Failed to update profile. Please try again.');
            setTimeout(() => setUpdateMessage(null), 5000);
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteProfile = async () => {
        try {
            setDeleting(true);
            await profileApi.deleteProfile();

            // In a real app, you would redirect to login or show a success message
            alert('Profile deleted successfully. You will be redirected to the login page.');

        } catch (err) {
            alert('Failed to delete profile. Please try again.');
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-700 text-lg mb-4">{error}</p>
                        <button
                            onClick={loadProfileData}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile || !stats) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                            <p className="text-gray-600">Manage your account settings and view your progress</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleEditToggle}
                                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isEditing
                                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                            >
                                {isEditing ? (
                                    <>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit3 className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Update Message */}
                {updateMessage && (
                    <div className={`mb-6 p-4 rounded-lg ${updateMessage.includes('successfully')
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        <div className="flex items-center">
                            {updateMessage.includes('successfully') ? (
                                <CheckCircle className="w-5 h-5 mr-2" />
                            ) : (
                                <AlertTriangle className="w-5 h-5 mr-2" />
                            )}
                            {updateMessage}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start space-x-6">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                                            {profile.avatar_url ? (
                                                <img
                                                    src={profile.avatar_url}
                                                    alt={profile.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="w-12 h-12 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Profile Details */}
                                    <div className="flex-1">
                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={editForm.email}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div className="flex space-x-3 pt-2">
                                                    <button
                                                        onClick={handleUpdateProfile}
                                                        disabled={updating || !editForm.name.trim() || !editForm.email.trim()}
                                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {updating ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save className="w-4 h-4 mr-2" />
                                                                Save Changes
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                                                    <p className="text-gray-600 capitalize">{profile.role} Account</p>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center text-gray-600">
                                                        <Mail className="w-5 h-5 mr-3" />
                                                        <span>{profile.email}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <Calendar className="w-5 h-5 mr-3" />
                                                        <span>Member since {formatDate(profile.created_at)}</span>
                                                    </div>
                                                    {profile.updated_at && (
                                                        <div className="flex items-center text-gray-600">
                                                            <Clock className="w-5 h-5 mr-3" />
                                                            <span>Last updated {formatDate(profile.updated_at)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enrolled Courses */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrolled Courses</h3>
                                {stats.enrolled_courses.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No courses enrolled yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {stats.enrolled_courses.map((course, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                            >
                                                <div className="flex items-center">
                                                    <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                                                    <span className="font-medium text-gray-900">{course}</span>
                                                </div>
                                                <span className="text-sm text-gray-500">Active</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                                        <span className="text-gray-600">Courses</span>
                                    </div>
                                    <span className="text-2xl font-bold text-blue-600">{stats.total_courses_enrolled}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FileText className="w-5 h-5 text-green-600 mr-2" />
                                        <span className="text-gray-600">Assignments</span>
                                    </div>
                                    <span className="text-2xl font-bold text-green-600">{stats.total_assignments}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                                        <span className="text-gray-600">Progress</span>
                                    </div>
                                    <span className="text-2xl font-bold text-purple-600">85%</span>
                                </div>
                            </div>
                        </div>

                        {/* Account Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Account Settings
                                </button>
                                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <Shield className="w-4 h-4 mr-2" />
                                    Privacy Settings
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Account
                                </button>
                            </div>
                        </div>

                        {/* Achievement Badge */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                            <div className="text-center">
                                <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                                <h4 className="font-semibold text-gray-900 mb-2">Active Learner</h4>
                                <p className="text-sm text-gray-600">
                                    You're enrolled in {stats.total_courses_enrolled} courses. Keep up the great work!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="text-center">
                            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Account</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete your account? This action cannot be undone and you will lose all your progress.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteProfile}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deleting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Deleting...
                                        </div>
                                    ) : (
                                        'Delete Account'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};