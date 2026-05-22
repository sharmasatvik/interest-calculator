import { Component, computed, signal, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

export interface ChartPoint {
  year: number;
  si: number;
  ci: number;
  siTotal: number;
  ciTotal: number;
  totalInvested: number;
}

export interface SvgPoint {
  x: number;
  y: number;
}

const COMPOUND_OPTIONS = [
  { label: "Annually (1×/year)", value: 1 },
  { label: "Semi-Annually (2×/year)", value: 2 },
  { label: "Quarterly (4×/year)", value: 4 },
  { label: "Monthly (12×/year)", value: 12 },
  { label: "Daily (365×/year)", value: 365 },
];

// IANA timezone prefix → ISO 4217 currency code
// Timezone is set by the OS to the user's actual location,
// so it works correctly even when the browser language is en-US.
// Had to add this piece of code in order show user locale
// currency instead of flat out showing USD or INR.
const TIMEZONE_CURRENCY_MAP: Record<string, string> = {
  // Africa
  "Africa/Abidjan": "XOF",
  "Africa/Accra": "GHS",
  "Africa/Addis_Ababa": "ETB",
  "Africa/Algiers": "DZD",
  "Africa/Cairo": "EGP",
  "Africa/Casablanca": "MAD",
  "Africa/Johannesburg": "ZAR",
  "Africa/Kampala": "UGX",
  "Africa/Lagos": "NGN",
  "Africa/Nairobi": "KES",
  "Africa/Tripoli": "LYD",
  "Africa/Tunis": "TND",
  // Americas
  "America/Argentina/Buenos_Aires": "ARS",
  "America/Bogota": "COP",
  "America/Caracas": "VES",
  "America/Chicago": "USD",
  "America/Denver": "USD",
  "America/Halifax": "CAD",
  "America/Lima": "PEN",
  "America/Los_Angeles": "USD",
  "America/Mexico_City": "MXN",
  "America/New_York": "USD",
  "America/Phoenix": "USD",
  "America/Santiago": "CLP",
  "America/Sao_Paulo": "BRL",
  "America/Toronto": "CAD",
  "America/Vancouver": "CAD",
  "America/Winnipeg": "CAD",
  // Asia
  "Asia/Almaty": "KZT",
  "Asia/Baghdad": "IQD",
  "Asia/Baku": "AZN",
  "Asia/Bangkok": "THB",
  "Asia/Beirut": "LBP",
  "Asia/Calcutta": "INR",
  "Asia/Colombo": "LKR",
  "Asia/Dhaka": "BDT",
  "Asia/Dubai": "AED",
  "Asia/Ho_Chi_Minh": "VND",
  "Asia/Hong_Kong": "HKD",
  "Asia/Jakarta": "IDR",
  "Asia/Jerusalem": "ILS",
  "Asia/Karachi": "PKR",
  "Asia/Kathmandu": "NPR",
  "Asia/Kolkata": "INR",
  "Asia/Krasnoyarsk": "RUB",
  "Asia/Kuala_Lumpur": "MYR",
  "Asia/Kuwait": "KWD",
  "Asia/Macau": "MOP",
  "Asia/Manila": "PHP",
  "Asia/Muscat": "OMR",
  "Asia/Nicosia": "EUR",
  "Asia/Novosibirsk": "RUB",
  "Asia/Qatar": "QAR",
  "Asia/Riyadh": "SAR",
  "Asia/Seoul": "KRW",
  "Asia/Shanghai": "CNY",
  "Asia/Singapore": "SGD",
  "Asia/Taipei": "TWD",
  "Asia/Tashkent": "UZS",
  "Asia/Tbilisi": "GEL",
  "Asia/Tehran": "IRR",
  "Asia/Tokyo": "JPY",
  "Asia/Ulaanbaatar": "MNT",
  "Asia/Vladivostok": "RUB",
  "Asia/Yakutsk": "RUB",
  "Asia/Yekaterinburg": "RUB",
  "Asia/Yerevan": "AMD",
  // Australia & Pacific
  "Australia/Adelaide": "AUD",
  "Australia/Brisbane": "AUD",
  "Australia/Melbourne": "AUD",
  "Australia/Perth": "AUD",
  "Australia/Sydney": "AUD",
  "Pacific/Auckland": "NZD",
  "Pacific/Fiji": "FJD",
  // Europe
  "Europe/Amsterdam": "EUR",
  "Europe/Athens": "EUR",
  "Europe/Belgrade": "RSD",
  "Europe/Berlin": "EUR",
  "Europe/Bratislava": "EUR",
  "Europe/Brussels": "EUR",
  "Europe/Bucharest": "RON",
  "Europe/Budapest": "HUF",
  "Europe/Copenhagen": "DKK",
  "Europe/Dublin": "EUR",
  "Europe/Helsinki": "EUR",
  "Europe/Istanbul": "TRY",
  "Europe/Kiev": "UAH",
  "Europe/Kyiv": "UAH",
  "Europe/Lisbon": "EUR",
  "Europe/Ljubljana": "EUR",
  "Europe/London": "GBP",
  "Europe/Luxembourg": "EUR",
  "Europe/Madrid": "EUR",
  "Europe/Malta": "EUR",
  "Europe/Minsk": "BYN",
  "Europe/Moscow": "RUB",
  "Europe/Oslo": "NOK",
  "Europe/Paris": "EUR",
  "Europe/Prague": "CZK",
  "Europe/Riga": "EUR",
  "Europe/Rome": "EUR",
  "Europe/Sarajevo": "BAM",
  "Europe/Sofia": "BGN",
  "Europe/Stockholm": "SEK",
  "Europe/Tallinn": "EUR",
  "Europe/Tirane": "ALL",
  "Europe/Uzhgorod": "UAH",
  "Europe/Vienna": "EUR",
  "Europe/Vilnius": "EUR",
  "Europe/Warsaw": "PLN",
  "Europe/Zurich": "CHF",
};

// Best locale to use for formatting a given currency.
const CURRENCY_LOCALE_MAP: Record<string, string> = {
  AED: "ar-AE",
  ARS: "es-AR",
  AUD: "en-AU",
  AZN: "az-AZ",
  BAM: "bs-BA",
  BDT: "bn-BD",
  BGN: "bg-BG",
  BRL: "pt-BR",
  BYN: "be-BY",
  CAD: "en-CA",
  CHF: "de-CH",
  CLP: "es-CL",
  CNY: "zh-CN",
  COP: "es-CO",
  CZK: "cs-CZ",
  DKK: "da-DK",
  DZD: "ar-DZ",
  EGP: "ar-EG",
  ETB: "am-ET",
  EUR: "de-DE",
  FJD: "en-FJ",
  GEL: "ka-GE",
  GHS: "en-GH",
  GBP: "en-GB",
  HKD: "zh-HK",
  HUF: "hu-HU",
  IDR: "id-ID",
  ILS: "he-IL",
  INR: "en-IN",
  IQD: "ar-IQ",
  IRR: "fa-IR",
  JPY: "ja-JP",
  KES: "sw-KE",
  KRW: "ko-KR",
  KWD: "ar-KW",
  KZT: "kk-KZ",
  LBP: "ar-LB",
  LKR: "si-LK",
  LYD: "ar-LY",
  MAD: "ar-MA",
  MNT: "mn-MN",
  MOP: "zh-MO",
  MXN: "es-MX",
  MYR: "ms-MY",
  NGN: "en-NG",
  NOK: "nb-NO",
  NPR: "ne-NP",
  NZD: "en-NZ",
  OMR: "ar-OM",
  PHP: "en-PH",
  PKR: "ur-PK",
  PLN: "pl-PL",
  QAR: "ar-QA",
  RON: "ro-RO",
  RSD: "sr-RS",
  RUB: "ru-RU",
  SAR: "ar-SA",
  SEK: "sv-SE",
  SGD: "en-SG",
  THB: "th-TH",
  TND: "ar-TN",
  TRY: "tr-TR",
  TWD: "zh-TW",
  UAH: "uk-UA",
  UGX: "sw-UG",
  USD: "en-US",
  UZS: "uz-UZ",
  VES: "es-VE",
  VND: "vi-VN",
  XOF: "fr-SN",
  ZAR: "en-ZA",
};

function detectCurrency(): {
  locale: string;
  currency: string;
  timezone: string;
} {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Try exact timezone match first, then try prefix (e.g. "Asia/..." region)
  let currency = TIMEZONE_CURRENCY_MAP[timezone];

  if (!currency) {
    // Try matching by continent prefix for unknown sub-zones
    const prefix = Object.keys(TIMEZONE_CURRENCY_MAP).find((tz) =>
      timezone.startsWith(tz.split("/")[0] + "/"),
    );
    currency = prefix ? TIMEZONE_CURRENCY_MAP[prefix] : "USD";
  }

  const locale = CURRENCY_LOCALE_MAP[currency] || navigator.language || "en-US";
  return { locale, currency, timezone };
}

@Component({
  selector: "app-calculator",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./calculator.component.html",
  styleUrl: "./calculator.component.css",
})
export class CalculatorComponent implements OnInit {
  readonly compoundOptions = COMPOUND_OPTIONS;

  // Locale / currency
  userLocale = "en-US";
  userCurrency = "USD";
  userTimezone = "";

  // Core inputs
  principal = signal<number | null>(null);
  rate = signal<number | null>(null);
  time = signal<number | null>(null);
  compoundFrequency = signal<number>(1);

  // Opening balance
  openingBalance = signal<number | null>(null);

  // Step-up
  stepUpEnabled = signal(false);
  stepUpRate = signal<number | null>(null);

  // Validation errors
  errors = signal<Record<string, string | undefined>>({});

  showResults = signal(false);
  activeTab = signal<"interest" | "total">("interest");

  /**
   * Tooltip
   */
  tooltip = signal<{
    year: number;
    svgX: number;
    siY: number;
    ciY: number;
    siVal: number;
    ciVal: number;
    totalInvested: number;
    htmlX: number;
    showRight: boolean;
  } | null>(null);

  ngOnInit() {
    const { locale, currency, timezone } = detectCurrency();
    this.userLocale = locale;
    this.userCurrency = currency;
    this.userTimezone = timezone;
  }

  /**
   * Computed results
   */
  results = computed(() => {
    if (!this.showResults()) return null;

    const P = this.principal()!;
    const B = this.openingBalance() ?? 0;
    const r = this.rate()! / 100;
    const t = Math.floor(this.time()!);
    const n = this.compoundFrequency();
    const su = this.stepUpEnabled() ? (this.stepUpRate() ?? 0) / 100 : 0;

    /**
     * Build investment schedule: [{amount, year}]
     * Opening balance + principal both start at year 0
     */
    const investments: { amount: number; year: number }[] = [
      { amount: B + P, year: 0 },
    ];
    if (this.stepUpEnabled()) {
      for (let i = 1; i < t; i++) {
        investments.push({ amount: P * Math.pow(1 + su, i), year: i });
      }
    }

    const chartData: ChartPoint[] = [];

    /**
     * Map chart data.
     */
    for (let yr = 0; yr <= t; yr++) {
      const active = investments.filter((inv) => inv.year <= yr);
      const totalInvested = active.reduce((s, inv) => s + inv.amount, 0);

      // SI: each investment earns simple interest for (yr - inv.year) years
      const siInterest = active.reduce(
        (s, inv) => s + inv.amount * r * (yr - inv.year),
        0,
      );
      const siTotal = totalInvested + siInterest;

      // CI: each investment compounds for (yr - inv.year) years
      const ciTotal = active.reduce(
        (s, inv) => s + inv.amount * Math.pow(1 + r / n, n * (yr - inv.year)),
        0,
      );
      const ciInterest = ciTotal - totalInvested;

      chartData.push({
        year: yr,
        si: parseFloat(siInterest.toFixed(2)),
        ci: parseFloat(ciInterest.toFixed(2)),
        siTotal: parseFloat(siTotal.toFixed(2)),
        ciTotal: parseFloat(ciTotal.toFixed(2)),
        totalInvested: parseFloat(totalInvested.toFixed(2)),
      });
    }

    const last = chartData[chartData.length - 1];
    const totalInvestedFinal = last.totalInvested;

    return {
      P,
      B,
      r,
      t,
      n,
      su,
      SI: last.si,
      CI: last.ci,
      totalSI: last.siTotal,
      totalCI: last.ciTotal,
      totalInvested: totalInvestedFinal,
      chartData,
    };
  });

  // SVG Chart
  readonly svgW = 580;
  readonly svgH = 280;
  readonly padL = 72;
  readonly padR = 20;
  readonly padT = 16;
  readonly padB = 40;

  chartSvgData = computed(() => {
    const res = this.results();
    if (!res) return null;
    const tab = this.activeTab();
    const data = res.chartData;

    const aKey = tab === "interest" ? "si" : "siTotal";
    const bKey = tab === "interest" ? "ci" : "ciTotal";

    const allVals = data.flatMap((d) => [
      d[aKey as keyof ChartPoint] as number,
      d[bKey as keyof ChartPoint] as number,
    ]);
    const minVal =
      tab === "total" ? Math.min(...data.map((d) => d.totalInvested)) : 0;
    const maxVal = Math.max(...allVals) * 1.08 || 1;

    const innerW = this.svgW - this.padL - this.padR;
    const innerH = this.svgH - this.padT - this.padB;

    const toX = (yr: number) =>
      this.padL + (yr / (data.length - 1 || 1)) * innerW;
    const toY = (v: number) =>
      this.padT + innerH - ((v - minVal) / (maxVal - minVal || 1)) * innerH;

    const lineA = data.map((d) => ({
      x: toX(d.year),
      y: toY(d[aKey as keyof ChartPoint] as number),
    }));
    const lineB = data.map((d) => ({
      x: toX(d.year),
      y: toY(d[bKey as keyof ChartPoint] as number),
    }));

    const toPath = (pts: SvgPoint[]) =>
      pts
        .map(
          (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
        )
        .join(" ");

    const toArea = (pts: SvgPoint[]) => {
      const base = this.padT + innerH;
      return (
        pts
          .map(
            (p, i) =>
              `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
          )
          .join(" ") +
        ` L${pts[pts.length - 1].x.toFixed(1)},${base} L${pts[0].x.toFixed(1)},${base} Z`
      );
    };

    const tickCount = 5;
    const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => {
      const v = minVal + (i / tickCount) * (maxVal - minVal);
      return { y: toY(v), label: this.formatShort(v) };
    });

    const maxXTicks = 10;
    const step = Math.ceil(data.length / maxXTicks);
    const xTicks = data
      .filter((d) => d.year % step === 0 || d.year === data.length - 1)
      .map((d) => ({ x: toX(d.year), label: String(d.year) }));

    // invested line for "total" tab
    let investedPath: string | null = null;
    if (tab === "total") {
      const pts = data.map((d) => ({
        x: toX(d.year),
        y: toY(d.totalInvested),
      }));
      investedPath = toPath(pts);
    }

    return {
      pathA: toPath(lineA),
      pathB: toPath(lineB),
      areaA: toArea(lineA),
      areaB: toArea(lineB),
      investedPath,
      yTicks,
      xTicks,
      innerH,
      innerW,
    };
  });

  // Pre-computed scale info reused by the mouse handler
  chartBounds = computed(() => {
    const res = this.results();
    if (!res) return null;
    const tab = this.activeTab();
    const data = res.chartData;
    const aKey = tab === "interest" ? "si" : "siTotal";
    const bKey = tab === "interest" ? "ci" : "ciTotal";
    const allVals = data.flatMap((d) => [
      d[aKey as keyof ChartPoint] as number,
      d[bKey as keyof ChartPoint] as number,
    ]);
    const minVal =
      tab === "total" ? Math.min(...data.map((d) => d.totalInvested)) : 0;
    const maxVal = Math.max(...allVals) * 1.08 || 1;
    const innerW = this.svgW - this.padL - this.padR;
    const innerH = this.svgH - this.padT - this.padB;
    const toX = (yr: number) =>
      this.padL + (yr / (data.length - 1 || 1)) * innerW;
    const toY = (v: number) =>
      this.padT + innerH - ((v - minVal) / (maxVal - minVal || 1)) * innerH;
    return { data, aKey, bKey, toX, toY, innerW };
  });

  onChartMouseMove(event: MouseEvent, svgEl: SVGSVGElement) {
    const bounds = this.chartBounds();
    if (!bounds) return;
    const { data, aKey, bKey, toX, toY, innerW } = bounds;

    const rect = svgEl.getBoundingClientRect();
    const scaleX = this.svgW / rect.width;
    const mouseX = (event.clientX - rect.left) * scaleX;

    if (mouseX < this.padL - 2 || mouseX > this.svgW - this.padR + 2) {
      this.tooltip.set(null);
      return;
    }

    const fraction = Math.max(0, Math.min(1, (mouseX - this.padL) / innerW));
    const yr = Math.round(fraction * (data.length - 1));
    const d = data[yr];

    const svgX = toX(yr);
    const siVal = d[aKey as keyof ChartPoint] as number;
    const ciVal = d[bKey as keyof ChartPoint] as number;
    const siY = toY(siVal);
    const ciY = toY(ciVal);

    const htmlX = event.clientX - rect.left;
    const showRight = htmlX < rect.width * 0.55;

    this.tooltip.set({
      year: yr,
      svgX,
      siY,
      ciY,
      siVal,
      ciVal,
      totalInvested: d.totalInvested,
      htmlX,
      showRight,
    });
  }

  onChartMouseLeave() {
    this.tooltip.set(null);
  }

  // Validation
  validate(): boolean {
    const errs: Record<string, string | undefined> = {};
    const p = this.principal();
    const r = this.rate();
    const t = this.time();
    const b = this.openingBalance();
    const su = this.stepUpRate();

    if (p === null || isNaN(p) || p <= 0)
      errs["principal"] = "Enter a valid positive amount";
    if (r === null || isNaN(r) || r <= 0 || r > 100)
      errs["rate"] = "Rate must be between 0 and 100";
    if (t === null || isNaN(t) || t < 1 || t > 50)
      errs["time"] = "Time must be between 1 and 50";
    if (b !== null && (isNaN(b) || b < 0))
      errs["openingBalance"] = "Opening balance must be 0 or more";
    if (
      this.stepUpEnabled() &&
      (su === null || isNaN(su) || su < 0 || su > 100)
    )
      errs["stepUpRate"] = "Step-up rate must be between 0 and 100";

    this.errors.set(errs);
    return Object.keys(errs).length === 0;
  }

  calculate() {
    if (this.validate()) this.showResults.set(true);
  }

  reset() {
    this.principal.set(null);
    this.rate.set(null);
    this.time.set(null);
    this.compoundFrequency.set(1);
    this.openingBalance.set(null);
    this.stepUpEnabled.set(false);
    this.stepUpRate.set(null);
    this.errors.set({});
    this.showResults.set(false);
    this.tooltip.set(null);
  }

  private invalidate() {
    if (this.showResults()) this.showResults.set(false);
  }

  onFieldChange(field: string, val: string) {
    const num = val ? parseFloat(val) : null;
    switch (field) {
      case "principal":
        this.principal.set(num);
        break;
      case "rate":
        this.rate.set(num);
        break;
      case "time":
        this.time.set(num);
        break;
      case "openingBalance":
        this.openingBalance.set(num);
        break;
      case "stepUpRate":
        this.stepUpRate.set(num);
        break;
    }
    this.errors.update((e) => ({ ...e, [field]: undefined }));
    this.invalidate();
  }

  onFreqChange(val: string) {
    this.compoundFrequency.set(parseInt(val));
    this.invalidate();
  }

  toggleStepUp() {
    this.stepUpEnabled.update((v) => !v);
    this.invalidate();
  }

  setTab(tab: "interest" | "total") {
    this.activeTab.set(tab);
  }

  // Formatting
  formatCurrency(val: number): string {
    return new Intl.NumberFormat(this.userLocale, {
      style: "currency",
      currency: this.userCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  }

  formatShort(val: number): string {
    try {
      return new Intl.NumberFormat(this.userLocale, {
        style: "currency",
        currency: this.userCurrency,
        notation: "compact",
        maximumFractionDigits: 1,
      } as Intl.NumberFormatOptions).format(val);
    } catch {
      return val.toFixed(0);
    }
  }

  formatPct(val: number): string {
    return val.toFixed(2) + "%";
  }

  currencyLabel = computed(() => {
    try {
      const sample = new Intl.NumberFormat(this.userLocale, {
        style: "currency",
        currency: this.userCurrency,
        currencyDisplay: "symbol",
        maximumFractionDigits: 0,
      }).format(0);
      // Extract symbol by removing digits, spaces, commas
      return sample.replace(/[\d\s,]+/g, "").trim() || this.userCurrency;
    } catch {
      return this.userCurrency;
    }
  });

  difference = computed(() => {
    const r = this.results();
    if (!r) return null;
    const diff = r.CI - r.SI;
    const pct = r.SI > 0 ? (diff / r.SI) * 100 : 0;
    return { diff, pct };
  });

  compoundLabel = computed(
    () =>
      this.compoundOptions.find((o) => o.value === this.compoundFrequency())
        ?.label ?? "",
  );
}
