const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('celebria_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const api = {
  // Auth
  register: (userData) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    }).then(handleResponse),

  login: (credentials) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    }).then(handleResponse),

  getMe: () =>
    fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders()
    }).then(handleResponse),

  // Invitations (Host)
  getMyInvitations: () =>
    fetch(`${BASE_URL}/invitations`, {
      method: 'GET',
      headers: getHeaders()
    }).then(handleResponse),

  getInvitationById: (id) =>
    fetch(`${BASE_URL}/invitations/${id}`, {
      method: 'GET',
      headers: getHeaders()
    }).then(handleResponse),

  createInvitation: (invitationData) =>
    fetch(`${BASE_URL}/invitations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(invitationData)
    }).then(handleResponse),

  updateInvitation: (id, invitationData) =>
    fetch(`${BASE_URL}/invitations/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(invitationData)
    }).then(handleResponse),

  deleteInvitation: (id) =>
    fetch(`${BASE_URL}/invitations/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Public Invitation (Guest)
  getPublicInvitation: (slug) =>
    fetch(`${BASE_URL}/invitations/public/${slug}`, {
      method: 'GET'
    }).then(handleResponse),

  // RSVP (Guest)
  submitRsvp: (slug, rsvpData) =>
    fetch(`${BASE_URL}/rsvps/public/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rsvpData)
    }).then(handleResponse),

  // RSVPs (Host)
  getEventRsvps: (invitationId) =>
    fetch(`${BASE_URL}/rsvps/event/${invitationId}`, {
      method: 'GET',
      headers: getHeaders()
    }).then(handleResponse),

  deleteRsvp: (rsvpId) =>
    fetch(`${BASE_URL}/rsvps/${rsvpId}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  exportRsvpsCsvUrl: (invitationId) =>
    `${BASE_URL}/rsvps/event/${invitationId}/export`
};
