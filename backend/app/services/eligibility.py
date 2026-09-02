from app.models.scheme import Scheme
from app.schemas.matching import ApplicantInput

def _norm(value: str) -> str:
    return (value or "").strip().lower()

def evaluate_scheme(applicant: ApplicantInput, scheme: Scheme) -> dict:
    reasons = []
    failed = []

    app_cat = _norm(applicant.category)
    scheme_cat = _norm(scheme.beneficiary_category)
    app_gender = _norm(getattr(applicant, "gender", "male"))
    app_income = applicant.annual_family_income
    app_cost = applicant.project_cost
    app_business = _norm(applicant.business_type)
    app_desc = _norm(getattr(applicant, "business_description", ""))
    scheme_code = getattr(scheme, "code", "")
    scheme_name = getattr(scheme, "name", "")
    scheme_desc = getattr(scheme, "description", "")

    # 1. Category & Gender Target Rule
    is_category_match = False
    
    if scheme_cat == "general":
        # Schemes open to all, with special provisions
        if scheme_code == "STANDUP-INDIA":
            if app_cat in ["sc", "st"] or app_gender in ["female", "woman"]:
                reasons.append("Eligible: Stand-Up India targets SC/ST individuals or Women entrepreneurs.")
                is_category_match = True
            else:
                failed.append("Stand-Up India requires the applicant to be SC, ST, or a Woman entrepreneur.")
        elif scheme_code == "PMEGP":
            if app_cat in ["sc", "st", "obc", "minority"] or app_gender in ["female", "woman"]:
                reasons.append("Eligible: Qualified for PMEGP Special Category 35% maximum subsidy (SC/ST/OBC/Minority/Women).")
            else:
                reasons.append("Eligible: Qualified for PMEGP General Category 25% subsidy.")
            is_category_match = True
        else:
            reasons.append("Scheme is open to all categories and micro-entrepreneurs.")
            is_category_match = True
    elif scheme_cat == app_cat:
        reasons.append(f"Applicant category ({applicant.category.upper()}) matches target group ({scheme.beneficiary_category.upper()}).")
        is_category_match = True
    else:
        # Check women-specific schemes
        if "women" in _norm(scheme_name) or "female" in _norm(scheme_desc) or scheme_code in ["NSFDC-MSY", "NSTFDC-AMES", "NBCFDC-SWARNIMA"]:
            if app_gender in ["female", "woman"] and (scheme_cat == app_cat or scheme_cat == "general"):
                reasons.append(f"Applicant qualifies as a Female entrepreneur for {scheme_name}.")
                is_category_match = True
            else:
                failed.append(f"Scheme is specifically reserved for {scheme.beneficiary_category.upper()} female entrepreneurs.")
        else:
            failed.append(f"Applicant category ({applicant.category.upper()}) does not match scheme target group ({scheme.beneficiary_category.upper()}).")

    # 2. Income Ceiling Rule
    if scheme_code.startswith("NSFDC"):
        income_ceiling = 500000
    elif scheme_code.startswith(("NSTFDC", "NBCFDC", "NMDFC")):
        income_ceiling = 300000
    else:
        income_ceiling = None

    if income_ceiling is not None:
        if app_income <= income_ceiling:
            reasons.append(f"Annual family income (₹{app_income:,.0f}) is within the scheme ceiling of ₹{income_ceiling:,.0f}.")
        else:
            failed.append(f"Annual family income (₹{app_income:,.0f}) exceeds the scheme ceiling of ₹{income_ceiling:,.0f}.")
        is_income_ok = app_income <= income_ceiling
    else:
        reasons.append("No strict household income ceiling for this central scheme.")
        is_income_ok = True

    # 3. Minimum Project Cost Rule
    min_cost = getattr(scheme, "min_project_cost", None)
    if min_cost is not None:
        if app_cost >= min_cost:
            reasons.append(f"Project cost (₹{app_cost:,.0f}) meets the minimum required cost of ₹{min_cost:,.0f}.")
        else:
            failed.append(f"Project cost (₹{app_cost:,.0f}) is below the scheme minimum threshold of ₹{min_cost:,.0f}.")

    # 4. Maximum Project Cost Rule
    max_cost = getattr(scheme, "max_project_cost", None)
    if max_cost is not None:
        if app_cost <= max_cost:
            reasons.append(f"Project cost (₹{app_cost:,.0f}) is within the maximum limit of ₹{max_cost:,.0f}.")
        else:
            failed.append(f"Project cost (₹{app_cost:,.0f}) exceeds the maximum scheme ceiling of ₹{max_cost:,.0f}.")

    # 5. Age Eligibility (default >= 18)
    if applicant.age >= 18:
        reasons.append("Applicant age (>= 18 years) fulfills legal adult borrowing criteria.")
    else:
        failed.append("Applicant must be at least 18 years of age.")

    eligible = len(failed) == 0

    # 6. Scoring Algorithm for ranking eligible schemes
    score = 0.0
    if eligible:
        score += 70.0 # Base eligible score
        
        # Sector / Purpose alignment score (+15 points max)
        purposes = getattr(scheme, "purposes", []) or []
        purposes_text = " ".join(purposes).lower()
        if app_business in purposes_text or any(w in purposes_text for w in app_business.split()) or any(w in purposes_text for w in app_desc.split() if len(w) > 3):
            score += 15.0
            reasons.append("High sector alignment: Business type matches scheme target activities.")
        else:
            score += 5.0

        # Financing Optimal Utilization score (+15 points max)
        if max_cost and max_cost > 0:
            ratio = min(app_cost / max_cost, 1.0)
            score += round(15.0 * (1.0 - abs(0.70 - ratio)), 1)
        else:
            score += 10.0
    else:
        score = max(0.0, 50.0 - 15.0 * len(failed))

    score = round(min(score, 100.0), 1)

    return {
        "eligible": eligible,
        "score": score,
        "reasons": reasons,
        "failed_rules": failed,
        "details": {
            "max_loan_amount": getattr(scheme, "max_loan_amount", None),
            "beneficiary_interest_rate": getattr(scheme, "beneficiary_interest_rate", None),
            "repayment_years": getattr(scheme, "repayment_years", None),
            "moratorium_months": getattr(scheme, "moratorium_months", None),
            "channel_partners": getattr(scheme, "channel_partners", []) or [],
            "required_documents": getattr(scheme, "required_documents", []) or [],
            "source_url": getattr(scheme, "source_url", ""),
            "provider": getattr(scheme, "provider", "N/A"),
            "description": scheme_desc,
            "beneficiary_category": getattr(scheme, "beneficiary_category", "N/A"),
        },
    }
