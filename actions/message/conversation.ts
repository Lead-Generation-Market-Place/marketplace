// File: app/actions/message/conversation.ts

'use server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

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
      const otherUserId = conv.customer_id === userId ? conv.professional_id : conv.customer_id;

      const { data: otherUser } = await supabase
        .from('users_profiles')
        .select('username')
        .eq('id', otherUserId)
        .single();

      const { data: lastMessage } = await supabase
        .from('messages')
        .select('message')
        .eq('conversation_id', conv.id)
        .order('sent_at', { ascending: false })
        .limit(1)
        .single();

      return {
        ...conv,
        other_user_name: otherUser?.username || 'Unknown',
        last_message: lastMessage?.message || null,
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

export async function sendMessage(conversationId: string, senderId: string, message: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.from('messages').insert([
    {
      conversation_id: conversationId,
      sender_id: senderId,
      message: message,
    },
  ]);

  return { success: !error, data, error };
}
