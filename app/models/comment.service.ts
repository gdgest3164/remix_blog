import supabase from "./supabase";

export type TComment = {
  id: number;
  writer: string | null;
  content: string | null;
  created_at: string | null;
  post_id: number | null;
};

export async function getCommentPassword(id: number) {
  return await supabase.from("comment").select("password").eq("id", id).limit(1).single();
}

export async function createComment(content: string, password: string, post_id: number, wirter: string) {
  return await supabase.from("comment").insert([{ content, password, post_id, wirter }]).select();
}

export async function updateComment(id: number, content: string, password: string, post_id: number, wirter: string) {
  return await supabase.from("comment").update({ content, password, post_id, wirter }).eq("id", id).select();
}

export async function deleteComment(id: number) {
  return await supabase.from("comment").delete().eq("id", id);
}
