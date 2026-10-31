import { g as useRouter, u as useSupabaseUser, i as useState, h as useRoute } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-D_3WHFvH.mjs';
import { computed, watch } from 'vue';

//#region app/composables/useAdmin.ts
var useAdmin = () => {
	const supabase = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();
	const currentUser = user;
	const userEmail = computed(() => user.value?.email || "");
	const showDropdown = useState("admin_showDropdown", () => false);
	const activeTab = useState("admin_activeTab", () => "home");
	const isLoading = useState("admin_isLoading", () => true);
	const allEvents = useState("admin_allEvents", () => []);
	const route = useRoute();
	const lastActiveEventSlug = useState("admin_lastActiveEventSlug", () => null);
	watch(() => route.params.slug, (newSlug) => {
		if (newSlug && typeof newSlug === "string") lastActiveEventSlug.value = newSlug;
	}, { immediate: true });
	const selectedEvent = computed(() => {
		const slug = route.params.slug || lastActiveEventSlug.value;
		if (!slug) return null;
		return allEvents.value.find((e) => e.slug === slug) || null;
	});
	const showArsip = useState("admin_showArsip", () => false);
	const daftarPeserta = useState("admin_daftarPeserta", () => []);
	const isLoadingPeserta = useState("admin_isLoadingPeserta", () => false);
	const pesertaPage = useState("admin_pesertaPage", () => 1);
	const pesertaTotalData = useState("admin_pesertaTotalData", () => 0);
	const formEditEvent = useState("admin_formEditEvent", () => ({
		nama: "",
		slug: "",
		tanggal: "",
		lokasi: "",
		deskripsi: "",
		status: "published"
	}));
	const isSavingEdit = useState("admin_isSavingEdit", () => false);
	const showWizard = useState("admin_showWizard", () => false);
	const wizardStepNow = useState("admin_wizardStepNow", () => 1);
	const formEvent = useState("admin_formEvent", () => ({
		nama: "",
		slug: "",
		tanggal: "",
		lokasi: "",
		deskripsi: "",
		link_maps: "",
		tipe_event: "offline",
		sistem_checkin: "scanner",
		target_absen: 0,
		link_online: "",
		is_qr_active: true,
		is_online_absen_active: false,
		is_snk_active: false,
		snk_text: "Syarat dan ketentuan berlaku mengikuti kebijakan panitia dan tyket.id.",
		is_anti_calo_email: false,
		is_anti_calo_wa: false,
		is_wa_konfirm: false,
		is_limit_tiket_active: true,
		max_tiket_per_transaksi: 1,
		is_donasi_active: false,
		donasi_header: "",
		donasi_options: "",
		is_donasi_custom: false,
		is_grup_wa_active: false,
		link_grup_wa: "",
		poster_file: null,
		poster_preview: null
	}));
	const formTiketBaru = useState("admin_formTiketBaru", () => ({
		nama: "",
		harga: "",
		is_gratis: true,
		kuota: "",
		is_unlimited: false,
		is_hidden: false,
		is_active: true,
		buka: "",
		tutup: "",
		is_no_time_limit: false
	}));
	const wizardTiketList = useState("admin_wizardTiketList", () => []);
	const formForgeItems = useState("admin_formForgeItems", () => []);
	const isSavingEvent = useState("admin_isSavingEvent", () => false);
	const totalPeserta = useState("admin_totalPeserta", () => 0);
	const totalLunas = useState("admin_totalLunas", () => 0);
	const totalPending = useState("admin_totalPending", () => 0);
	const totalHadir = useState("admin_totalHadir", () => 0);
	const totalPendapatanTiket = useState("admin_totalPendapatanTiket", () => 0);
	const totalPendapatanDonasi = useState("admin_totalPendapatanDonasi", () => 0);
	const persenHadir = computed(() => totalLunas.value === 0 ? 0 : Math.round(totalHadir.value / totalLunas.value * 100));
	const organizerProfile = useState("admin_organizerProfile", () => null);
	const userName = computed(() => {
		if (organizerProfile.value && organizerProfile.value.nama_organizer) return organizerProfile.value.nama_organizer;
		if (user.value?.user_metadata?.full_name || user.value?.user_metadata?.name) return user.value.user_metadata.full_name || user.value.user_metadata.name;
		return userEmail.value ? userEmail.value.split("@")[0] : "Admin";
	});
	const userInitials = computed(() => userName.value?.substring(0, 2)?.toUpperCase() || "AD");
	const eventAktif = computed(() => {
		const today = /* @__PURE__ */ new Date();
		today.setHours(0, 0, 0, 0);
		return allEvents.value.filter((ev) => {
			const isArsip = ev.status === "archived" || ev.is_archived === true;
			const evDate = ev.tanggal_mulai ? new Date(ev.tanggal_mulai) : null;
			if (evDate) evDate.setHours(0, 0, 0, 0);
			return !isArsip && !(ev.status === "finished" || evDate && evDate < today);
		});
	});
	const eventSelesai = computed(() => {
		const today = /* @__PURE__ */ new Date();
		today.setHours(0, 0, 0, 0);
		return allEvents.value.filter((ev) => {
			const isArsip = ev.status === "archived" || ev.is_archived === true;
			const evDate = ev.tanggal_mulai ? new Date(ev.tanggal_mulai) : null;
			if (evDate) evDate.setHours(0, 0, 0, 0);
			return !isArsip && (ev.status === "finished" || evDate && evDate < today);
		});
	});
	const eventArsip = computed(() => allEvents.value.filter((ev) => ev.status === "archived" || ev.is_archived === true));
	const formatDate = (dateStr) => {
		if (!dateStr) return "Tgl blm diset";
		return new Date(dateStr).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric"
		});
	};
	const muatDaftarEvent = async (userId) => {
		if (!userId) {
			isLoading.value = false;
			return;
		}
		isLoading.value = true;
		try {
			const { data, error } = await supabase.from("event").select("*").eq("organizer_id", userId).order("created_at", { ascending: false });
			if (error) throw error;
			allEvents.value = data || [];
		} catch (err) {
			showToast("Gagal memuat event: " + err.message, "error");
		} finally {
			isLoading.value = false;
		}
	};
	const muatStatistikPeserta = async () => {
		if (!selectedEvent.value) return;
		try {
			const { data, error } = await supabase.rpc("get_admin_event_stats", { p_event_id: selectedEvent.value.id });
			if (error) throw error;
			if (data && data.length > 0) {
				const stats = data[0];
				totalPeserta.value = stats.total_peserta || 0;
				totalLunas.value = stats.total_lunas || 0;
				totalPending.value = stats.total_pending || 0;
				totalHadir.value = stats.total_hadir || 0;
				totalPendapatanTiket.value = stats.pendapatan_tiket || 0;
				totalPendapatanDonasi.value = stats.pendapatan_donasi || 0;
			}
		} catch (err) {
			console.error("Gagal memuat statistik:", err);
		}
	};
	const muatDaftarPeserta = async (query = "", status = "semua", hadir = "semua", tiket = "semua", limit = 20) => {
		if (!selectedEvent.value) return;
		isLoadingPeserta.value = true;
		try {
			const from = (pesertaPage.value - 1) * limit;
			const to = from + limit - 1;
			let req = supabase.from("peserta").select("id, nama_lengkap, email, no_wa, nama_tiket, status_bayar, is_scanned, bukti_bayar_url, data_tambahan, created_at, kategori_tiket (harga)", { count: "exact" }).eq("event_id", selectedEvent.value.id);
			if (query) req = req.or(`nama_lengkap.ilike.%${query}%,email.ilike.%${query}%,no_wa.ilike.%${query}%`);
			if (status !== "semua") req = req.eq("status_bayar", status);
			if (hadir === "hadir") req = req.eq("is_scanned", true);
			else if (hadir === "belum") req = req.eq("is_scanned", false);
			if (tiket !== "semua") req = req.eq("kategori_id", tiket);
			const { data, error, count } = await req.order("created_at", { ascending: false }).range(from, to);
			if (error) throw error;
			daftarPeserta.value = data || [];
			pesertaTotalData.value = count || 0;
			muatStatistikPeserta();
		} catch (err) {
			showToast("Gagal memuat peserta: " + err.message, "error");
		} finally {
			isLoadingPeserta.value = false;
		}
	};
	watch(selectedEvent, () => {
		if (selectedEvent.value) muatDaftarPeserta();
	}, { immediate: true });
	const prosesLogout = async () => {
		allEvents.value = [];
		lastActiveEventSlug.value = null;
		daftarPeserta.value = [];
		organizerProfile.value = null;
		totalPeserta.value = 0;
		totalLunas.value = 0;
		totalPending.value = 0;
		totalHadir.value = 0;
		pesertaPage.value = 1;
		pesertaTotalData.value = 0;
		await supabase.auth.signOut();
		router.push("/login");
	};
	const toastList = useState("admin_toastList", () => []);
	const showToast = (message, type = "success") => {
		const id = Date.now();
		toastList.value.push({
			id,
			message,
			type,
			show: false
		});
		setTimeout(() => {
			const toast = toastList.value.find((t) => t.id === id);
			if (toast) toast.show = true;
		}, 10);
		setTimeout(() => {
			const toast = toastList.value.find((t) => t.id === id);
			if (toast) toast.show = false;
			setTimeout(() => {
				toastList.value = toastList.value.filter((t) => t.id !== id);
			}, 400);
		}, 3e3);
	};
	const confirmData = useState("admin_confirm", () => ({
		show: false,
		title: "",
		message: "",
		actionText: "",
		type: "success",
		callback: null,
		cancelCallback: null
	}));
	const showConfirm = (title, message, actionText, type, callback, cancelCallback = null) => {
		confirmData.value = {
			show: true,
			title,
			message,
			actionText,
			type,
			callback,
			cancelCallback
		};
	};
	const closeConfirm = () => {
		if (confirmData.value.cancelCallback) confirmData.value.cancelCallback();
		confirmData.value.show = false;
	};
	const isOnline = useState("admin_isOnline", () => true);
	const showOnboarding = useState("admin_showOnboarding", () => false);
	const muatProfilOrganizer = async () => {
		try {
			if (!currentUser.value?.id) return;
			const { data, error } = await supabase.from("organizer_profile").select("*").eq("id", currentUser.value.id).single();
			console.log("--- muatProfilOrganizer ---");
			console.log("currentUser ID:", currentUser.value.id);
			console.log("Data fetched:", data);
			console.log("Error fetched:", error);
			if (data && !error) {
				organizerProfile.value = data;
				const pin = data.pin_scanner;
				const isPinInsecure = !pin || pin === "123456";
				if (!data.nama_organizer || isPinInsecure) showOnboarding.value = true;
			} else {
				console.warn("Failed to load profile or profile empty", error);
				showOnboarding.value = true;
			}
		} catch (e) {
			console.error("Exception in muatProfilOrganizer:", e);
			showOnboarding.value = true;
		}
	};
	return {
		supabase,
		currentUser,
		userEmail,
		showDropdown,
		activeTab,
		isLoading,
		allEvents,
		selectedEvent,
		showArsip,
		daftarPeserta,
		isLoadingPeserta,
		formEditEvent,
		isSavingEdit,
		pesertaPage,
		pesertaTotalData,
		showWizard,
		wizardStepNow,
		formEvent,
		formTiketBaru,
		wizardTiketList,
		isSavingEvent,
		formForgeItems,
		totalPeserta,
		totalLunas,
		totalPending,
		totalHadir,
		persenHadir,
		totalPendapatanTiket,
		totalPendapatanDonasi,
		userName,
		userInitials,
		eventAktif,
		eventSelesai,
		eventArsip,
		formatDate,
		muatDaftarEvent,
		muatDaftarPeserta,
		prosesLogout,
		toastList,
		showToast,
		confirmData,
		showConfirm,
		closeConfirm,
		isOnline,
		showOnboarding,
		organizerProfile,
		muatProfilOrganizer
	};
};

export { useAdmin as u };
//# sourceMappingURL=useAdmin-6B6OnmW9.mjs.map
