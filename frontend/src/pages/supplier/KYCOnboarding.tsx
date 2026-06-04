import React, { useState } from 'react';
import { Shield, Upload, FileText, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

const steps = [
  'Business Info',
  'GST Verification',
  'Aadhaar Verification',
  'Business Docs',
  'Review & Submit'
];

export function KYCOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    gstDoc: null as File | null,
    aadhaarFront: null as File | null,
    aadhaarBack: null as File | null,
    tradeLicense: null as File | null,
    waterLicense: null as File | null,
    qualityCert: null as File | null,
  });

  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(c => c + 1);
  };
  
  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const handleFileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Mock API call to submit KYC
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      navigate('/supplier'); // Back to dashboard
    }, 2000);
  };

  const MockFileUpload = ({ label, field, file }: { label: string, field: string, file: File | null }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
      {file ? (
        <div className="text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-dark">{file.name}</p>
          <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      ) : (
        <>
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-dark mb-1">Click to upload {label}</p>
          <p className="text-xs text-muted mb-4">PDF, JPG, PNG up to 10MB</p>
          <label className="btn-secondary text-sm cursor-pointer">
            Select File
            <input type="file" className="hidden" onChange={handleFileChange(field)} accept=".pdf,.jpg,.png" />
          </label>
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary-600" /> 
          Verified Supplier KYC
        </h1>
        <p className="text-muted mt-2">Complete your business verification to unlock Trust Badges and increase orders.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-600 -z-10 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, idx) => (
          <div key={step} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              idx < currentStep ? 'bg-primary-600 text-white' : 
              idx === currentStep ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 
              'bg-white text-gray-400 border-2 border-gray-200'
            }`}>
              {idx < currentStep ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
            </div>
            <span className={`text-xs font-medium hidden md:block ${idx <= currentStep ? 'text-dark' : 'text-gray-400'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Card Content */}
      <div className="card mb-6 min-h-[400px]">
        {success ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-2">KYC Submitted Successfully!</h2>
            <p className="text-muted text-center max-w-md mb-6">
              Your documents are under review. We will notify you once your Verified Supplier badge is activated.
            </p>
            <p className="text-sm font-medium text-primary-600">Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {currentStep === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-dark mb-4">Business Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Business Name</label>
                    <input type="text" className="input" placeholder="AquaTech Suppliers Pvt Ltd" 
                      value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">Owner Full Name</label>
                    <input type="text" className="input" placeholder="John Doe" 
                      value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">Business Phone</label>
                    <input type="tel" className="input" placeholder="+91 98765 43210" 
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">Business Email</label>
                    <input type="email" className="input" placeholder="contact@aquatech.com" 
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-dark mb-4">GST Verification</h2>
                <p className="text-sm text-muted mb-6">Upload your GST Registration Certificate. This adds +20 to your Trust Score.</p>
                <MockFileUpload label="GST Certificate" field="gstDoc" file={formData.gstDoc} />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-dark mb-4">Aadhaar Verification</h2>
                <p className="text-sm text-muted mb-6">Verify your identity to build trust with customers (+20 Trust Score).</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MockFileUpload label="Aadhaar Front" field="aadhaarFront" file={formData.aadhaarFront} />
                  <MockFileUpload label="Aadhaar Back" field="aadhaarBack" file={formData.aadhaarBack} />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-dark mb-4">Business Documents</h2>
                <p className="text-sm text-muted mb-6">Optional but highly recommended for Platinum Badge status.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MockFileUpload label="Trade License" field="tradeLicense" file={formData.tradeLicense} />
                  <MockFileUpload label="Water Quality Certificate" field="qualityCert" file={formData.qualityCert} />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-dark mb-4">Review & Submit</h2>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="font-semibold text-dark mb-4 border-b pb-2">Application Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Business Name</span>
                      <span className="font-medium text-dark">{formData.businessName || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">GST Document</span>
                      <span className="font-medium text-emerald-600 flex items-center gap-1">
                        {formData.gstDoc ? <><CheckCircle2 className="w-4 h-4"/> Attached</> : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Identity (Aadhaar)</span>
                      <span className="font-medium text-emerald-600 flex items-center gap-1">
                        {formData.aadhaarFront && formData.aadhaarBack ? <><CheckCircle2 className="w-4 h-4"/> Attached</> : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Projected Trust Score</span>
                      <span className="font-bold text-primary-600 text-base">
                        {20 /* Base */ + (formData.gstDoc ? 20 : 0) + (formData.aadhaarFront ? 20 : 0) + (formData.tradeLicense ? 20 : 0)} / 100
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {!success && (
        <div className="flex justify-between">
          <button 
            onClick={handlePrev} 
            disabled={currentStep === 0}
            className={`btn-secondary ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button onClick={handleNext} className="btn-primary">
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn-primary">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit KYC Application'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
