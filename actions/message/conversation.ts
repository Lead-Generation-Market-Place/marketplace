'use server';
import { createClient } from '@/utils/supabase/server';

export async function getConversations(userId: string) {
  const supabase = await createClient();

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`customer_id.eq.${userId},professional_id.eq.${userId}`);

  if (error || !conversations) {
    return [];
  }

const conversationsWithDetails = await Promise.all(
  conversations.map(async (conv) => {
    const otherUserId =
      conv.customer_id === userId ? conv.professional_id : conv.customer_id;

    // Fetch other user's profile
    const { data: otherUser } = await supabase
      .from('users_profiles')
      .select(`
        id,
        username,
        profile_picture_url,
        service_providers (
          business_name
        )
      `)
      .eq('id', otherUserId)
      .single();
    console.log('Other User:', otherUser);
    // Fetch latest message
    const { data: lastMessage } = await supabase
      .from('messages')
      .select('message, file_url, read_at, sent_at')
      .eq('conversation_id', conv.id)
      .order('sent_at', { ascending: false })
      .limit(1)
      .single();

    // Clean up the profile picture file name to avoid double slashes
    const imageFileName = otherUser?.profile_picture_url?.replace(/^\/+/, '');

    // Construct public image URL from Supabase Storage
    const profileImageUrl = imageFileName
      ? `https://hdwfpfxyzubfksctezkz.supabase.co/storage/v1/object/public/userprofilepicture/${imageFileName}`
      : null;

    // Use first service_providers record if available (it's an array)
    const businessName = (() => {
      if (!otherUser?.service_providers) return null;
      if (Array.isArray(otherUser.service_providers)) {
        return otherUser.service_providers.length > 0
          ? otherUser.service_providers[0].business_name
          : null;
      }
      return (otherUser.service_providers as { business_name?: string })?.business_name || null;
    })();
    const otherUserName = businessName || otherUser?.username || 'Unknown';

  return {
    ...conv,
    other_user_id: otherUser?.id || null,
    other_user_name: otherUserName,
    other_user_profile_picture: profileImageUrl,
    business_name: businessName,
    last_message: lastMessage?.message || lastMessage?.file_url || null,
    last_read_at: lastMessage?.read_at || null,
    last_sent_at: lastMessage?.sent_at || null,
  };

  })
);



  return conversationsWithDetails;
}

export async function getMessages(conversationId: string) {
  const supabase = await createClient();

  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('sent_at', { ascending: true });

  return messages || [];
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  message: string,
  fileUrl?: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        conversation_id: conversationId,
        sender_id: senderId,
        message,
        file_url: fileUrl || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error.message);
    return null;
  }

  return data;
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .is('read_at', null);

  if (error) {
    console.error('Error marking messages as read:', error.message);
    return false;
  }

  return true;
}
