import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  IndianRupee,
  Clock,
  MapPin,
  CheckCircle2,
  Target,
  FileText
} from 'lucide-react';
import GovtEmblem from '../components/shared/GovtEmblem';

// Extended mock data for the details page
const mockChallengesDetails: Record<string, any> = {
  '1': {
    id: 1,
    psId: 'PS-ATS-014-DRONE-TRAFFIC',
    title: 'AI Drone Traffic Monitor',
    department: 'Maharashtra Police',
    domain: 'Traffic Management & Safety',
    state: 'Maharashtra',
    budget: '15,00,000',
    trl: 'TRL 4+',
    duration: '3 Months',
    description: 'Develop an AI-powered drone surveillance system for real-time traffic monitoring and violation detection across major highways and urban intersections. The system must be capable of identifying traffic bottlenecks, tracking speeding vehicles, recognizing license plates from a high altitude, and automatically generating alerts for the central traffic control room.',
    technicalRequirements: [
      'High-resolution video feed processing with <200ms latency',
      'Edge AI integration on drones for onboard vehicle detection',
      'Integration with the Vahan database for registration lookups',
      'Weather-resistant drone hardware with 40+ mins flight time'
    ],
    outcomes: [
      'Reduction in manual traffic monitoring by 40%',
      'Automated e-challan generation pipeline',
      'Comprehensive dashboard for live traffic heatmaps'
    ]
  },
  '2': {
    id: 2,
    psId: 'PS-AGR-089-SMART-CROP',
    title: 'Smart Crop Disease Detection',
    department: 'Ministry of Agriculture',
    domain: 'AgriTech',
    state: 'Madhya Pradesh',
    budget: '20,00,000',
    trl: 'TRL 5+',
    duration: '6 Months',
    description: 'Build a mobile-first solution using satellite imagery and on-ground sensors to detect crop diseases early and alert farmers with actionable remediation steps. The platform should analyze hyper-spectral satellite data combined with local weather patterns to predict pest attacks and fungal infections before they become visible to the naked eye.',
    technicalRequirements: [
      'Machine Learning models trained on Indian crop disease datasets',
      'API integration with ISRO/Bhuvan satellite data',
      'Offline-first mobile app for farmers with regional language support',
      'Scalable backend to process heavy geospatial data'
    ],
    outcomes: [
      'Early warning SMS alerts to farmers 7 days prior to infestation spread',
      'Dashboard for agricultural officers to monitor district-wide crop health',
      'Decrease in yield loss by at least 15% in test districts'
    ]
  },
  '3': {
    id: 3,
    psId: 'PS-DJB-102-WATER-IOT',
    title: 'Real-Time Water Quality IoT',
    department: 'Delhi Jal Board',
    domain: 'Smart City & Water Management',
    state: 'Delhi',
    budget: '12,00,000',
    trl: 'TRL 4+',
    duration: '4 Months',
    description: 'Deploy a network of IoT sensors across the water distribution pipeline for continuous monitoring of quality parameters — pH, TDS, turbidity, and contaminants. The solution should detect anomalous changes in water quality indicative of pipe leaks, sewage mixing, or chemical contamination and instantly trigger valves to isolate affected sections.',
    technicalRequirements: [
      'Industrial-grade, corrosion-resistant multi-parameter sensors',
      'LoRaWAN or NB-IoT connectivity for underground transmission',
      'Secure, encrypted data pipeline to the central Jal Board server',
      'Automated anomaly detection algorithms'
    ],
    outcomes: [
      'Real-time alerts for contamination events',
      'Public portal to view water quality index in different wards',
      'Reduction in water-borne disease outbreaks'
    ]
  },
  '4': {
    id: 4,
    psId: 'PS-MOH-405-RAD-AI',
    title: 'AI Radiology Assist Platform',
    department: 'AIIMS Nagpur',
    domain: 'HealthTech',
    state: 'Maharashtra',
    budget: '25,00,000',
    trl: 'TRL 6+',
    duration: '6 Months',
    description: 'Create an AI-assisted diagnostic tool that helps radiologists detect abnormalities in X-ray and CT scans with higher accuracy and speed in tier-2 hospitals. The tool must identify common pulmonary diseases, fractures, and tumors, providing a confidence score and highlighting regions of interest to assist overburdened medical staff.',
    technicalRequirements: [
      'Deep learning models with >95% accuracy for top 5 anomalies',
      'DICOM viewer integration (PACS compatible)',
      'On-premise deployment capability for data privacy (HIPAA compliant)',
      'Explainable AI features to show diagnostic reasoning'
    ],
    outcomes: [
      'Reduction in scan turnaround time from hours to minutes',
      'Lower misdiagnosis rates in rural and tier-2 hospitals',
      'Prioritization queue for critical cases'
    ]
  },
  '5': {
    id: 5,
    psId: 'PS-MOD-999-CYBER-INTEL',
    title: 'Cybersecurity Threat Intel Engine',
    department: 'Ministry of Defence',
    domain: 'CyberSecurity & Defence',
    state: 'Pan India',
    budget: '30,00,000',
    trl: 'TRL 5+',
    duration: '9 Months',
    description: 'Develop a real-time cybersecurity threat intelligence platform that monitors, detects, and responds to advanced persistent threats across critical government infrastructure. The engine must ingest logs from thousands of endpoints, correlate events using AI, and identify zero-day vulnerabilities or state-sponsored attacks.',
    technicalRequirements: [
      'High-throughput log ingestion (ELK or custom stack)',
      'Behavioral analytics and anomaly detection using AI',
      'Integration with global Threat Intelligence feeds (STIX/TAXII)',
      'Automated incident response playbooks'
    ],
    outcomes: [
      'Centralized dashboard for the national cyber command center',
      'Reduction in mean time to detect (MTTD) to < 5 minutes',
      'Proactive blocking of malicious IP addresses and payloads'
    ]
  },
  '6': {
    id: 6,
    psId: 'PS-NDM-221-FOREST-FIRE',
    title: 'Forest Fire Early Warning System',
    department: 'NDMA',
    domain: 'Disaster Management',
    state: 'Uttarakhand',
    budget: '18,00,000',
    trl: 'TRL 4+',
    duration: '5 Months',
    description: 'Build a satellite + ground sensor fusion system for early forest fire detection in Himalayan forests with real-time alert propagation to local disaster response teams. The system should combine thermal imagery from satellites with ground-based IoT smoke and temperature sensors to eliminate false positives and accurately triangulate the fire source.',
    technicalRequirements: [
      'Fusion of multispectral satellite data (MODIS/VIIRS) with ground sensor data',
      'Solar-powered, ruggedized ground sensors with mesh networking',
      'Terrain-aware propagation modeling to predict fire spread',
      'Automated dispatch alerts to forest rangers via SMS/WhatsApp'
    ],
    outcomes: [
      'Detection of forest fires within 30 minutes of ignition',
      'Dynamic mapping of safe evacuation routes',
      'Preservation of biodiversity and reduction in timber loss'
    ]
  }
};

export default function ChallengeDetailsPublic() {
  const { id } = useParams<{ id: string }>();
  const challenge = id ? mockChallengesDetails[id] : null;

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Challenge Not Found</h2>
        <Link to="/active-challenges" className="text-sky-400 hover:underline">
          Return to Active Challenges
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0E1A] text-white overflow-x-hidden font-[Inter,system-ui,sans-serif]">
      {/* ── Tricolor stripe ── */}
      <div className="h-[3px] flex z-[60] relative">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-[#0A0E1A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/active-challenges" className="flex items-center gap-3 group">
            <ArrowLeft size={18} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
            <div className="pr-3 border-r border-white/10">
              <GovtEmblem width={32} height={40} />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">SAHYOG</span>
              <span className="block text-[9px] font-semibold tracking-[0.15em] uppercase text-orange-400">
                Problem Statement Details
              </span>
            </div>
          </Link>
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold tracking-wider text-sky-400 uppercase">
              <Target size={16} />
              <span>{challenge.domain}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              {challenge.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Building2 size={16} />
                <span>{challenge.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{challenge.state}</span>
              </div>
              <div className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded font-mono text-xs text-slate-300">
                {challenge.psId}
              </div>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Max Ceiling Budget</p>
              <div className="flex items-center gap-1.5 text-2xl font-bold text-emerald-400">
                <IndianRupee size={24} />
                {challenge.budget}
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Target TRL Level</p>
              <div className="text-2xl font-bold text-white">
                {challenge.trl}
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Expected Pilot Duration</p>
              <div className="flex items-center gap-2 text-2xl font-bold text-white">
                <Clock size={24} className="text-sky-400" />
                {challenge.duration}
              </div>
            </div>
          </div>

          {/* Details Sections */}
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                <FileText size={20} className="text-orange-400" />
                Problem Description
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg">
                {challenge.description}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                <Target size={20} className="text-sky-400" />
                Technical Requirements
              </h2>
              <ul className="space-y-3">
                {challenge.technicalRequirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-300">{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                <Target size={20} className="text-purple-400" />
                Expected Outcomes & Deliverables
              </h2>
              <ul className="space-y-3">
                {challenge.outcomes.map((outcome: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-300">{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </motion.div>
      </main>
      
      {/* ── Footer ── */}
      <footer className="bg-[#050810] border-t border-white/5 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-xs text-white/30">
          <p>© 2026 Government of India. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
