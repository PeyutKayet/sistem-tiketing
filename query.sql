[
  {
    "table_name": "event",
    "column_name": "id",
    "data_type": "bigint",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "event",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "event",
    "column_name": "nama_event",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "event",
    "column_name": "tanggal_mulai",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "event",
    "column_name": "lokasi",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "event",
    "column_name": "deskripsi",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "event",
    "column_name": "organizer_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": "auth.uid()"
  },
  {
    "table_name": "event",
    "column_name": "poster_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "event",
    "column_name": "no_wa_admin",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "event",
    "column_name": "slug",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "event",
    "column_name": "tipe_event",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'offline'::text"
  },
  {
    "table_name": "event",
    "column_name": "link_meeting",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "event",
    "column_name": "target_absen",
    "data_type": "smallint",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "event",
    "column_name": "settings",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb"
  },
  {
    "table_name": "event",
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'published'::text"
  },
  {
    "table_name": "event",
    "column_name": "sistem_checkin",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'scanner'::text"
  },
  {
    "table_name": "event",
    "column_name": "is_archived",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "table_name": "kategori_tiket",
    "column_name": "id",
    "data_type": "bigint",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "kategori_tiket",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "kategori_tiket",
    "column_name": "event_id",
    "data_type": "bigint",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "kategori_tiket",
    "column_name": "nama_kategori",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "kategori_tiket",
    "column_name": "harga",
    "data_type": "bigint",
    "is_nullable": "NO",
    "column_default": "'0'::bigint"
  },
  {
    "table_name": "kategori_tiket",
    "column_name": "kuota_maksimal",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "kategori_tiket",
    "column_name": "tanggal_mulai_penjualan",
    "data_type": "timestamp without time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "kategori_tiket",
    "column_name": "tanggal_selesai_penjualan",
    "data_type": "timestamp without time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "organizer_profile",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "organizer_profile",
    "column_name": "nama_organizer",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "organizer_profile",
    "column_name": "no_wa",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "organizer_profile",
    "column_name": "link_ig",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "organizer_profile",
    "column_name": "link_web",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "organizer_profile",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "table_name": "organizer_profile",
    "column_name": "logo_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "organizer_profile",
    "column_name": "pin_scanner",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'123456'::text"
  },
  {
    "table_name": "peserta",
    "column_name": "id",
    "data_type": "bigint",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "peserta",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "peserta",
    "column_name": "kategori_id",
    "data_type": "bigint",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "peserta",
    "column_name": "nama_lengkap",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "peserta",
    "column_name": "email",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "peserta",
    "column_name": "status_pembayaran",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": "'pending'::text"
  },
  {
    "table_name": "peserta",
    "column_name": "is_scanned",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_name": "peserta",
    "column_name": "no_hp",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "peserta",
    "column_name": "data_tambahan",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "peserta",
    "column_name": "event_id",
    "data_type": "bigint",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "peserta",
    "column_name": "no_wa",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "peserta",
    "column_name": "nama_tiket",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "peserta",
    "column_name": "status_bayar",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'pending'::text"
  },
  {
    "table_name": "peserta",
    "column_name": "status_hadir",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "table_name": "peserta",
    "column_name": "bukti_bayar_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "riwayat_absen",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "riwayat_absen",
    "column_name": "peserta_id",
    "data_type": "bigint",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "riwayat_absen",
    "column_name": "waktu_absen",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_name": "riwayat_absen",
    "column_name": "metode",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "riwayat_absen",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  }
]