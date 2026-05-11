import {
  pcCenters as defaultPCCenters,
  reviews as defaultReviews,
  type PCCenter,
  type Review,
} from "../app/data/mockData";

export type { PCCenter, Review };

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Booking {
  id: string;
  userId?: string;
  pcCenterId: string;
  date: string;
  time: string;
  duration: number;
  seats: string[];
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getAuthToken(): string | null {
  try {
    const stored = localStorage.getItem("eco_user");
    if (!stored) return null;
    const user = JSON.parse(stored);
    return user?.token || null;
  } catch {
    return null;
  }
}

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  return result.data ?? result;
}

// ── PC Centers ────────────────────────────────────────────────────────────────

export async function getPCCenters(): Promise<PCCenter[]> {
  try {
    return await apiCall<PCCenter[]>("/pc-centers");
  } catch (error) {
    console.warn("API unavailable, using local mock data:", error);
    const stored = localStorage.getItem("eco_pc_centers");
    const raw: PCCenter[] = stored ? JSON.parse(stored) : [];
    // Deduplicate within local entries: keep last entry per name
    const localMap = new Map<string, PCCenter>();
    for (const c of raw) localMap.set(c.name.toLowerCase(), c);
    const localCenters = Array.from(localMap.values());
    // Remove mock entries that share a name with a local entry
    const localNames = new Set(localCenters.map((c) => c.name.toLowerCase()));
    const filteredMock = defaultPCCenters.filter(
      (c) => !localNames.has(c.name.toLowerCase())
    );
    return [...filteredMock, ...localCenters];
  }
}

export async function getPCCenterById(id: string): Promise<PCCenter | undefined> {
  try {
    return await apiCall<PCCenter>(`/pc-centers/${id}`);
  } catch {
    const stored = localStorage.getItem("eco_pc_centers");
    const localCenters: PCCenter[] = stored ? JSON.parse(stored) : [];
    return (
      defaultPCCenters.find((c) => c.id === id) ??
      localCenters.find((c) => c.id === id)
    );
  }
}

export async function createPCCenter(center: Omit<PCCenter, "id">): Promise<PCCenter> {
  return apiCall<PCCenter>("/pc-centers", {
    method: "POST",
    body: JSON.stringify(center),
  });
}

export async function addPCCenter(center: PCCenter): Promise<PCCenter> {
  try {
    return await apiCall<PCCenter>("/pc-centers", {
      method: "POST",
      body: JSON.stringify(center),
    });
  } catch {
    const stored = localStorage.getItem("eco_pc_centers");
    const existing: PCCenter[] = stored ? JSON.parse(stored) : [];
    // Replace if same name already exists, otherwise append
    const newCenter = { ...center, id: `local-${Date.now()}` };
    const updated = existing.filter(
      (c) => c.name.toLowerCase() !== center.name.toLowerCase()
    );
    localStorage.setItem("eco_pc_centers", JSON.stringify([...updated, newCenter]));
    return newCenter;
  }
}

export async function getPCCentersByOwner(ownerId: string): Promise<PCCenter[]> {
  try {
    return await apiCall<PCCenter[]>(`/pc-centers?ownerId=${ownerId}`);
  } catch {
    const stored = localStorage.getItem("eco_pc_centers");
    if (stored) {
      const all: PCCenter[] = JSON.parse(stored);
      return all.filter((c) => c.ownerId === ownerId);
    }
    return [];
  }
}

export async function updatePCCenter(id: string, center: Partial<PCCenter>): Promise<PCCenter> {
  return apiCall<PCCenter>(`/pc-centers/${id}`, {
    method: "PUT",
    body: JSON.stringify(center),
  });
}

export async function deletePCCenter(id: string): Promise<void> {
  await apiCall(`/pc-centers/${id}`, { method: "DELETE" });
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function getUsers(): Promise<User[]> {
  try {
    return await apiCall<User[]>("/users");
  } catch {
    return [];
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    return await apiCall<User>(`/users/${id}`);
  } catch {
    return undefined;
  }
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
  return apiCall<User>("/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export async function updateUser(id: string, user: Partial<User>): Promise<User> {
  return apiCall<User>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
  });
}

export async function deleteUser(id: string): Promise<void> {
  await apiCall(`/users/${id}`, { method: "DELETE" });
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export async function getBookings(): Promise<Booking[]> {
  try {
    return await apiCall<Booking[]>("/bookings");
  } catch {
    return [];
  }
}

export async function getBookingById(id: string): Promise<Booking | undefined> {
  try {
    return await apiCall<Booking>(`/bookings/${id}`);
  } catch {
    return undefined;
  }
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  try {
    return await apiCall<Booking[]>(`/bookings?userId=${userId}`);
  } catch {
    const stored = localStorage.getItem("eco_bookings");
    if (stored) {
      const all: Booking[] = JSON.parse(stored);
      return all.filter((b) => b.userId === userId);
    }
    return [];
  }
}

export async function createBooking(booking: Omit<Booking, "id">): Promise<Booking> {
  try {
    return await apiCall<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(booking),
    });
  } catch {
    const stored = localStorage.getItem("eco_bookings");
    const existing: Booking[] = stored ? JSON.parse(stored) : [];
    const newBooking: Booking = { ...booking, id: `local-${Date.now()}` };
    localStorage.setItem("eco_bookings", JSON.stringify([...existing, newBooking]));
    return newBooking;
  }
}

export async function saveBooking(booking: Omit<Booking, "id" | "status">): Promise<Booking> {
  return createBooking({ ...booking, status: "pending" });
}

export async function getBookingsByPCCenterIds(pcCenterIds: string[]): Promise<Booking[]> {
  if (pcCenterIds.length === 0) return [];
  try {
    const results = await Promise.all(
      pcCenterIds.map((id) => apiCall<Booking[]>(`/bookings?pcCenterId=${id}`))
    );
    return results.flat();
  } catch {
    const stored = localStorage.getItem("eco_bookings");
    if (stored) {
      const all: Booking[] = JSON.parse(stored);
      return all.filter((b) => pcCenterIds.includes(b.pcCenterId));
    }
    return [];
  }
}

export async function updateBooking(id: string, booking: Partial<Booking>): Promise<Booking> {
  try {
    return await apiCall<Booking>(`/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify(booking),
    });
  } catch {
    const stored = localStorage.getItem("eco_bookings");
    if (stored) {
      const all: Booking[] = JSON.parse(stored);
      const updated = all.map((b) => (b.id === id ? { ...b, ...booking } : b));
      localStorage.setItem("eco_bookings", JSON.stringify(updated));
      const found = updated.find((b) => b.id === id);
      if (found) return found;
    }
    throw new Error("Booking not found");
  }
}

export async function cancelBooking(id: string): Promise<Booking> {
  return updateBooking(id, { status: "cancelled" });
}

export async function deleteBooking(id: string): Promise<void> {
  await apiCall(`/bookings/${id}`, { method: "DELETE" });
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export async function getReviewsByCenterId(pcCenterId: string): Promise<Review[]> {
  try {
    return await apiCall<Review[]>(`/reviews/center/${pcCenterId}`);
  } catch {
    const stored = localStorage.getItem("eco_reviews");
    const local: Review[] = stored ? JSON.parse(stored) : [];
    const localForCenter = local.filter((r) => r.pcCenterId === pcCenterId);
    const mockForCenter = defaultReviews.filter((r) => r.pcCenterId === pcCenterId);
    const localIds = new Set(localForCenter.map((r) => r.id));
    const merged = [...mockForCenter.filter((r) => !localIds.has(r.id)), ...localForCenter];
    return merged;
  }
}

export async function addReview(review: Omit<Review, "id" | "date">): Promise<Review> {
  try {
    return await apiCall<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(review),
    });
  } catch {
    const newReview: Review = {
      ...review,
      id: `${review.pcCenterId}-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
    };
    const stored = localStorage.getItem("eco_reviews");
    const existing: Review[] = stored ? JSON.parse(stored) : [];
    localStorage.setItem("eco_reviews", JSON.stringify([...existing, newReview]));
    return newReview;
  }
}

export async function saveReview(review: Review): Promise<Review> {
  return addReview({
    pcCenterId: review.pcCenterId,
    userName: review.userName,
    userAvatar: review.userAvatar,
    rating: review.rating,
    comment: review.comment,
  });
}
