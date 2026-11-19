import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

import {
  OPSI_RENTANG_WAKTU,
  trenBahanBakuController,
  type BahanBaku,
  type RentangWaktu,
  type TrenResult,
} from '../controllers/TrenBahanBakuController';
import { COLORS, RADIUS, SHADOW, SPACING } from '../constants/theme';
import { formatRupiah } from '../utils/format';
import SimulasiHargaBahan from './SimulasiHargaBahan';

/* -------------------------------------------------------------------------- */
/*  Hook: daftar bahan baku                                                    */
/* -------------------------------------------------------------------------- */
function useDaftarBahanBaku() {
  const [items, setItems] = useState<BahanBaku[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'initial') setLoading(true);
    else setRefreshing(true);

    try {
      const data = await trenBahanBakuController.getDaftarBahanBaku();
      setItems(data);
      setError(null);
    } catch (e) {
      setItems([]);
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan tak terduga.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load('initial');
  }, [load]);

  return { items, loading, refreshing, error, reload: () => load('initial'), refresh: () => load('refresh') };
}

/* -------------------------------------------------------------------------- */
/*  Hook: data tren untuk 1 bahan baku + rentang waktu                         */
/* -------------------------------------------------------------------------- */
function useTren(bahan: BahanBaku | null, rentang: RentangWaktu) {
  const [tren, setTren] = useState<TrenResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!bahan) {
      setTren(null);
      setError(null);
      return;
    }

    let cancelled = false; // cegah respons lama menimpa respons baru
    setLoading(true);
    setError(null);

    trenBahanBakuController
      .getTren(bahan.id, rentang)
      .then((result) => {
        if (!cancelled) setTren(result);
      })
      .catch((e) => {
        if (cancelled) return;
        setTren(null);
        setError(e instanceof Error ? e.message : 'Terjadi kesalahan tak terduga.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [bahan, rentang, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);
  return { tren, loading, error, retry };
}

/* -------------------------------------------------------------------------- */
/*  Komponen kecil                                                             */
/* -------------------------------------------------------------------------- */
function StateMessage({
  icon,
  title,
  message,
  tone = 'neutral',
  actionLabel,
  onAction,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  message: string;
  tone?: 'neutral' | 'error';
  actionLabel?: string;
  onAction?: () => void;
}) {
  const isError = tone === 'error';
  return (
    <View style={styles.stateWrap}>
      <View style={[styles.stateIconCircle, isError && styles.stateIconCircleError]}>
        <Ionicons name={icon} size={40} color={isError ? COLORS.danger : COLORS.navy} />
      </View>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const BahanCard = memo(function BahanCard({
  item,
  onPress,
}: {
  item: BahanBaku;
  onPress: (b: BahanBaku) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Lihat tren harga ${item.nama}`}
    >
      <View style={styles.cardIcon}>
        <Ionicons name="trending-up" size={22} color={COLORS.greenDark} />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.nama}
        </Text>
        <Text style={styles.cardSub}>{item.satuan ? `Satuan: ${item.satuan}` : 'Lihat tren harga beli'}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
    </Pressable>
  );
});

/** Dropdown sederhana tanpa dependensi tambahan (opsi mengembang di tempat). */
function DropdownRentang({
  value,
  onChange,
}: {
  value: RentangWaktu;
  onChange: (v: RentangWaktu) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = OPSI_RENTANG_WAKTU.find((o) => o.value === value);

  return (
    <View>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={styles.dropdownTrigger}
        accessibilityRole="button"
        accessibilityLabel="Pilih rentang waktu"
        accessibilityState={{ expanded: open }}
      >
        <Ionicons name="calendar-outline" size={18} color={COLORS.navy} />
        <Text style={styles.dropdownTriggerText}>{current?.label}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.navy} />
      </Pressable>

      {open && (
        <View style={styles.dropdownMenu}>
          {OPSI_RENTANG_WAKTU.map((opt) => {
            const active = opt.value === value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={[styles.dropdownItem, active && styles.dropdownItemActive]}
              >
                <Text style={[styles.dropdownItemText, active && styles.dropdownItemTextActive]}>
                  {opt.label}
                </Text>
                {active && <Ionicons name="checkmark" size={18} color={COLORS.greenDark} />}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Modal detail tren                                                          */
/* -------------------------------------------------------------------------- */
const formatSumbuY = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 1000 ? `${Math.round(n / 100) / 10}rb` : v;
};

function TrenModal({ bahan, onClose }: { bahan: BahanBaku | null; onClose: () => void }) {
  const { width } = useWindowDimensions();
  const [rentang, setRentang] = useState<RentangWaktu>(30);
  const { tren, loading, error, retry } = useTren(bahan, rentang);

  useEffect(() => {
    if (bahan) setRentang(30);
  }, [bahan]);

  const chartWidth = width - SPACING.lg * 2 - SPACING.lg * 2; // padding sheet + padding card
  const ringkasan = tren?.ringkasan ?? null;
  const naik = ringkasan ? ringkasan.perubahanPersen > 0 : false;
  const turun = ringkasan ? ringkasan.perubahanPersen < 0 : false;

  let content: React.ReactNode;
  if (loading) {
    content = (
      <View style={styles.modalCenter}>
        <ActivityIndicator size="large" color={COLORS.green} />
        <Text style={styles.loadingText}>Memuat riwayat harga…</Text>
      </View>
    );
  } else if (error) {
    content = (
      <StateMessage
        tone="error"
        icon="cloud-offline-outline"
        title="Gagal memuat tren"
        message={error}
        actionLabel="Coba lagi"
        onAction={retry}
      />
    );
  } else if (!tren || tren.jumlahTitik === 0) {
    content = (
      <StateMessage
        icon="analytics-outline"
        title="Belum ada riwayat harga"
        message="Tidak ada catatan harga beli pada rentang waktu ini. Coba pilih rentang yang lebih panjang."
      />
    );
  } else {
    content = (
      <>
        {tren.jumlahTitik < 2 ? (
          <View style={styles.chartCard}>
            <Text style={styles.singleHint}>
              Baru ada 1 catatan harga, belum cukup untuk membentuk grafik.
            </Text>
            <Text style={styles.singlePrice}>{formatRupiah(ringkasan?.hargaAkhir)}</Text>
          </View>
        ) : (
          <View style={styles.chartCard}>
            <LineChart
              data={tren.chart}
              width={chartWidth}
              height={220}
              bezier
              withShadow={false}
              formatYLabel={formatSumbuY}
              yLabelsOffset={8}
              chartConfig={{
                backgroundGradientFrom: COLORS.card,
                backgroundGradientTo: COLORS.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(11, 42, 91, ${opacity})`,
                propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.green },
                propsForBackgroundLines: { stroke: COLORS.border, strokeDasharray: '' },
              }}
              style={styles.chart}
            />
          </View>
        )}

        {ringkasan && (
          <>
            <View style={styles.changeRow}>
              <Text style={styles.changeLabel}>Perubahan harga</Text>
              <View
                style={[
                  styles.changeBadge,
                  naik && styles.changeBadgeUp,
                  turun && styles.changeBadgeDown,
                ]}
              >
                <Ionicons
                  name={naik ? 'arrow-up' : turun ? 'arrow-down' : 'remove'}
                  size={14}
                  color={naik ? COLORS.danger : turun ? COLORS.greenDark : COLORS.navySoft}
                />
                <Text
                  style={[
                    styles.changeBadgeText,
                    naik && { color: COLORS.danger },
                    turun && { color: COLORS.greenDark },
                  ]}
                >
                  {Math.abs(ringkasan.perubahanPersen).toFixed(1)}%
                </Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <StatBox label="Terendah" value={formatRupiah(ringkasan.terendah)} />
              <StatBox label="Rata-rata" value={formatRupiah(ringkasan.rataRata)} />
              <StatBox label="Tertinggi" value={formatRupiah(ringkasan.tertinggi)} />
            </View>
          </>
        )}
      </>
    );
  }

  return (
    <Modal
      visible={bahan !== null}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={onClose} accessibilityLabel="Tutup" />

        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderText}>
              <Text style={styles.sheetTitle} numberOfLines={1}>
                {bahan?.nama}
              </Text>
              <Text style={styles.sheetSub}>
                Tren harga beli{bahan?.satuan ? ` per ${bahan.satuan}` : ''}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Tutup" style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.navy} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetBody}>
            <DropdownRentang value={rentang} onChange={setRentang} />
            {content}
            {bahan && <SimulasiHargaBahan idBahan={bahan.id} satuan={bahan.satuan} onBerhasil={retry} />}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/*  Halaman                                                                    */
/* -------------------------------------------------------------------------- */
export default function TrenBahanBakuPage() {
  const { items, loading, refreshing, error, reload, refresh } = useDaftarBahanBaku();
  const [selected, setSelected] = useState<BahanBaku | null>(null);

  const renderItem = useCallback(
    ({ item }: { item: BahanBaku }) => <BahanCard item={item} onPress={setSelected} />,
    [],
  );

  let body: React.ReactNode;
  if (loading) {
    body = (
      <View style={styles.centerWrap}>
        <ActivityIndicator size="large" color={COLORS.green} />
        <Text style={styles.loadingText}>Memuat bahan baku…</Text>
      </View>
    );
  } else if (error) {
    body = (
      <StateMessage
        tone="error"
        icon="cloud-offline-outline"
        title="Gagal memuat bahan baku"
        message={error}
        actionLabel="Coba lagi"
        onAction={reload}
      />
    );
  } else if (items.length === 0) {
    body = (
      <StateMessage
        icon="basket-outline"
        title="Belum ada bahan baku"
        message="Tambahkan bahan baku terlebih dahulu untuk melihat tren harganya."
      />
    );
  } else {
    body = (
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={COLORS.green} colors={[COLORS.green]} />
        }
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tren Harga Bahan Baku</Text>
        <Text style={styles.headerSub}>Pilih bahan baku untuk melihat fluktuasi harga belinya.</Text>
      </View>

      <View style={styles.body}>{body}</View>

      <TrenModal bahan={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*  Style                                                                      */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.md },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.navy },
  headerSub: { fontSize: 14, color: COLORS.navySoft, marginTop: 4 },

  body: { flex: 1 },
  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl, gap: SPACING.md },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    ...SHADOW,
  },
  cardPressed: { opacity: 0.85 },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.greenTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.navy },
  cardSub: { fontSize: 13, color: COLORS.muted, marginTop: 2 },

  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
  loadingText: { color: COLORS.navySoft, fontSize: 14 },

  stateWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  stateIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...SHADOW,
  },
  stateIconCircleError: { backgroundColor: COLORS.dangerTint },
  stateTitle: { fontSize: 18, fontWeight: '800', color: COLORS.navy, textAlign: 'center' },
  stateMessage: {
    fontSize: 14,
    color: COLORS.navySoft,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.green,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: RADIUS.chip,
  },
  primaryButtonPressed: { backgroundColor: COLORS.greenDark },
  primaryButtonText: { color: COLORS.white, fontWeight: '800', fontSize: 15 },

  /* Modal / bottom sheet */
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(11, 42, 91, 0.45)' },
  backdropTouch: { flex: 1 },
  sheet: {
    maxHeight: '88%',
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.sheet,
    borderTopRightRadius: RADIUS.sheet,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  sheetHeaderText: { flex: 1 },
  sheetTitle: { fontSize: 22, fontWeight: '800', color: COLORS.navy },
  sheetSub: { fontSize: 13, color: COLORS.navySoft, marginTop: 2 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBody: { paddingBottom: SPACING.xl * 1.5, gap: SPACING.md },
  modalCenter: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: SPACING.md },

  /* Dropdown */
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
  },
  dropdownTriggerText: { fontSize: 14, fontWeight: '700', color: COLORS.navy },
  dropdownMenu: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOW,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
  },
  dropdownItemActive: { backgroundColor: COLORS.greenTint },
  dropdownItemText: { fontSize: 14, color: COLORS.navySoft },
  dropdownItemTextActive: { color: COLORS.navy, fontWeight: '800' },

  /* Chart & ringkasan */
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOW,
  },
  chart: { borderRadius: RADIUS.card, marginLeft: -SPACING.sm },
  singleHint: { fontSize: 14, color: COLORS.navySoft, textAlign: 'center' },
  singlePrice: { fontSize: 28, fontWeight: '800', color: COLORS.navy, marginTop: SPACING.sm },

  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  changeLabel: { fontSize: 14, fontWeight: '600', color: COLORS.navy },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.chip,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  changeBadgeUp: { backgroundColor: COLORS.dangerTint }, // harga beli naik = beban naik
  changeBadgeDown: { backgroundColor: COLORS.greenTint },
  changeBadgeText: { fontSize: 14, fontWeight: '800', color: COLORS.navySoft },

  statRow: { flexDirection: 'row', gap: SPACING.sm },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
  },
  statLabel: { fontSize: 12, color: COLORS.muted },
  statValue: { fontSize: 14, fontWeight: '800', color: COLORS.navy, marginTop: 4 },
});
