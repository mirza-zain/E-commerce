export type BankAccountDetail = {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban?: string;
  branchName?: string;
  raastId?: string;
  logo?: string;
  notes?: string;
};

export type BankTransferConfig = {
  enabled: boolean;
  title: string;
  instructions: string[];
  accounts: BankAccountDetail[];
};

export const BANK_TRANSFER_CONFIG: BankTransferConfig = {
  enabled: true,
  title: "Direct Bank / Online Transfer",
  instructions: [
    "Transfer the exact total amount to the bank account details listed below.",
    "Take a clear screenshot or save the transaction receipt from your banking app.",
    "Upload the screenshot below to submit your payment proof.",
    "Our admin team will review and approve your order once payment is verified."
  ],
  accounts: [
    {
      bankName: process.env.NEXT_PUBLIC_BANK_NAME || "Mashreq Bank",
      accountTitle: process.env.NEXT_PUBLIC_BANK_ACCOUNT_TITLE || "Zarb",
      accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUM || "089200209864",
      iban: process.env.NEXT_PUBLIC_BANK_IBAN || "PK05MSHQ0000089200209864",
      branchName: process.env.NEXT_PUBLIC_BANK_BRANCH || "Main Branch",
      raastId: process.env.NEXT_PUBLIC_BANK_RAAST_ID || "",
      logo: "/images/Mashreq-Bank-Logo.png",
      notes: "Instant transfer via Raast, 1Link, or Banking App"
    }
  ]
};

