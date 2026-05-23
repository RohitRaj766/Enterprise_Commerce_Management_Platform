'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { locationSchema, type LocationFormData } from '@/lib/zod-schemas';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { useLocationStore } from '@/store/locationStore';
import Image from 'next/image';

export default function LocationPage() {
  const router = useRouter();
  const { zones, areas, selectedZone, setZone, setArea } = useLocationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      zone: selectedZone || '',
      area: '',
    },
  });

  const selectedZoneValue = watch('zone');
  const availableAreas = selectedZoneValue ? areas[selectedZoneValue] || [] : [];

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const zone = e.target.value;
    setZone(zone);
    setValue('zone', zone);
    setValue('area', ''); // Reset area when zone changes
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = e.target.value;
    setArea(area);
    setValue('area', area);
  };

  const onSubmit = async (data: LocationFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await delay(900);
    setZone(data.zone);
    setArea(data.area);
    router.push('/home');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div 
        style={{ backgroundImage: 'url(/assets/headerbackground.png)' }}
        className="bg-cover bg-center bg-no-repeat h-80 absolute top-0 left-0 w-full z-0 pointer-events-none"
      />
      
      <div className="relative z-20">
        <Navbar showBack title="" />
      </div>

      <div className="relative z-10 px-6 pb-10 lg:pt-24">
        <div className="max-w-5xl mx-auto lg:shadow-sm lg:border border-gray-100 lg:rounded-3xl lg:p-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">
            {/* Location Image */}
            <div className="w-full flex justify-center mb-6 lg:mb-0 ">
              <div className="w-64 h-64 flex items-center justify-center">
                <Image
                  src="/assets/location.png"
                  alt="Location map"
                  width={256}
                  height={256}
                  className="!w-[80%] object-contain"
                  priority
                />
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-start">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center lg:text-left">
                Select Your Location
              </h1>
              <p className="text-gray-500 text-base mb-8 text-center lg:text-left px-4 lg:px-0">
                Switch on your location to stay in tune with what's happening in your area
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                <div>
                  <label className="block text-base font-normal text-gray-900 mb-2">
                    Your Zone
                  </label>
                  <div className="border-b-2 border-gray-300 pb-3 relative">
                    <select
                      {...register('zone', {
                        onChange: handleZoneChange,
                      })}
                      className="w-full text-base font-medium bg-transparent outline-none text-gray-900 appearance-none cursor-pointer pr-8"
                    >
                      <option value="">Select your zone</option>
                      {zones.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="text-gray-500"
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.zone && (
                    <p className="mt-1 text-sm text-red-500">{errors.zone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-base font-normal text-gray-900 mb-2">
                    Your Area
                  </label>
                  <div className="border-b-2 border-gray-300 pb-3 relative">
                    <select
                      {...register('area', {
                        onChange: handleAreaChange,
                      })}
                      disabled={!selectedZoneValue}
                      className="w-full text-base font-medium bg-transparent outline-none text-gray-900 appearance-none cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed pr-8"
                    >
                      <option value="">Types of your area</option>
                      {availableAreas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="text-gray-500"
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.area && (
                    <p className="mt-1 text-sm text-red-500">{errors.area.message}</p>
                  )}
                </div>

                <Button type="submit" variant="primary" className="mt-8 w-full" isLoading={isSubmitting}>
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

