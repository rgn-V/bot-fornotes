import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export async function notes(username) {
  return await supabase.from('Note').select('text').eq('owner', username)
}

export async function notesId(username) {
  return await supabase.from('Note').select('id').eq('owner', username)
}

export async function addUser(username) {
  return await supabase.from('User').upsert({
    tg_username: username,
  })
}

export async function add(username, text) {
  return await supabase.from('Note').insert({ text, owner: username })
}

export async function rm(username, id) {
  return await supabase.from('Note').delete().match({
    owner: username,
    id: id,
  })
}

export default supabase
