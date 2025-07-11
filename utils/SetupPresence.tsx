import { RealtimeChannel } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

let presenceChannel: RealtimeChannel | null = null;

export const setupPresence = async (
  userId: string,
  setOnlineUsers: (users: Record<string, any>) => void
): Promise<() => void> => {
  const supabase = createClient();

  if (presenceChannel) {
    await supabase.removeChannel(presenceChannel);
    presenceChannel = null;
  }

  presenceChannel = supabase.channel('online-users', {
    config: {
      presence: {
        key: userId,
      },
    },
  });

  presenceChannel.on('presence', { event: 'sync' }, () => {
    const state = presenceChannel!.presenceState();
    console.log('Online Esmatullah:', state);
    setOnlineUsers(state);
  });

  // ✅ Correct way: use callback here
  presenceChannel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await presenceChannel!.track({
        online_at: new Date().toISOString(),
      });
    }
  });

  return () => {
    if (presenceChannel) {
      supabase.removeChannel(presenceChannel);
      presenceChannel = null;
    }
  };
};
