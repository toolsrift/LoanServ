import type { BtContent } from "@/data/types";

export const balanceTransfers: BtContent[] = [
  {
    slug: "personal-loan",
    name: "Personal Loan Balance Transfer",
    metaTitle: "Personal Loan Balance Transfer: Lower Your EMI in India",
    metaDescription:
      "Move your high-rate personal loan to a cheaper lender. Learn when a personal loan balance transfer actually saves money in India, with a worked rupee example.",
    tagline: "Shift your personal loan to a lower rate and cut your EMI",
    intro: [
      "A personal loan balance transfer means moving the outstanding balance of your existing personal loan from your current lender to a new bank or NBFC that charges a lower rate of interest. The new lender pays off your old loan and you continue with fresh EMIs at the reduced rate.",
      "Personal loan rates in India typically range from around 10.5% to 24% per annum depending on your credit score, income and employer. If your current rate sits at the higher end and your profile has improved since you first borrowed, a transfer can meaningfully reduce your interest outgo.",
      "The catch is cost. A balance transfer usually attracts a processing fee of 1% to 3% of the transferred amount, plus any foreclosure charges on the old loan. The savings are real only when the interest you save over the remaining tenure comfortably exceeds these one-time costs.",
    ],
    whenItSaves: [
      "The rate difference is at least 2-3 percentage points, not a token 0.25%.",
      "You still have a long tenure left (say 18 months or more) for the lower rate to compound into real savings.",
      "Your credit score has improved since the original loan, unlocking a better rate today.",
      "The new lender's processing fee and any old-loan foreclosure charges are modest relative to the interest saved.",
      "You resist the temptation to also increase the loan amount, which would offset your savings.",
    ],
    example: [
      { label: "Outstanding balance", value: "₹4,00,000" },
      { label: "Remaining tenure", value: "36 months" },
      { label: "Old rate", value: "18% p.a." },
      { label: "New rate", value: "13% p.a." },
      { label: "Transfer + processing cost (~2%)", value: "₹8,000" },
      { label: "Approx. net interest saved", value: "~₹27,000 over the tenure" },
    ],
    faqs: [
      {
        q: "Does a personal loan balance transfer hurt my credit score?",
        a: "There is a small, temporary dip from the new lender's hard enquiry, but closing the old loan on time and paying the new one promptly usually leaves your score neutral or better over a few months.",
      },
      {
        q: "Are there foreclosure charges on my existing personal loan?",
        a: "Many lenders charge a foreclosure or prepayment fee of up to around 4% of the outstanding on personal loans. Check your old loan agreement, since this cost eats directly into your transfer savings.",
      },
      {
        q: "Is it worth transferring if only a year is left?",
        a: "Usually no. With a short remaining tenure there is little interest left to save, so the processing fee and paperwork rarely justify the switch.",
      },
      {
        q: "Can I get a top-up along with the balance transfer?",
        a: "Yes, most lenders offer a top-up on transfer, but treat it as a separate borrowing decision. Adding to your loan increases your total interest and can wipe out the savings from the lower rate.",
      },
    ],
    related: ["home-loan", "credit-card-to-loan", "loan-top-up"],
  },
  {
    slug: "home-loan",
    name: "Home Loan Balance Transfer",
    metaTitle: "Home Loan Balance Transfer: Save Lakhs in Interest",
    metaDescription:
      "Refinance your home loan to a lower rate and save lakhs over the tenure. See when a home loan balance transfer makes sense in India, with a rupee-by-rupee example.",
    tagline: "Refinance your home loan and save lakhs over the long run",
    intro: [
      "A home loan balance transfer lets you shift your outstanding housing loan to a new lender offering a lower interest rate. Because home loans run for 15 to 30 years and involve large amounts, even a small rate reduction can translate into lakhs of rupees saved over the full tenure.",
      "Home loan rates in India are usually linked to an external benchmark such as the RBI repo rate. Over time, spreads offered to new borrowers may fall below what you are paying, especially if your income or credit profile has strengthened since you took the loan.",
      "Since balance transfers are most powerful early in the loan, when the interest portion of each EMI is highest, timing matters. Weigh the processing fee, legal and valuation charges of the new lender against the interest you will save across the remaining years.",
    ],
    whenItSaves: [
      "You are in the first half of the loan tenure, when most of each EMI is still interest.",
      "The new rate is at least 0.5-1 percentage point lower, which on a large balance is significant.",
      "The processing, legal and valuation fees are low or waived under a festive or transfer offer.",
      "Your outstanding balance is large enough that the rupee interest saved dwarfs the switching cost.",
      "You plan to keep the loan for several more years rather than foreclosing soon.",
    ],
    example: [
      { label: "Outstanding balance", value: "₹40,00,000" },
      { label: "Remaining tenure", value: "180 months" },
      { label: "Old rate", value: "9.5% p.a." },
      { label: "New rate", value: "8.5% p.a." },
      { label: "Transfer + processing cost (~0.5%)", value: "₹20,000" },
      { label: "Approx. net interest saved", value: "~₹3,80,000 over the tenure" },
    ],
    faqs: [
      {
        q: "What charges apply on a home loan balance transfer?",
        a: "Expect a processing fee (often 0.25%-0.5% of the loan), plus legal, technical valuation and stamp or MOD charges. Under floating-rate home loans, the RBI does not permit foreclosure penalties, which helps.",
      },
      {
        q: "How much rate difference makes a transfer worthwhile?",
        a: "On a large, long home loan even 0.5% can save lakhs. As a rule of thumb, a difference of 0.5 percentage points or more, early in the tenure, is usually worth exploring.",
      },
      {
        q: "Does the new lender fund the entire outstanding?",
        a: "Yes. The new lender directly pays off your old loan against the property, and the mortgage is transferred to them. You then service EMIs to the new lender.",
      },
      {
        q: "Should I transfer if only a few years are left?",
        a: "Late in the tenure most of your EMI is principal, so there is little interest left to save. A transfer then rarely justifies the fees and paperwork.",
      },
    ],
    related: ["mortgage-lap", "loan-top-up", "personal-loan"],
  },
  {
    slug: "car-loan",
    name: "Car Loan Balance Transfer",
    metaTitle: "Car Loan Balance Transfer: Lower Your Auto Loan Rate",
    metaDescription:
      "Transfer your car loan to a cheaper lender and reduce your EMI. Understand when an auto loan balance transfer saves money in India, with a clear rupee example.",
    tagline: "Move your car loan to a lower rate and trim your EMI",
    intro: [
      "A car loan balance transfer means shifting the outstanding amount of your existing auto loan to a new lender charging a lower interest rate. The new lender clears your old loan, the hypothecation on the vehicle moves to them, and you continue with cheaper EMIs.",
      "Car loans in India usually run for three to seven years at rates between roughly 9% and 15% per annum. If you locked in a high rate at the dealership and your credit profile has since improved, a transfer can shave a useful amount off your remaining interest.",
      "Because car loans are shorter and the amounts smaller than home loans, the window to save is narrower. The transfer makes sense only when a solid rate gap and enough remaining tenure together outweigh the processing fee and re-hypothecation costs.",
    ],
    whenItSaves: [
      "You are early in the loan, ideally within the first two to three years, with substantial tenure left.",
      "The rate difference is a clear 2 percentage points or more, not marginal.",
      "The outstanding balance is still large enough to make the interest saving worthwhile.",
      "The processing and re-hypothecation charges are low relative to the interest you will save.",
      "Your credit score has improved enough since the original dealer loan to qualify for a better rate.",
    ],
    example: [
      { label: "Outstanding balance", value: "₹6,00,000" },
      { label: "Remaining tenure", value: "48 months" },
      { label: "Old rate", value: "13% p.a." },
      { label: "New rate", value: "10% p.a." },
      { label: "Transfer + processing cost (~1.5%)", value: "₹9,000" },
      { label: "Approx. net interest saved", value: "~₹32,000 over the tenure" },
    ],
    faqs: [
      {
        q: "Does the vehicle hypothecation change on transfer?",
        a: "Yes. The old lender's hypothecation is cleared and the new lender is recorded as the financier with the RTO. There may be a small charge and paperwork for updating the registration certificate.",
      },
      {
        q: "Is a car loan balance transfer worth it for an older car?",
        a: "Lenders are cautious with ageing vehicles and may offer poorer terms or decline outright. If your car is several years old and the outstanding is small, savings are often too thin to bother.",
      },
      {
        q: "Are there foreclosure charges on the old car loan?",
        a: "Many lenders levy a foreclosure fee of up to around 5% of the outstanding on fixed-rate auto loans. Factor this in, as it directly reduces your net saving from the transfer.",
      },
      {
        q: "How long does the transfer process take?",
        a: "It typically takes one to two weeks, covering the new sanction, foreclosure of the old loan and updating the hypothecation with the RTO. Timelines vary by lender and region.",
      },
    ],
    related: ["personal-loan", "home-loan", "loan-top-up"],
  },
  {
    slug: "mortgage-lap",
    name: "Mortgage / LAP Balance Transfer",
    metaTitle: "LAP Balance Transfer: Cut Your Loan Against Property Rate",
    metaDescription:
      "Transfer your loan against property to a cheaper lender and save on interest. Learn when a mortgage or LAP balance transfer pays off in India, with a rupee example.",
    tagline: "Refinance your loan against property to a lower rate",
    intro: [
      "A mortgage or loan-against-property (LAP) balance transfer lets you move your existing property-backed loan to a new lender offering a lower rate. As with a home loan, the new lender pays off the old one and the mortgage over your property is transferred to them.",
      "LAP rates in India generally run higher than home loans, often around 9% to 14% per annum, because the funds are used for varied purposes rather than buying a house. This wider rate band means there is frequently room to negotiate or transfer to a better deal.",
      "Because LAP amounts are large and tenures long, a modest rate cut can save a substantial sum. The decision still turns on the rate gap, the remaining tenure, and whether processing, legal and valuation fees stay small relative to the interest saved.",
    ],
    whenItSaves: [
      "The new rate is at least 1 percentage point lower, which on a large LAP is meaningful.",
      "You have several years of tenure remaining for the saving to accumulate.",
      "Your property valuation and income support a favourable rate with the new lender.",
      "Processing, legal and valuation charges are low or offered under a promotional waiver.",
      "The outstanding balance is large enough that rupee interest saved clearly beats the switching cost.",
    ],
    example: [
      { label: "Outstanding balance", value: "₹25,00,000" },
      { label: "Remaining tenure", value: "120 months" },
      { label: "Old rate", value: "12% p.a." },
      { label: "New rate", value: "10.5% p.a." },
      { label: "Transfer + processing cost (~1%)", value: "₹25,000" },
      { label: "Approx. net interest saved", value: "~₹2,20,000 over the tenure" },
    ],
    faqs: [
      {
        q: "How is a LAP transfer different from a home loan transfer?",
        a: "The mechanics are similar, but LAP rates are typically higher and lenders re-value the pledged property. Foreclosure norms can also differ, so read the fine print before switching.",
      },
      {
        q: "Will the new lender re-evaluate my property?",
        a: "Yes. The new lender conducts a fresh legal and technical valuation of the mortgaged property, which determines the sanctioned amount and rate. This adds to the switching cost and time.",
      },
      {
        q: "Can I get a higher loan amount on transfer?",
        a: "Often yes, if your property value has risen you may unlock a top-up. Treat the extra borrowing separately, since it raises your total interest and can offset the rate benefit.",
      },
      {
        q: "Are there foreclosure charges on LAP?",
        a: "For floating-rate LAP taken by individuals for non-business purposes, foreclosure penalties are generally not allowed. Fixed-rate or business-purpose loans may still carry charges, so confirm with your lender.",
      },
    ],
    related: ["home-loan", "loan-top-up", "personal-loan"],
  },
  {
    slug: "credit-card-to-loan",
    name: "Credit Card to Personal Loan Conversion",
    metaTitle: "Credit Card to Personal Loan: Escape 40% Interest",
    metaDescription:
      "Convert costly credit card dues into a cheaper personal loan and cut your interest sharply. See when this conversion saves money in India, with a worked rupee example.",
    tagline: "Turn expensive card dues into an affordable personal loan",
    intro: [
      "Converting credit card outstanding into a personal loan means taking a lower-rate loan to clear your revolving card balance, then repaying that loan in fixed EMIs. It is one of the most effective ways to escape the punishing cost of rolling over card dues month after month.",
      "Credit cards in India charge interest of roughly 36% to 45% per annum on unpaid balances, far above the 11% to 20% typical of personal loans. When you only pay the minimum due each month, the balance barely shrinks and interest keeps compounding against you.",
      "Swapping that debt for a structured personal loan gives you a much lower rate, a fixed repayment date and a clear end to the debt. The main discipline required is to stop revolving fresh purchases on the card once the balance is cleared.",
    ],
    whenItSaves: [
      "You are carrying a card balance and paying only the minimum due each month.",
      "The personal loan rate is dramatically lower than your card's 36%-45% annualised rate.",
      "You can commit to fixed EMIs and avoid rebuilding a fresh revolving balance on the card.",
      "The loan processing fee is small compared with the interest you would otherwise pay on the card.",
      "You want a definite payoff date instead of an open-ended, compounding card debt.",
    ],
    example: [
      { label: "Credit card outstanding", value: "₹2,00,000" },
      { label: "Card interest rate", value: "~42% p.a." },
      { label: "Personal loan rate", value: "15% p.a." },
      { label: "Loan tenure", value: "24 months" },
      { label: "Processing fee (~2%)", value: "₹4,000" },
      { label: "Approx. net interest saved", value: "~₹90,000 vs revolving the card" },
    ],
    faqs: [
      {
        q: "Is this the same as a card EMI conversion?",
        a: "Not exactly. Card issuers offer their own EMI conversion, but a separate personal loan from another lender can carry a lower rate. Compare both, since the cheapest option depends on the offers available to you.",
      },
      {
        q: "Will converting close my credit card?",
        a: "No, the card stays open. You are simply using loan funds to clear the balance. Keeping the card active and paid in full each month can actually help your credit utilisation and score.",
      },
      {
        q: "How much can I realistically save?",
        a: "Because card rates are three to four times personal loan rates, the saving is often the largest of any balance transfer. On a sizeable balance carried for a year or more, it can run into tens of thousands of rupees.",
      },
      {
        q: "Does this help my credit score?",
        a: "Usually yes over time. Clearing a maxed-out card lowers your utilisation ratio, and steady EMI repayment on the loan builds a positive track record, both of which support your score.",
      },
    ],
    related: ["personal-loan", "loan-top-up", "home-loan"],
  },
  {
    slug: "loan-top-up",
    name: "Loan Top-Up",
    metaTitle: "Loan Top-Up: Extra Funds on Your Existing Loan",
    metaDescription:
      "A loan top-up adds funds to your existing home or personal loan at a low rate. Learn when a top-up is cheaper than a fresh loan in India, with a worked rupee example.",
    tagline: "Borrow more on your existing loan at a lower rate",
    intro: [
      "A loan top-up is additional borrowing taken over and above your existing loan, most commonly on a home loan or personal loan you are already repaying. Because the lender already knows your track record and, for secured loans, holds your collateral, top-ups are quick to sanction and priced attractively.",
      "Top-up rates are usually close to your base loan rate and well below unsecured personal loan or credit card rates. For a home loan borrower, a top-up can be one of the cheapest ways to raise funds for renovation, education, a wedding or consolidating costlier debt.",
      "The trade-off is tenure. A top-up is often stretched over the remaining loan period, so a small sum spread over many years can still accumulate meaningful interest. It works best when the rate advantage over a fresh loan clearly outweighs the longer repayment horizon.",
    ],
    whenItSaves: [
      "You need extra funds and already hold a secured loan, such as a home loan, in good standing.",
      "The top-up rate is far below what a fresh personal loan or credit card would charge.",
      "You have repaid part of the principal, creating headroom against your property or eligibility.",
      "You use the funds for a productive or high-cost need rather than routine spending.",
      "You are comfortable that the top-up will not stretch repayment uncomfortably over the remaining tenure.",
    ],
    example: [
      { label: "Existing home loan rate", value: "8.75% p.a." },
      { label: "Top-up amount", value: "₹5,00,000" },
      { label: "Top-up rate", value: "9.25% p.a." },
      { label: "Alternative personal loan rate", value: "15% p.a." },
      { label: "Top-up tenure", value: "84 months" },
      { label: "Approx. interest saved vs personal loan", value: "~₹1,40,000" },
    ],
    faqs: [
      {
        q: "How much top-up can I get?",
        a: "It depends on your repayment record, current property valuation and total loan-to-value limit. Lenders typically top up only to the extent that the combined loan stays within their permitted ceiling against your collateral.",
      },
      {
        q: "Is a top-up cheaper than a new personal loan?",
        a: "Usually yes, especially on a home loan top-up, where the rate is close to your low secured base rate. That can be several percentage points below an unsecured personal loan.",
      },
      {
        q: "Can I use top-up funds for any purpose?",
        a: "Broadly yes, for needs like renovation, education, medical costs or debt consolidation. Lenders may ask for an end-use declaration, and certain speculative uses are typically not permitted.",
      },
      {
        q: "Does a top-up extend my loan tenure?",
        a: "Often the top-up is aligned to your remaining loan tenure, which keeps EMIs manageable but spreads interest over a longer period. Opting for a shorter top-up tenure, if allowed, reduces total interest.",
      },
    ],
    related: ["home-loan", "personal-loan", "mortgage-lap"],
  },
];

export function getBt(slug: string) {
  return balanceTransfers.find((b) => b.slug === slug);
}
