import type { GlossaryTerm } from "@/data/types";

export const glossary: GlossaryTerm[] = [
  {
    term: "Amortisation",
    slug: "amortisation",
    letter: "A",
    definition:
      "Amortisation is the process of paying off a loan gradually through regular EMIs, where each instalment covers both interest and a part of the principal. In the early years of a loan, a larger share of the EMI goes toward interest, while later instalments repay more principal. An amortisation schedule shows this break-up for every EMI across the full tenure.",
    related: ["emi", "principal", "reducing-balance"],
  },
  {
    term: "APR",
    slug: "apr",
    letter: "A",
    definition:
      "APR, or Annual Percentage Rate, is the true yearly cost of a loan expressed as a percentage, including the interest rate plus processing fees and other mandatory charges. Because it bundles fees into the rate, the APR lets you compare loans on a like-for-like basis. A loan with a low headline rate but high fees can have a higher APR than one with a slightly higher rate and no fees.",
    related: ["interest-rate", "processing-fee", "flat-rate"],
  },
  {
    term: "Balance Transfer",
    slug: "balance-transfer",
    letter: "B",
    definition:
      "A balance transfer is the process of moving your outstanding loan from your current lender to a new one offering a lower interest rate or better terms. The new lender pays off the old loan, and you continue repaying the balance to the new lender at the cheaper rate. It saves the most when done early in the tenure, provided the interest savings exceed the transfer costs.",
    related: ["foreclosure", "top-up-loan", "sanction-letter"],
  },
  {
    term: "CIBIL Score",
    slug: "cibil-score",
    letter: "C",
    definition:
      "A CIBIL score is a three-digit number between 300 and 900 that summarises your creditworthiness based on your borrowing and repayment history. Maintained by TransUnion CIBIL, it is the first thing most Indian lenders check. A score of 750 or above is considered excellent and unlocks easier approvals and lower interest rates.",
    related: ["credit-report", "credit-utilisation"],
  },
  {
    term: "Co-applicant",
    slug: "co-applicant",
    letter: "C",
    definition:
      "A co-applicant is a person who applies for a loan jointly with the primary borrower and shares equal responsibility for its repayment. Adding an earning co-applicant, such as a spouse, can increase the eligible loan amount by combining incomes. Both applicants' credit histories are assessed, and both are liable if the loan is not repaid.",
    related: ["guarantor", "co-applicant"],
  },
  {
    term: "Collateral",
    slug: "collateral",
    letter: "C",
    definition:
      "Collateral is an asset, such as property, gold or a fixed deposit, that a borrower pledges to a lender as security for a loan. If the borrower defaults, the lender can sell the collateral to recover its dues. Because collateral reduces the lender's risk, secured loans backed by it carry lower interest rates than unsecured loans.",
    related: ["secured-loan", "unsecured-loan", "loan-against-property"],
  },
  {
    term: "Credit Report",
    slug: "credit-report",
    letter: "C",
    definition:
      "A credit report is a detailed record of your credit history, listing all your loans and credit cards, their repayment status, outstanding balances and any defaults. It is maintained by credit bureaus such as CIBIL, Experian, Equifax and CRIF High Mark. Lenders read it to decide whether to approve a loan and at what rate, so keeping it accurate and clean is essential.",
    related: ["cibil-score", "credit-utilisation"],
  },
  {
    term: "Credit Utilisation",
    slug: "credit-utilisation",
    letter: "C",
    definition:
      "Credit utilisation is the percentage of your total available credit-card limit that you are currently using. For example, using Rs. 30,000 of a Rs. 1,00,000 limit is 30 percent utilisation. Keeping this ratio below 30 percent signals disciplined credit behaviour and helps maintain a healthy CIBIL score.",
    related: ["cibil-score", "credit-report"],
  },
  {
    term: "DBR/FOIR",
    slug: "dbr-foir",
    letter: "D",
    definition:
      "DBR (Debt Burden Ratio) or FOIR (Fixed Obligation to Income Ratio) is the share of your net monthly income already committed to fixed obligations such as existing EMIs. Lenders add your proposed new EMI to this and usually require the total to stay below 40 to 50 percent of income. A lower ratio improves your loan eligibility and approval odds.",
    related: ["emi", "tenure"],
  },
  {
    term: "Disbursement",
    slug: "disbursement",
    letter: "D",
    definition:
      "Disbursement is the release of the sanctioned loan amount to the borrower or, in the case of a home loan, to the seller or builder. It happens after the borrower accepts the sanction terms and signs the loan agreement. Disbursement may be made in a single lump sum or in stages, such as for an under-construction property.",
    related: ["sanction-letter", "down-payment"],
  },
  {
    term: "Down Payment",
    slug: "down-payment",
    letter: "D",
    definition:
      "A down payment is the portion of an asset's cost that a borrower pays upfront from their own funds, with the loan covering the rest. In a home loan, the down payment is the difference between the property price and the amount financed under the LTV ratio. A larger down payment reduces the loan amount, the EMI and the total interest paid.",
    related: ["loan-to-value-ltv", "disbursement", "principal"],
  },
  {
    term: "DSA",
    slug: "dsa",
    letter: "D",
    definition:
      "A DSA, or Direct Selling Agent, is an individual or firm authorised by banks and NBFCs to source and process loan applications on their behalf. DSAs help borrowers compare products, gather documents and liaise with lenders, earning a commission from the lender. A good DSA can simplify the borrowing process and help you find a competitive offer.",
    related: ["nbfc", "sanction-letter"],
  },
  {
    term: "EMI",
    slug: "emi",
    letter: "E",
    definition:
      "EMI stands for Equated Monthly Instalment, the fixed amount a borrower pays the lender each month to repay a loan. Every EMI includes a portion of the principal and a portion of the interest, and it stays constant over the tenure for a fixed-rate loan. The EMI amount depends on the loan amount, interest rate and tenure.",
    related: ["principal", "interest-rate", "tenure", "amortisation"],
  },
  {
    term: "EMI Bounce",
    slug: "emi-bounce",
    letter: "E",
    definition:
      "An EMI bounce occurs when a scheduled EMI payment fails because the borrower's bank account lacks sufficient balance on the due date. It leads to bounce charges, penal interest and a negative mark on the credit report. Repeated bounces seriously damage your credit score and can trigger recovery action from the lender.",
    related: ["nach", "emi", "credit-report"],
  },
  {
    term: "Fixed Interest Rate",
    slug: "fixed-interest-rate",
    letter: "F",
    definition:
      "A fixed interest rate stays constant for a defined period or the entire tenure of a loan, so the EMI does not change regardless of market movements. It offers predictability and protects the borrower from rate hikes. However, fixed rates usually start higher than floating rates, and the borrower does not benefit when market rates fall.",
    related: ["floating-interest-rate", "interest-rate", "mclr"],
  },
  {
    term: "Flat Rate",
    slug: "flat-rate",
    letter: "F",
    definition:
      "A flat rate charges interest on the full original loan principal for the entire tenure, regardless of how much you have already repaid. This makes it more expensive than an equivalent-sounding reducing-balance rate, where interest is charged only on the outstanding balance. Always convert a flat rate to its effective reducing-balance rate before comparing loans.",
    related: ["reducing-balance", "interest-rate", "apr"],
  },
  {
    term: "Floating Interest Rate",
    slug: "floating-interest-rate",
    letter: "F",
    definition:
      "A floating interest rate changes over the loan tenure in line with an external benchmark such as the RBI repo rate or the lender's MCLR. When the benchmark rises the EMI or tenure increases, and when it falls the borrower benefits. Floating rates usually start lower than fixed rates and, for individual home loans, carry no prepayment penalty.",
    related: ["fixed-interest-rate", "repo-rate", "mclr"],
  },
  {
    term: "Foreclosure",
    slug: "foreclosure",
    letter: "F",
    definition:
      "Foreclosure is the full repayment of a loan before the end of its scheduled tenure, closing the account early. It saves the borrower future interest but may attract a foreclosure charge, though floating-rate home loans to individuals are usually exempt. Always check the foreclosure terms and any lock-in period before closing a loan early.",
    related: ["prepayment", "balance-transfer", "sanction-letter"],
  },
  {
    term: "Guarantor",
    slug: "guarantor",
    letter: "G",
    definition:
      "A guarantor is a person who guarantees the repayment of a loan on behalf of the borrower, agreeing to repay it if the borrower defaults. Unlike a co-applicant, a guarantor does not usually have ownership of the loan proceeds but remains legally liable. Standing as a guarantor affects your own credit report and future borrowing capacity.",
    related: ["co-applicant", "collateral", "credit-report"],
  },
  {
    term: "Interest Rate",
    slug: "interest-rate",
    letter: "I",
    definition:
      "The interest rate is the percentage charged by a lender on the amount borrowed, representing the cost of the loan. It can be fixed or floating and is usually quoted per annum. The rate you are offered depends on your credit score, income, loan type and the lender, and even a small difference significantly affects total repayment on large loans.",
    related: ["apr", "flat-rate", "reducing-balance", "emi"],
  },
  {
    term: "Loan Against Property",
    slug: "loan-against-property",
    letter: "L",
    definition:
      "A Loan Against Property (LAP) is a secured loan where you pledge a residential, commercial or industrial property you own as collateral to borrow a large sum. Because it is backed by real estate, it offers lower interest rates, larger amounts and longer tenures than unsecured loans. You retain ownership and use of the property, but risk losing it if you default.",
    related: ["collateral", "secured-loan", "loan-to-value-ltv"],
  },
  {
    term: "Loan-to-Value (LTV)",
    slug: "loan-to-value-ltv",
    letter: "L",
    definition:
      "Loan-to-Value (LTV) is the ratio of the loan amount to the assessed market value of the asset being financed or pledged. For example, a 80 percent LTV on a Rs. 50 lakh property means a loan of up to Rs. 40 lakh. A lower LTV means a larger down payment and lower lender risk, while regulations cap the maximum LTV for home loans.",
    related: ["down-payment", "loan-against-property", "collateral"],
  },
  {
    term: "MCLR",
    slug: "mclr",
    letter: "M",
    definition:
      "MCLR, or Marginal Cost of Funds based Lending Rate, is an internal benchmark below which a bank cannot lend, based on its cost of funds. Floating-rate loans linked to MCLR reset periodically as the benchmark changes. Many newer retail loans are instead linked to an external benchmark such as the repo rate for greater transparency.",
    related: ["repo-rate", "floating-interest-rate", "interest-rate"],
  },
  {
    term: "Moratorium",
    slug: "moratorium",
    letter: "M",
    definition:
      "A moratorium is a period during which a borrower is temporarily not required to make full EMI payments, often at the start of a loan or during financial hardship. Interest usually continues to accrue during this period, increasing the total cost. Education loans, for instance, commonly offer a moratorium until the student completes their course.",
    related: ["pre-emi", "emi", "disbursement"],
  },
  {
    term: "NACH",
    slug: "nach",
    letter: "N",
    definition:
      "NACH, or National Automated Clearing House, is an electronic system operated by NPCI that automatically debits your bank account for recurring payments such as loan EMIs. Setting up a NACH mandate authorises the lender to collect each EMI on its due date. Ensuring sufficient balance before the due date prevents an EMI bounce and its penalties.",
    related: ["emi-bounce", "emi", "disbursement"],
  },
  {
    term: "NBFC",
    slug: "nbfc",
    letter: "N",
    definition:
      "An NBFC, or Non-Banking Financial Company, is a financial institution registered with the RBI that offers loans and credit but cannot accept demand deposits like a bank. NBFCs are known for flexible eligibility, faster processing and lending to segments that banks may overlook. Their interest rates are sometimes higher, reflecting the added flexibility and risk.",
    related: ["dsa", "unsecured-loan"],
  },
  {
    term: "No-Cost EMI",
    slug: "no-cost-emi",
    letter: "N",
    definition:
      "A No-Cost EMI lets you buy a product and repay it in monthly instalments with no additional interest charged, so you pay only the product's price spread over the tenure. In practice, the interest is often absorbed by the seller as an upfront discount. Watch for processing fees or GST that can make a no-cost EMI not entirely free.",
    related: ["emi", "interest-rate", "processing-fee"],
  },
  {
    term: "Overdraft",
    slug: "overdraft",
    letter: "O",
    definition:
      "An overdraft is a credit facility that lets you withdraw more money than your account balance, up to a sanctioned limit, and pay interest only on the amount actually used. It is popular for managing short-term cash-flow needs, especially in business. Because interest applies only to the drawn amount, an overdraft is flexible and cost-efficient when used carefully.",
    related: ["working-capital", "interest-rate"],
  },
  {
    term: "Pre-EMI",
    slug: "pre-emi",
    letter: "P",
    definition:
      "Pre-EMI is the interest-only payment a borrower makes on the disbursed portion of a loan before full disbursement is complete, common in under-construction home loans. During this period you pay only interest, not principal, so the loan balance does not reduce. Full EMIs begin once the entire loan amount has been disbursed.",
    related: ["emi", "moratorium", "disbursement"],
  },
  {
    term: "Prepayment",
    slug: "prepayment",
    letter: "P",
    definition:
      "Prepayment is paying an extra amount toward your loan over and above the regular EMI, reducing the outstanding principal. This lowers the total interest you pay and can shorten the tenure. Partial prepayment when you receive a bonus or windfall is one of the most effective ways to reduce the cost of a long-tenure loan.",
    related: ["foreclosure", "principal", "amortisation"],
  },
  {
    term: "Principal",
    slug: "principal",
    letter: "P",
    definition:
      "The principal is the original amount of money borrowed from a lender, before interest is added. Each EMI repays a portion of the principal along with interest, so the outstanding principal shrinks over time. Interest on a reducing-balance loan is calculated on the remaining principal, which is why early prepayment saves the most.",
    related: ["interest-rate", "emi", "reducing-balance"],
  },
  {
    term: "Processing Fee",
    slug: "processing-fee",
    letter: "P",
    definition:
      "A processing fee is a one-time charge levied by a lender to cover the cost of evaluating and processing your loan application, usually a percentage of the loan amount. It typically ranges from 0.5 to 3 percent and often attracts GST. Because it adds to your borrowing cost, always factor the processing fee into the APR when comparing loans.",
    related: ["apr", "sanction-letter", "interest-rate"],
  },
  {
    term: "Reducing Balance",
    slug: "reducing-balance",
    letter: "R",
    definition:
      "Reducing balance is a method of calculating interest only on the outstanding loan principal, which decreases with every EMI you pay. As you repay, the interest component of each EMI falls and the principal component rises. This method is fairer and cheaper than a flat rate, and it is the standard for most loans in India.",
    related: ["flat-rate", "principal", "amortisation", "interest-rate"],
  },
  {
    term: "Repo Rate",
    slug: "repo-rate",
    letter: "R",
    definition:
      "The repo rate is the interest rate at which the Reserve Bank of India lends money to commercial banks. It is a key benchmark; when the RBI raises or lowers it, banks adjust their lending rates, affecting EMIs on repo-linked floating loans. A rate cut typically makes loans cheaper, while a hike raises borrowing costs.",
    related: ["mclr", "floating-interest-rate", "interest-rate"],
  },
  {
    term: "Sanction Letter",
    slug: "sanction-letter",
    letter: "S",
    definition:
      "A sanction letter is the document a lender issues after approving a loan, stating the sanctioned amount, interest rate, tenure, EMI, processing fee and all terms and conditions. It is not the final disbursement but a formal offer that the borrower reviews and accepts. Reading every line of the sanction letter helps you catch hidden charges before signing.",
    related: ["disbursement", "processing-fee", "interest-rate"],
  },
  {
    term: "Secured Loan",
    slug: "secured-loan",
    letter: "S",
    definition:
      "A secured loan is a loan backed by collateral, such as a home loan or a loan against property, where the borrower pledges an asset to the lender. Because the lender can recover its money by selling the asset on default, secured loans carry lower interest rates and offer larger amounts. The trade-off is the risk of losing the pledged asset.",
    related: ["unsecured-loan", "collateral", "loan-against-property"],
  },
  {
    term: "Tenure",
    slug: "tenure",
    letter: "T",
    definition:
      "Tenure is the length of time over which a loan is repaid, usually expressed in months or years. A longer tenure lowers the monthly EMI but increases the total interest paid, while a shorter tenure does the opposite. Choosing the right tenure means balancing a comfortable EMI against the lowest possible total interest cost.",
    related: ["emi", "interest-rate", "amortisation"],
  },
  {
    term: "Top-Up Loan",
    slug: "top-up-loan",
    letter: "T",
    definition:
      "A top-up loan is additional funding offered over and above an existing loan, often a home loan or a loan taken during a balance transfer, at a similar low interest rate. It lets you borrow extra money without a fresh, separate loan and usually with minimal documentation. Top-up loans are a cost-effective way to fund renovation, education or other needs.",
    related: ["balance-transfer", "interest-rate", "disbursement"],
  },
  {
    term: "Unsecured Loan",
    slug: "unsecured-loan",
    letter: "U",
    definition:
      "An unsecured loan is a loan granted without any collateral, based on the borrower's income, employment and credit history, such as a personal loan or many business loans. Because the lender has no asset to fall back on, unsecured loans carry higher interest rates and stricter eligibility. They are faster to process since no asset needs valuation.",
    related: ["secured-loan", "collateral", "cibil-score"],
  },
  {
    term: "Working Capital",
    slug: "working-capital",
    letter: "W",
    definition:
      "Working capital is the money a business needs to fund its day-to-day operations, such as buying inventory, paying suppliers and meeting salaries. A working capital loan or overdraft bridges the gap between outgoing payments and incoming receipts. Managing it well keeps a business liquid, even when profits are healthy, because timing mismatches can strain cash flow.",
    related: ["overdraft", "interest-rate"],
  },
];
