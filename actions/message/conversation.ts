// File: app/actions/message/conversation.ts

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
      .select('id, username, profile_picture_url')
      .eq('id', otherUserId)
      .single();

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

    return {
      ...conv,
      other_user_name: otherUser?.username || 'Unknown',
      last_message: lastMessage?.message || lastMessage?.file_url || null,
      last_read_at: lastMessage?.read_at || null,
      last_sent_at: lastMessage?.sent_at || null,
      other_user_id: otherUser?.id || null,
      other_user_profile_picture: profileImageUrl,
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
    .single(); // This returns the inserted row

  if (error) {
    console.error('Error sending message:', error.message);
    return null;
  }

  return data;
}

