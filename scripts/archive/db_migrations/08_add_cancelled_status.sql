-- FIX ENUM TYPE UNTUK STATUS BAYAR
-- Menambahkan opsi 'cancelled' ke dalam tipe enum payment_status
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'cancelled';
