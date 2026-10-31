{
	"tables": [
		{
			"table_name": "event",
			"column_name": "id",
			"data_type": "bigint",
			"udt_name": "int8",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "event",
			"column_name": "created_at",
			"data_type": "timestamp with time zone",
			"udt_name": "timestamptz",
			"is_nullable": "NO",
			"column_default": "now()"
		},
		{
			"table_name": "event",
			"column_name": "nama_event",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "event",
			"column_name": "tanggal_mulai",
			"data_type": "timestamp with time zone",
			"udt_name": "timestamptz",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "event",
			"column_name": "lokasi",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "event",
			"column_name": "deskripsi",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "event",
			"column_name": "organizer_id",
			"data_type": "uuid",
			"udt_name": "uuid",
			"is_nullable": "YES",
			"column_default": "auth.uid()"
		},
		{
			"table_name": "event",
			"column_name": "poster_url",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "event",
			"column_name": "no_wa_admin",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "event",
			"column_name": "slug",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "event",
			"column_name": "tipe_event",
			"data_type": "USER-DEFINED",
			"udt_name": "tipe_event",
			"is_nullable": "YES",
			"column_default": "'offline'::tipe_event"
		},
		{
			"table_name": "event",
			"column_name": "link_meeting",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "event",
			"column_name": "target_absen",
			"data_type": "smallint",
			"udt_name": "int2",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "event",
			"column_name": "settings",
			"data_type": "jsonb",
			"udt_name": "jsonb",
			"is_nullable": "YES",
			"column_default": "'{}'::jsonb"
		},
		{
			"table_name": "event",
			"column_name": "status",
			"data_type": "USER-DEFINED",
			"udt_name": "event_status",
			"is_nullable": "YES",
			"column_default": "'published'::event_status"
		},
		{
			"table_name": "event",
			"column_name": "sistem_checkin",
			"data_type": "USER-DEFINED",
			"udt_name": "checkin_system",
			"is_nullable": "YES",
			"column_default": "'scanner'::checkin_system"
		},
		{
			"table_name": "event",
			"column_name": "is_archived",
			"data_type": "boolean",
			"udt_name": "bool",
			"is_nullable": "YES",
			"column_default": "false"
		},
		{
			"table_name": "kategori_tiket",
			"column_name": "id",
			"data_type": "bigint",
			"udt_name": "int8",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "kategori_tiket",
			"column_name": "created_at",
			"data_type": "timestamp with time zone",
			"udt_name": "timestamptz",
			"is_nullable": "NO",
			"column_default": "now()"
		},
		{
			"table_name": "kategori_tiket",
			"column_name": "event_id",
			"data_type": "bigint",
			"udt_name": "int8",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "kategori_tiket",
			"column_name": "nama_kategori",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "kategori_tiket",
			"column_name": "harga",
			"data_type": "bigint",
			"udt_name": "int8",
			"is_nullable": "NO",
			"column_default": "'0'::bigint"
		},
		{
			"table_name": "kategori_tiket",
			"column_name": "kuota_maksimal",
			"data_type": "integer",
			"udt_name": "int4",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "kategori_tiket",
			"column_name": "tanggal_mulai_penjualan",
			"data_type": "timestamp without time zone",
			"udt_name": "timestamp",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "kategori_tiket",
			"column_name": "tanggal_selesai_penjualan",
			"data_type": "timestamp without time zone",
			"udt_name": "timestamp",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "kategori_tiket",
			"column_name": "is_hidden",
			"data_type": "boolean",
			"udt_name": "bool",
			"is_nullable": "YES",
			"column_default": "false"
		},
		{
			"table_name": "kategori_tiket",
			"column_name": "secret_token",
			"data_type": "character varying",
			"udt_name": "varchar",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "kategori_tiket",
			"column_name": "is_active",
			"data_type": "boolean",
			"udt_name": "bool",
			"is_nullable": "YES",
			"column_default": "true"
		},
		{
			"table_name": "organizer_profile",
			"column_name": "id",
			"data_type": "uuid",
			"udt_name": "uuid",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "organizer_profile",
			"column_name": "nama_organizer",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "organizer_profile",
			"column_name": "no_wa",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "organizer_profile",
			"column_name": "link_ig",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "organizer_profile",
			"column_name": "link_web",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "organizer_profile",
			"column_name": "updated_at",
			"data_type": "timestamp with time zone",
			"udt_name": "timestamptz",
			"is_nullable": "YES",
			"column_default": "timezone('utc'::text, now())"
		},
		{
			"table_name": "organizer_profile",
			"column_name": "logo_url",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "organizer_profile",
			"column_name": "pin_scanner",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "YES",
			"column_default": "'123456'::text"
		},
		{
			"table_name": "organizer_profile",
			"column_name": "bank_nama",
			"data_type": "character varying",
			"udt_name": "varchar",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "organizer_profile",
			"column_name": "bank_rekening",
			"data_type": "character varying",
			"udt_name": "varchar",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "organizer_profile",
			"column_name": "bank_atas_nama",
			"data_type": "character varying",
			"udt_name": "varchar",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "penarikan_dana",
			"column_name": "id",
			"data_type": "bigint",
			"udt_name": "int8",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "penarikan_dana",
			"column_name": "organizer_id",
			"data_type": "uuid",
			"udt_name": "uuid",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "penarikan_dana",
			"column_name": "nominal",
			"data_type": "bigint",
			"udt_name": "int8",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "penarikan_dana",
			"column_name": "bank_tujuan",
			"data_type": "character varying",
			"udt_name": "varchar",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "penarikan_dana",
			"column_name": "rekening_tujuan",
			"data_type": "character varying",
			"udt_name": "varchar",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "penarikan_dana",
			"column_name": "atas_nama",
			"data_type": "character varying",
			"udt_name": "varchar",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "penarikan_dana",
			"column_name": "status",
			"data_type": "character varying",
			"udt_name": "varchar",
			"is_nullable": "YES",
			"column_default": "'REQUEST'::character varying"
		},
		{
			"table_name": "penarikan_dana",
			"column_name": "keterangan",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "penarikan_dana",
			"column_name": "created_at",
			"data_type": "timestamp with time zone",
			"udt_name": "timestamptz",
			"is_nullable": "YES",
			"column_default": "now()"
		},
		{
			"table_name": "penarikan_dana",
			"column_name": "updated_at",
			"data_type": "timestamp with time zone",
			"udt_name": "timestamptz",
			"is_nullable": "YES",
			"column_default": "now()"
		},
		{
			"table_name": "peserta",
			"column_name": "id",
			"data_type": "bigint",
			"udt_name": "int8",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "peserta",
			"column_name": "created_at",
			"data_type": "timestamp with time zone",
			"udt_name": "timestamptz",
			"is_nullable": "NO",
			"column_default": "now()"
		},
		{
			"table_name": "peserta",
			"column_name": "kategori_id",
			"data_type": "bigint",
			"udt_name": "int8",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "peserta",
			"column_name": "nama_lengkap",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "peserta",
			"column_name": "email",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "peserta",
			"column_name": "is_scanned",
			"data_type": "boolean",
			"udt_name": "bool",
			"is_nullable": "NO",
			"column_default": "false"
		},
		{
			"table_name": "peserta",
			"column_name": "data_tambahan",
			"data_type": "jsonb",
			"udt_name": "jsonb",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "peserta",
			"column_name": "event_id",
			"data_type": "bigint",
			"udt_name": "int8",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "peserta",
			"column_name": "no_wa",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "peserta",
			"column_name": "nama_tiket",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "peserta",
			"column_name": "status_bayar",
			"data_type": "USER-DEFINED",
			"udt_name": "payment_status",
			"is_nullable": "YES",
			"column_default": "'pending'::payment_status"
		},
		{
			"table_name": "peserta",
			"column_name": "bukti_bayar_url",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "peserta",
			"column_name": "status_dana",
			"data_type": "character varying",
			"udt_name": "varchar",
			"is_nullable": "YES",
			"column_default": "'PENDING'::character varying"
		},
		{
			"table_name": "peserta",
			"column_name": "scanned_at",
			"data_type": "timestamp with time zone",
			"udt_name": "timestamptz",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "platform_settings",
			"column_name": "key",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "platform_settings",
			"column_name": "value",
			"data_type": "jsonb",
			"udt_name": "jsonb",
			"is_nullable": "NO",
			"column_default": "'{}'::jsonb"
		},
		{
			"table_name": "platform_settings",
			"column_name": "updated_at",
			"data_type": "timestamp with time zone",
			"udt_name": "timestamptz",
			"is_nullable": "NO",
			"column_default": "timezone('utc'::text, now())"
		},
		{
			"table_name": "riwayat_absen",
			"column_name": "id",
			"data_type": "bigint",
			"udt_name": "int8",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "riwayat_absen",
			"column_name": "peserta_id",
			"data_type": "bigint",
			"udt_name": "int8",
			"is_nullable": "YES",
			"column_default": null
		},
		{
			"table_name": "riwayat_absen",
			"column_name": "metode",
			"data_type": "text",
			"udt_name": "text",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "riwayat_absen",
			"column_name": "waktu_absen",
			"data_type": "timestamp with time zone",
			"udt_name": "timestamptz",
			"is_nullable": "YES",
			"column_default": "now()"
		},
		{
			"table_name": "riwayat_absen",
			"column_name": "created_at",
			"data_type": "timestamp with time zone",
			"udt_name": "timestamptz",
			"is_nullable": "YES",
			"column_default": "now()"
		},
		{
			"table_name": "super_admins",
			"column_name": "user_id",
			"data_type": "uuid",
			"udt_name": "uuid",
			"is_nullable": "NO",
			"column_default": null
		},
		{
			"table_name": "super_admins",
			"column_name": "created_at",
			"data_type": "timestamp with time zone",
			"udt_name": "timestamptz",
			"is_nullable": "YES",
			"column_default": "now()"
		}
	],
	"enums": [
		{
			"enum_name": "checkin_system",
			"enum_values": [
				"scanner",
				"manual_absen"
			]
		},
		{
			"enum_name": "event_status",
			"enum_values": [
				"draft",
				"published",
				"archived"
			]
		},
		{
			"enum_name": "payment_status",
			"enum_values": [
				"pending",
				"paid",
				"failed",
				"expired",
				"refunded",
				"cancelled"
			]
		},
		{
			"enum_name": "tipe_event",
			"enum_values": [
				"offline",
				"online",
				"hybrid"
			]
		}
	],
	"functions": [
		{
			"function_name": "ajukan_penarikan",
			"arguments": "eo_id uuid, req_nominal bigint, b_nama character varying, b_rek character varying, b_atas_nama character varying",
			"return_type": "jsonb"
		},
		{
			"function_name": "checkout_tiket_atomic",
			"arguments": "p_event_id bigint, p_is_anti_calo_email boolean, p_is_anti_calo_wa boolean, p_peserta_data jsonb",
			"return_type": "jsonb"
		},
		{
			"function_name": "get_admin_event_stats",
			"arguments": "p_event_id bigint",
			"return_type": "TABLE(total_peserta bigint, total_lunas bigint, total_pending bigint, total_hadir bigint, pendapatan_tiket bigint, pendapatan_donasi bigint)"
		},
		{
			"function_name": "get_eo_balances",
			"arguments": "eo_id uuid",
			"return_type": "jsonb"
		},
		{
			"function_name": "get_ticket_sales",
			"arguments": "p_event_id bigint",
			"return_type": "TABLE(kategori_id bigint, terjual bigint)"
		},
		{
			"function_name": "handle_new_user",
			"arguments": "",
			"return_type": "trigger"
		},
		{
			"function_name": "proses_absen_online",
			"arguments": "p_tiket_id bigint, p_email text",
			"return_type": "json"
		},
		{
			"function_name": "scan_tiket_crew",
			"arguments": "p_email text, p_pin text, p_tiket_id uuid",
			"return_type": "text"
		},
		{
			"function_name": "update_updated_at_column",
			"arguments": "",
			"return_type": "trigger"
		},
		{
			"function_name": "verifikasi_pin_eo",
			"arguments": "p_email text, p_pin text",
			"return_type": "boolean"
		}
	]
}