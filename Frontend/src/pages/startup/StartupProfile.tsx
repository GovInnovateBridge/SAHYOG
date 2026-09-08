import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { getStartupProfile, updateStartupProfile } from '../../services/userService';
import type { User } from '../../types/User';
import Sidebar from '../../components/shared/Sidebar';
import Navbar from '../../components/shared/Navbar';
import { ShieldCheck, Award, Building2, Save, Loader2, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StartupProfile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [dpiitNumber, setDpiitNumber] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [profileDescription, setProfileDescription] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getStartupProfile();
      setProfile(data);
      setDpiitNumber(data.dpiitNumber || '');
      setLogoUrl(data.logoUrl || '');
      setProfileDescription(data.profileDescription || '');
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateStartupProfile({
        dpiitNumber,
        logoUrl,
        profileDescription
      });
      setProfile(updated);
      useAuthStore.getState().setUser(updated); // Update global state
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 relative">
          
          {/* Glassmorphism Background elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 -z-10" />

          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Header section with Stats */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Startup Logo" className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-gray-200" />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm border border-blue-200">
                      <Building2 className="text-blue-500" size={40} />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profile?.name}</h1>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium border border-green-200">
                        <ShieldCheck size={16} /> Verified Startup
                      </span>
                      {profile?.verifiedTrlScore ? (
                        <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200">
                          TRL {profile.verifiedTrlScore} Certified
                        </span>
                      ) : (
                        <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-medium border border-yellow-200">
                          TRL Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Locked Gov-Trust Stats */}
                <div className="flex gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-blue-100 w-32 text-center">
                    <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Gov-Trust</p>
                    <p className="text-3xl font-bold text-indigo-700">{profile?.govTrustScore || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-green-100 w-32 text-center">
                    <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Escrows</p>
                    <p className="text-3xl font-bold text-emerald-700">{profile?.escrowsCompleted || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Form Section */}
            <form onSubmit={handleSave} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">Company Profile</h2>
                <p className="text-sm text-gray-500">Update your details. Your profile description is used by the ML Matchmaker to find relevant government challenges.</p>
              </div>
              
              <div className="p-8 space-y-6">
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      DPIIT Recognition Number
                    </label>
                    <input
                      type="text"
                      value={dpiitNumber}
                      onChange={(e) => setDpiitNumber(e.target.value)}
                      placeholder="e.g. DIPP12345"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Logo URL
                    </label>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Technical Bio (Used for Semantic Matchmaking)
                  </label>
                  <textarea
                    value={profileDescription}
                    onChange={(e) => setProfileDescription(e.target.value)}
                    rows={5}
                    placeholder="Describe your core technologies, patents, and products. E.g., 'We build AI-powered drone surveillance systems utilizing computer vision and edge computing...'"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    The more detailed you are about your technology stack and domain, the better the ML Matchmaker will pair you with relevant Government challenges.
                  </p>
                </div>

              </div>

              <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Profile
                </button>
              </div>
            </form>

            {/* Read-Only Financials / Badges */}
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <IndianRupee size={20} className="text-green-600" /> Financial Standing
                </h3>
                <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                  <p className="text-sm text-green-800 font-medium mb-1">Total PFMS Funds Disbursed</p>
                  <p className="text-3xl font-bold text-green-700">₹{profile?.totalFundsDisbursed?.toLocaleString() || '0'}</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={20} className="text-yellow-500" /> Platform Badges
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.badges && profile.badges.length > 0 ? (
                    profile.badges.map((badge, idx) => (
                      <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
                        <Award size={14} /> {badge}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No badges earned yet. Complete your first sandbox pilot to earn the 'Pioneer' badge.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
