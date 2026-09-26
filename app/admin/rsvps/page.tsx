'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Utensils, 
  Download, 
  Search, 
  Lock, 
  ArrowLeft, 
  RefreshCw,
  MessageSquareHeart 
} from 'lucide-react';
import { RSVPRecord } from '@/lib/supabase';

export default function AdminRSVPsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'declined'>('all');

  // Authenticate using passcode
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/rsvp?key=${encodeURIComponent(passcode.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError('Invalid passcode. Please enter the wedding admin key.');
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setRsvps(data.data || []);
      // Save session in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('chateau_admin_key', passcode.trim());
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check saved session on mount
  useEffect(() => {
    const savedKey = typeof window !== 'undefined' ? sessionStorage.getItem('chateau_admin_key') : null;
    if (savedKey) {
      setPasscode(savedKey);
      fetch(`/api/rsvp?key=${encodeURIComponent(savedKey)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIsAuthenticated(true);
            setRsvps(data.data || []);
          }
        })
        .catch(() => {});
    }
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/rsvp?key=${encodeURIComponent(passcode.trim())}`);
      const data = await res.json();
      if (data.success) {
        setRsvps(data.data || []);
      } else {
        setFetchError('Failed to refresh list.');
      }
    } catch {
      setFetchError('Error connecting to database.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('chateau_admin_key');
    }
    setIsAuthenticated(false);
    setPasscode('');
    setRsvps([]);
  };

  // Filtered and searched list
  const filteredRsvps = useMemo(() => {
    return rsvps.filter((item) => {
      const matchesFilter =
        filterStatus === 'all' || item.attendance === filterStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.full_name.toLowerCase().includes(q) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q)) ||
        (item.dietary_requirements && item.dietary_requirements.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [rsvps, filterStatus, searchQuery]);

  // Summary statistics
  const stats = useMemo(() => {
    const total = rsvps.length;
    const attending = rsvps.filter((r) => r.attendance === 'attending').length;
    const declined = rsvps.filter((r) => r.attendance === 'declined').length;
    const withDietary = rsvps.filter((r) => r.dietary_requirements && r.dietary_requirements.trim().length > 0).length;
    return { total, attending, declined, withDietary };
  }, [rsvps]);

  // Export to CSV
  const exportToCSV = () => {
    if (rsvps.length === 0) return;

    const headers = ['Full Name', 'Email', 'Attendance', 'Dietary Requirements', 'Message', 'Submitted Date'];
    const rows = rsvps.map((r) => [
      `"${(r.full_name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${r.attendance}"`,
      `"${(r.dietary_requirements || '').replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${new Date(r.created_at).toLocaleString()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Irene_Franklin_Wedding_RSVPs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 sm:p-10 bg-[#FCFAF7] rounded-3xl border border-[#CDD0C2]/50 shadow-lg flex flex-col items-center text-center">
          
          <div className="w-12 h-12 rounded-full bg-[#9F4B31]/10 text-[#9F4B31] flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#BD8167] font-medium">
            Private Dashboard
          </span>

          <h1 className="font-serif italic text-3xl text-[#9F4B31] mt-1 mb-2">
            Irene & Franklin
          </h1>

          <p className="font-serif text-sm text-[#3D251E]/80 mb-6">
            Enter your admin key to view and manage guest RSVP submissions.
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            {authError && (
              <div className="p-3 text-xs font-sans rounded-lg bg-[#9C3B3E]/10 text-[#9C3B3E] border border-[#9C3B3E]/20">
                {authError}
              </div>
            )}

            <div>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Admin Passcode (default: chateau2026)"
                className="w-full min-h-[44px] px-4 py-3 rounded-lg bg-white border border-[#E3BDB0] text-[#3D251E] font-sans placeholder:text-[#8F6E64]/70 focus:border-[#9F4B31] focus:ring-2 focus:ring-[#9F4B31]/25 outline-none text-center"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[44px] py-3 px-6 rounded-lg bg-[#9F4B31] hover:bg-[#BD8167] active:bg-[#D28B77] text-[#FFFDFB] font-sans text-xs uppercase tracking-[0.25em] font-medium transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? 'Verifying...' : 'Access RSVP List'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E3BDB0]/40 w-full">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs font-serif text-[#6B473C] hover:text-[#9F4B31] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Wedding Invitation</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Authenticated Dashboard
  return (
    <main className="min-h-screen bg-[#FAF7F5] text-[#3D251E] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E3BDB0]/60 gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="text-xs font-serif text-[#6B473C] hover:text-[#9F4B31] flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>View Invitation</span>
              </Link>
            </div>
            <h1 className="font-serif italic text-3xl sm:text-4xl text-[#9F4B31] mt-1">
              Irene & Franklin — RSVP Dashboard
            </h1>
            <p className="font-serif text-xs text-[#6B473C]">
              Château de la Couronne • 16 November 2026
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={refreshData}
              disabled={isLoading}
              className="px-3.5 py-2 min-h-[40px] rounded-lg bg-[#FFFDFB] border border-[#E3BDB0] text-[#9F4B31] hover:bg-[#FAF7F5] hover:text-[#BD8167] transition-colors flex items-center space-x-1.5 text-xs font-sans uppercase tracking-wider cursor-pointer"
              title="Refresh RSVP list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={exportToCSV}
              disabled={rsvps.length === 0}
              className="px-4 py-2 min-h-[40px] rounded-lg bg-[#9F4B31] hover:bg-[#BD8167] active:bg-[#D28B77] text-[#FFFDFB] transition-colors flex items-center space-x-1.5 text-xs font-sans uppercase tracking-wider shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#FFFDFB]" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg text-xs font-serif text-[#BD8167] hover:text-[#9F4B31] transition-colors cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDFB] border border-[#E3BDB0]/60 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#9F4B31]/15 flex items-center justify-center text-[#9F4B31]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-wider text-[#6B473C]">
                Total RSVPs
              </p>
              <p className="font-serif text-2xl text-[#9F4B31] font-semibold">
                {stats.total}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDFB] border border-[#E3BDB0]/60 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#BD8167]/20 flex items-center justify-center text-[#BD8167]">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-wider text-[#6B473C]">
                Attending
              </p>
              <p className="font-serif text-2xl text-[#BD8167] font-semibold">
                {stats.attending}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDFB] border border-[#E3BDB0]/60 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#9C3B3E]/15 flex items-center justify-center text-[#9C3B3E]">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-wider text-[#6B473C]">
                Declined
              </p>
              <p className="font-serif text-2xl text-[#9C3B3E] font-semibold">
                {stats.declined}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDFB] border border-[#E3BDB0]/60 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#D28B77]/25 flex items-center justify-center text-[#D28B77]">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-wider text-[#6B473C]">
                Dietary Notes
              </p>
              <p className="font-serif text-2xl text-[#D28B77] font-semibold">
                {stats.withDietary}
              </p>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-[#FFFDFB] border border-[#E3BDB0]/60 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F6E64]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, dietary..."
              className="w-full pl-9 pr-4 py-2 min-h-[38px] rounded-lg bg-white border border-[#E3BDB0] text-xs font-sans text-[#3D251E] placeholder:text-[#8F6E64]/70 focus:outline-none focus:border-[#9F4B31] focus:ring-2 focus:ring-[#9F4B31]/25"
            />
          </div>

          {/* Filter Status Tabs */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-sans tracking-wide transition-colors cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-[#9F4B31] text-[#FFFDFB]'
                  : 'bg-white text-[#6B473C] border border-[#E3BDB0] hover:bg-[#FAF7F5]'
              }`}
            >
              All ({rsvps.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('attending')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-sans tracking-wide transition-colors cursor-pointer ${
                filterStatus === 'attending'
                  ? 'bg-[#9F4B31] text-[#FFFDFB]'
                  : 'bg-white text-[#6B473C] border border-[#E3BDB0] hover:bg-[#FAF7F5]'
              }`}
            >
              Attending ({stats.attending})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('declined')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-sans tracking-wide transition-colors cursor-pointer ${
                filterStatus === 'declined'
                  ? 'bg-[#9F4B31] text-[#FFFDFB]'
                  : 'bg-white text-[#6B473C] border border-[#E3BDB0] hover:bg-[#FAF7F5]'
              }`}
            >
              Declined ({stats.declined})
            </button>
          </div>
        </div>

        {/* RSVPs Table */}
        <div className="rounded-2xl bg-[#FFFDFB] border border-[#E3BDB0]/60 shadow-xs overflow-hidden">
          {fetchError && (
            <div className="p-4 text-xs font-sans text-center bg-[#9C3B3E]/10 text-[#9C3B3E] border-b border-[#9C3B3E]/20">
              {fetchError}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5EEE9] border-b border-[#E3BDB0]/40 text-[10px] font-sans uppercase tracking-wider text-[#6B473C]">
                  <th className="py-3 px-4 sm:px-6">Guest Name</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Dietary Requirements</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3BDB0]/30 text-xs font-sans">
                {filteredRsvps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#6B473C]">
                      No RSVP submissions match your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredRsvps.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAF7F5]/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-medium text-[#3D251E]">
                        {item.full_name}
                      </td>
                      <td className="py-3.5 px-4">
                        {item.attendance === 'attending' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider bg-[#E3BDB0]/40 text-[#9F4B31] border border-[#E3BDB0]">
                            Attending
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider bg-[#9C3B3E]/10 text-[#9C3B3E] border border-[#9C3B3E]/20">
                            Declined
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#6B473C]">
                        {item.email || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-[#6B473C] max-w-[200px] truncate" title={item.dietary_requirements || ''}>
                        {item.dietary_requirements || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-[#3D251E] max-w-[240px]">
                        {item.message ? (
                          <div className="flex items-start space-x-1.5" title={item.message}>
                            <MessageSquareHeart className="w-3.5 h-3.5 text-[#BD8167] shrink-0 mt-0.5" />
                            <span className="truncate">{item.message}</span>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right text-[#6B473C] whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
