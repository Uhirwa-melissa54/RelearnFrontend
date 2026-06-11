/**
 * Central API utility for the Relearn frontend.
 *
 * All requests go through the API Gateway at http://localhost:8080
 * (proxied via Vite in dev, direct in production).
 *
 * Token storage:
 *   - accessToken  → localStorage (short-lived, 15 min)
 *   - refreshToken → localStorage (long-lived, 7 days)
 *   - user         → localStorage (id, email, role, className, academicYear)
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Normalizes Note/Submission.fileUrl to the bare stored filename.
 * Handles legacy values that stored a full URL or filesystem path.
 */
export const normalizeStoredFilename = (fileRef) => {
  if (!fileRef) return '';
  const value = String(fileRef).trim();
  if (!value) return '';

  if (/^https?:\/\//i.test(value)) {
    try {
      const parts = new URL(value).pathname.split('/').filter(Boolean);
      return decodeURIComponent(parts[parts.length - 1] || '');
    } catch {
      return decodeURIComponent(value.split('/').pop() || value);
    }
  }

  const normalized = value.replace(/\\/g, '/');
  if (normalized.includes('/')) {
    return decodeURIComponent(normalized.split('/').pop());
  }
  return decodeURIComponent(value);
};

/** Builds a safe authenticated download path for a stored file reference. */
export const buildDownloadPath = (basePath, fileRef) => {
  const filename = normalizeStoredFilename(fileRef);
  if (!filename) return null;
  return `${basePath}/${encodeURIComponent(filename)}`;
};

/** Download a teacher note file with JWT auth. */
export const downloadNoteFile = async (fileRef) => {
  const path = buildDownloadPath('/teacher/notes/download', fileRef);
  const filename = normalizeStoredFilename(fileRef);
  if (!path || !filename) {
    alert('Download failed: no file attached.');
    return;
  }
  await authenticatedDownload(path, filename);
};

/** Download a submission file with JWT auth. */
export const downloadSubmissionFile = async (fileRef) => {
  const path = buildDownloadPath('/submissions/download', fileRef);
  const filename = normalizeStoredFilename(fileRef);
  if (!path || !filename) {
    alert('Download failed: no file attached.');
    return;
  }
  await authenticatedDownload(path, filename);
};

// ----------------------------------------------------------------
//  Token helpers
// ----------------------------------------------------------------

export const saveAuth = (data) => {
  if (!data?.accessToken || !data?.refreshToken) {
    throw new Error('Invalid login response from server. Check that the API Gateway and Auth Service are running.');
  }
  localStorage.setItem('accessToken',  data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('user', JSON.stringify({
    id:           data.userId,
    email:        data.email,
    role:         data.role,
    className:    data.className    || null,
    academicYear: data.academicYear || null,
    fullName:     data.fullName     || null,
  }));
};

export const getToken = () => localStorage.getItem('accessToken');

export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const getUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export const clearAuth = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export const isLoggedIn = () => !!getToken();

/**
 * Logs out the current user (admin, teacher, or student):
 * deletes the refresh token in the auth database, then clears local storage.
 */
export const performLogout = async () => {
  const refreshToken = getRefreshToken();
  const user = getUser();

  try {
    if (refreshToken) {
      await apiRequest('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } else if (user?.id) {
      await apiRequest(`/auth/logout?userId=${user.id}`, { method: 'POST' });
    }
  } catch {
    // Still clear the client session even if the server call fails
  } finally {
    clearAuth();
  }
};

// ----------------------------------------------------------------
//  Core fetch wrapper
// ----------------------------------------------------------------

/**
 * Makes an authenticated API request.
 * Automatically attaches the JWT Authorization header.
 * On 401, attempts a token refresh once, then redirects to login.
 *
 * @param {string} path    - API path, e.g. '/api/auth/login'
 * @param {object} options - fetch options (method, body, headers, etc.)
 * @returns {Promise<any>} - parsed JSON response
 */
export const apiRequest = async (path, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const parseError = async (res) => {
    const err = await res.json().catch(() => ({}));
    return err.message || err.error || `Request failed: ${res.status}`;
  };

  // Handle 401 — refresh only for expired session on protected routes (not login/register)
  if (response.status === 401) {
    const isAuthEndpoint = path.startsWith('/auth/');
    if (isAuthEndpoint || !token) {
      throw new Error(await parseError(response));
    }

    const refreshed = await tryRefreshToken();
    if (refreshed) {
      const newToken = getToken();
      const retryResponse = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
      if (!retryResponse.ok) {
        throw new Error(await parseError(retryResponse));
      }
      return retryResponse.status === 204 ? null : retryResponse.json();
    }

    clearAuth();
    window.location.href = '/login';
    throw new Error('Session expired. Please sign in again.');
  }

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  // 204 No Content — return null
  if (response.status === 204) return null;

  return response.json();
};

/**
 * Downloads a file from an authenticated backend endpoint.
 * Sends the JWT Authorization header (unlike direct <a href> or window.open).
 * Converts the response to a blob and triggers a browser download.
 *
 * @param {string} url       - full API path, e.g. /api/teacher/notes/download/file.pdf
 * @param {string} filename  - the filename to use for the downloaded file
 */
export const authenticatedDownload = async (url, filename) => {
  if (!url || url.includes('://')) {
    alert('Download failed: invalid file reference. Please re-upload the note file.');
    return;
  }

  const safeFilename = normalizeStoredFilename(filename) || filename || 'download';
  const token = getToken();

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      // Try to refresh once on 401
      if (response.status === 401) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          const retryResponse = await fetch(`${BASE_URL}${url}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${getToken()}` },
          });
          if (!retryResponse.ok) throw new Error(`Download failed: ${retryResponse.status}`);
          return triggerBlobDownload(await retryResponse.blob(), safeFilename);
        }
        clearAuth();
        window.location.href = '/login';
        return;
      }
      throw new Error(`Download failed: ${response.status}`);
    }

    await triggerBlobDownload(await response.blob(), safeFilename);
  } catch (err) {
    const message = err.message === 'Failed to fetch'
      ? 'Cannot reach the API server. Ensure Discovery, Auth, Notes, Assignment services and API Gateway are running, then open the app at http://localhost:5173.'
      : err.message;
    alert('Download failed: ' + message);
  }
};

/**
 * Creates a temporary blob URL and clicks it to trigger a browser download.
 * Cleans up the blob URL after the click.
 */
const triggerBlobDownload = async (blob, filename) => {
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename || 'download';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke after a short delay to let the download start
  setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
};

/**
 * Fetches a protected file and returns the response Blob.
 * Used for inline preview (iframe) and view-online flows.
 *
 * @param {string} path - API path, e.g. /teacher/notes/download/file.pdf
 */
export const authenticatedFetchBlob = async (path) => {
  if (!path || path.includes('://')) {
    throw new Error('Invalid file reference. Please re-upload the note file.');
  }

  const doFetch = async (token) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

  let response = await doFetch(getToken());

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      response = await doFetch(getToken());
    } else {
      clearAuth();
      window.location.href = '/login';
      throw new Error('Session expired. Please sign in again.');
    }
  }

  if (!response.ok) {
    throw new Error(`Failed to load file: ${response.status}`);
  }

  return response.blob();
};

/**
 * Multipart upload with JWT auth (no Content-Type — browser sets boundary).
 */
const apiUpload = async (path, formData, method = 'POST') => {
  const doUpload = async (token) =>
    fetch(`${BASE_URL}${path}`, {
      method,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

  let response = await doUpload(getToken());

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      response = await doUpload(getToken());
    } else {
      clearAuth();
      window.location.href = '/login';
      throw new Error('Session expired. Please sign in again.');
    }
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Upload failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
};

// ----------------------------------------------------------------
//  Token refresh
// ----------------------------------------------------------------

const tryRefreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    return true;
  } catch {
    return false;
  }
};

// ----------------------------------------------------------------
//  Auth API
// ----------------------------------------------------------------

export const authApi = {
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => performLogout(),

  getMe: () => apiRequest('/student/me'),
};

// ----------------------------------------------------------------
//  Admin API
// ----------------------------------------------------------------

export const adminApi = {
  getDashboard: () =>
    apiRequest('/admin/dashboard'),

  getUsers: (params = {}) => {
    const safeParams = { search: '', size: 100, ...params };
    const query = new URLSearchParams(safeParams).toString();
    return apiRequest(`/admin/users${query ? '?' + query : ''}`);
  },

  getStudents: (params = {}) => {
    const safeParams = { search: '', size: 100, ...params };
    const query = new URLSearchParams(safeParams).toString();
    return apiRequest(`/admin/users/students${query ? '?' + query : ''}`);
  },

  getTeachers: (params = {}) => {
    const safeParams = { search: '', size: 100, ...params };
    const query = new URLSearchParams(safeParams).toString();
    return apiRequest(`/admin/users/teachers${query ? '?' + query : ''}`);
  },

  getUserById: (id) => apiRequest(`/admin/users/${id}`),

  createUser: (data) =>
    apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateUser: (id, data) =>
    apiRequest(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  assignRole: (id, role) =>
    apiRequest(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),

  resetPassword: (id, newPassword) =>
    apiRequest(`/admin/users/${id}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ newPassword }),
    }),

  deactivateUser: (id) =>
    apiRequest(`/admin/users/${id}/deactivate`, { method: 'PATCH' }),

  reactivateUser: (id) =>
    apiRequest(`/admin/users/${id}/reactivate`, { method: 'PATCH' }),

  deleteUser: (id) =>
    apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),

  getClasses: () => apiRequest('/admin/classes'),

  getClassDetails: (className) => apiRequest(`/admin/classes/${className}`),

  createClass: (data) =>
    apiRequest('/admin/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateClass: (className, data) =>
    apiRequest(`/admin/classes/${encodeURIComponent(className)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteClass: (className) =>
    apiRequest(`/admin/classes/${encodeURIComponent(className)}`, { method: 'DELETE' }),

  assignTeacher: (className, teacherId) =>
    apiRequest(`/admin/classes/${encodeURIComponent(className)}/assign-teacher`, {
      method: 'PATCH',
      body: JSON.stringify({ teacherId }),
    }),

  getStudentsByClass: (className) =>
    apiRequest(`/admin/classes/${encodeURIComponent(className)}/students`),

  getClassesByTeacher: (teacherId) =>
    apiRequest(`/admin/classes/teacher/${teacherId}`),

  getAcademicYears: () => apiRequest('/admin/academic-years'),

  getActivities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/activities${query ? '?' + query : ''}`);
  },

  getAssignmentStats: () => apiRequest('/admin/assignments/stats'),

  getNoteStats: () => apiRequest('/admin/notes/stats'),
};

// ----------------------------------------------------------------
//  Teacher API
// ----------------------------------------------------------------

export const teacherApi = {
  getProfile: () => apiRequest('/teacher/me'),

  getProfileById: (id) => apiRequest(`/teacher/profile/${id}`),

  changePassword: (data) =>
    apiRequest('/teacher/me/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getStudentCount: (className) =>
    apiRequest(`/teacher/classes/${className}/students/count`),

  getStudentsByClass: (className) =>
    apiRequest(`/teacher/classes/${className}/students`),

  // Returns classes assigned to this teacher by admin (from AcademicClass table)
  getAssignedClasses: () =>
    apiRequest('/teacher/assigned-classes'),

  // Dashboard
  getDashboard: (teacherId) =>
    apiRequest(`/teacher/assignments/dashboard/${teacherId}`),

  // Assignments
  getAssignments: (teacherId) =>
    apiRequest(`/teacher/assignments/${teacherId}`),

  getAssignmentsByClassAndCourse: (teacherId, className, courseName) =>
    apiRequest(`/teacher/assignments/${teacherId}/class/${className}/course/${courseName}`),

  getAssignmentStats: (assignmentId, totalExpected = 0) =>
    apiRequest(`/teacher/assignments/${assignmentId}/stats?totalExpected=${totalExpected}`),

  createAssignment: (data) =>
    apiRequest('/teacher/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateAssignment: (id, data) =>
    apiRequest(`/teacher/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteAssignment: (id) =>
    apiRequest(`/teacher/assignments/${id}`, { method: 'DELETE' }),

  // Submissions
  getSubmissionsForAssignment: (assignmentId, status = '') =>
    apiRequest(`/teacher/submissions/assignment/${assignmentId}${status ? '?status=' + status : ''}`),

  getSubmissionById: (id) => apiRequest(`/teacher/submissions/${id}`),

  getPendingReviews: (teacherId) =>
    apiRequest(`/teacher/submissions/pending/${teacherId}`),

  gradeSubmission: (id, teacherId, data) =>
    apiRequest(`/teacher/submissions/${id}/grade?teacherId=${teacherId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Notes
  getNotes: (teacherId) => apiRequest(`/teacher/notes/${teacherId}`),

  getNotesByClassAndCourse: (teacherId, className, courseName) =>
    apiRequest(`/teacher/notes/${teacherId}/class/${className}/course/${courseName}`),

  getNoteById: (id) => apiRequest(`/teacher/notes/detail/${id}`),

  uploadNote: (formData) => apiUpload('/teacher/notes', formData, 'POST'),

  updateNote: (id, formData) => apiUpload(`/teacher/notes/${id}`, formData, 'PUT'),

  deleteNote: (id) =>
    apiRequest(`/teacher/notes/${id}`, { method: 'DELETE' }),

  downloadNote: (fileRef) => buildDownloadPath('/teacher/notes/download', fileRef),
};

// ----------------------------------------------------------------
//  Student API
// ----------------------------------------------------------------

export const studentApi = {
  getProfile: () => apiRequest('/student/me'),

  getClasses: () => apiRequest('/student/classes'),

  changePassword: (data) =>
    apiRequest('/student/me/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Notes
  getNotesByClass: (className, academicYear = '') =>
    apiRequest(`/student/notes/class/${className}${academicYear ? '?academicYear=' + academicYear : ''}`),

  getNoteDetail: (id) => apiRequest(`/student/notes/${id}`),

  getRecentNotes: (className, limit = 5) =>
    apiRequest(`/student/notes/recent/${className}?limit=${limit}`),

  getNotesByYear: (className, academicYear) =>
    apiRequest(`/student/notes/history/${className}/${academicYear}`),

  downloadNote: (fileRef) => buildDownloadPath('/teacher/notes/download', fileRef),

  // Assignments
  getAssignmentsByClass: (className, academicYear = '') =>
    apiRequest(`/student/assignments/class/${className}${academicYear ? '?academicYear=' + academicYear : ''}`),

  getActiveAssignments: (className) =>
    apiRequest(`/student/assignments/class/${className}/active`),

  getOverdueAssignments: (className) =>
    apiRequest(`/student/assignments/class/${className}/overdue`),

  getRecentAssignments: (className, limit = 5) =>
    apiRequest(`/student/assignments/recent/${className}?limit=${limit}`),

  getAssignmentsByYear: (className, academicYear) =>
    apiRequest(`/student/assignments/history/${className}/${academicYear}`),

  // Submissions
  submitAssignment: (formData) =>
    apiUpload('/submissions', formData, 'POST'),

  updateSubmission: (id, studentId, formData) =>
    apiUpload(`/submissions/${id}?studentId=${studentId}`, formData, 'PUT'),

  getMySubmissions: (studentId) =>
    apiRequest(`/submissions/student/${studentId}`),

  getMySubmissionForAssignment: (assignmentId, studentId) =>
    apiRequest(`/submissions/my/${assignmentId}?studentId=${studentId}`),

  downloadSubmission: (fileRef) => buildDownloadPath('/submissions/download', fileRef),
};
