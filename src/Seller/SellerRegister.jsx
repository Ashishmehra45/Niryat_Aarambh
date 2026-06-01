import React, { useState } from "react";
import { 
  Building2, User, Mail, Phone, MapPin, Globe, 
  FileText, Briefcase, UploadCloud, ArrowRight, ShieldCheck, 
  ArrowLeft, CheckCircle2, Lock 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; 

import api from "../utils/axiosConfig"; 

const InputField = ({ label, icon: Icon, type = "text", name, placeholder, required = false, disabled = false, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-slate-700">{label} {required && <span className="text-red-500">*</span>}</label>
    <div className="relative flex items-center">
      <Icon className="absolute left-3 text-slate-400" size={18} />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none transition-all ${
          disabled ? "opacity-60 cursor-not-allowed" : "focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />
    </div>
  </div>
);

const SellerRegistration = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // 🔥 OTP wale states hata diye hain aur form data update kar diya hai
  const [formData, setFormData] = useState({
    businessPhone: "",
    businessEmail: "",
    password: "", // Naya Password Field
    businessName: "",
    ownerName: "",
    country: "",
    state: "",
    city: "",
    address: "",
    companyDescription: "",
    gstNumber: "",
    exportLicense: "",
    website: "",
    profileImage: null,
    coverImage: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  // Basic Validation Next Step pe jaane ke liye
  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.businessPhone || !formData.businessEmail || !formData.password) {
        return toast.error("Please fill all required account details.");
      }
      if (formData.password.length < 6) {
        return toast.error("Password must be at least 6 characters.");
      }
    } else if (step === 2) {
      if (!formData.businessName || !formData.ownerName || !formData.country || !formData.state || !formData.city || !formData.address) {
        return toast.error("Please fill all required business details.");
      }
    }
    setStep(step + 1);
  };

  // ================= API CALL (FINAL SUBMIT) =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach((key) => {
        if (key !== "profileImage" && key !== "coverImage") {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }
      if (formData.coverImage) {
        formDataToSend.append("coverImage", formData.coverImage);
      }

      const response = await api.post("/sellers/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // 🔥 AUTO-LOGIN LOGIC: Registration ke turant baad token aur data save karo
      localStorage.setItem("sellerToken", response.data.token);
      localStorage.setItem("sellerId", response.data.seller._id);
      localStorage.setItem("userName", response.data.seller.businessName);

      toast.success("Registration Successful!");
      
      // Submit hote hi choose-plan pe bhej do
      setTimeout(() => {
        navigate("/seller/choose-plan", { state: { sellerId: response.data.seller?._id } });
      }, 1000);
      
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6">
      <Toaster position="top-right" />
      
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 mb-2">
            Become a Verified Exporter
          </h1>
          <p className="text-slate-500">
            Register your business and connect with global buyers.
          </p>
        </div>

        {/* Progress Bar (3 Steps) */}
        <div className="flex items-center justify-center mb-8 max-w-2xl mx-auto">
          <div className={`flex flex-col items-center ${step >= 1 ? "text-blue-600" : "text-slate-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 1 ? "bg-blue-600 text-white" : "bg-slate-200"}`}>1</div>
            <span className="text-xs font-bold uppercase tracking-wider">Account</span>
          </div>
          <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 2 ? "bg-blue-600" : "bg-slate-200"}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? "text-blue-600" : "text-slate-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 2 ? "bg-blue-600 text-white" : "bg-slate-200"}`}>2</div>
            <span className="text-xs font-bold uppercase tracking-wider">Business</span>
          </div>
          <div className={`flex-1 h-1 mx-4 rounded-full ${step === 3 ? "bg-blue-600" : "bg-slate-200"}`}></div>
          <div className={`flex flex-col items-center ${step === 3 ? "text-blue-600" : "text-slate-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step === 3 ? "bg-blue-600 text-white" : "bg-slate-200"}`}>3</div>
            <span className="text-xs font-bold uppercase tracking-wider">Documents</span>
          </div>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()} className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[400px]">
          
          {/* STEP 1: ACCOUNT SETUP */}
          {step === 1 && (
            <div className="p-8 md:p-12 max-w-xl mx-auto flex flex-col justify-center h-full animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Account Setup</h2>
                <p className="text-sm text-slate-500 mt-2">Set up your login credentials for Seller Central.</p>
              </div>

              <div className="space-y-5">
                <InputField 
                  label="Business Email" 
                  icon={Mail} 
                  type="email" 
                  name="businessEmail" 
                  placeholder="contact@company.com" 
                  value={formData.businessEmail} 
                  onChange={handleChange} 
                  required 
                />
                <InputField 
                  label="Business Phone Number" 
                  icon={Phone} 
                  type="tel" 
                  name="businessPhone" 
                  placeholder="Enter without +91 (e.g. 9876543210)" 
                  value={formData.businessPhone}
                  onChange={handleChange}
                  required
                />
                <InputField 
                  label="Password" 
                  icon={Lock} 
                  type="password" 
                  name="password" 
                  placeholder="Create a strong password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button 
                type="button" 
                onClick={handleNextStep} 
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-blue-600/20"
              >
                Save & Continue
              </button>
              
              <p className="text-center text-sm font-medium text-slate-500 mt-6">
                Already have an account? <a href="/seller/login" className="text-blue-600 hover:underline">Login here</a>
              </p>
            </div>
          )}

          {/* STEP 2: BUSINESS DETAILS */}
          {step === 2 && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-8 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                  <Briefcase className="text-blue-600" size={20} /> Business Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Business Name" icon={Building2} name="businessName" placeholder="Enter registered company name" value={formData.businessName} onChange={handleChange} required />
                  <InputField label="Owner/Contact Name" icon={User} name="ownerName" placeholder="Enter your full name" value={formData.ownerName} onChange={handleChange} required />
                </div>
              </div>
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                  <MapPin className="text-blue-600" size={20} /> Location Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InputField label="Country" icon={Globe} name="country" placeholder="e.g. India" value={formData.country} onChange={handleChange} required />
                  <InputField label="State" icon={MapPin} name="state" placeholder="e.g. Maharashtra" value={formData.state} onChange={handleChange} required />
                  <InputField label="City" icon={MapPin} name="city" placeholder="e.g. Mumbai" value={formData.city} onChange={handleChange} required />
                  <div className="md:col-span-2 lg:col-span-3">
                    <InputField label="Full Address" icon={MapPin} name="address" placeholder="Enter complete office/factory address" value={formData.address} onChange={handleChange} required />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LEGAL & DOCUMENTS */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-8 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                  <ShieldCheck className="text-blue-600" size={20} /> Legal & Identity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <InputField label="GST Number" icon={FileText} name="gstNumber" placeholder="Enter GSTIN" value={formData.gstNumber} onChange={handleChange} required />
                  <InputField label="Export License (IEC)" icon={FileText} name="exportLicense" placeholder="Import Export Code" value={formData.exportLicense} onChange={handleChange} />
                  <InputField label="Website (Optional)" icon={Globe} name="website" placeholder="https://www.yourcompany.com" value={formData.website} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Company Description</label>
                  <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} placeholder="Tell buyers about your manufacturing capacity..." rows="4" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"></textarea>
                </div>
              </div>

              <div className="p-8 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                  <UploadCloud className="text-blue-600" size={20} /> Brand Media
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all rounded-xl p-6 text-center cursor-pointer relative">
                    <input type="file" name="profileImage" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3"><User size={24} /></div>
                    <p className="text-sm font-semibold text-slate-700">Upload Company Logo</p>
                    <p className="text-xs text-slate-500 mt-1">{formData.profileImage ? formData.profileImage.name : "PNG, JPG up to 2MB"}</p>
                  </div>
                  <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all rounded-xl p-6 text-center cursor-pointer relative">
                    <input type="file" name="coverImage" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3"><UploadCloud size={24} /></div>
                    <p className="text-sm font-semibold text-slate-700">Upload Cover Banner</p>
                    <p className="text-xs text-slate-500 mt-1">{formData.coverImage ? formData.coverImage.name : "High-res wide image"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NAVIGATION BUTTONS FOR STEP 2 & 3 */}
          {step > 1 && (
            <div className="p-6 border-t border-slate-200 bg-white flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="text-slate-600 font-bold px-6 py-3 rounded-lg hover:bg-slate-100 flex items-center gap-2 transition-all"
              >
                <ArrowLeft size={18} /> Back
              </button>

              {step === 2 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  Continue <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-600/20"
                >
                  {loading ? "Submitting..." : "Complete Registration"} <CheckCircle2 size={18} />
                </button>
              )}
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default SellerRegistration;