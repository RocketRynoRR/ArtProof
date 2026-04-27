export const todayIso = () => new Date().toISOString().slice(0, 10);

export const defaultCompany = {
  logo: "",
  name: "Jigsaw Signs & Print",
  address: "1/114 Strelly Street, Busselton",
  phone: "(08) 9751 3810",
  email: "art@jigsawsigns.com.au",
  website: "jigsawsigns.com.au"
};

export const defaultSettings = {
  ...defaultCompany,
  footerLayout: "balanced",
  proofTitle: "Artwork Proof",
  disclaimerHeading: "Artwork Disclaimer",
  disclaimerText:
    "Colours viewed on screen may differ from printed colours.\nPlease carefully check spelling, grammar, phone numbers, URLs, layout and sizing.\nOnce approved, production may proceed immediately.\nChanges after approval may incur additional charges.\nJigsaw Signs & Print is not responsible for errors missed after approval.",
  signatureWording: "CLIENT APPROVAL SIGNATURE",
  printNameLabel: "Print Name",
  dateLabel: "Date",
  includeDisclaimer: true,
  includeSignature: true,
  margin: 44,
  titleSize: 28,
  bodySize: 11,
  labelSize: 7,
  brandColor: "#10223f",
  accentColor: "#f8c983",
  defaultZoom: 85
};

export const defaultProof = {
  clientName: "",
  jobNumber: "",
  currentDate: todayIso(),
  revisionNumber: "",
  notes: "",
  artwork: [],
  itemPhotos: [],
  sitePhotos: []
};
