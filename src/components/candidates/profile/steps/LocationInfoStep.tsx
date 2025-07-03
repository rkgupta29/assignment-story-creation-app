import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CandidateProfile } from "@/types/profile";
import { MapPin, Plus, X } from "lucide-react";

const locationSchema = z.object({
  currentLocation: z.object({
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    isRemote: z.boolean(),
  }),
  preferredLocations: z
    .array(
      z.object({
        city: z.string().min(1, "City is required"),
        state: z.string().optional(),
        country: z.string().min(1, "Country is required"),
        isRemote: z.boolean(),
      })
    )
    .min(1, "At least one preferred location is required"),
});

type LocationFormData = z.infer<typeof locationSchema>;

interface LocationInfoStepProps {
  profile: CandidateProfile | null;
  onComplete: (data: Partial<CandidateProfile>) => void;
  onBack: () => void;
  saving: boolean;
  isLastStep: boolean;
}

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "India",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "Brazil",
  "Mexico",
  "Italy",
  "Spain",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Switzerland",
  "Austria",
  "Singapore",
  "South Korea",
  "New Zealand",
  "Ireland",
  "Belgium",
  "Poland",
  "Czech Republic",
  "Hungary",
  "Portugal",
  "Greece",
  "Turkey",
  "Israel",
  "South Africa",
  "Argentina",
  "Chile",
  "Colombia",
  "Peru",
  "Venezuela",
  "Uruguay",
  "Paraguay",
  "Ecuador",
  "Bolivia",
  "Guyana",
  "Suriname",
  "French Guiana",
  "Falkland Islands",
  "Greenland",
  "Iceland",
  "Faroe Islands",
  "Svalbard",
  "Jan Mayen",
  "Bouvet Island",
  "South Georgia",
  "South Sandwich Islands",
  "Antarctica",
  "Other",
];

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export default function LocationInfoStep({
  profile,
  onComplete,
  onBack,
  saving,
  isLastStep,
}: LocationInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      currentLocation: {
        city: profile?.currentLocation?.city || "",
        state: profile?.currentLocation?.state || "",
        country: profile?.currentLocation?.country || "United States",
        isRemote: profile?.currentLocation?.isRemote || false,
      },
      preferredLocations: profile?.preferredLocations?.length
        ? profile.preferredLocations
        : [{ city: "", state: "", country: "United States", isRemote: false }],
    },
  });

  const watchedCountry = watch("currentLocation.country");
  const watchedPreferredLocations = watch("preferredLocations");

  const addPreferredLocation = () => {
    const currentLocations = watchedPreferredLocations || [];
    setValue("preferredLocations", [
      ...currentLocations,
      { city: "", state: "", country: "United States", isRemote: false },
    ]);
  };

  const removePreferredLocation = (index: number) => {
    const currentLocations = watchedPreferredLocations || [];
    if (currentLocations.length > 1) {
      setValue(
        "preferredLocations",
        currentLocations.filter((_, i) => i !== index)
      );
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const updateData: Partial<CandidateProfile> = {
        currentLocation: data.currentLocation,
        preferredLocations: data.preferredLocations.filter(
          (loc: any) => loc.city && loc.country
        ),
      };

      onComplete(updateData);
    } catch (error) {
      console.error("Error saving location info:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Current Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Current Location</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="currentCity"
              className="block text-sm font-medium text-gray-700"
            >
              City *
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="currentCity"
                {...register("currentLocation.city")}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your city"
              />
            </div>
            {errors.currentLocation?.city && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currentLocation.city.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="currentCountry"
              className="block text-sm font-medium text-gray-700"
            >
              Country *
            </label>
            <select
              id="currentCountry"
              {...register("currentLocation.country")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.currentLocation?.country && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currentLocation.country.message}
              </p>
            )}
          </div>
        </div>

        {watchedCountry === "United States" && (
          <div>
            <label
              htmlFor="currentState"
              className="block text-sm font-medium text-gray-700"
            >
              State
            </label>
            <select
              id="currentState"
              {...register("currentLocation.state")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select state</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="currentRemote"
            {...register("currentLocation.isRemote")}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="currentRemote"
            className="ml-2 block text-sm text-gray-900"
          >
            I work remotely
          </label>
        </div>
      </div>

      {/* Preferred Locations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Preferred Work Locations
          </h3>
          <button
            type="button"
            onClick={addPreferredLocation}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Location
          </button>
        </div>

        {watchedPreferredLocations?.map((_, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                Location {index + 1}
              </h4>
              {watchedPreferredLocations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePreferredLocation(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  {...register(`preferredLocations.${index}.city`)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country *
                </label>
                <select
                  {...register(`preferredLocations.${index}.country`)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register(`preferredLocations.${index}.isRemote`)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Open to remote work
              </label>
            </div>
          </div>
        ))}

        {errors.preferredLocations && (
          <p className="text-sm text-red-600">
            {errors.preferredLocations.message}
          </p>
        )}
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
