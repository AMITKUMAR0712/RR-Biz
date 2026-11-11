"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { defaultCountries, parseCountry, PhoneInput } from "react-international-phone";
import { services } from "@/content/services";
import { trackEvent } from "@/lib/analytics";
import { enquirySchema } from "@/lib/validators";

const isoCountryCodes = `AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW`.split(" ");
const englishRegions = new Intl.DisplayNames(["en"], { type: "region" });
const countryOptions = isoCountryCodes.map((code) => englishRegions.of(code) ?? code);
const countryFlags = defaultCountries.map((data) => {
  const { iso2 } = parseCountry(data);
  const emoji = String.fromCodePoint(...iso2.toUpperCase().split("").map((letter) => letter.charCodeAt(0) + 127397));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><text y="20" font-size="20">${emoji}</text></svg>`;
  return { iso2, src: `data:image/svg+xml,${encodeURIComponent(svg)}` };
});

export function EnquiryForm({
  serviceName,
  source = "website",
  compact = false,
  serviceNames,
}: {
  serviceName?: string;
  source?: string;
  compact?: boolean;
  serviceNames?: string[];
}) {
  const router = useRouter();
  const startedAt = useRef(Date.now());
  const [step, setStep] = useState(1);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedService, setSelectedService] = useState(serviceName ?? "");
  useEffect(() => {
    if (serviceName) setSelectedService(serviceName);
  }, [serviceName]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (step < 3) {
      const fields = Array.from(form.querySelectorAll<HTMLElement>(`[data-step="${step}"] input, [data-step="${step}"] select, [data-step="${step}"] textarea`));
      const invalid = fields.find((field) => "checkValidity" in field && !(field as HTMLInputElement).checkValidity());
      if (invalid && invalid instanceof HTMLInputElement) invalid.reportValidity();
      if (invalid) return;
      if (step === 1 && phone.replace(/\D/g, "").length < 7 && !String(new FormData(form).get("email") ?? "").trim()) {
        setError("Provide a phone number or email address to continue.");
        return;
      }
      setStep(step + 1);
      setError("");
      return;
    }
    setSending(true);
    setError("");
    const values = new FormData(form);
    const payload = {
      name: values.get("name"),
      email: values.get("email") ?? "",
      phone: phone.replace(/\D/g, "").length >= 7 ? phone : "",
      service: values.get("service"),
      message: values.get("message"),
      contactMethod: values.get("contactMethod"),
      preferredTime: values.get("preferredTime") ?? "",
      nationality: values.get("nationality") ?? "",
      serviceDetail: values.get("serviceDetail") ?? "",
      consent: values.get("consent") === "on",
      source,
      pagePath: window.location.pathname,
      honeypot: values.get("website") ?? "",
      startedAt: startedAt.current,
    };
    const checked = enquirySchema.safeParse(payload);
    if (!checked.success) {
      setError(checked.error.issues[0]?.message ?? "Please check your details and try again.");
      setSending(false);
      return;
    }
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checked.data),
      });
      const result = await response.json() as { ok?: boolean; error?: string; notificationFailed?: boolean };
      if (!response.ok || !result.ok) throw new Error(result.error || "We could not send your enquiry. Please try again.");
      trackEvent("enquiry_submit", { service: selectedService });
      router.push(result.notificationFailed ? "/thank-you?notification=delayed" : "/thank-you");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not send your enquiry. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const phoneInput = (
    <div className="phone-input" aria-label="Phone number including country calling code">
      <PhoneInput
        defaultCountry="ae"
        value={phone}
        onChange={setPhone}
        name="phone"
        flags={countryFlags}
        disableCountryGuess
        forceDialCode
        inputProps={{ "aria-label": "Phone number", autoComplete: "tel", inputMode: "tel" }}
      />
    </div>
  );

  return (
    <form className={`enquiry-form guided-form${compact ? " enquiry-form-compact" : ""}`} onSubmit={submit} noValidate>
      <label className="honeypot" aria-hidden="true" tabIndex={-1}>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className="guided-progress" role="progressbar" aria-label={`Step ${step} of 3`} aria-valuemin={1} aria-valuemax={3} aria-valuenow={step}><span style={{ width: `${step * 33.333}%` }} /></div>
      <p className="guided-step">Step {step} of 3</p>
      <div data-step="1" className={step === 1 ? "form-step-panel" : "form-step-panel hidden"}>
        <label><span>Your name</span><input name="name" autoComplete="name" placeholder="e.g. Alex Morgan" minLength={2} maxLength={120} required /></label>
        <label><span>Phone number <small>(optional if you provide email)</small></span>{phoneInput}</label>
        <label><span>Email address <small>(optional)</small></span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" /></label>
        <label><span>Nationality <small>(optional)</small></span>
          <input name="nationality" list={`countries-${source}`} autoComplete="country-name" placeholder="Search countries" />
          <datalist id={`countries-${source}`}>{countryOptions.map((country) => <option key={country} value={country} />)}</datalist>
        </label>
        <label><span>Service</span><select name="service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)} required>
          <option value="" disabled>Select a service</option>{(serviceNames ?? services.map((item) => item.name)).map((name) => <option key={name} value={name}>{name}</option>)}
        </select></label>
        {selectedService && (selectedService === "Business Setup" || selectedService === "Visa Processing Support" || selectedService === "Recruitment") && (
          <label><span>{selectedService === "Business Setup" ? "Setup preference" : selectedService === "Visa Processing Support" ? "Visa type" : "Enquiry type"} <small>(optional)</small></span>
            <select name="serviceDetail" defaultValue=""><option value="">Choose if known</option>
              {(selectedService === "Business Setup" ? ["Mainland", "Free zone", "Not sure"] : selectedService === "Visa Processing Support" ? ["Golden", "Freelance", "Visit", "Investor / partner", "Employment", "Family", "Not sure"] : ["Hiring", "Job seeking"]).map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        )}
      </div>
      <div data-step="2" className={step === 2 ? "form-step-panel" : "form-step-panel hidden"}>
        <label><span>What would you like help with?</span><textarea name="message" rows={4} minLength={4} maxLength={3000} placeholder="A short description of what you need" required /></label>
        <label><span>Preferred contact method</span><select name="contactMethod" defaultValue="WhatsApp" required><option>WhatsApp</option><option>Phone</option><option>Email</option></select></label>
        <label><span>Preferred time <small>(optional)</small></span><select name="preferredTime" defaultValue=""><option value="">No preference</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label>
      </div>
      <div data-step="3" className={step === 3 ? "form-step-panel" : "form-step-panel hidden"}>
        <p className="form-review-copy">Please check your details before sending. Do not include passport copies, bank statements, or other sensitive documents.</p>
        <label className="consent-row"><input name="consent" type="checkbox" required /><span>I agree to be contacted about this enquiry. See our <a href="/privacy-policy">Privacy Policy</a>.</span></label>
      </div>
      <div className="guided-actions">
        {step > 1 && <button className="button button-ghost-dark" type="button" onClick={() => setStep(step - 1)}><ArrowLeft size={16} /> Back</button>}
        <button className="button button-gold form-submit" type="submit" disabled={sending}>{sending ? "Sending..." : step === 3 ? "Send enquiry" : "Continue"} <ArrowRight size={16} /></button>
      </div>
      <p className="form-note">Please do not share sensitive documents here. Our team will guide you securely.</p>
      {error && <p className="form-status error" role="alert">{error}</p>}
    </form>
  );
}
