'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Lock,
  User,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Download,
  MessageSquare,
  Calendar,
  Sparkles,
  Heart,
  AlertCircle,
  Filter,
  X,
} from 'lucide-react';
import { RSVPRecord } from '@/lib/supabase';

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data State
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'declined'>('all');

  // Message popup
  const [selectedRsvp, setSelectedRsvp] = useState<RSVPRecord | null>(null);

  // Check authentication on initial mount
  useEffect(() => {
    checkSessionAndFetch();
  }, []);

  const checkSessionAndFetch = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/admin/rsvps');
      if (res.status === 401) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      if (res.ok && data.success) {
        setRsvps(data.data || []);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (res.status !== 401) {
          setFetchError(data.error || 'Failed to load RSVPs.');
        }
      }
    } catch {
      setIsAuthenticated(false);
      setFetchError('Network error connecting to server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Invalid credentials. Please try again.');
        setIsLoggingIn(false);
        return;
      }

      setIsAuthenticated(true);
      setPassword('');
      await checkSessionAndFetch();
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore error during logout
    } finally {
      setIsAuthenticated(false);
      setRsvps([]);
      setUsername('');
      setPassword('');
    }
  };

  // Filtered list
  const filteredRsvps = useMemo(() => {
    return rsvps.filter((rsvp) => {
      const matchesStatus =
        statusFilter === 'all' || rsvp.attendance === statusFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rsvp.full_name.toLowerCase().includes(q) ||
        (rsvp.message && rsvp.message.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [rsvps, statusFilter, searchQuery]);

  // Aggregate statistics
  const stats = useMemo(() => {
    const total = rsvps.length;
    const attendingResponses = rsvps.filter((r) => r.attendance === 'attending');
    const declinedResponses = rsvps.filter((r) => r.attendance === 'declined');

    const totalAttendingGuests = attendingResponses.reduce(
      (sum, r) => sum + (r.guests_count || 1),
      0
    );

    return {
      totalResponses: total,
      attendingParties: attendingResponses.length,
      totalGuests: totalAttendingGuests,
      declinedCount: declinedResponses.length,
    };
  }, [rsvps]);

  // Export to CSV
  const handleExportCSV = () => {
    if (rsvps.length === 0) return;

    const headers = ['ID', 'Full Name', 'Attendance', 'Guest Count', 'Message', 'Submitted At'];
    const rows = filteredRsvps.map((r) => [
      r.id,
      `"${r.full_name.replace(/"/g, '""')}"`,
      r.attendance,
      r.attendance === 'attending' ? r.guests_count : 0,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${new Date(r.created_at).toLocaleString()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wedding_rsvps_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(d);
    } catch {
      return isoString;
    }
  };

  // Initial checking state
  if (isAuthenticated === null && isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#D28B77] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif italic text-lg text-[#713B1C]">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#E3BDB0] selection:text-[#613018]">
        {/* Subtle decorative background glow */}
        <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_top,_#F2DFD7_0%,_transparent_60%)]" />

        <div className="relative w-full max-w-md bg-[#FFFDFB] rounded-2xl shadow-xl shadow-[#713B1C]/5 border border-[#E3BDB0]/80 p-8 sm:p-10 backdrop-blur-sm">
          {/* Top Seal / Monogram */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#FAF0E6] border border-[#D28B77]/60 flex items-center justify-center mb-4 shadow-inner">
              <Lock className="w-7 h-7 text-[#713B1C]" />
            </div>
            <span className="text-xs uppercase font-sans tracking-[0.3em] text-[#9F4B31] font-semibold mb-1">
              Irene & Franklin
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#613018] italic font-semibold">
              Admin Portal
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#8F6E64] mt-2">
              Sign in with your wedding administrator credentials to view and manage RSVPs.
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-6 p-3.5 rounded-xl bg-[#FDF0ED] border border-[#F3C5BA] flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-[#9F4B31] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#8F3D2C] leading-snug">{authError}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs uppercase font-sans tracking-wider text-[#713B1C] font-semibold mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-[#946042]" />
                </div>
                <input
                  id="admin-username"
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="e.g. admin"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0]/70 border border-[#DAC7BA] rounded-xl text-sm text-[#613018] placeholder-[#B59685] focus:outline-none focus:ring-2 focus:ring-[#713B1C]/30 focus:border-[#713B1C] transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs uppercase font-sans tracking-wider text-[#713B1C] font-semibold mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#946042]" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAF6F0]/70 border border-[#DAC7BA] rounded-xl text-sm text-[#613018] placeholder-[#B59685] focus:outline-none focus:ring-2 focus:ring-[#713B1C]/30 focus:border-[#713B1C] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#946042] hover:text-[#713B1C] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#713B1C] to-[#8C4A25] hover:from-[#5A2E16] hover:to-[#713B1C] text-[#FFF6EE] font-serif text-lg tracking-wider italic font-semibold shadow-md shadow-[#713B1C]/20 hover:shadow-lg transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 text-center pt-6 border-t border-[#E3BDB0]/40">
            <p className="font-serif italic text-xs text-[#8F6E64]">
              Private wedding administration • C.S.I. St. Paul&apos;s Church, Keelkatalai
            </p>
          </div>
        </div>
      </main>
    );
  }

  // 2. AUTHENTICATED DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#613018] selection:bg-[#E3BDB0] selection:text-[#613018]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#FFFDFB]/95 backdrop-blur-md border-b border-[#E3BDB0]/70 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#FAF0E6] border border-[#D28B77]/60 flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 text-[#9F4B31] fill-[#9F4B31]/20" />
            </div>
            <div>
              <span className="block text-[11px] uppercase font-sans tracking-[0.25em] text-[#9F4B31] font-semibold">
                Irene & Franklin Wedding
              </span>
              <h1 className="font-serif text-xl sm:text-2xl text-[#613018] font-bold italic leading-tight">
                RSVP Guestlist Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={checkSessionAndFetch}
              disabled={isLoading}
              title="Refresh RSVP data"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF0E6] border border-[#DAC7BA] text-xs font-semibold text-[#713B1C] hover:bg-[#F2DFD7] transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={rsvps.length === 0}
              title="Download CSV export"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF0E6] border border-[#DAC7BA] text-xs font-semibold text-[#713B1C] hover:bg-[#F2DFD7] transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              title="Sign out of admin"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#E3BDB0] text-xs font-semibold text-[#8F3D2C] hover:bg-[#FDF0ED] transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Alert if any */}
        {fetchError && (
          <div className="p-4 rounded-xl bg-[#FDF0ED] border border-[#F3C5BA] flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#9F4B31] shrink-0" />
              <p className="text-sm text-[#8F3D2C] font-medium">{fetchError}</p>
            </div>
            <button
              onClick={checkSessionAndFetch}
              className="text-xs font-bold text-[#8F3D2C] underline hover:text-[#5E2417] ml-4 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* 1. Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Responses */}
          <div className="bg-[#FFFDFB] rounded-2xl border border-[#E3BDB0]/70 p-5 sm:p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-sans tracking-wider text-[#8F6E64] font-semibold">
                Total Responses
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#FAF0E6] flex items-center justify-center text-[#713B1C]">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl text-[#613018] font-bold">
              {stats.totalResponses}
            </div>
            <p className="text-xs text-[#946042] mt-1">Total RSVP submissions recorded</p>
          </div>

          {/* Card 2: Attending Parties */}
          <div className="bg-[#FFFDFB] rounded-2xl border border-[#B2D8BB]/80 p-5 sm:p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-sans tracking-wider text-[#2D5A3C] font-semibold">
                Attending Responses
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#EAF4EC] flex items-center justify-center text-[#2D5A3C]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl text-[#2D5A3C] font-bold">
              {stats.attendingParties}
            </div>
            <p className="text-xs text-[#447253] mt-1">Families / parties attending</p>
          </div>

          {/* Card 3: Total Headcount (Attending Guests) */}
          <div className="bg-[#FFFDFB] rounded-2xl border border-[#D28B77]/80 p-5 sm:p-6 shadow-xs relative overflow-hidden bg-gradient-to-br from-[#FFFDFB] to-[#FAF2EC]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-sans tracking-wider text-[#9F4B31] font-semibold">
                Total Headcount
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#FAF0E6] flex items-center justify-center text-[#9F4B31]">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl text-[#9F4B31] font-bold">
              {stats.totalGuests}
            </div>
            <p className="text-xs text-[#713B1C] mt-1">Confirmed guest seats for reception</p>
          </div>

          {/* Card 4: Declined Responses */}
          <div className="bg-[#FFFDFB] rounded-2xl border border-[#F3C5BA]/80 p-5 sm:p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-sans tracking-wider text-[#8F3D2C] font-semibold">
                Declined
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#FDF0ED] flex items-center justify-center text-[#8F3D2C]">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl text-[#8F3D2C] font-bold">
              {stats.declinedCount}
            </div>
            <p className="text-xs text-[#A85848] mt-1">Unable to attend in person</p>
          </div>
        </section>

        {/* 2. Controls, Search & Filter Bar */}
        <section className="bg-[#FFFDFB] rounded-2xl border border-[#E3BDB0]/70 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#946042]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by guest name or message..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0]/80 border border-[#DAC7BA] rounded-xl text-sm text-[#613018] placeholder-[#B59685] focus:outline-none focus:ring-2 focus:ring-[#713B1C]/30 focus:border-[#713B1C] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-[#946042] hover:text-[#613018]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FAF6F0] border border-[#DAC7BA]/70 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#713B1C] text-[#FFF6EE] shadow-xs'
                  : 'text-[#8F6E64] hover:text-[#613018]'
              }`}
            >
              All ({rsvps.length})
            </button>
            <button
              onClick={() => setStatusFilter('attending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'attending'
                  ? 'bg-[#2D5A3C] text-white shadow-xs'
                  : 'text-[#8F6E64] hover:text-[#2D5A3C]'
              }`}
            >
              Attending ({stats.attendingParties})
            </button>
            <button
              onClick={() => setStatusFilter('declined')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'declined'
                  ? 'bg-[#8F3D2C] text-white shadow-xs'
                  : 'text-[#8F6E64] hover:text-[#8F3D2C]'
              }`}
            >
              Declined ({stats.declinedCount})
            </button>
          </div>
        </section>

        {/* 3. RSVPs Table / Cards */}
        <section className="bg-[#FFFDFB] rounded-2xl border border-[#E3BDB0]/70 shadow-xs overflow-hidden">
          {/* Header count indicator */}
          <div className="px-6 py-4 border-b border-[#E3BDB0]/50 bg-[#FAF6F0]/50 flex items-center justify-between">
            <h2 className="font-serif italic text-lg sm:text-xl text-[#613018] font-bold">
              Guest Responses ({filteredRsvps.length})
            </h2>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="text-xs font-medium text-[#9F4B31] hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Loading Skeleton State */}
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-[#FAF6F0] rounded-xl animate-pulse border border-[#E3BDB0]/40"
                />
              ))}
            </div>
          ) : filteredRsvps.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF0E6] border border-[#D28B77]/60 flex items-center justify-center mx-auto mb-4">
                <Filter className="w-7 h-7 text-[#9F4B31]" />
              </div>
              <h3 className="font-serif text-2xl text-[#613018] italic font-semibold mb-2">
                {rsvps.length === 0 ? 'No RSVP Responses Yet' : 'No Matching Responses'}
              </h3>
              <p className="font-sans text-sm text-[#8F6E64] max-w-sm mx-auto">
                {rsvps.length === 0
                  ? 'When guests submit their RSVPs on your wedding website, their responses will appear right here.'
                  : 'Try adjusting your search query or status filter to see other guests.'}
              </p>
              {rsvps.length > 0 && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#FAF0E6] text-xs font-bold text-[#713B1C] border border-[#DAC7BA] hover:bg-[#F2DFD7] transition-all cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View (Hidden on small mobile screens) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E3BDB0]/60 bg-[#FAF6F0]/70 text-[11px] uppercase font-sans tracking-wider text-[#8F6E64]">
                      <th className="py-3.5 px-6 font-semibold">Guest Name</th>
                      <th className="py-3.5 px-4 font-semibold">Attendance</th>
                      <th className="py-3.5 px-4 font-semibold text-center">Guest Count</th>
                      <th className="py-3.5 px-6 font-semibold">Message for Couple</th>
                      <th className="py-3.5 px-6 font-semibold text-right">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3BDB0]/40 text-sm">
                    {filteredRsvps.map((rsvp) => {
                      const isAttending = rsvp.attendance === 'attending';
                      return (
                        <tr
                          key={rsvp.id}
                          className="hover:bg-[#FAF6F0]/60 transition-colors"
                        >
                          {/* Name */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-base font-bold shrink-0 ${
                                  isAttending
                                    ? 'bg-[#EAF4EC] text-[#2D5A3C] border border-[#B2D8BB]'
                                    : 'bg-[#FDF0ED] text-[#8F3D2C] border border-[#F3C5BA]'
                                }`}
                              >
                                {rsvp.full_name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-[#613018]">
                                {rsvp.full_name}
                              </span>
                            </div>
                          </td>

                          {/* Attendance Status */}
                          <td className="py-4 px-4">
                            {isAttending ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF4EC] text-[#2D5A3C] border border-[#B2D8BB]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Attending
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF0ED] text-[#8F3D2C] border border-[#F3C5BA]">
                                <XCircle className="w-3.5 h-3.5" />
                                Declined
                              </span>
                            )}
                          </td>

                          {/* Guest Count */}
                          <td className="py-4 px-4 text-center">
                            {isAttending ? (
                              <span className="inline-block px-3 py-1 bg-[#FAF0E6] text-[#713B1C] font-semibold text-xs rounded-full border border-[#DAC7BA]">
                                {rsvp.guests_count} {rsvp.guests_count === 1 ? 'Guest' : 'Guests'}
                              </span>
                            ) : (
                              <span className="text-xs text-[#A88C80] font-mono">—</span>
                            )}
                          </td>

                          {/* Message */}
                          <td className="py-4 px-6 max-w-xs xl:max-w-sm">
                            {rsvp.message ? (
                              <button
                                type="button"
                                onClick={() => setSelectedRsvp(rsvp)}
                                className="flex items-start gap-2 text-xs sm:text-sm text-[#713B1C] italic text-left cursor-pointer hover:bg-[#FAF0E6]/60 rounded-lg p-1.5 -m-1.5 transition-colors group w-full"
                              >
                                <MessageSquare className="w-4 h-4 text-[#946042] shrink-0 mt-0.5 group-hover:text-[#9F4B31] transition-colors" />
                                <span className="line-clamp-2">&ldquo;{rsvp.message}&rdquo;</span>
                              </button>
                            ) : (
                              <span className="text-xs text-[#B59685] italic font-serif">
                                No message provided
                              </span>
                            )}
                          </td>

                          {/* Submission Date */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5 text-xs text-[#8F6E64]">
                              <Calendar className="w-3.5 h-3.5 text-[#946042]" />
                              <span>{formatDate(rsvp.created_at)}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (For small screens) */}
              <div className="md:hidden divide-y divide-[#E3BDB0]/50">
                {filteredRsvps.map((rsvp) => {
                  const isAttending = rsvp.attendance === 'attending';
                  return (
                    <div key={rsvp.id} className="p-4 sm:p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg font-bold shrink-0 ${
                              isAttending
                                ? 'bg-[#EAF4EC] text-[#2D5A3C] border border-[#B2D8BB]'
                                : 'bg-[#FDF0ED] text-[#8F3D2C] border border-[#F3C5BA]'
                            }`}
                          >
                            {rsvp.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-base text-[#613018]">
                              {rsvp.full_name}
                            </h4>
                            <span className="text-[11px] text-[#8F6E64]">
                              {formatDate(rsvp.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {isAttending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EAF4EC] text-[#2D5A3C] border border-[#B2D8BB]">
                            <CheckCircle2 className="w-3 h-3" />
                            Attending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FDF0ED] text-[#8F3D2C] border border-[#F3C5BA]">
                            <XCircle className="w-3 h-3" />
                            Declined
                          </span>
                        )}
                      </div>

                      {/* Guest Count for attending */}
                      {isAttending && (
                        <div className="flex items-center gap-2 text-xs text-[#713B1C] bg-[#FAF0E6] py-1.5 px-3 rounded-lg border border-[#DAC7BA]/70">
                          <Users className="w-3.5 h-3.5" />
                          <span>
                            Attending Party:{' '}
                            <strong className="font-bold">
                              {rsvp.guests_count} {rsvp.guests_count === 1 ? 'Guest' : 'Guests'}
                            </strong>
                          </span>
                        </div>
                      )}

                      {/* Message */}
                      {rsvp.message && (
                        <button
                          type="button"
                          onClick={() => setSelectedRsvp(rsvp)}
                          className="w-full text-left p-3 bg-[#FAF6F0] rounded-xl border border-[#E3BDB0]/40 text-xs text-[#713B1C] italic cursor-pointer hover:bg-[#F2DFD7]/50 hover:border-[#D28B77]/50 transition-colors"
                        >
                          <p className="line-clamp-3">&ldquo;{rsvp.message}&rdquo;</p>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </main>

      {/* ── Message Popup Modal ── */}
      {selectedRsvp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedRsvp(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#613018]/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" />

          {/* Card */}
          <div
            className="relative w-full max-w-lg bg-[#FFFDFB] rounded-2xl shadow-2xl shadow-[#713B1C]/15 border border-[#E3BDB0]/80 overflow-hidden animate-[scaleIn_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative top accent */}
            <div className="h-1.5 bg-gradient-to-r from-[#D28B77] via-[#9F4B31] to-[#D28B77]" />

            {/* Header */}
            <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4 border-b border-[#E3BDB0]/40">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-serif text-lg font-bold shrink-0 ${
                    selectedRsvp.attendance === 'attending'
                      ? 'bg-[#EAF4EC] text-[#2D5A3C] border border-[#B2D8BB]'
                      : 'bg-[#FDF0ED] text-[#8F3D2C] border border-[#F3C5BA]'
                  }`}
                >
                  {selectedRsvp.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-lg text-[#613018] font-bold truncate">
                    {selectedRsvp.full_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {selectedRsvp.attendance === 'attending' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF4EC] text-[#2D5A3C] border border-[#B2D8BB]">
                        <CheckCircle2 className="w-3 h-3" />
                        Attending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDF0ED] text-[#8F3D2C] border border-[#F3C5BA]">
                        <XCircle className="w-3 h-3" />
                        Declined
                      </span>
                    )}
                    <span className="text-[11px] text-[#8F6E64] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(selectedRsvp.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedRsvp(null)}
                className="shrink-0 w-8 h-8 rounded-lg bg-[#FAF0E6] border border-[#DAC7BA] flex items-center justify-center text-[#8F6E64] hover:text-[#613018] hover:bg-[#F2DFD7] transition-all cursor-pointer"
                aria-label="Close message"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Body */}
            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-[#D28B77] shrink-0 mt-1" />
                <p className="font-serif italic text-[#713B1C] text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                  &ldquo;{selectedRsvp.message}&rdquo;
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-[#FAF6F0]/60 border-t border-[#E3BDB0]/30 flex justify-end">
              <button
                onClick={() => setSelectedRsvp(null)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#713B1C] to-[#8C4A25] hover:from-[#5A2E16] hover:to-[#713B1C] text-[#FFF6EE] text-xs font-semibold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
