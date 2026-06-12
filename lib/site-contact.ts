export const SITE_CONTACT = {
  hours: "Mon - Fri : 09:00am to 06:00pm",
  phone: "+66 66 020 2902",
  secondaryPhone: "+66 80 912 5232",
  phoneNumbers: ["+66 66 020 2902", "+66 80 912 5232"],
  phoneDisplay: "+66 66 020 2902   +66 80 912 5232",
  email: "info@9yardtrading.com",
  whatsapp: "66660202902",
  x: "https://x.com/9yardtrading",
  facebook:
    "https://www.facebook.com/people/9yard-Trading-Thailand/100086220451987/?rdid=hPaTYrYy4w8zBWAU&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19KZMEgTEY%2F",
  instagram: "https://www.instagram.com/9yardtrading?igsh=MWRlcmFycmtvbG8xZg==",
  tiktok: "https://www.tiktok.com/@9yardtrading?_r=1&_t=ZS-95uiN02afm3",
  address:
    "193, Soi Samrong Nuea 21, Samrong Nuea sub-district, Mueang Samut Prakan district, Samut Prakan, 10270",
} as const;

export function phoneHref(phone: string = SITE_CONTACT.phone) {
  const primaryPhone = phone.split("/")[0]?.trim() || SITE_CONTACT.phone;
  return `tel:${primaryPhone.replace(/[^\d+]/g, "")}`;
}
