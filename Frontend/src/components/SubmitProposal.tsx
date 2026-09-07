import React, { useState } from 'react';
import { submitProposal } from '../services/proposalService';

const SubmitProposal: React.FC = () => {
  const [challengeId, setChallengeId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  // Envelope A
  const [applicantDisplayName, setApplicantDisplayName] = useState('');
  const [domain, setDomain] = useState('');
  const [claimedTrl, setClaimedTrl] = useState('');
  const [startupPitch, setStartupPitch] = useState('');
  
  // Envelope B
  const [pilotExecutionBid, setPilotExecutionBid] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const envelopeA = {
      applicant_display_name: applicantDisplayName,
      domain,
      claimed_trl: claimedTrl,
      startup_pitch: startupPitch
    };

    const envelopeB = {
      pilot_execution_bid: pilotExecutionBid
    };

    const formData = new FormData();
    formData.append('challengeId', challengeId);
    
    // Optional file
    if (file) {
      formData.append('file', file);
    }
    
    // Stringify objects to JSON strings as required
    formData.append('envelope_a_technical', JSON.stringify(envelopeA));
    formData.append('envelope_b_financial', JSON.stringify(envelopeB));

    try {
      await submitProposal(formData);
      setMessage('Proposal submitted successfully!');
      
      // Optionally reset form here
      setChallengeId('');
      setFile(null);
      setApplicantDisplayName('');
      setDomain('');
      setClaimedTrl('');
      setStartupPitch('');
      setPilotExecutionBid('');
    } catch (error: any) {
      console.error('Submission error:', error);
      setMessage(error.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-proposal-container">
      <h2>Submit Proposal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Challenge ID:</label>
          <input 
            type="text" 
            value={challengeId} 
            onChange={(e) => setChallengeId(e.target.value)} 
            required 
          />
        </div>

        <h3>Envelope A: Technical</h3>
        <div className="form-group">
          <label>Applicant Display Name:</label>
          <input 
            type="text" 
            value={applicantDisplayName} 
            onChange={(e) => setApplicantDisplayName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Domain:</label>
          <input 
            type="text" 
            value={domain} 
            onChange={(e) => setDomain(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Claimed TRL:</label>
          <input 
            type="text" 
            value={claimedTrl} 
            onChange={(e) => setClaimedTrl(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Startup Pitch:</label>
          <textarea 
            value={startupPitch} 
            onChange={(e) => setStartupPitch(e.target.value)} 
            required 
          />
        </div>

        <h3>Envelope B: Financial</h3>
        <div className="form-group">
          <label>Pilot Execution Bid:</label>
          <input 
            type="number" 
            value={pilotExecutionBid} 
            onChange={(e) => setPilotExecutionBid(e.target.value)} 
            required 
          />
        </div>

        <h3>Additional Documents (Optional)</h3>
        <div className="form-group">
          <label>Upload File:</label>
          <input 
            type="file" 
            onChange={handleFileChange} 
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Proposal'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default SubmitProposal;
