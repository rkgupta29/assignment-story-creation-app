import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CandidateProfile } from "@/types/profile";
import { Phone, Mail, Linkedin, Github, Globe } from "lucide-react";

const contactInfoSchema = z.object({
  mobileNumber: z.string().min(1, "Mobile number is required"),
  countryCode: z.string().min(1, "Country code is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
});

type ContactInfoFormData = z.infer<typeof contactInfoSchema>;

interface ContactInfoStepProps {
  profile: CandidateProfile | null;
  onComplete: (data: Partial<CandidateProfile>) => void;
  onBack: () => void;
  saving: boolean;
  isLastStep: boolean;
}

const COUNTRY_CODES = [
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
  { code: "+7", country: "Russia" },
  { code: "+55", country: "Brazil" },
  { code: "+52", country: "Mexico" },
  { code: "+39", country: "Italy" },
  { code: "+34", country: "Spain" },
  { code: "+31", country: "Netherlands" },
  { code: "+46", country: "Sweden" },
  { code: "+47", country: "Norway" },
  { code: "+45", country: "Denmark" },
  { code: "+358", country: "Finland" },
  { code: "+41", country: "Switzerland" },
  { code: "+43", country: "Austria" },
];

export default function ContactInfoStep({
  profile,
  onComplete,
  onBack,
  saving,
  isLastStep,
}: ContactInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ContactInfoFormData>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      mobileNumber: profile?.contactInfo?.mobileNumber || "",
      countryCode: profile?.contactInfo?.countryCode || "+1",
      contactEmail: profile?.contactInfo?.contactEmail || "",
      linkedinUrl: profile?.contactInfo?.linkedinUrl || "",
      githubUrl: profile?.contactInfo?.githubUrl || "",
      portfolioUrl: profile?.contactInfo?.portfolioUrl || "",
    },
  });

  const watchedCountryCode = watch("countryCode");
  const watchedMobileNumber = watch("mobileNumber");

  const onSubmit = async (data: ContactInfoFormData) => {
    try {
      const updateData: Partial<CandidateProfile> = {
        contactInfo: {
          mobileNumber: data.mobileNumber,
          countryCode: data.countryCode,
          fullPhoneNumber: `${data.countryCode}${data.mobileNumber}`,
          contactEmail: data.contactEmail,
          linkedinUrl: data.linkedinUrl || undefined,
          githubUrl: data.githubUrl || undefined,
          portfolioUrl: data.portfolioUrl || undefined,
        },
      };

      onComplete(updateData);
    } catch (error) {
      console.error("Error saving contact info:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Phone Number */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label
            htmlFor="countryCode"
            className="block text-sm font-medium text-gray-700"
          >
            Country Code *
          </label>
          <select
            id="countryCode"
            {...register("countryCode")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {COUNTRY_CODES.map(({ code, country }) => (
              <option key={code} value={code}>
                {code} ({country})
              </option>
            ))}
          </select>
          {errors.countryCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.countryCode.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="mobileNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Mobile Number *
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="mobileNumber"
              {...register("mobileNumber")}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your mobile number"
            />
          </div>
          {errors.mobileNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.mobileNumber.message}
            </p>
          )}
          {watchedMobileNumber && watchedCountryCode && (
            <p className="mt-1 text-sm text-gray-500">
              Full number: {watchedCountryCode} {watchedMobileNumber}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="contactEmail"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address *
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            id="contactEmail"
            {...register("contactEmail")}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email address"
          />
        </div>
        {errors.contactEmail && (
          <p className="mt-1 text-sm text-red-600">
            {errors.contactEmail.message}
          </p>
        )}
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Professional Links (Optional)
        </h3>

        {/* LinkedIn */}
        <div>
          <label
            htmlFor="linkedinUrl"
            className="block text-sm font-medium text-gray-700"
          >
            LinkedIn Profile
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Linkedin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              id="linkedinUrl"
              {...register("linkedinUrl")}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          {errors.linkedinUrl && (
            <p className="mt-1 text-sm text-red-600">
              {errors.linkedinUrl.message}
            </p>
          )}
        </div>

        {/* GitHub */}
        <div>
          <label
            htmlFor="githubUrl"
            className="block text-sm font-medium text-gray-700"
          >
            GitHub Profile
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Github className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              id="githubUrl"
              {...register("githubUrl")}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://github.com/yourusername"
            />
          </div>
          {errors.githubUrl && (
            <p className="mt-1 text-sm text-red-600">
              {errors.githubUrl.message}
            </p>
          )}
        </div>

        {/* Portfolio */}
        <div>
          <label
            htmlFor="portfolioUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Portfolio Website
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              id="portfolioUrl"
              {...register("portfolioUrl")}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://yourportfolio.com"
            />
          </div>
          {errors.portfolioUrl && (
            <p className="mt-1 text-sm text-red-600">
              {errors.portfolioUrl.message}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back
        </button>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : isLastStep ? "Complete Profile" : "Next Step"}
        </button>
      </div>
    </form>
  );
}
