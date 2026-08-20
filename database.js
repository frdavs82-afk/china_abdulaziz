const SUPABASE_URL = "https://rykdfofgibfxjhgcvuhq.supabase.co";
const SUPABASE_KEY = "sb_publishable_...SENING_KEYING...";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function getProducts() {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Mahsulotlarni olishda xato:", error);
    return [];
  }

  return data || [];
}

async function addProduct(product) {
  const { data, error } = await supabaseClient
    .from("products")
    .insert([product])
    .select();

  if (error) {
    console.error("Mahsulot qo‘shishda xato:", error);
    return null;
  }

  return data?.[0] || null;
}

async function deleteProduct(id) {
  const { error } = await supabaseClient.from("products").delete().eq("id", id);

  if (error) {
    console.error("Mahsulotni o‘chirishda xato:", error);
    return false;
  }

  return true;
}
