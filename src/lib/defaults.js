export const todayIso = () => new Date().toISOString().slice(0, 10);

export const defaultCompany = {
  logo: "./assets/jigsaw-signs-print-logo.png",
  name: "Jigsaw Signs & Print",
  address: "1/114 Strelly Street, Busselton",
  phone: "(08) 9751 3810",
  email: "art@jigsawsigns.com.au",
  website: "jigsawsigns.com.au"
};

export const defaultSettings = {
  ...defaultCompany,
  footerLayout: "balanced",
  footerBusinessName: "Jigsaw Signs & Print",
  footerTagline: "",
  footerShowContact: false,
  proofTitle: "Your Custom Artwork Proof",
  disclaimerHeading: "Artwork Disclaimer",
  disclaimerText:
    "We would like to bring to your attention some important information regarding colour accuracy and variation. Please note that the colours you see on your computer screen or in a digital proof may appear slightly different than the final printed product. This is because computer monitors and screens display colours differently, and there may be slight variations in colour between different printers, printing methods, and materials. We will do our best to match the colours in the artwork to the closest possible approximation of the colours you have requested, based on the specifications of the printing process and the materials used. However, please understand that there may be some variation in colour between the digital proof and the final printed product. If colour accuracy is critical to your project, we recommend requesting a printed proof before we proceed with the final print run. This will allow you to review the colours and ensure they meet your requirements before we proceed with the final production. Please note that any additional changes or revisions to the artwork requested by you may result in additional charges or fees. We will inform you of any such charges before proceeding with any revisions. If you have any questions or concerns about our artwork process or services, please do not hesitate to contact us. We are committed to providing you with the best possible artwork experience and outcome. Thank you for choosing our services for your project. We look forward to working with you.",
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
  historyId: "",
  historyGroupId: "",
  historyParentId: "",
  clientName: "",
  jobNumber: "",
  currentDate: todayIso(),
  revisionNumber: "",
  notes: "",
  artwork: [],
  itemPhotos: [],
  sitePhotos: []
};
