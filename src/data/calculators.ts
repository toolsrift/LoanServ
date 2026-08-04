import type { CalculatorMeta } from "@/data/types";

export const calculators: CalculatorMeta[] = [
  // ----------------------------------------------------------------------
  // LOAN EMI GROUP
  // ----------------------------------------------------------------------
  {
    slug: "emi-calculator",
    kind: "emi",
    name: "EMI Calculator",
    metaTitle: "EMI Calculator - Calculate Loan EMI Online in India",
    metaDescription:
      "Free online EMI calculator to work out your monthly instalment for any loan. Enter amount, interest rate and tenure to see EMI, total interest and payment.",
    tagline: "Know your monthly instalment before you borrow.",
    intro: [
      "An Equated Monthly Instalment (EMI) is the fixed amount you repay to a lender every month until your loan is fully cleared. Each EMI has two parts: a portion that pays off the interest charged for the month and a portion that reduces the outstanding principal. In the early months most of your EMI goes towards interest, and as the balance falls, a larger share starts chipping away at the principal. This is why paying off a loan feels slow at first and speeds up towards the end of the tenure.",
      "Lenders in India calculate EMIs on a reducing-balance basis using the formula EMI = P x r x (1 + r)^n / ((1 + r)^n - 1), where P is the loan principal, r is the monthly interest rate (annual rate divided by 12, expressed as a decimal) and n is the number of monthly instalments. Because interest is charged only on the balance still owed, reducing-balance EMIs are far cheaper than flat-rate calculations, so always confirm which method a lender uses before comparing offers.",
      "Use this calculator to test different combinations of loan amount, interest rate and tenure. A longer tenure lowers the monthly EMI but raises the total interest you pay, while a shorter tenure does the opposite. Seeing these trade-offs in numbers helps you pick an EMI that fits your monthly budget without overpaying on interest across the life of the loan.",
    ],
    notes: [
      "Enter the loan amount, annual interest rate and tenure to instantly see your EMI, total interest and total repayment.",
      "Try a shorter tenure to see how much interest you can save, then check whether that higher EMI fits your budget.",
      "Keep your total EMIs across all loans below about 40-50% of your monthly take-home income for comfort.",
      "Remember to add processing fees, GST and insurance charges, which are not part of the EMI but add to your cost.",
    ],
    faqs: [
      {
        q: "How is EMI calculated?",
        a: "EMI is calculated on a reducing balance using EMI = P x r x (1 + r)^n / ((1 + r)^n - 1), where P is the principal, r is the monthly interest rate and n is the number of months. This calculator applies the same formula banks use.",
      },
      {
        q: "Does a longer tenure reduce my EMI?",
        a: "Yes. A longer tenure spreads repayment over more months, lowering each EMI. However, you pay interest for longer, so the total interest cost is higher than with a shorter tenure.",
      },
      {
        q: "Is the EMI shown here final?",
        a: "The EMI is an accurate estimate based on the figures you enter. Your actual EMI may differ slightly due to the exact interest rate the lender offers, the disbursal date and any add-on charges.",
      },
      {
        q: "What is the difference between flat and reducing interest?",
        a: "Flat-rate interest is charged on the full original loan amount for the whole tenure, while reducing-balance interest is charged only on the outstanding balance. Reducing balance works out cheaper, and this tool uses it.",
      },
    ],
    defaults: {
      amount: { min: 10000, max: 10000000, step: 10000, default: 500000, label: "Loan Amount" },
      rate: { min: 5, max: 30, step: 0.1, default: 11, label: "Interest Rate (% p.a.)" },
      tenure: { min: 3, max: 360, step: 1, default: 60, label: "Tenure", unit: "months" },
    },
    related: ["home-loan-emi", "personal-loan-emi", "car-loan-emi", "loan-eligibility", "prepayment"],
    group: "Loan EMI",
  },
  {
    slug: "home-loan-emi",
    kind: "emi",
    name: "Home Loan EMI Calculator",
    metaTitle: "Home Loan EMI Calculator - Calculate Housing Loan EMI",
    metaDescription:
      "Calculate your home loan EMI online. Enter loan amount, interest rate and tenure to see monthly instalment, total interest and full repayment schedule.",
    tagline: "Plan your dream home with a clear monthly budget.",
    presetCategory: "Home",
    intro: [
      "A home loan is usually the largest and longest loan most Indians ever take, with tenures that can stretch to 30 years. Because the amount is high, even a small change in the interest rate has a big impact on your EMI and on the total interest you pay over the years. This calculator lets you see exactly how much you will pay each month for a given loan amount, rate and tenure, so you can decide how much house you can comfortably afford.",
      "Home loan EMIs are computed on a reducing balance using EMI = P x r x (1 + r)^n / ((1 + r)^n - 1). Since housing rates are among the lowest in the market, often linked to an external benchmark like the repo rate, they move up or down when the RBI changes policy. Many home loans are floating rate, so your EMI or tenure can change over time. Running the numbers at a slightly higher rate is a useful stress test.",
      "Beyond the EMI, home loans offer tax benefits under Sections 80C and 24(b) on principal and interest repayment, which effectively reduce your cost. Making part-prepayments whenever you have surplus funds can shorten the tenure dramatically and save several lakhs in interest, because you cut down the principal on which future interest is charged.",
    ],
    notes: [
      "Choose a tenure that keeps the EMI within your budget but try to keep it as short as you can afford.",
      "Home loan interest and principal qualify for tax deductions under Sections 24(b) and 80C respectively.",
      "Prepaying even one extra EMI a year can shave years off a 20-year loan, so use the prepayment calculator too.",
      "Factor in stamp duty, registration, processing fees and insurance, which are over and above the EMI.",
    ],
    faqs: [
      {
        q: "What is the maximum tenure for a home loan?",
        a: "Most lenders offer home loans for up to 30 years, subject to your age at loan maturity. A longer tenure means a lower EMI but significantly more total interest.",
      },
      {
        q: "Are home loan interest rates fixed or floating?",
        a: "Most Indian home loans are floating rate, linked to an external benchmark such as the repo rate. When the benchmark changes, your EMI or remaining tenure is revised accordingly.",
      },
      {
        q: "How much home loan can I get?",
        a: "Lenders typically fund up to 75-90% of the property value and cap your total EMIs at around 40-50% of your income. Use the home loan eligibility calculator to estimate your limit.",
      },
      {
        q: "Do home loans offer tax benefits?",
        a: "Yes. Under the old tax regime you can claim up to Rs 1.5 lakh on principal under Section 80C and up to Rs 2 lakh on interest under Section 24(b) for a self-occupied property.",
      },
    ],
    defaults: {
      amount: { min: 100000, max: 100000000, step: 50000, default: 5000000, label: "Loan Amount" },
      rate: { min: 6, max: 15, step: 0.05, default: 8.7, label: "Interest Rate (% p.a.)" },
      tenure: { min: 1, max: 30, step: 1, default: 20, label: "Tenure", unit: "years" },
    },
    related: ["home-loan-eligibility", "prepayment", "balance-transfer-savings", "lap", "emi-calculator"],
    group: "Loan EMI",
  },
  {
    slug: "personal-loan-emi",
    kind: "emi",
    name: "Personal Loan EMI Calculator",
    metaTitle: "Personal Loan EMI Calculator - Monthly Instalment Online",
    metaDescription:
      "Estimate your personal loan EMI in seconds. Enter loan amount, interest rate and tenure to view monthly instalment, total interest and repayment amount.",
    tagline: "Borrow for any need with a repayment you can plan.",
    presetCategory: "Personal",
    intro: [
      "A personal loan is an unsecured loan you can use for almost anything: a wedding, medical bills, travel, debt consolidation or a home renovation. Because there is no collateral, lenders price in more risk, so interest rates are higher than for secured loans like home or car loans. Tenures are shorter too, usually one to five years, and sometimes up to seven. This calculator shows the EMI for your chosen amount, rate and tenure so you can borrow responsibly.",
      "The EMI is worked out on a reducing balance with the standard formula EMI = P x r x (1 + r)^n / ((1 + r)^n - 1). Since personal loan rates typically range from around 10.5% to 24% depending on your credit score, income and employer, a strong CIBIL score can meaningfully cut your rate and EMI. It pays to compare offers from several lenders rather than accepting the first pre-approved amount you are shown.",
      "Because personal loans are expensive, keep the tenure only as long as you need to make the EMI affordable. A shorter tenure raises the monthly outgo but sharply reduces the total interest. Also watch for processing fees, typically 1-3% of the loan plus GST, and any prepayment or foreclosure charges, since these add to the true cost beyond the headline interest rate.",
    ],
    notes: [
      "Check your CIBIL score before applying, as a higher score often unlocks a lower interest rate.",
      "Keep the tenure short to minimise interest, but ensure the EMI stays within your monthly budget.",
      "Compare the annual percentage rate including processing fees, not just the advertised interest rate.",
      "Avoid stacking multiple personal loans, as high combined EMIs can strain your finances and credit score.",
    ],
    faqs: [
      {
        q: "What interest rate applies to personal loans?",
        a: "Personal loan rates in India typically range from about 10.5% to 24% per year, based on your credit score, income, employer and the lender. A better credit profile earns a lower rate.",
      },
      {
        q: "What is the maximum tenure for a personal loan?",
        a: "Personal loans usually run from 12 to 60 months, and some lenders extend up to 84 months. Longer tenures reduce the EMI but increase total interest paid.",
      },
      {
        q: "Do I need collateral for a personal loan?",
        a: "No. Personal loans are unsecured, so you do not pledge any asset. Approval depends on your income, credit history and repayment capacity rather than security.",
      },
      {
        q: "Can I prepay my personal loan?",
        a: "Yes, most lenders allow prepayment or foreclosure, though some charge a fee, often 2-5% of the outstanding amount. Prepaying reduces the interest you pay overall.",
      },
    ],
    defaults: {
      amount: { min: 10000, max: 4000000, step: 10000, default: 300000, label: "Loan Amount" },
      rate: { min: 9, max: 28, step: 0.1, default: 13, label: "Interest Rate (% p.a.)" },
      tenure: { min: 3, max: 84, step: 1, default: 36, label: "Tenure", unit: "months" },
    },
    related: ["personal-loan-eligibility", "loan-eligibility", "balance-transfer-savings", "emi-calculator", "prepayment"],
    group: "Loan EMI",
  },
  {
    slug: "car-loan-emi",
    kind: "emi",
    name: "Car Loan EMI Calculator",
    metaTitle: "Car Loan EMI Calculator - Auto Loan Instalment Online",
    metaDescription:
      "Work out your car loan EMI online. Enter the on-road price, down payment, interest rate and tenure to see your monthly instalment and total interest cost.",
    tagline: "Drive home your car with an EMI that fits.",
    presetCategory: "Car",
    intro: [
      "A car loan helps you buy a new or used vehicle without paying the full price upfront. The loan is secured against the car itself, which keeps interest rates lower than personal loans. Lenders usually finance 80-90% of the on-road price, so you pay the rest as a down payment. A bigger down payment means a smaller loan, a lower EMI and less interest overall, so it is worth stretching your upfront contribution if you can.",
      "The EMI uses the reducing-balance formula EMI = P x r x (1 + r)^n / ((1 + r)^n - 1), where P is the amount financed after your down payment. Car loan tenures typically range from one to seven years. A longer tenure lowers the EMI but you end up paying more interest on a depreciating asset, and you risk owing more than the car is worth if you sell early, so balance affordability against total cost.",
      "Use this calculator to test different down payments and tenures before you visit a dealership, where financing is often bundled into the deal. Knowing your target EMI in advance helps you negotiate on the car price rather than getting distracted by an attractive monthly figure. Remember to include insurance, road tax and processing fees when working out the true cost of ownership.",
    ],
    notes: [
      "Make the largest down payment you comfortably can to reduce the loan, the EMI and total interest.",
      "Compare loans from banks and NBFCs, as rates and processing fees vary widely for the same car.",
      "Prefer a shorter tenure so you are not paying interest long after the car has depreciated.",
      "Factor in insurance, road tax, accessories and extended warranty when budgeting the full cost.",
    ],
    faqs: [
      {
        q: "How much of the car price will a lender finance?",
        a: "Most lenders finance 80-90% of the on-road price for new cars, and a lower percentage for used cars. You pay the balance as a down payment.",
      },
      {
        q: "What is the typical car loan interest rate?",
        a: "New car loan rates in India usually fall between about 8.5% and 12% per year. Used car loans carry higher rates because the asset is older and riskier for the lender.",
      },
      {
        q: "What tenure should I choose for a car loan?",
        a: "Car loans run up to seven years, but a tenure of three to five years is often ideal. It keeps the EMI manageable without paying interest long after the car loses value.",
      },
      {
        q: "Is my car hypothecated to the lender?",
        a: "Yes. Until the loan is fully repaid, the car is hypothecated to the lender and this is noted in the registration certificate. The charge is removed once you close the loan.",
      },
    ],
    defaults: {
      amount: { min: 50000, max: 10000000, step: 25000, default: 800000, label: "Loan Amount" },
      rate: { min: 7, max: 18, step: 0.1, default: 9.5, label: "Interest Rate (% p.a.)" },
      tenure: { min: 6, max: 96, step: 1, default: 60, label: "Tenure", unit: "months" },
    },
    related: ["loan-eligibility", "emi-calculator", "personal-loan-emi", "prepayment", "balance-transfer-savings"],
    group: "Loan EMI",
  },
  {
    slug: "business-loan-emi",
    kind: "emi",
    name: "Business Loan EMI Calculator",
    metaTitle: "Business Loan EMI Calculator - MSME Loan Instalment",
    metaDescription:
      "Calculate your business loan EMI online. Enter the loan amount, interest rate and tenure to plan monthly instalments, total interest and cash flow impact.",
    tagline: "Fund your business growth with a predictable EMI.",
    presetCategory: "Business",
    intro: [
      "A business loan gives entrepreneurs and MSMEs capital to expand operations, buy equipment, manage working capital or handle seasonal cash-flow gaps. These loans can be secured or unsecured, and rates depend heavily on the health of your business, its vintage, turnover and credit history. Because business income can be uneven, planning the EMI carefully against your expected cash flows is essential to avoid stress during slow months.",
      "This calculator applies the reducing-balance formula EMI = P x r x (1 + r)^n / ((1 + r)^n - 1) to show your monthly outgo, total interest and total repayment. Business loan rates are typically higher than home or car loans, often ranging from around 14% to 24% for unsecured lending, so it is worth exploring secured options or government-backed schemes like those under CGTMSE if you qualify, as they can offer better terms.",
      "For a business, the EMI is not just a cost but a claim on future cash flow. Match the tenure to the purpose of the loan: use shorter tenures for working capital and longer ones for equipment or expansion that generates returns over years. Keep some buffer so a single bad month does not cause a default, and remember that interest on a business loan is generally a deductible expense, which lowers its effective cost.",
    ],
    notes: [
      "Match the loan tenure to what you are funding: short for working capital, longer for capital assets.",
      "Keep an EMI buffer so seasonal dips in revenue do not put you at risk of missing payments.",
      "Explore secured loans and government MSME schemes, which often carry lower interest rates.",
      "Interest paid on a business loan is usually tax deductible, reducing its effective cost.",
    ],
    faqs: [
      {
        q: "What interest rate do business loans carry?",
        a: "Unsecured business loan rates in India generally range from about 14% to 24% per year. Secured loans and government-backed MSME schemes can offer lower rates.",
      },
      {
        q: "Do I need collateral for a business loan?",
        a: "Not always. Many lenders offer unsecured business loans based on turnover and credit profile, while larger amounts may require collateral or a longer business vintage.",
      },
      {
        q: "How long is a typical business loan tenure?",
        a: "Business loan tenures commonly range from 12 to 60 months. Working capital loans tend to be shorter, while term loans for equipment or expansion can be longer.",
      },
      {
        q: "Is business loan interest tax deductible?",
        a: "Yes. Interest paid on a loan taken for business purposes is generally an allowable business expense, which reduces your taxable profit and the effective cost of borrowing.",
      },
    ],
    defaults: {
      amount: { min: 50000, max: 50000000, step: 50000, default: 1000000, label: "Loan Amount" },
      rate: { min: 10, max: 30, step: 0.1, default: 17, label: "Interest Rate (% p.a.)" },
      tenure: { min: 6, max: 84, step: 1, default: 48, label: "Tenure", unit: "months" },
    },
    related: ["loan-eligibility", "emi-calculator", "lap", "prepayment", "gst"],
    group: "Loan EMI",
  },
  {
    slug: "education-loan-emi",
    kind: "emi",
    name: "Education Loan EMI Calculator",
    metaTitle: "Education Loan EMI Calculator - Study Loan Instalment",
    metaDescription:
      "Estimate your education loan EMI online. Enter the amount, interest rate and tenure to plan repayments for studies in India or abroad after your course.",
    tagline: "Invest in education and repay comfortably after graduation.",
    presetCategory: "Education",
    intro: [
      "An education loan funds tuition, living costs and related expenses for higher studies in India or abroad. A distinctive feature is the moratorium period: repayment usually begins only after the course ends plus a grace period of six months to a year, giving graduates time to find a job before EMIs start. Interest, however, may accrue during this period, so understanding how it is treated matters for your final repayment burden.",
      "The EMI is calculated on a reducing balance using EMI = P x r x (1 + r)^n / ((1 + r)^n - 1). Education loans often carry moderate interest rates, and loans up to certain limits may need no collateral, especially for premier institutions. Under Section 80E, the entire interest paid on an education loan is deductible from taxable income for up to eight years, which can substantially reduce the effective cost for the borrower or the co-applicant parent.",
      "Because repayment starts after studies, plan for the fact that interest builds up during the course. Servicing at least the simple interest during the moratorium keeps the balance from ballooning. Use this calculator to see the EMI once repayment begins, and choose a tenure that a fresh graduate's expected salary can support without difficulty in the crucial early years of a career.",
    ],
    notes: [
      "Repayment usually starts after a moratorium of course duration plus six to twelve months.",
      "Interest paid on an education loan is fully deductible under Section 80E for up to eight years.",
      "Servicing simple interest during the study period stops the outstanding balance from growing.",
      "Loans up to a threshold may not need collateral, particularly for reputed institutions.",
    ],
    faqs: [
      {
        q: "When do education loan EMIs begin?",
        a: "EMIs usually start after a moratorium period, which is the course duration plus a grace period of six months to one year. This lets graduates settle into a job before repaying.",
      },
      {
        q: "Are there tax benefits on education loans?",
        a: "Yes. Under Section 80E, the full interest paid on an education loan is deductible from taxable income for up to eight years, with no upper limit on the interest amount.",
      },
      {
        q: "Do I need collateral for an education loan?",
        a: "Loans up to a certain limit are often collateral-free, especially for recognised institutions. Larger amounts, particularly for studies abroad, may require security or a guarantor.",
      },
      {
        q: "Does interest accrue during the moratorium?",
        a: "Yes, interest generally accrues during the moratorium. Paying the simple interest during this period prevents it from being added to the principal and increasing later EMIs.",
      },
    ],
    defaults: {
      amount: { min: 50000, max: 15000000, step: 50000, default: 1000000, label: "Loan Amount" },
      rate: { min: 7, max: 16, step: 0.1, default: 11, label: "Interest Rate (% p.a.)" },
      tenure: { min: 1, max: 15, step: 1, default: 10, label: "Tenure", unit: "years" },
    },
    related: ["loan-eligibility", "emi-calculator", "personal-loan-emi", "prepayment", "income-tax"],
    group: "Loan EMI",
  },
  {
    slug: "balance-transfer-savings",
    kind: "balance-transfer",
    name: "Balance Transfer Savings Calculator",
    metaTitle: "Loan Balance Transfer Calculator - Savings Estimator",
    metaDescription:
      "See how much you can save by transferring your loan to a lower interest rate. Compare current and new EMIs, total interest and net savings after charges.",
    tagline: "Switch to a lower rate and keep more of your money.",
    intro: [
      "A balance transfer, also called a refinance, moves your outstanding loan from your current lender to a new one offering a lower interest rate. Because interest is charged on the remaining principal, even a rate cut of one or two percentage points can save a large sum over the rest of a long loan such as a home loan. This calculator compares your existing EMI and interest with the new terms so you can see the real saving.",
      "The new EMI is computed on your outstanding balance using the standard reducing-balance formula, EMI = P x r x (1 + r)^n / ((1 + r)^n - 1). The saving comes from the difference in total interest over the remaining tenure. However, a transfer is not free: the new lender may charge a processing fee, and there can be legal, valuation or stamp duty costs. The right decision is the one where interest savings comfortably exceed these one-time charges.",
      "Balance transfers make the most sense early in a loan, when a large principal and many remaining instalments mean interest still dominates each EMI. Late in the tenure, when little principal is left, the savings rarely justify the switch. Some borrowers also use a transfer to access a top-up loan at a low rate. Always compare the total cost, not just the headline rate, before moving your loan.",
    ],
    notes: [
      "Compare total interest saved against processing, legal and valuation charges before switching.",
      "Balance transfers save the most early in the tenure, when the outstanding principal is high.",
      "Ask the new lender about a top-up loan, which can be cheaper than a fresh personal loan.",
      "Check for foreclosure charges from your current lender, though floating-rate home loans usually have none.",
    ],
    faqs: [
      {
        q: "When is a balance transfer worthwhile?",
        a: "It is worthwhile when the interest saved from a lower rate over the remaining tenure clearly exceeds the processing and switching charges, which is usually early in a long loan.",
      },
      {
        q: "What charges apply to a balance transfer?",
        a: "The new lender may levy a processing fee, and there can be legal, valuation and stamp duty costs. Your current lender may charge foreclosure fees, though floating home loans usually do not.",
      },
      {
        q: "Can I get extra funds during a balance transfer?",
        a: "Yes. Many lenders offer a top-up loan along with the transfer, letting you borrow more at the lower secured rate, which is often cheaper than an unsecured personal loan.",
      },
      {
        q: "Does a balance transfer affect my credit score?",
        a: "The application involves a credit enquiry and closing the old loan, which can cause a small temporary dip. Consistent repayment on the new loan restores and improves your score over time.",
      },
    ],
    related: ["home-loan-emi", "prepayment", "personal-loan-emi", "emi-calculator", "lap"],
    group: "Loan EMI",
  },
  {
    slug: "prepayment",
    kind: "prepayment",
    name: "Loan Prepayment Calculator",
    metaTitle: "Loan Prepayment Calculator - Interest Savings Estimator",
    metaDescription:
      "Find out how much interest and time you can save by prepaying your loan. Compare tenure reduction versus EMI reduction and see your total savings.",
    tagline: "Pay off your loan faster and save on interest.",
    intro: [
      "Prepayment means paying more than your scheduled EMI, either as a lump sum or through regular extra payments, to reduce your loan faster. Because interest is charged only on the outstanding principal, every rupee you prepay directly cuts the balance on which future interest is calculated. The effect compounds over time, so prepaying early in a long loan can save far more interest than the amount you actually pay in.",
      "When you prepay, you usually choose one of two options: reduce the tenure while keeping the EMI the same, or reduce the EMI while keeping the tenure the same. Reducing the tenure saves the most interest because you close the loan sooner and stop paying interest earlier. Reducing the EMI eases your monthly cash flow instead. This calculator shows the interest saved and the new tenure or EMI under either choice.",
      "Prepayment is most powerful in the early years of a loan, when the principal is large and the interest portion of each EMI is highest. Floating-rate home loans in India generally carry no prepayment penalty, making them ideal for this strategy, while fixed-rate and some personal loans may charge a fee. Always weigh the interest saved against any prepayment charges and the returns you could earn by investing the same money instead.",
    ],
    notes: [
      "Choose tenure reduction over EMI reduction to maximise the interest you save.",
      "Prepay as early as possible, since early prepayments cut the most future interest.",
      "Floating-rate home loans usually have no prepayment penalty, unlike some fixed and personal loans.",
      "Compare the interest saved with potential investment returns before locking money into prepayment.",
    ],
    faqs: [
      {
        q: "Should I reduce the tenure or the EMI when prepaying?",
        a: "Reducing the tenure saves more interest because you close the loan sooner. Reducing the EMI lowers your monthly outgo but you keep paying interest for the full original tenure.",
      },
      {
        q: "Is there a penalty for prepaying a loan?",
        a: "Floating-rate home loans in India usually have no prepayment penalty. Fixed-rate loans and some personal loans may charge a fee, often 2-5% of the amount prepaid.",
      },
      {
        q: "When is prepayment most beneficial?",
        a: "Prepayment saves the most in the early years of a loan, when the outstanding principal and the interest share of each EMI are at their highest.",
      },
      {
        q: "Is prepaying always better than investing?",
        a: "Not always. If your expected post-tax investment return is higher than your loan interest rate, investing may be smarter. Prepayment offers a guaranteed, risk-free saving equal to the loan rate.",
      },
    ],
    related: ["home-loan-emi", "balance-transfer-savings", "emi-calculator", "personal-loan-emi", "sip"],
    group: "Loan EMI",
  },
  {
    slug: "lap",
    kind: "lap",
    name: "Loan Against Property Calculator",
    metaTitle: "Loan Against Property Calculator - LAP EMI Online",
    metaDescription:
      "Calculate your loan against property EMI and eligibility. Enter property value, loan amount, rate and tenure to see monthly instalment and total interest.",
    tagline: "Unlock the value of your property at a lower rate.",
    intro: [
      "A loan against property (LAP) lets you borrow by pledging a residential or commercial property you own, while continuing to use it. Because the loan is secured against a high-value asset, interest rates are much lower than unsecured personal or business loans, and you can borrow larger amounts for longer tenures. LAP is popular for business expansion, funding education, weddings or consolidating costlier debts into one affordable EMI.",
      "Lenders sanction a percentage of the property's market value, known as the loan-to-value ratio, usually around 50-70%. The EMI is calculated on a reducing balance using EMI = P x r x (1 + r)^n / ((1 + r)^n - 1), and tenures can run up to 15 years or more. This calculator helps you see the EMI and total interest for a given loan amount, so you can judge affordability against the significant commitment a secured loan represents.",
      "The key thing to remember with LAP is that your property is on the line: defaulting can lead to the lender taking possession, so borrow only what you can comfortably repay. The lower rate and longer tenure make LAP a sensible way to raise a large sum, but the temptation to over-borrow against a valuable asset is real. Compare offers on interest rate, loan-to-value ratio and processing fees before committing.",
    ],
    notes: [
      "Lenders typically fund 50-70% of the property's market value as the loan amount.",
      "LAP rates are far lower than personal or business loans because the loan is secured.",
      "Borrow only what you can repay, since default can lead to loss of the pledged property.",
      "Compare loan-to-value ratio, interest rate and processing fees across lenders before choosing.",
    ],
    faqs: [
      {
        q: "How much can I borrow against my property?",
        a: "Lenders usually offer 50-70% of the property's current market value, based on a valuation. Residential properties often fetch a higher loan-to-value ratio than commercial ones.",
      },
      {
        q: "What is the interest rate on a loan against property?",
        a: "LAP rates are lower than unsecured loans because the loan is secured, typically ranging from about 9% to 13% per year depending on the lender and your profile.",
      },
      {
        q: "Can I use LAP for any purpose?",
        a: "Yes. Funds from a loan against property can be used for business, education, medical needs, weddings or debt consolidation, though not for speculative or illegal activities.",
      },
      {
        q: "What happens if I default on a LAP?",
        a: "Since the property is pledged as security, persistent default can lead the lender to take possession and sell the property to recover dues. Borrow only what you can comfortably repay.",
      },
    ],
    defaults: {
      amount: { min: 200000, max: 100000000, step: 100000, default: 3000000, label: "Loan Amount" },
      rate: { min: 8, max: 16, step: 0.1, default: 10.5, label: "Interest Rate (% p.a.)" },
      tenure: { min: 1, max: 20, step: 1, default: 15, label: "Tenure", unit: "years" },
    },
    related: ["home-loan-emi", "business-loan-emi", "loan-eligibility", "balance-transfer-savings", "emi-calculator"],
    group: "Loan EMI",
  },

  // ----------------------------------------------------------------------
  // ELIGIBILITY GROUP
  // ----------------------------------------------------------------------
  {
    slug: "loan-eligibility",
    kind: "eligibility",
    name: "Loan Eligibility Calculator",
    metaTitle: "Loan Eligibility Calculator - How Much Loan Can I Get",
    metaDescription:
      "Check how much loan you can get based on your income, existing EMIs, interest rate and tenure. Estimate your eligibility before you apply to any lender.",
    tagline: "Find out how much you can borrow before you apply.",
    intro: [
      "Loan eligibility is the maximum amount a lender is willing to give you, based mainly on your ability to repay. The single biggest factor is your income and how much of it is already committed to other EMIs. Lenders use a measure called the fixed-obligation-to-income ratio (FOIR), typically capping your total EMIs at around 40-50% of your monthly income. This calculator estimates your borrowing limit from your income, existing obligations and the loan terms.",
      "The logic works backwards from an affordable EMI. First, the lender decides the maximum EMI you can support, which is your income multiplied by the allowed FOIR, minus your current EMIs. Then it converts that EMI into a loan amount using the interest rate and tenure through the reducing-balance formula. A higher income, a longer tenure or a lower interest rate all increase the eligible amount, while existing loans reduce it.",
      "Beyond income, lenders also weigh your credit score, employment stability, age and the type of loan. A strong CIBIL score can improve both your eligibility and the rate offered. This tool gives a realistic starting estimate so you apply for an amount you are likely to get, avoiding the credit-score damage of repeated rejections. Treat the result as indicative, since each lender applies its own policies.",
    ],
    notes: [
      "Lenders cap total EMIs at roughly 40-50% of your monthly income through the FOIR rule.",
      "Clearing or reducing existing EMIs directly increases how much new loan you can get.",
      "A longer tenure or lower rate raises eligibility but increases the total interest you pay.",
      "Maintain a high credit score, as it improves both your eligible amount and your interest rate.",
    ],
    faqs: [
      {
        q: "How do lenders decide my loan eligibility?",
        a: "Lenders start with an affordable EMI, usually 40-50% of your income minus existing EMIs, then convert it into a loan amount using the interest rate and tenure. Credit score and job stability also matter.",
      },
      {
        q: "How can I increase my loan eligibility?",
        a: "Increase your declared income, close or reduce existing EMIs, choose a longer tenure, add a co-applicant or improve your credit score. Each of these raises the amount a lender will offer.",
      },
      {
        q: "Does a co-applicant improve eligibility?",
        a: "Yes. Adding a co-applicant with a steady income pools both incomes, which raises the affordable EMI and therefore the eligible loan amount, especially useful for home loans.",
      },
      {
        q: "Is the eligibility shown here guaranteed?",
        a: "No. It is an indicative estimate based on standard rules. Each lender applies its own policies on FOIR, credit score, employer category and documentation, so the final sanction may differ.",
      },
    ],
    defaults: {
      amount: { min: 15000, max: 5000000, step: 5000, default: 60000, label: "Monthly Income" },
      rate: { min: 6, max: 28, step: 0.1, default: 11, label: "Interest Rate (% p.a.)" },
      tenure: { min: 6, max: 360, step: 1, default: 60, label: "Tenure", unit: "months" },
    },
    related: ["home-loan-eligibility", "personal-loan-eligibility", "emi-calculator", "personal-loan-emi", "home-loan-emi"],
    group: "Eligibility",
  },
  {
    slug: "home-loan-eligibility",
    kind: "eligibility",
    name: "Home Loan Eligibility Calculator",
    metaTitle: "Home Loan Eligibility Calculator - Check Your Limit",
    metaDescription:
      "Estimate your home loan eligibility from your income, existing EMIs, interest rate and tenure. Know your borrowing limit before applying for a housing loan.",
    tagline: "See how much home loan your income can support.",
    presetCategory: "Home",
    intro: [
      "Home loan eligibility tells you the maximum housing loan a lender is likely to sanction, which in turn shapes the budget for the property you can buy. Because home loans are large and long, lenders assess your repayment capacity carefully, capping total EMIs at around 40-50% of your monthly income. This calculator estimates your eligible loan amount from your income, current obligations and the loan terms you expect.",
      "The eligible amount is derived by first finding the EMI you can afford, then converting it into a loan using the reducing-balance formula over the chosen tenure. Home loans allow long tenures, up to 30 years, which lifts eligibility because the affordable EMI supports a bigger principal. Adding a co-applicant, such as a spouse with income, pools earnings and can substantially raise the amount you qualify for.",
      "Two limits apply together: your income-based eligibility and the loan-to-value cap, since lenders fund only 75-90% of the property value and you must arrange the rest as a down payment. Your final loan is the lower of the two. A strong credit score, stable employment and minimal existing debt all improve your position. Use this estimate to shortlist properties within a realistic budget before you begin house-hunting.",
    ],
    notes: [
      "Your loan is the lower of income-based eligibility and the loan-to-value cap on the property.",
      "Adding an earning co-applicant pools incomes and can significantly raise your eligibility.",
      "A longer tenure increases eligibility but adds to total interest over the life of the loan.",
      "Plan for a down payment of 10-25% of the property value plus stamp duty and registration.",
    ],
    faqs: [
      {
        q: "How much home loan can I get on my salary?",
        a: "As a rough guide, lenders offer a loan whose EMI stays within 40-50% of your income after existing EMIs. Over a long tenure this can be 50-70 times your monthly income, subject to the property value.",
      },
      {
        q: "Does adding a co-applicant help?",
        a: "Yes. A co-applicant with income, such as a spouse or parent, combines earnings, raising the affordable EMI and the eligible loan amount. It can also unlock additional tax benefits.",
      },
      {
        q: "What is the loan-to-value ratio for home loans?",
        a: "Lenders typically fund 75-90% of the property value, with the exact ratio depending on the loan size and lender policy. You pay the remaining amount as a down payment.",
      },
      {
        q: "How can I improve my home loan eligibility?",
        a: "Boost eligibility by raising declared income, clearing existing EMIs, choosing a longer tenure, adding a co-applicant and maintaining a strong credit score above 750.",
      },
    ],
    defaults: {
      amount: { min: 20000, max: 5000000, step: 5000, default: 80000, label: "Monthly Income" },
      rate: { min: 6, max: 15, step: 0.05, default: 8.7, label: "Interest Rate (% p.a.)" },
      tenure: { min: 1, max: 30, step: 1, default: 20, label: "Tenure", unit: "years" },
    },
    related: ["home-loan-emi", "loan-eligibility", "personal-loan-eligibility", "prepayment", "emi-calculator"],
    group: "Eligibility",
  },
  {
    slug: "personal-loan-eligibility",
    kind: "eligibility",
    name: "Personal Loan Eligibility Calculator",
    metaTitle: "Personal Loan Eligibility Calculator - Check Limit",
    metaDescription:
      "Check your personal loan eligibility based on income, existing EMIs, interest rate and tenure. Estimate how much unsecured loan you can borrow before applying.",
    tagline: "Estimate your personal loan limit in seconds.",
    presetCategory: "Personal",
    intro: [
      "Personal loan eligibility is the maximum unsecured loan a lender will offer based on your repayment capacity. Since there is no collateral, lenders rely heavily on your income, existing EMIs, credit score and employer profile. Most cap your total monthly obligations at around 40-50% of your income. This calculator estimates the loan amount you can expect from your income, current commitments and the rate and tenure on offer.",
      "The method mirrors how lenders think: it works out the EMI you can afford, then converts that into a loan amount using the reducing-balance formula for the chosen tenure and rate. Personal loans have shorter tenures, usually up to five or seven years, so eligibility is more tightly linked to income than for a home loan. Reducing existing EMIs or extending the tenure a little can meaningfully raise the amount you qualify for.",
      "Because personal loans are unsecured, your credit score plays an outsized role in both approval and pricing. A CIBIL score above 750, a stable salaried job with a reputed employer and a clean repayment history all improve your chances and can secure a lower rate, which in turn increases eligibility. Use this estimate to apply for a realistic amount and avoid the score damage that comes from multiple rejected applications.",
    ],
    notes: [
      "Lenders cap total EMIs at about 40-50% of monthly income when sizing a personal loan.",
      "A CIBIL score above 750 improves both approval odds and the interest rate you are offered.",
      "Salaried applicants with reputed employers often qualify for higher amounts and better rates.",
      "Avoid multiple simultaneous applications, as each triggers a hard enquiry that can lower your score.",
    ],
    faqs: [
      {
        q: "How is personal loan eligibility calculated?",
        a: "Lenders find the EMI you can afford, roughly 40-50% of your income minus existing EMIs, then convert it into a loan amount using the interest rate and tenure. Credit score and employer also count.",
      },
      {
        q: "What credit score do I need for a personal loan?",
        a: "A CIBIL score of 750 or above gives the best chance of approval and the lowest rates. Lower scores may still be approved but usually at higher interest rates or smaller amounts.",
      },
      {
        q: "How can I increase my personal loan eligibility?",
        a: "Raise your declared income, close small existing loans, choose a slightly longer tenure, improve your credit score and, where allowed, add a co-applicant to boost the eligible amount.",
      },
      {
        q: "Does my employer affect eligibility?",
        a: "Yes. Salaried applicants from reputed or large employers are seen as lower risk, which can improve both the loan amount offered and the interest rate compared with less stable employment.",
      },
    ],
    defaults: {
      amount: { min: 15000, max: 2000000, step: 5000, default: 50000, label: "Monthly Income" },
      rate: { min: 9, max: 28, step: 0.1, default: 13, label: "Interest Rate (% p.a.)" },
      tenure: { min: 6, max: 84, step: 1, default: 48, label: "Tenure", unit: "months" },
    },
    related: ["personal-loan-emi", "loan-eligibility", "home-loan-eligibility", "emi-calculator", "balance-transfer-savings"],
    group: "Eligibility",
  },

  // ----------------------------------------------------------------------
  // INVESTMENT GROUP
  // ----------------------------------------------------------------------
  {
    slug: "sip",
    kind: "sip",
    name: "SIP Calculator",
    metaTitle: "SIP Calculator - Mutual Fund SIP Returns Online India",
    metaDescription:
      "Calculate the future value of your mutual fund SIP. Enter your monthly investment, expected return and duration to see maturity value and wealth gained.",
    tagline: "See how small monthly investments grow into wealth.",
    intro: [
      "A Systematic Investment Plan (SIP) is a way of investing a fixed amount in a mutual fund at regular intervals, usually every month. Instead of timing the market, you invest steadily, buying more units when prices are low and fewer when they are high. This rupee-cost averaging smooths out volatility, while the real magic comes from compounding: your returns earn further returns over time, turning modest monthly contributions into a substantial corpus over the years.",
      "This calculator uses the future value of an annuity formula, FV = P x (((1 + i)^n - 1) / i) x (1 + i), where P is the monthly investment, i is the monthly rate of return (annual expected return divided by 12) and n is the number of instalments. The result shows your maturity value, the total amount you invested and the wealth gained. Because compounding accelerates over time, starting early and staying invested longer has an outsized effect.",
      "SIP returns are not guaranteed, since mutual funds invest in market-linked assets, so the expected return you enter is only an assumption. Equity funds have historically delivered higher long-term returns than fixed deposits but with more short-term ups and downs. Use this tool to set realistic goals, then stay disciplined through market cycles. A step-up SIP, where you raise your contribution each year, can grow your corpus even faster.",
    ],
    notes: [
      "Start early, as compounding rewards a longer investment horizon more than a larger amount.",
      "Increase your SIP amount each year with a step-up to grow your corpus significantly faster.",
      "Stay invested through market dips, since rupee-cost averaging works best over full cycles.",
      "Returns are market-linked and not guaranteed, so treat the expected return as an estimate.",
    ],
    faqs: [
      {
        q: "How is SIP maturity value calculated?",
        a: "It uses the future value of an annuity formula, FV = P x (((1 + i)^n - 1) / i) x (1 + i), where P is the monthly amount, i is the monthly return and n is the number of instalments.",
      },
      {
        q: "Are SIP returns guaranteed?",
        a: "No. SIPs invest in market-linked mutual funds, so returns vary with market performance. The expected return you enter is an assumption used to project a likely outcome, not a promise.",
      },
      {
        q: "What return should I assume for a SIP?",
        a: "For equity funds, many investors assume around 10-12% per year over the long term, though actual returns fluctuate. Debt funds are lower and steadier. Use a conservative figure for planning.",
      },
      {
        q: "What is a step-up SIP?",
        a: "A step-up SIP increases your monthly investment by a fixed percentage each year, usually in line with income growth. It harnesses compounding on a rising base to build a much larger corpus.",
      },
    ],
    related: ["lumpsum", "compound-interest", "fd", "rd", "retirement"],
    group: "Investment",
  },
  {
    slug: "lumpsum",
    kind: "lumpsum",
    name: "Lumpsum Calculator",
    metaTitle: "Lumpsum Calculator - One-Time Investment Returns India",
    metaDescription:
      "Calculate the future value of a one-time lumpsum investment. Enter the amount, expected annual return and duration to see maturity value and total gains.",
    tagline: "Project the growth of a one-time investment.",
    intro: [
      "A lumpsum investment is a single, one-time deposit into a mutual fund or other market-linked instrument, as opposed to spreading it out through a SIP. Investors often use lumpsum investing when they receive a large sum, such as a bonus, maturity proceeds or the sale of an asset, and want to put it to work immediately. Because the full amount is invested from day one, it has the maximum possible time to compound.",
      "The calculator applies the compound interest formula for a one-time investment, FV = P x (1 + r)^n, where P is the amount invested, r is the expected annual rate of return and n is the number of years. It shows the maturity value and the total gain over your principal. Small differences in the assumed return or the holding period can produce large differences in the final value, which highlights the power of long-term compounding.",
      "Lumpsum investing carries timing risk: if you invest just before a market fall, your short-term returns can suffer, though this evens out over a long horizon. For very large amounts, some investors stagger entry through a systematic transfer plan to reduce this risk. Since returns are market-linked and not assured, treat the projection as a planning aid and choose an expected return that reflects the asset class and your time frame.",
    ],
    notes: [
      "Invest for the long term, as compounding on a lumpsum grows dramatically with more years.",
      "For large amounts, consider staggering entry via a systematic transfer plan to reduce timing risk.",
      "A small change in the assumed return can greatly alter the final value over long periods.",
      "Returns are market-linked and not guaranteed, so use a realistic expected rate for planning.",
    ],
    faqs: [
      {
        q: "How is lumpsum maturity value calculated?",
        a: "It uses the compound interest formula FV = P x (1 + r)^n, where P is the invested amount, r is the annual expected return and n is the number of years the money stays invested.",
      },
      {
        q: "Is lumpsum better than SIP?",
        a: "Neither is universally better. Lumpsum suits a large one-time sum and gives maximum compounding time, while SIP averages your cost over time and reduces timing risk. Many investors use both.",
      },
      {
        q: "What is the risk with lumpsum investing?",
        a: "The main risk is timing: investing just before a market decline can hurt short-term returns. Over a long horizon this risk fades, and staggering entry can further reduce it.",
      },
      {
        q: "Are lumpsum returns guaranteed?",
        a: "No. Lumpsum investments in mutual funds are market-linked, so returns vary. The projected value is based on the expected return you assume and is not a guaranteed outcome.",
      },
    ],
    related: ["sip", "compound-interest", "fd", "retirement", "ppf"],
    group: "Investment",
  },
  {
    slug: "fd",
    kind: "fd",
    name: "FD Calculator",
    metaTitle: "FD Calculator - Fixed Deposit Maturity & Interest India",
    metaDescription:
      "Calculate your fixed deposit maturity amount and interest earned. Enter deposit amount, interest rate, tenure and compounding to see returns instantly.",
    tagline: "Know exactly what your fixed deposit will earn.",
    intro: [
      "A fixed deposit (FD) is one of India's most trusted savings instruments, where you deposit a sum with a bank or NBFC for a fixed period at a guaranteed interest rate. Unlike market-linked investments, an FD gives assured returns known in advance, which makes it ideal for capital protection and predictable goals. Interest is usually compounded quarterly, and you can choose to receive it periodically or reinvest it until maturity for the full compounding benefit.",
      "This calculator computes the maturity value using the compound interest formula A = P x (1 + r/m)^(m x t), where P is the principal, r is the annual rate, m is the number of times interest compounds per year and t is the tenure in years. It shows both the maturity amount and the interest earned. A cumulative FD, where interest is reinvested, grows faster than a non-cumulative one that pays interest out regularly.",
      "FD interest is fully taxable as per your income slab, and banks deduct TDS if the interest crosses the annual threshold, so your post-tax return can be noticeably lower than the headline rate. Senior citizens usually earn a higher rate. FDs suit conservative investors and short-to-medium-term goals, but over long horizons their returns may struggle to beat inflation compared with equity, so balance safety against growth.",
    ],
    notes: [
      "Choose a cumulative FD to reinvest interest and benefit from full compounding at maturity.",
      "FD interest is taxable at your slab rate, and TDS applies once interest crosses the threshold.",
      "Senior citizens typically earn a higher interest rate, often 0.25-0.75% above standard rates.",
      "Compare rates across banks and small finance banks, but check deposit insurance cover of 5 lakh.",
    ],
    faqs: [
      {
        q: "How is FD maturity calculated?",
        a: "Using compound interest, A = P x (1 + r/m)^(m x t), where P is the principal, r the annual rate, m the compounding frequency per year and t the tenure in years. Most banks compound quarterly.",
      },
      {
        q: "Is FD interest taxable?",
        a: "Yes. FD interest is added to your income and taxed at your slab rate. Banks deduct TDS if annual interest exceeds Rs 40,000, or Rs 50,000 for senior citizens, unless you submit Form 15G or 15H.",
      },
      {
        q: "What is the difference between cumulative and non-cumulative FD?",
        a: "A cumulative FD reinvests interest and pays the total at maturity, maximising compounding. A non-cumulative FD pays interest at regular intervals, giving periodic income but a lower final amount.",
      },
      {
        q: "Are fixed deposits safe?",
        a: "FDs are among the safest options, with deposits in banks insured up to Rs 5 lakh per depositor per bank by the DICGC. Company FDs carry more risk and are not covered by this insurance.",
      },
    ],
    related: ["rd", "compound-interest", "ppf", "sip", "lumpsum"],
    group: "Investment",
  },
  {
    slug: "rd",
    kind: "rd",
    name: "RD Calculator",
    metaTitle: "RD Calculator - Recurring Deposit Maturity & Interest",
    metaDescription:
      "Calculate your recurring deposit maturity value and interest earned. Enter monthly deposit, interest rate and tenure to see your total returns instantly.",
    tagline: "Build savings with fixed monthly deposits.",
    intro: [
      "A recurring deposit (RD) lets you save a fixed amount every month for a chosen period at a guaranteed interest rate, making it perfect for building a savings habit. Like a fixed deposit, it offers assured returns, but instead of a single lumpsum you invest in regular instalments. This suits salaried people who want to set aside a part of their income each month towards a goal such as a holiday, a gadget or an emergency fund.",
      "Each monthly deposit earns interest for the remaining months until maturity, and interest is typically compounded quarterly. The maturity value is the sum of all instalments plus the compounded interest on each. Because early deposits stay invested longer, they earn more interest than later ones. This calculator adds up the compounded value of every instalment to show your maturity amount and the total interest you earn over the tenure.",
      "RD interest is taxable at your income slab, and TDS may apply if the annual interest crosses the threshold. Missing an instalment can attract a small penalty, so ensure funds are available on the due date. While RDs offer safety and discipline, their returns are similar to FDs and may not beat inflation over the long run, so they are best for short-to-medium-term goals where certainty matters more than high growth.",
    ],
    notes: [
      "RDs build a disciplined monthly savings habit with guaranteed, predictable returns.",
      "Earlier instalments earn more interest because they stay invested for longer.",
      "RD interest is taxable at your slab rate, and TDS may apply on higher interest amounts.",
      "Ensure funds are available each month, as missed instalments can attract a small penalty.",
    ],
    faqs: [
      {
        q: "How is RD maturity calculated?",
        a: "Each monthly instalment earns compound interest for the months remaining until maturity, usually compounded quarterly. The maturity value is the sum of all instalments plus their accumulated interest.",
      },
      {
        q: "Is RD interest taxable?",
        a: "Yes. RD interest is added to your income and taxed at your slab rate. Banks deduct TDS if the annual interest crosses the applicable threshold, unless you submit Form 15G or 15H.",
      },
      {
        q: "What happens if I miss an RD instalment?",
        a: "Missing an instalment usually attracts a small penalty, and repeated defaults can lead the bank to close the account prematurely. Keep sufficient balance in the linked account on each due date.",
      },
      {
        q: "Is an RD better than a SIP?",
        a: "An RD gives guaranteed but modest returns and suits capital protection, while a SIP is market-linked with higher potential returns and more risk. Choose based on your goal and risk appetite.",
      },
    ],
    related: ["fd", "sip", "compound-interest", "ppf", "lumpsum"],
    group: "Investment",
  },
  {
    slug: "ppf",
    kind: "ppf",
    name: "PPF Calculator",
    metaTitle: "PPF Calculator - Public Provident Fund Maturity India",
    metaDescription:
      "Calculate your PPF maturity value and interest over 15 years. Enter your yearly contribution and rate to plan tax-free, government-backed savings.",
    tagline: "Grow tax-free savings with a government-backed scheme.",
    intro: [
      "The Public Provident Fund (PPF) is a long-term, government-backed savings scheme popular for its safety and tax benefits. It has a 15-year lock-in, which can be extended in blocks of five years, and you can invest between Rs 500 and Rs 1.5 lakh per year. The interest rate is set by the government every quarter and is credited annually. Because it is sovereign-backed, your capital and returns are effectively guaranteed, making it a cornerstone of conservative financial planning.",
      "PPF interest compounds annually, so each year's balance earns interest that is added to the principal for the next year. This calculator projects your maturity value based on your yearly contribution and the assumed rate over the tenure, using annual compounding on the growing balance. The long lock-in combined with compounding means that steady annual contributions can grow into a sizeable, entirely tax-free corpus by maturity.",
      "PPF enjoys the coveted exempt-exempt-exempt (EEE) tax status: your contributions qualify for deduction under Section 80C, the interest earned is tax-free, and the maturity amount is also tax-free. This makes it especially attractive for those in higher tax brackets seeking risk-free returns. To maximise interest, deposit before the 5th of the month, since interest is calculated on the lowest balance between the 5th and month-end.",
    ],
    notes: [
      "PPF has a 15-year lock-in, extendable in five-year blocks, with EEE tax-free status.",
      "Contributions of Rs 500 to Rs 1.5 lakh a year qualify for deduction under Section 80C.",
      "Deposit before the 5th of the month to earn interest on that month's balance.",
      "The interest rate is revised quarterly by the government and credited at year end.",
    ],
    faqs: [
      {
        q: "How does PPF interest work?",
        a: "PPF interest is set quarterly by the government, compounded annually and credited at year end. Interest each month is calculated on the lowest balance between the 5th and the last day.",
      },
      {
        q: "Is PPF completely tax-free?",
        a: "Yes. PPF has EEE status: contributions are deductible under Section 80C, the interest earned is tax-free, and the maturity amount is tax-free, making it very attractive for higher tax brackets.",
      },
      {
        q: "What is the lock-in period for PPF?",
        a: "PPF has a 15-year lock-in from the end of the year the account is opened. After that you can extend it in blocks of five years, with or without further contributions.",
      },
      {
        q: "Can I withdraw from PPF before maturity?",
        a: "Partial withdrawals are allowed from the seventh year, and loans against the balance from the third to sixth year. Premature closure is permitted only in specific cases like serious illness or higher education.",
      },
    ],
    related: ["fd", "compound-interest", "sip", "retirement", "income-tax"],
    group: "Investment",
  },
  {
    slug: "compound-interest",
    kind: "compound-interest",
    name: "Compound Interest Calculator",
    metaTitle: "Compound Interest Calculator - Grow Money Over Time",
    metaDescription:
      "Calculate compound interest on your savings or investment. Enter principal, rate, tenure and compounding frequency to see the future value and interest earned.",
    tagline: "Understand the force that grows your money.",
    intro: [
      "Compound interest is often called the eighth wonder of finance because it lets your money earn returns not just on the original principal but also on the interest already earned. Over time this creates a snowball effect: the balance grows faster and faster as the interest base keeps expanding. Understanding compounding is fundamental to almost every savings and investment decision, from fixed deposits and PPF to mutual funds and even loans, where it works against you.",
      "This calculator uses the standard formula A = P x (1 + r/n)^(n x t), where P is the principal, r is the annual interest rate, n is the number of times interest is compounded per year and t is the time in years. The more frequently interest compounds, whether yearly, quarterly, monthly or daily, the higher the final amount. It shows both the maturity value and the interest earned, so you can see compounding in action.",
      "The two biggest drivers of compound growth are time and rate. Because the effect is exponential, starting early can matter more than investing a larger amount later. A modest sum left to compound for decades can outgrow a much bigger sum invested for only a few years. Use this tool to appreciate why long-term, patient investing works, and why paying down high-interest debt quickly is so valuable, since the same maths compounds against borrowers.",
    ],
    notes: [
      "More frequent compounding, such as monthly over yearly, produces a higher final amount.",
      "Time is the most powerful factor, so starting early beats investing more later.",
      "Compounding works against you on loans and credit cards, so clear high-interest debt fast.",
      "Small differences in the interest rate compound into large differences over long periods.",
    ],
    faqs: [
      {
        q: "What is the compound interest formula?",
        a: "A = P x (1 + r/n)^(n x t), where P is the principal, r the annual rate, n the number of compounding periods per year and t the number of years. Interest earns further interest each period.",
      },
      {
        q: "How is compound interest different from simple interest?",
        a: "Simple interest is charged only on the original principal, while compound interest is charged on the principal plus accumulated interest. Over time, compounding produces significantly higher growth.",
      },
      {
        q: "Does compounding frequency matter?",
        a: "Yes. The more often interest compounds, the more you earn, because interest starts earning interest sooner. Monthly compounding yields more than quarterly, which yields more than annual.",
      },
      {
        q: "Why is starting early so important?",
        a: "Because compounding is exponential, money invested earlier has more time to snowball. Starting a decade sooner can outweigh investing a much larger amount later in life.",
      },
    ],
    related: ["sip", "fd", "lumpsum", "ppf", "rd"],
    group: "Investment",
  },

  // ----------------------------------------------------------------------
  // TAX & OTHER GROUP
  // ----------------------------------------------------------------------
  {
    slug: "income-tax",
    kind: "income-tax",
    name: "Income Tax Calculator",
    metaTitle: "Income Tax Calculator - Old vs New Regime India",
    metaDescription:
      "Calculate your income tax under the old and new regimes. Enter your income and deductions to compare tax liability and choose the regime that saves more.",
    tagline: "Compare old and new regimes and pay the right tax.",
    intro: [
      "Income tax in India is charged on your total annual income across salary, business, house property, capital gains and other sources, after allowable deductions. Since a major reform, taxpayers can choose between two systems: the old regime, which offers many exemptions and deductions with higher slab rates, and the new regime, which has lower slab rates but removes most deductions. Choosing the right one can meaningfully change how much tax you pay.",
      "This calculator helps you estimate your liability under both regimes so you can compare them side by side. The old regime rewards those who invest in tax-saving instruments and claim deductions such as Section 80C, HRA, home loan interest and health insurance. The new regime suits those with few deductions who prefer simplicity and lower headline rates. Your best choice depends on how many deductions you can realistically claim.",
      "Tax is calculated slab by slab, meaning each portion of your income is taxed at the rate for that band, not the whole income at the top rate. A health and education cess is added on top, and a rebate makes income up to a threshold effectively tax-free. Because rules and slabs change with each Union Budget, use this tool as a planning guide and confirm the latest rates and limits before filing your return.",
    ],
    notes: [
      "Compare both regimes each year, since the better choice depends on your deductions.",
      "The old regime favours those who claim 80C, HRA, home loan interest and other deductions.",
      "The new regime offers lower slab rates but removes most exemptions and deductions.",
      "Tax is applied slab by slab, plus a health and education cess, with a rebate up to a threshold.",
    ],
    faqs: [
      {
        q: "Which tax regime should I choose?",
        a: "Choose the old regime if you have substantial deductions like 80C, HRA and home loan interest. The new regime, with lower rates and no deductions, suits those who claim few exemptions.",
      },
      {
        q: "How does slab-based taxation work?",
        a: "Your income is divided into bands, and each band is taxed at its own rate rather than the whole income at the highest rate. A cess is then added to the total tax computed across all slabs.",
      },
      {
        q: "What is the rebate under Section 87A?",
        a: "Section 87A gives a rebate that makes income up to a specified threshold effectively tax-free for resident individuals. The exact limit differs between the old and new regimes and changes with each Budget.",
      },
      {
        q: "Is the tax shown here final?",
        a: "It is an estimate based on the figures and rates you enter. Actual liability depends on the exact current slabs, surcharges, cess and your complete income and deductions, so verify before filing.",
      },
    ],
    related: ["hra", "ppf", "gst", "retirement", "home-loan-emi"],
    group: "Tax & Other",
  },
  {
    slug: "hra",
    kind: "hra",
    name: "HRA Exemption Calculator",
    metaTitle: "HRA Calculator - House Rent Allowance Exemption India",
    metaDescription:
      "Calculate your HRA exemption under Section 10(13A). Enter basic salary, HRA received, rent paid and city type to see your tax-exempt and taxable HRA.",
    tagline: "Find your tax-exempt house rent allowance.",
    intro: [
      "House Rent Allowance (HRA) is a common component of a salaried person's pay meant to cover rented accommodation. If you live in a rented home and receive HRA, part of it is exempt from income tax under Section 10(13A) of the old tax regime, which can significantly reduce your tax bill. The exemption is not the full HRA you receive but the lowest of three specific amounts defined by the tax rules.",
      "The exempt HRA is the least of: the actual HRA received; 50% of basic salary for metro cities (Delhi, Mumbai, Kolkata, Chennai) or 40% for non-metros; and the rent you actually pay minus 10% of your basic salary. This calculator works out all three and picks the smallest as your exemption, showing the balance as taxable. Because the rent-minus-10% component matters, higher rent generally means a larger exemption, up to the other limits.",
      "To claim HRA exemption you must actually pay rent and keep proof such as rent receipts and a rental agreement; if annual rent exceeds a threshold, you also need the landlord's PAN. HRA exemption is available only under the old regime, so factor it in when comparing regimes. Even if HRA is not part of your salary, you may claim a deduction for rent paid under Section 80GG, subject to separate conditions and limits.",
    ],
    notes: [
      "Exempt HRA is the least of actual HRA, 50%/40% of basic, and rent minus 10% of basic.",
      "Metro cities allow 50% of basic salary, while non-metros allow 40% in the calculation.",
      "Keep rent receipts and the rental agreement, plus the landlord's PAN for high annual rent.",
      "HRA exemption applies only under the old regime, so weigh it when comparing regimes.",
    ],
    faqs: [
      {
        q: "How is HRA exemption calculated?",
        a: "The exemption is the least of three amounts: actual HRA received, 50% of basic for metros or 40% for non-metros, and rent paid minus 10% of basic salary. The rest of your HRA is taxable.",
      },
      {
        q: "Which cities count as metro for HRA?",
        a: "For HRA purposes, the metros are Delhi, Mumbai, Kolkata and Chennai, where you can use 50% of basic salary. All other cities are non-metro and use 40% in the calculation.",
      },
      {
        q: "Can I claim HRA under the new tax regime?",
        a: "No. HRA exemption is available only under the old tax regime. If you opt for the new regime, you forgo the HRA exemption along with most other deductions and exemptions.",
      },
      {
        q: "What if I do not receive HRA but pay rent?",
        a: "If HRA is not part of your salary, you may still claim a deduction for rent paid under Section 80GG, subject to its own conditions and monetary limits under the old regime.",
      },
    ],
    related: ["income-tax", "ppf", "home-loan-emi", "gst", "retirement"],
    group: "Tax & Other",
  },
  {
    slug: "gst",
    kind: "gst",
    name: "GST Calculator",
    metaTitle: "GST Calculator - Add or Remove GST Online India",
    metaDescription:
      "Calculate GST easily. Add GST to a base price or extract GST from a gross amount at 5%, 12%, 18% or 28% and see the net price and tax split instantly.",
    tagline: "Add or remove GST at any slab in seconds.",
    intro: [
      "Goods and Services Tax (GST) is India's unified indirect tax on the supply of most goods and services, replacing a web of earlier taxes like VAT, service tax and excise. It applies at standard slabs of 5%, 12%, 18% and 28%, depending on the item or service. Whether you are a business raising invoices or a consumer checking a bill, being able to add or remove GST accurately helps you understand exactly what you are paying or charging.",
      "This calculator works both ways. To add GST, it multiplies the base price by the tax rate and adds it, so a Rs 1,000 item at 18% becomes Rs 1,180. To remove GST from a gross amount, it reverses the maths using base = gross x 100 / (100 + rate), extracting the tax already included in the price. It also splits the tax into CGST and SGST for intra-state supplies, each being half of the total GST.",
      "For registered businesses, GST is collected on sales (output tax) and paid on purchases (input tax), with the input tax credit mechanism ensuring tax is effectively charged only on the value added at each stage. This avoids the earlier problem of tax on tax. Correct GST calculation is essential for compliant invoicing and accurate pricing, so use this tool to verify figures before finalising a quote, bill or purchase.",
    ],
    notes: [
      "GST applies at slabs of 5%, 12%, 18% and 28% depending on the goods or service.",
      "Use add mode for a base price and remove mode to extract GST from a gross amount.",
      "Intra-state supplies split GST equally into CGST and SGST components.",
      "Registered businesses can offset output GST with input tax credit on their purchases.",
    ],
    faqs: [
      {
        q: "How do I add GST to a price?",
        a: "Multiply the base price by the GST rate and add it to the base. For example, a Rs 1,000 item at 18% GST has Rs 180 tax, giving a gross price of Rs 1,180.",
      },
      {
        q: "How do I remove GST from a total?",
        a: "Use base price = gross amount x 100 / (100 + rate). For a Rs 1,180 gross at 18%, the base is Rs 1,000 and the GST included is Rs 180.",
      },
      {
        q: "What is the difference between CGST, SGST and IGST?",
        a: "For supplies within a state, GST splits equally into CGST (central) and SGST (state). For inter-state supplies, a single IGST equal to the total GST rate applies instead.",
      },
      {
        q: "What is input tax credit?",
        a: "Input tax credit lets a registered business reduce the GST it owes on sales by the GST it already paid on purchases, so tax is effectively charged only on the value added at each stage.",
      },
    ],
    related: ["income-tax", "business-loan-emi", "hra", "compound-interest", "retirement"],
    group: "Tax & Other",
  },
  {
    slug: "retirement",
    kind: "retirement",
    name: "Retirement Corpus Calculator",
    metaTitle: "Retirement Calculator - Plan Your Retirement Corpus",
    metaDescription:
      "Calculate the retirement corpus you need and the monthly saving to reach it. Factor in inflation, expenses and returns to plan a comfortable retirement.",
    tagline: "Plan today for a financially secure retirement.",
    intro: [
      "Retirement planning is about ensuring you have enough savings to maintain your lifestyle once your regular income stops. The challenge is that your expenses will keep rising with inflation, so the corpus you need decades from now is far larger than today's costs suggest. This calculator estimates the total corpus required at retirement and the amount you should invest each month to build it, given your current expenses, expected inflation and investment returns.",
      "The maths works in stages. First, today's monthly expenses are grown by inflation to your retirement age using future value, expense x (1 + inflation)^years. Then the corpus needed to fund those inflated expenses through retirement is estimated, allowing for returns during the retirement years. Finally, the required monthly investment is found using the SIP future value formula, so you know how much to save today to reach that target comfortably.",
      "Two forces dominate retirement planning: inflation, which quietly erodes purchasing power, and compounding, which rewards those who start early. Beginning in your twenties or thirties means a modest monthly investment can grow into a large corpus, whereas starting late demands much heavier saving. Because returns and inflation are assumptions, revisit your plan periodically. Combining equity for growth in early years with safer instruments closer to retirement is a common, sensible strategy.",
    ],
    notes: [
      "Account for inflation, which sharply raises the future value of your current expenses.",
      "Start early, as compounding lets a small monthly investment grow into a large corpus.",
      "Revisit your plan periodically, since returns, inflation and goals change over time.",
      "Blend growth assets like equity early with safer instruments as retirement nears.",
    ],
    faqs: [
      {
        q: "How much corpus do I need to retire?",
        a: "It depends on your future monthly expenses, life expectancy and post-retirement returns. This calculator grows today's expenses by inflation, then estimates the corpus needed to fund them through retirement.",
      },
      {
        q: "Why does inflation matter so much?",
        a: "Inflation steadily raises the cost of living, so the same lifestyle costs far more in the future. Ignoring it leads to a serious shortfall, which is why the corpus is based on inflated expenses.",
      },
      {
        q: "How is the required monthly investment calculated?",
        a: "It uses the SIP future value formula to find the monthly amount that, compounded at your expected return until retirement, grows to the target corpus you need.",
      },
      {
        q: "When should I start retirement planning?",
        a: "As early as possible. Thanks to compounding, starting in your twenties or thirties requires a much smaller monthly investment than starting later to reach the same corpus.",
      },
    ],
    related: ["sip", "ppf", "compound-interest", "lumpsum", "fd"],
    group: "Tax & Other",
  },
];

export function getCalculator(slug: string) {
  return calculators.find((c) => c.slug === slug);
}
