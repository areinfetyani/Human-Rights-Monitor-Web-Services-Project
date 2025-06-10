// ✅ ViewVictimDetails.jsx
import React from 'react';
import { X } from 'lucide-react';

const ViewVictimDetails = ({ victim, onClose }) => {
  if (!victim) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button onClick={onClose} className="modal-close">
          <X size={20} />
        </button>
        <h2 className="modal-title">Victim Details</h2>
        <p><strong>ID:</strong> {victim.id}</p>
        <p><strong>Anonymous:</strong> {victim.anonymous ? 'Yes' : 'No'}</p>
        <p><strong>Gender:</strong> {victim.demographics?.gender}</p>
        <p><strong>Age:</strong> {victim.demographics?.age}</p>
        <p><strong>Ethnicity:</strong> {victim.demographics?.ethnicity}</p>
        <p><strong>Occupation:</strong> {victim.demographics?.occupation}</p>
        <p><strong>Email:</strong> {victim.contact_info?.email}</p>
        <p><strong>Phone:</strong> {victim.contact_info?.phone}</p>
        <p><strong>Secure Messaging:</strong> {victim.contact_info?.secure_messaging}</p>
        <p><strong>Created At:</strong> {new Date(victim.created_at).toLocaleString()}</p>
        {victim.updated_at && <p><strong>Updated At:</strong> {new Date(victim.updated_at).toLocaleString()}</p>}
      </div>
    </div>
  );
};

export default ViewVictimDetails;
