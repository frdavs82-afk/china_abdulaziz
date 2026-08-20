const SUPABASE_URL = "https://rykdfofgibfxjhgcvuhq.supabase.co";

const SUPABASE_KEY = "sb_publishable_MyJG1TGASkdbbIVmrpIxWA_j0zNSuWS";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// MAHSULOTLARNI OLISH
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

// MAHSULOT QO‘SHISH
async function addProduct(product) {
  const { data, error } = await supabaseClient
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error("Mahsulot qo‘shishda xato:", error);
    alert("Mahsulot saqlanmadi!");
    return null;
  }

  return data;
}

// MAHSULOT O‘CHIRISH
async function deleteProduct(id) {
  const { error } = await supabaseClient.from("products").delete().eq("id", id);

  if (error) {
    console.error("Mahsulot o‘chirishda xato:", error);
    alert("Mahsulot o‘chirilmadi!");
    return false;
  }

  return true;
}
