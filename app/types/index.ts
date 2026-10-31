export interface Peserta {
  kategori_id?: string | number;
  nama_tiket?: string;
  nama_lengkap: string;
  email: string;
  no_wa: string;
  ticket_id: string;
  data_tambahan?: Record<string, any>;
}

export interface CheckoutPayload {
  event_id: string | number;
  kategori_id: string | number;
  peserta: Peserta[];
  bukti_bayar_url?: string | null;
  payment_method?: string;
}
