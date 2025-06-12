'use server';

import { createClient } from "@/utils/supabase/server";

interface Shift {
  openTime: string;
  closeTime: string;
  availabilityStatus?: string | null;
  isClosed?: boolean;
  notes?: string | null;
}

interface DaySchedule {
  dayOfWeek: number;
  shifts: Shift[];
}

export interface SaveAvailabilityResult {
  status: 'success' | 'error';
  message: string;
  details: string | null;
}

export async function saveAvailability(formData: FormData): Promise<SaveAvailabilityResult> {
  try {
    const timezone = formData.get('timezone') as string;
    const scheduleJson = formData.get('schedule') as string;
    const availableAnyTime = formData.get('availableAnyTime') === 'true';

    if (!timezone) throw new Error('Timezone is required.');

    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw new Error(userError?.message ?? 'User not authenticated');

    // Fetch service provider(s) for user
    const { data: providers, error: providerError } = await supabase
      .from('service_providers')
      .select('provider_id')
      .eq('user_id', user.id);

    if (providerError) throw new Error(providerError.message);
    if (!providers || providers.length === 0) throw new Error('Service provider not found');

    if (providers.length > 1) {
      console.warn('Multiple service providers found for user, using the first one.');
    }

    const providerId = providers[0].provider_id;

    let businessHours = [];

    if (availableAnyTime) {
      // Full-day availability for all 7 days (0=Sun, 6=Sat)
      businessHours = [0, 1, 2, 3, 4, 5, 6].flatMap((dayOfWeek) => [
        {
          provider_id: providerId,
          day_of_week: dayOfWeek,
          shift_number: 1,
          open_time: '00:00:00',
          close_time: '23:59:59',
          availability_status: null,
          is_closed: false,
          timezone,
          notes: 'Available any time',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    } else {
      if (!scheduleJson) throw new Error('Schedule data is required.');

      const schedule: DaySchedule[] = JSON.parse(scheduleJson);

      businessHours = schedule.flatMap((day) =>
        (day.shifts ?? []).map((shift, index) => {
          const formatTime = (time: string) => (time.length === 5 ? time + ':00' : time);
          const openTime = shift.isClosed ? null : formatTime(shift.openTime);
          const closeTime = shift.isClosed ? null : formatTime(shift.closeTime);

          return {
            provider_id: providerId,
            day_of_week: day.dayOfWeek,
            shift_number: index + 1,
            open_time: openTime,
            close_time: closeTime,
            availability_status: shift.availabilityStatus ?? null,
            is_closed: shift.isClosed ?? false,
            timezone,
            notes: shift.notes ?? null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        })
      );
    }

    if (businessHours.length === 0) throw new Error('No availability schedule provided.');

    // Delete previous availability for provider
    const { error: deleteError } = await supabase
      .from('provider_business_hours')
      .delete()
      .eq('provider_id', providerId);

    if (deleteError) {
      console.error('Delete Error:', deleteError);
      throw new Error(deleteError.message);
    }

    // Insert new availability records
    const { error: insertError } = await supabase
      .from('provider_business_hours')
      .insert(businessHours);

    if (insertError) {
      console.error('Insert Error:', insertError);
      throw new Error(insertError.message);
    }

    return {
      status: 'success',
      message: 'Availability saved successfully.',
      details: null,
    };
  } catch (error) {
    console.error('Error in saveAvailability:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      details: error instanceof Error ? error.stack ?? null : null,
    };
  }
}
