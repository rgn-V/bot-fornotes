import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

/**
 *
 * @param {string} username
 * @returns {Promise<{data: {text: string}[]}>}
 */
export async function notes(username) {
  return await supabase.from('Note').select('text').eq('owner', username)
}

/**
 *
 * @param {string} username
 * @returns {Promise<{data: {id: number}[]}>}
 */
export async function notesId(username) {
  return await supabase.from('Note').select('id').eq('owner', username)
}

/**
 *
 * @param {string} username
 */
export async function addUser(username) {
  return await supabase.from('User').upsert({
    tg_username: username,
  })
}

/**
 *
 * @param {string} username
 * @param {string} text
 */
export async function add(username, text) {
  return await supabase.from('Note').insert({ text, owner: username })
}

/**
 *
 * @param {string} username
 * @param {number} id
 */
export async function rm(username, id) {
  return await supabase.from('Note').delete().match({
    owner: username,
    id: id,
  })
}

export default supabase
